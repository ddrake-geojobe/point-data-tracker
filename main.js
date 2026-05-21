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

let locations = []; // state

document.getElementById("modal-close").addEventListener("click", closeModal);

function renderSidebar() {
  document.getElementById("sidebar").replaceWith(
    createSidebar(
      locations,
      (loc) => openModal(loc, onSave),
      () => openModal(undefined, onAdd, "Add Location"),
      onDelete,
    ),
  );
}

async function onAdd(newLocation) {
  console.log("about to post");
  await fetch(`/api/points`, {
    method: "POST",
    headers: { "Content-Type": "applications/json" },
    body: JSON.stringify(newLocation),
  });
}

async function onSave(updated) {
  await fetch(`/api/points/${updated.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  });

  const res = await fetch("/api/points");
  locations = await res.json();

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
    .replaceWith(
      createTopbar({
        title: "Point Tracker",
        user: userName,
        onSignOut: signOut,
      }),
    );
  document.getElementById("sidebar").replaceWith(createSidebarLoader());

  // Fetch points
  const res = await fetch("/api/points");
  locations = await res.json();

  // Sidebar
  renderSidebar();

  // Render Map
  const { container, pointsLayer } = await createMap(
    config.pointsFeatureLayerUrl,
  );
  document.getElementById("arcgis-map").replaceChildren(container);
}

function signOut() {
  IdentityManager.destroyCredentials();
  window.location.reload();
}

init();
