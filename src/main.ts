const app = document.querySelector<HTMLElement>("#app")!;

const heading = document.createElement("h1");
heading.textContent = "D2 project";

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;
canvas.style.border = "4px solid #333333";

let brushsize = 2;
const sizeslider = document.createElement("input");
sizeslider.type = "range";
sizeslider.id = "sizeslider";
sizeslider.min = "1";
sizeslider.max = "10";
sizeslider.step = "1";
sizeslider.value = "2";
sizeslider.addEventListener("input", () => {
  brushsize = Number(sizeslider.value);
  console.log("brushsize is: " + brushsize);
});
const textbreak = document.createElement("br");
const sizetext = document.createElement("p");
sizetext.textContent = "Paintbrush Size: ";

const undobutton = document.createElement("button");

undobutton.textContent = "Undo";
undobutton.id = "undobutton";
undobutton.addEventListener("click", () => {
  const undoneline = lines.pop();
  if (undoneline != undefined) undonelines.push(undoneline);
  redrawall();
});

const redobutton = document.createElement("button");
redobutton.textContent = "Redo";
redobutton.id = "redobutton";
redobutton.addEventListener("click", () => {
  const newline = undonelines.pop();
  if (newline != undefined) lines.push(newline);
  redrawall();
});

let isMouseDown = false;
let mouseX = 0;
let mouseY = 0;

interface Point {
  x: number;
  y: number;
  color: string;
  size: number;
  connected: boolean;
  emoji?: string;
}

let connectpoints = true;
const connecttoggle = document.createElement("input");
connecttoggle.type = "checkbox";
connecttoggle.checked = true;
connecttoggle.addEventListener("change", () => {
  connectpoints = connecttoggle.checked;
});
const connecttext = document.createElement("p");
connecttext.textContent = "Connect Points: ";

const colortext = document.createElement("p");
colortext.textContent = "Brush Color: ";

//COLORS
let brushcolor = "black"; //default

const colorOptions = [ //other options
  "black",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
];

const colorButtons: HTMLInputElement[] = [];
const colorText = document.createElement("p");
const colorSection = document.createElement("div");
colorSection.append(colorText);

for (const name of colorOptions) { //loop to create each color button
  const box = document.createElement("input");
  box.type = "checkbox";
  box.id = name + "box";
  box.checked = name == "black";
  box.addEventListener("change", () => {
    brushcolor = name;
    for (const other of colorButtons) other.checked = other == box;
    updateswatch();
  });
  const label = document.createElement("label");
  label.htmlFor = box.id;
  label.textContent = name + " ";
  colorButtons.push(box);
  colorSection.append(box, label);
}

const colorswatch = document.createElement("div");
colorswatch.style.width = "50px";
colorswatch.style.height = "50px";
colorswatch.style.border = "2px solid #333333";
colorswatch.style.background = brushcolor;

function updateswatch() {
  colorswatch.style.background = brushcolor;
}

//Extracted Function which takes duplicated code from export and the redrawall function and puts it intoo a single function called in both spots.
function render(c: CanvasRenderingContext2D, scale = 1) { //added scale parameter so export can be scaled up
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width * scale, canvas.height * scale);
  c.lineCap = "round";

  for (const line of lines) {
    let prev: Point | null = null;
    for (const p of line) {
      if (p.emoji) {
        drawsticker(c, p, scale);
        continue;
      }
      if (!p.connected) {
        c.fillStyle = p.color;
        c.fillRect(p.x * scale, p.y * scale, p.size * scale, p.size * scale);
      } else if (prev) {
        c.strokeStyle = p.color;
        c.lineWidth = p.size * scale;
        c.beginPath();
        c.moveTo(prev.x * scale, prev.y * scale);
        c.lineTo(p.x * scale, p.y * scale);
        c.stroke();
      }
      prev = p;
    }
  }
}

