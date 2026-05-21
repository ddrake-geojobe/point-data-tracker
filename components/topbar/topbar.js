export function createTopbar({ title = 'Point Tracker', user = 'Guest', onSignOut } = {}) {
  const header = document.createElement('header');
  header.id = 'topbar';

  const titleEl = document.createElement('span');
  titleEl.className = 'topbar-title';
  titleEl.textContent = title;

  const userEl = document.createElement('span');
  userEl.className = 'topbar-user';
  userEl.textContent = user;

  header.append(titleEl, userEl);

  if (onSignOut) {
    const signOutBtn = document.createElement('button');
    signOutBtn.className = 'topbar-signout';
    signOutBtn.textContent = 'Sign Out';
    signOutBtn.addEventListener('click', onSignOut);
    header.append(signOutBtn);
  }

  return header;
}
