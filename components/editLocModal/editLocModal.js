export function openModal(fields, location, onSave, title = "Edit Location") {
  document.getElementById("edit-modal-header").innerHTML = title;
  document.getElementById("modal-overlay").classList.remove("hidden");

  const closeX = document.getElementById("header-row");
  const form = document.getElementById("modal-form");
  form.innerHTML = "";

  let formFields = [];

  for (const field of fields) {
    if (field.type === "oid" || field.type === "global-id") {
      continue; // skip object ID and global ID fields
    }

    const label = document.createElement("label");
    label.textContent = field.label;

    const input = document.createElement("input");
    input.type = field.type;
    input.name = field.key;

    if (field.type === "date" && location?.[field.key]) {
      input.value = new Date(location[field.key]).toISOString().split("T")[0];
    }
    else {
      input.value = location?.[field.key] ?? ""; // ? acts like 'if (location)'
    }

    label.append(input);
    form.append(label);
    formFields.push(field);
  }

  const saveBtn = document.getElementById("modal-save");
  const newSaveBtn = saveBtn.cloneNode(true);
  saveBtn.replaceWith(newSaveBtn);

  newSaveBtn.addEventListener("click", () => {
    const updated = { ...location };
    for (const field of formFields) {
      const input = form.querySelector(`[name="${field.key}"]`);
      updated[field.key] = field.type === "number" ? parseFloat(input.value) : input.value;
      updated.OBJECTID = location?.OBJECTID; // ensure OBJECTID is included for updates
    }
    onSave(updated);
    closeModal();
  });

  closeX.addEventListener("click", () => {
    closeModal();
  });
}

export function closeModal() {
  document.getElementById("modal-overlay").classList.add("hidden");
}
