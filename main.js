import { createTopbar } from './topbar.js';
import { createSidebar } from './sidebar.js';

document.getElementById('topbar').replaceWith(createTopbar({ title: 'Point Tracker', user: 'Alice' }));

fetch('./data/points.json')
  .then(res => res.json())
  .then(locations => {
    document.getElementById('sidebar').replaceWith(createSidebar(locations));
  });
