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
}

let connectpoints = false;
const connecttoggle = document.createElement("input");
connecttoggle.type = "checkbox";
connecttoggle.checked = false;
connecttoggle.addEventListener("change", () => {
  connectpoints = connecttoggle.checked;
});
const connecttext = document.createElement("p");
connecttext.textContent = "Connect Points: ";

let lines: Point[][] = []; //every mousedown is a collection of lines
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

canvas.addEventListener("mousedown", () => {
  isMouseDown = true;
  undonelines = [];
});
canvas.addEventListener("mouseup", () => {
  isMouseDown = false;
  lines.push(currentline);
  currentline = [];
  prevpointvalid = false;
});

function placePoint(x: number, y: number) {
  const pointcolor = "black";

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
);

ctx!.fillStyle = "white";
ctx!.fillRect(0, 0, 600, 600);

function redrawall() {
  ctx!.fillStyle = "white";
  ctx!.fillRect(0, 0, 600, 600);

  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      const currentpoint: Point = lines[i][j];

      if (currentpoint.connected == false) {
        ctx!.fillStyle = currentpoint.color;
        ctx!.fillRect(
          currentpoint.x,
          currentpoint.y,
          currentpoint.size,
          currentpoint.size,
        );
      }

      if (currentpoint.connected && prevpointvalid) {
        ctx!.strokeStyle = currentpoint.color;
        ctx!.lineWidth = currentpoint.size;
        ctx!.lineCap = "round";

        ctx!.beginPath();
        ctx!.moveTo(prevpoint.x, prevpoint.y);
        ctx!.lineTo(currentpoint.x, currentpoint.y);
        ctx!.stroke();
      }

      prevpointvalid = true;
      prevpoint = currentpoint;
    }
    prevpointvalid = false;
  }
}
