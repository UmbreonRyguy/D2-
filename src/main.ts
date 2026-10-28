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

let isMouseDown = false;
let mouseX = 0;
let mouseY = 0;

interface Pixel {
  x: number;
  y: number;
  color: "string";
}
let lines = []; //every mousedown is a collection of lines

canvas.addEventListener("mousemove", (event) => {
  mouseX = event.clientX - canvas.width / 40;
  mouseY = event.clientY - canvas.height / 4.2;
  if (isMouseDown) {
    placePixel(mouseX, mouseY);
  }
});

document.addEventListener("mousedown", () => {
  isMouseDown = true;
});
document.addEventListener("mouseup", () => {
  isMouseDown = false;
});

function placePixel(x: number, y: number) {
  ctx!.fillStyle = "black";
  ctx!.fillRect(x, y, 1, 1);
  console.log("placing pixel");
}

app.append(heading, message, canvas);

ctx!.fillStyle = "white";
ctx!.fillRect(0, 0, 600, 600);
