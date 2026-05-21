import { createTopbar } from "./components/topbar/topbar.js";
import {
  createSidebar,
  createSidebarLoader,
} from "./components/sidebar/sidebar.js";
import {
  openModal,
  closeModal,
} from "./components/editLocModal/editLocModal.js";

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
  document
    .getElementById("topbar")
    .replaceWith(createTopbar({ title: "Point Tracker", user: "Alice" }));
  document.getElementById("sidebar").replaceWith(createSidebarLoader());

  const res = await fetch("/api/points");
  locations = await res.json();

  renderSidebar();
}

init();
