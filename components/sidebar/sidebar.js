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

export function createSidebar(locations, onSelect, openModal, deleteItem) {
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

    const label = document.createElement("span");
    label.className = "location-label";
    label.textContent = loc.name;

    const desc = document.createElement("span");
    desc.className = "location-desc";
    desc.textContent = loc.description;

    const coords = document.createElement("span");
    coords.className = "location-coords";
    coords.textContent = `${loc.latitude}, ${loc.longitude}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-location-btn";
    deleteBtn.innerHTML = "Delete";

    deleteBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      deleteItem(loc); // AI did this

      console.log("Delete button clicked");
    });

    li.append(label, desc, coords, deleteBtn);
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
