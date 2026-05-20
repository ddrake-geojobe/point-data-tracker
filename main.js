import { createTopbar } from './topbar.js';
import { createSidebar } from './sidebar.js';

async function init() {
  document.getElementById('topbar').replaceWith(createTopbar({ title: 'Point Tracker', user: 'Alice' }));

  const res = await fetch('./data/points.json');
  const locations = await res.json();
  document.getElementById('sidebar').replaceWith(createSidebar(locations));
}

init();
