const app = document.querySelector<HTMLElement>("#app")!;

const heading = document.createElement("h1");
heading.textContent = "D2 project";

const message = document.createElement("p");
message.textContent = "Your project starts here.";

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

let isMouseDown = false;
let mouseX = 0;
let mouseY = 0;

interface Point {
  x: number;
  y: number;
  color: "string";
  size: number;
}
let lines = []; //every mousedown is a collection of lines
let currentline = [];

canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;
  if (isMouseDown) {
    placePoint(mouseX, mouseY);
  }
});

document.addEventListener("mousedown", () => {
  isMouseDown = true;
});
document.addEventListener("mouseup", () => {
  isMouseDown = false;
});

function placePoint(x: number, y: number) {
  ctx!.fillStyle = "black";
  ctx!.fillRect(x, y, brushsize, brushsize);
  console.log("placing pixel");
}

app.append(heading, message, canvas, textbreak, sizetext, sizeslider);

ctx!.fillStyle = "white";
ctx!.fillRect(0, 0, 600, 600);
