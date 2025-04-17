const mediaFiles = [
  "../m/1.jfif","../m/2.jfif","../m/3.jpg","../m/4.jpg","../m/5.jpg",
  "../m/6.jpg","../m/7.jpg","../m/8.jpg","../m/9.jpg","../m/10.jpg",
  "../m/11.jpg","../m/12.mp4","../m/13.jpg","../m/14.jpg","../m/15.jpg",
  "../m/16.jpg","../m/17.mp4","../m/18.jpg","../m/19.mp4","../m/20.jpg",
  "../m/21.jpg","../m/22.jpg","../m/23.jpg","../m/24.jfif","../m/25.jpg",
  "../m/26.jpg","../m/27.jpg","../m/28.jfif","../m/29.jfif","../m/30.jfif",
  "../m/31.jpg","../m/32.jpg","../m/33.jpg","../m/34.jpg","../m/35.jpg",
  "../m/36.jpg","../m/37.jpeg","../m/38.jpeg","../m/39.jpeg","../m/40.jpeg",
];

let hoveredBoxes = new Set();

function getRandomFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
  const arr = array.slice(); // make a copy
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function isOverlapping(x, y, width, height, boxes, buffer = 20) {
  for (const rect of boxes) {
    if (
      x + width + buffer > rect.x &&
      x < rect.x + rect.width + buffer &&
      y + height + buffer > rect.y &&
      y < rect.y + rect.height + buffer
    ) {
      return true; // There is an overlap
    }
  }
  return false; // No overlap
}

function updateBoxes() {
  const boxes = document.querySelectorAll(".img-box");
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const placedBoxes = [];
  const shuffledMedia = shuffleArray(mediaFiles);

  boxes.forEach((box, index) => {
    if (hoveredBoxes.has(box)) return;

    let attempts = 0;
    let width = getRandomFromRange(120, 220);
    let height = width * 4 / 3;
    let top, left;

    do {
      top = getRandomFromRange(0, screenHeight - height); // Constrain top within bounds
      left = getRandomFromRange(0, screenWidth - width);  // Constrain left within bounds
      attempts++;
      if (attempts > 100) break; // Allow more attempts to avoid early failure
    } while (isOverlapping(left, top, width, height, placedBoxes, 40)); // Increased buffer to 40px

    // Set the position and size for the box
    box.style.width = `${width}px`;
    box.style.height = `${height}px`;
    box.style.top = `${top}px`;
    box.style.left = `${left}px`;

    // Reset previous content
    box.style.backgroundImage = "";
    box.innerHTML = "";

    // Assign the media file to the box
    const file = shuffledMedia[index % shuffledMedia.length];
    const ext = file.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "jfif", "gif", "webp"].includes(ext)) {
      box.style.backgroundImage = `url("${file}")`;
      box.style.backgroundSize = "cover";
      box.style.backgroundPosition = "center";
    } else if (ext === "mp4") {
      const video = document.createElement("video");
      video.src = file;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.style.width = "100%";
      video.style.height = "100%";
      video.style.objectFit = "cover";
      video.style.borderRadius = "inherit";
      box.appendChild(video);
    }

    // Add the current box's position and size to placedBoxes to avoid overlap
    placedBoxes.push({ x: left, y: top, width, height });
  });
}

// Run the function periodically to update positions
setInterval(updateBoxes, 2500);
updateBoxes();

// Countdown logic (unchanged)
const targetDate = new Date("2025-05-08T00:00:00");

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) return;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = String(hours).padStart(2, '0');
  document.getElementById("minutes").textContent = String(minutes).padStart(2, '0');
  document.getElementById("seconds").textContent = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Hover effect tracking (unchanged)
const boxes = document.querySelectorAll(".img-box");
boxes.forEach((box) => {
  box.addEventListener("mouseenter", () => hoveredBoxes.add(box));
  box.addEventListener("mouseleave", () => hoveredBoxes.delete(box));
});