const exportbutton = document.createElement("button");
exportbutton.textContent = "Export Current Drawing to PNG";
exportbutton.id = "exportbutton";
exportbutton.addEventListener("click", () => {
  //const newcanvas = document.createElement("canvas");
  //const newctx = newcanvas.getContext("2d");

  const scale = 2;
  const output = document.createElement("canvas");
  output.width = canvas.width * scale;
  output.height = canvas.height * scale;
  render(output.getContext("2d")!, scale);

  //REFACTORED BELOW INTO AN EXTRACTED RENDER FUNCTION FOR STEP 9.

  // newctx!.fillStyle = "white";
  // newctx!.fillRect(0, 0, 600 * newscale, 600 * newscale);

  // for (let i = 0; i < lines.length; i++) {
  //   for (let j = 0; j < lines[i].length; j++) {
  //     const currentpoint: Point = lines[i][j];
  //     if (currentpoint.emoji) {
  //       newctx!.font = `${currentpoint.size * newscale}px serif`;
  //       newctx!.textAlign = "center";
  //       newctx!.textBaseline = "middle";
  //       newctx!.fillText(
  //         currentpoint.emoji!,
  //         currentpoint.x * newscale,
  //         currentpoint.y * newscale,
  //       );
  //       continue;
  //     }
  //     if (currentpoint.connected == false) {
  //       newctx!.fillStyle = currentpoint.color;
  //       newctx!.fillRect(
  //         currentpoint.x * newscale,
  //         currentpoint.y * newscale,
  //         currentpoint.size * newscale,
  //         currentpoint.size * newscale,
  //       );
  //     }

  //     if (currentpoint.connected && prevpointvalid) {
  //       newctx!.strokeStyle = currentpoint.color;
  //       newctx!.lineWidth = currentpoint.size;
  //       newctx!.lineCap = "round";

  //       newctx!.beginPath();
  //       newctx!.moveTo(prevpoint.x * newscale, prevpoint.y * newscale);
  //       newctx!.lineTo(currentpoint.x * newscale, currentpoint.y * newscale);
  //       newctx!.stroke();
  //     }

  //     prevpointvalid = true;
  //     prevpoint = currentpoint;
  //   }
  //   prevpointvalid = false;
  // }

  const img = output.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = img;
  link.download = "canvas-image.png";
  app.appendChild(link);
  link.click();
});

//EMOJI PLACING
let selectedEmoji = ""; //default none selected
const emojiOptions = ["😀", "😂", "😍"];

const customEmojis: string[] = [];

const emojitext = document.createElement("p");
emojitext.textContent = "Stickers: ";
const emojilist = document.createElement("div");
const emojiinput = document.createElement("input");
emojiinput.type = "text";
emojiinput.id = "emojiinput";
emojiinput.placeholder = "Add emoji";
emojiinput.size = 8;

const addemojibutton = document.createElement("button");
addemojibutton.textContent = "Add Emoji";
addemojibutton.id = "addemojibutton";
addemojibutton.addEventListener("click", () => {
  const newemoji = emojiinput.value.trim();
  if (!emojiOptions.includes(newemoji) && !customEmojis.includes(newemoji)) {
    customEmojis.push(newemoji);
    localStorage.setItem("customemojis", JSON.stringify(customEmojis));
  }
  selectedEmoji = newemoji;
  emojiinput.value = "";
  renderemojis();
});

const emojisection = document.createElement("div");
emojisection.append(emojitext, emojilist, emojiinput, addemojibutton);

function renderemojis() {
  emojilist.innerHTML = "";
  for (const emoji of [...emojiOptions, ...customEmojis]) {
    const button = document.createElement("button");
    button.textContent = emoji;
    button.style.background = emoji == selectedEmoji ? "#cccccc" : "";
    button.addEventListener("click", () => {
      selectedEmoji = selectedEmoji == emoji ? "" : emoji;
      renderemojis();
    });
    emojilist.append(button);
  }
  canvas.style.cursor = selectedEmoji == "" ? "default" : "crosshair";
}
renderemojis();

