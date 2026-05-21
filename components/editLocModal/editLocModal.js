import Point from "@arcgis/core/geometry/Point.js";
import SpatialReference from "@arcgis/core/geometry/SpatialReference.js";
import * as projectOperator from "@arcgis/core/geometry/operators/projectOperator.js";

export function openModal(fields, location, onSave, title = "Edit Location") {
  document.getElementById("edit-modal-header").innerHTML = title;
  document.getElementById("modal-overlay").classList.remove("hidden");

  const closeX = document.getElementById("header-row");
  const form = document.getElementById("modal-form");
  form.innerHTML = "";

  let formFields = [];

  function createFieldInput(field, overrideValue = null) {
    const label = document.createElement("label");
    label.textContent = field.label;

    const input = document.createElement("input");
    input.type = field.type;
    input.name = field.key;

    if (field.type === "date" && location?.attributes?.[field.key]) {
      input.value = new Date(location?.attributes[field.key]).toISOString().split("T")[0];
    }
    else {
      input.value = overrideValue ?? location?.attributes?.[field.key] ?? ""; // ? acts like 'if (location)'
    }

    label.append(input);
    form.append(label);

    return input;
  }

  for (const field of fields) {
    if (field.type === "oid" || field.type === "global-id") {
      continue; // skip object ID and global ID fields
    }
    
    let fieldInput = createFieldInput(field);

    formFields.push(fieldInput);
  }

  let latInput = createFieldInput({ key: "Latitude", label: "Latitude", type: "number" }, location?.geometry?.latitude);
  let lngInput = createFieldInput({ key: "Longitude", label: "Longitude", type: "number" }, location?.geometry?.longitude);

  formFields.push(latInput);
  formFields.push(lngInput);

  const saveBtn = document.getElementById("modal-save");
  const newSaveBtn = saveBtn.cloneNode(true);
  saveBtn.replaceWith(newSaveBtn);

  newSaveBtn.addEventListener("click", async () => {
    const updated = location ? location : { attributes: {} };

    for (const field of formFields) {
      if (field.name === "Latitude" || field.name === "Longitude") {
        continue;
      }
      updated.attributes[field.name] = field.type === "number" ? parseFloat(field.value) : field.value;
      updated.attributes.OBJECTID = location?.attributes.OBJECTID; // ensure OBJECTID is included for updates
    }

    let geographicPoint = new Point({
      longitude: parseFloat(form.querySelector(`[name="Longitude"]`).value),
      latitude: parseFloat(form.querySelector(`[name="Latitude"]`).value),
    });

    await projectOperator.load();
    let webMercatorPoint = await projectOperator.execute(geographicPoint, SpatialReference.WebMercator);

    updated.geometry = webMercatorPoint;

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
