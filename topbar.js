export function createTopbar({ title = 'Point Tracker', user = 'Guest' } = {}) {
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
