const FIELDS = await fetch("./data/schema.json").then((res) => res.json());

export function openModal(location, onSave) {
  document.getElementById("modal-overlay").classList.remove("hidden");

  const closeX = document.getElementById("header-row");
  const form = document.getElementById("modal-form");
  form.innerHTML = "";

  for (const field of FIELDS) {
    const label = document.createElement("label");
    label.textContent = field.label;

    const input = document.createElement("input");
    input.type = field.type;
    input.name = field.key;
    input.value = location[field.key] ?? "";

    label.append(input);
    form.append(label);
  }

  const saveBtn = document.getElementById("modal-save");
  const newSaveBtn = saveBtn.cloneNode(true);
  saveBtn.replaceWith(newSaveBtn);

  newSaveBtn.addEventListener("click", () => {
    const updated = { ...location };
    for (const field of FIELDS) {
      const input = form.querySelector(`[name="${field.key}"]`);
      updated[field.key] =
        field.type === "number" ? parseFloat(input.value) : input.value;
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
