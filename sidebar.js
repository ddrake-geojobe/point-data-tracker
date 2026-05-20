export function createSidebar(items = []) {
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
