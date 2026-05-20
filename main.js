import { createTopbar } from './components/topbar/topbar.js';
import { createSidebar } from './components/sidebar/sidebar.js';
import { openModal, closeModal } from './components/editLocModal/editLocModal.js';

let locations = []; // state

document.getElementById('modal-close').addEventListener('click', closeModal);

function renderSidebar() {
  document.getElementById('sidebar').replaceWith(
    createSidebar(locations, (loc) => openModal(loc, onSave))
  );
}

function onSave(updated) {
  const index = locations.findIndex(l => l.id === updated.id);
  if (index !== -1) locations[index] = updated;
  renderSidebar();
}

async function init() {
  document.getElementById('topbar').replaceWith(createTopbar({ title: 'Point Tracker', user: 'Alice' }));

  const res = await fetch('./data/points.json');
  locations = await res.json();

  renderSidebar();
}

init();