function drawsticker(c: CanvasRenderingContext2D, point: Point, scale = 1) {
  c.font = `${point.size * scale}px serif`;
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.fillText(point.emoji!, point.x * scale, point.y * scale);
}

const lines: Point[][] = []; //every mousedown is a collection of lines
let currentline: Point[] = [];
let undonelines: Point[][] = [];
let prevpoint: Point = {
  x: 0,
  y: 0,
  color: "black",
  size: 2,
  connected: false,
};
let prevpointvalid = false;

canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;
  if (isMouseDown) {
    placePoint(mouseX, mouseY);
  }
});

canvas.addEventListener("mousedown", (event) => {
  undonelines = [];

  if (selectedEmoji != "") { //handling for when an emoji is selected
    const rect = canvas.getBoundingClientRect();
    const sticker: Point = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      color: brushcolor,
      size: brushsize * 8,
      connected: false,
      emoji: selectedEmoji,
    };

    lines.push([sticker]);
    drawsticker(ctx!, sticker);
    return;
  }
  isMouseDown = true;
});
canvas.addEventListener("mouseup", () => {
  if (!isMouseDown) return;
  isMouseDown = false;
  lines.push(currentline);
  currentline = [];
  prevpointvalid = false;
});

function placePoint(x: number, y: number) {
  const pointcolor = brushcolor;

  if (connectpoints == false) {
    ctx!.fillStyle = pointcolor;
    ctx!.fillRect(x, y, brushsize, brushsize);
  }

  if (connectpoints && prevpointvalid) {
    ctx!.strokeStyle = pointcolor;
    ctx!.lineWidth = brushsize;
    ctx!.lineCap = "round";

    ctx!.beginPath();
    ctx!.moveTo(prevpoint.x, prevpoint.y);
    ctx!.lineTo(x, y);
    ctx!.stroke();
  }

  const newpoint: Point = {
    x: x,
    y: y,
    size: brushsize,
    color: pointcolor,
    connected: connectpoints,
  };
  currentline.push(newpoint);

  prevpointvalid = true;
  prevpoint = newpoint;
}

app.append(
  heading,
  canvas,
  textbreak,
  undobutton,
  redobutton,
  connecttext,
  connecttoggle,
  textbreak,
  sizetext,
  sizeslider,
  colortext,
  colorSection,
  emojisection,
  textbreak,
  exportbutton,
);

ctx!.fillStyle = "white";
ctx!.fillRect(0, 0, 600, 600);

function redrawall() {
  render(ctx!);
}
//REFACTORED INTO AN EXTRACTED RENDER FUNCTION FOR STEP 9.

// ctx!.fillStyle = "white";
// ctx!.fillRect(0, 0, 600, 600);

// for (let i = 0; i < lines.length; i++) {
//   for (let j = 0; j < lines[i].length; j++) {
//     const currentpoint: Point = lines[i][j];
//     if (currentpoint.emoji) {
//       drawsticker(currentpoint);
//       continue;
//     }
//     if (currentpoint.connected == false) {
//       ctx!.fillStyle = currentpoint.color;
//       ctx!.fillRect(
//         currentpoint.x,
//         currentpoint.y,
//         currentpoint.size,
//         currentpoint.size,
//       );
//     }

//     if (currentpoint.connected && prevpointvalid) {
//       ctx!.strokeStyle = currentpoint.color;
//       ctx!.lineWidth = currentpoint.size;
//       ctx!.lineCap = "round";

//       ctx!.beginPath();
//       ctx!.moveTo(prevpoint.x, prevpoint.y);
//       ctx!.lineTo(currentpoint.x, currentpoint.y);
//       ctx!.stroke();
//     }

//     prevpointvalid = true;
//     prevpoint = currentpoint;
//   }
//   prevpointvalid = false;
