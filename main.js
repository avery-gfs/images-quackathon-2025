const $ = document.querySelector.bind(document);

const form = $("#controls");
const img = $("#input");
const canvas = $("#output");
const settings = $("#settings");
const ctx = canvas.getContext("2d");

function setSrc() {
  const reader = new FileReader();
  reader.readAsDataURL(form.source.files[0]);
  reader.onload = () => (img.src = reader.result);
}

form.source.onchange = setSrc;
img.onload = render;

function render() {
  const controls = {};

  for (const input of form.querySelectorAll("input")) {
    switch (input.type) {
      case "file":
        continue;

      case "checkbox":
        controls[input.name] = input.checked;
        break;

      case "range":
        controls[input.name] = Number(input.value);
    }

    input.oninput = render;
  }

  settings.innerText = JSON.stringify(controls, null, 2);

  const { width, height } = img;
  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(img, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);
  transform?.(imageData, controls);
  ctx.putImageData(imageData, 0, 0);
}

let transform;

export function attach(handler) {
  transform = handler;
  setSrc();
}
