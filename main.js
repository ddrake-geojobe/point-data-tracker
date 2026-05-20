function createTopbar({ title = 'Point Tracker', user = 'Guest' } = {}) {
  const header = document.createElement('header');
  header.id = 'topbar';

  const titleEl = document.createElement('span');
  titleEl.className = 'topbar-title';
  titleEl.textContent = title;

  const userEl = document.createElement('span');
  userEl.className = 'topbar-user';
  userEl.textContent = user;

  header.append(titleEl, userEl);
  return header;
}

function createSidebar(items = []) {
  const nav = document.createElement('nav');
  nav.id = 'sidebar';

  const ul = document.createElement('ul');
  for (const item of items) {
    const li = document.createElement('li');
    li.textContent = item;
    ul.append(li);
  }

  nav.append(ul);
  return nav;
}

document.getElementById('topbar').replaceWith(createTopbar({ title: 'Point Tracker', user: 'Alice' }));
document.getElementById('sidebar').replaceWith(createSidebar(['Item One', 'Item Two', 'Item Three']));
