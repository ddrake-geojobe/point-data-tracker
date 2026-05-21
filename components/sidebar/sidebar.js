export function createSidebarLoader() {
  const nav = document.createElement("nav");
  nav.id = "sidebar";

  const img = document.createElement("img");
  img.id = "loader";
  img.src = "assets/loading.gif";
  img.alt = "Loading...";

  nav.append(img);
  return nav;
}

export function createSidebar(locations, onSelect, openModal, onDelete) {
  console.log("Creating sidebar with locations:", locations);
  const nav = document.createElement("nav");
  nav.id = "sidebar";

  const sideBarActionRow = document.createElement("div");
  sideBarActionRow.id = "sidebar-action-row";
  const addLoc = document.createElement("button");
  addLoc.id = "add-loc-btn";
  addLoc.innerHTML = "Add +";
  addLoc.addEventListener("click", openModal);
  const filter = document.createElement("input");
  filter.type = "search";
  filter.id = "sidebar-filter";
  filter.placeholder = "Filter locations...";

  sideBarActionRow.append(addLoc, filter);
  nav.append(sideBarActionRow);

  const ul = document.createElement("ul");
  for (const loc of locations) {
    const li = document.createElement("li");
    li.classList.add("sidebar-item");

    const locInfoCol = document.createElement("div");
    locInfoCol.className = "location-info";

    const label = document.createElement("span");
    label.className = "location-label";
    label.textContent = loc.name;

    const desc = document.createElement("span");
    desc.className = "location-desc";
    desc.textContent = loc.description;

    const coords = document.createElement("span");
    coords.className = "location-coords";
    coords.textContent = `${loc.latitude}, ${loc.longitude}`;

    locInfoCol.append(label, desc, coords);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-loc-btn";
    deleteBtn.title = "Delete";
    deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9 3h6l1 1h4v2H4V4h4L9 3zm-5 4h16l-1.5 13.5A1.5 1.5 0 0 1 17 22H7a1.5 1.5 0 0 1-1.5-1.5L4 7zm5 3v8h2v-8H9zm4 0v8h2v-8h-2z"/></svg>`;
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      onDelete(loc.id);
    });

    li.append(locInfoCol, deleteBtn);
    li.addEventListener("click", () => onSelect(loc));
    ul.append(li);
  }

  filter.addEventListener("input", () => {
    const query = filter.value.toLowerCase();
    for (const li of ul.querySelectorAll(".sidebar-item")) {
      const text = li.textContent.toLowerCase();
      li.style.display = text.includes(query) ? "" : "none";
    }
  });

  nav.append(ul);
  return nav;
}
