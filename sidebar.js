export function createSidebar(locations = [], onSelect) {
  const nav = document.createElement('nav');
  nav.id = 'sidebar';

  const ul = document.createElement('ul');
  for (const loc of locations) {
    const li = document.createElement('li');
    li.classList.add('sidebar-item');

    const label = document.createElement('span');
    label.className = 'location-label';
    label.textContent = loc.name;

    const desc = document.createElement('span');
    desc.className = 'location-desc';
    desc.textContent = loc.description;

    const coords = document.createElement('span');
    coords.className = 'location-coords';
    coords.textContent = `${loc.latitude}, ${loc.longitude}`;

    li.append(label, desc, coords);
    li.addEventListener('click', () => onSelect(loc));
    ul.append(li);
  }

  nav.append(ul);
  return nav;
}
