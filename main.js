import { createTopbar } from "./components/topbar/topbar.js";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo.js";
import IdentityManager from "@arcgis/core/identity/IdentityManager.js";
import Portal from "@arcgis/core/portal/Portal.js";
import config from "./config.json";
import {
  createSidebar,
  createSidebarLoader,
} from "./components/sidebar/sidebar.js";
import {
  openModal,
  closeModal,
} from "./components/editLocModal/editLocModal.js";
import { createMap } from "./components/map/map.js";

let pointsFeatureLayer; // state

document.getElementById("modal-close").addEventListener("click", closeModal);

async function renderSidebar() {
  let pointsFeatureLayerFields = pointsFeatureLayer.fields.map((f) => {

    let fieldType = 'text';

    switch (f.type) {
      case "double":
      case "integer":
        fieldType = "number";
        break;
      case "date":
        fieldType = "date";
        break;
      default:
        fieldType = f.type;
    }

    return {
      key: f.name,
      label: f.alias,
      type: fieldType,
    }
  });

  // Fetch points
  let pointsFeatureSet = await pointsFeatureLayer.queryFeatures({
    where: "1=1",
    outFields: ["*"],
    returnGeometry: true,
  });

  let sidebarEl = createSidebar(
    pointsFeatureSet.features,
    // TODO
    (loc) => openModal(pointsFeatureLayerFields, loc, onSave),
    // TODO
    () => openModal(pointsFeatureLayerFields, undefined, onAdd, "Add Location"),
    onDelete,
  );

  document.getElementById("sidebar").replaceWith(sidebarEl);
}

async function onAdd(newLocation) {
  document.getElementById("sidebar").replaceWith(createSidebarLoader());

  let res = await pointsFeatureLayer.applyEdits({
    addFeatures: [newLocation]
  });

  renderSidebar();
}

async function onDelete(objectId) {
  if (!confirm("Are you sure you want to delete this location?")) return;

  document.getElementById("sidebar").replaceWith(createSidebarLoader());

  let deleteRes = await pointsFeatureLayer.applyEdits({
    deleteFeatures: [ { objectId: objectId } ]
  });

  renderSidebar();
}

async function onSave(updated) {
  document.getElementById("sidebar").replaceWith(createSidebarLoader());

  updated.StartDate = new Date(updated.StartDate).getTime();

  let updateRes = await pointsFeatureLayer.applyEdits({
    updateFeatures: [updated]
  });

  renderSidebar();
}

async function init() {
  // Set up OAuth
  const oauthInfo = new OAuthInfo({ appId: config.oauthAppId, popup: false });
  IdentityManager.registerOAuthInfos([oauthInfo]);
  await IdentityManager.getCredential("https://www.arcgis.com/sharing/rest");
  const portal = new Portal();
  await portal.load();
  const userName = portal.user?.fullName ?? portal.user?.username ?? "User";

  // Render Topbar
  document
    .getElementById("topbar")
    .replaceWith(createTopbar({ title: "Point Tracker", user: userName, onSignOut: signOut }));
  document.getElementById("sidebar").replaceWith(createSidebarLoader());

  // Render Map
  const { container, pointsLayer } = await createMap(config.pointsFeatureLayerUrl);
  pointsFeatureLayer = pointsLayer;

  document.getElementById("arcgis-map").replaceChildren(container);

  // Sidebar
  renderSidebar();
}

function signOut() {
  IdentityManager.destroyCredentials();
  window.location.reload();
}

init();
