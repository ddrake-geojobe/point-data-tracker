import { createTopbar } from "./components/topbar/topbar.js";
import {
  createSidebar,
  createSidebarLoader,
} from "./components/sidebar/sidebar.js";
import {
  openModal,
  closeModal,
} from "./components/editLocModal/editLocModal.js";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo.js";
import IdentityManager from "@arcgis/core/identity/IdentityManager.js";
import Portal from "@arcgis/core/portal/Portal.js";
import config from "./config.json";


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
  document.getElementById("sidebar").replaceWith(createSidebarLoader());

  await fetch(`/api/points`, {
    method: "POST",
    headers: { "Content-Type": "applications/json" },
    body: JSON.stringify(newLocation),
  });

  const res = await fetch("/api/points");
  locations = await res.json();
  renderSidebar();
}

async function onDelete(id) {
  if (!confirm("Are you sure you want to delete this location?")) return;

  document.getElementById("sidebar").replaceWith(createSidebarLoader());

  await fetch(`/api/points/${id}`, { method: "DELETE" });

  const res = await fetch("/api/points");
  locations = await res.json();

  renderSidebar();
}

async function onSave(updated) {
  document.getElementById("sidebar").replaceWith(createSidebarLoader());

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

  document
    .getElementById("topbar")
    .replaceWith(createTopbar({ title: "Point Tracker", user: userName, onSignOut: signOut }));
  document.getElementById("sidebar").replaceWith(createSidebarLoader());

  const res = await fetch("/api/points");
  locations = await res.json();

  renderSidebar();
}

function signOut() {
  IdentityManager.destroyCredentials();
  window.location.reload();
}

init();
