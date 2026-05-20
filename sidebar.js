export function createSidebar(locations = []) {
  const nav = document.createElement('nav');
  nav.id = 'sidebar';

  const ul = document.createElement('ul');
  for (const loc of locations) {
    const li = document.createElement('li');

    const label = document.createElement('span');
    label.className = 'location-label';
    label.textContent = loc.label;

    const desc = document.createElement('span');
    desc.className = 'location-desc';
    desc.textContent = loc.description;

    const coords = document.createElement('span');
    coords.className = 'location-coords';
    coords.textContent = `${loc.latitude}, ${loc.longitude}`;

    li.append(label, desc, coords);
    ul.append(li);
  }

  nav.append(ul);
  return nav;
}
