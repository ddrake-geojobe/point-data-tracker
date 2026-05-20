import { createTopbar } from './topbar.js';
import { createSidebar } from './sidebar.js';

document.getElementById('topbar').replaceWith(createTopbar({ title: 'Point Tracker', user: 'Alice' }));
document.getElementById('sidebar').replaceWith(createSidebar(['Item One', 'Item Two', 'Item Three']));
