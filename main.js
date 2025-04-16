// New keyframe system: each keyframe corresponds to one line.
// There are 5 verses with 4 lines each – 20 keyframes in total.
let keyframeIndex = 0;

let keyframes = [
  { activeVerse: 1, activeLines: [1] },
  { activeVerse: 1, activeLines: [2] },
  { activeVerse: 1, activeLines: [3] },
  { activeVerse: 1, activeLines: [4] },
  { activeVerse: 2, activeLines: [1] },
  { activeVerse: 2, activeLines: [2] },
  { activeVerse: 2, activeLines: [3] },
  { activeVerse: 2, activeLines: [4] },
  { activeVerse: 3, activeLines: [1] },
  { activeVerse: 3, activeLines: [2] },
  { activeVerse: 3, activeLines: [3] },
  { activeVerse: 3, activeLines: [4] },
  { activeVerse: 4, activeLines: [1] },
  { activeVerse: 4, activeLines: [2] },
  { activeVerse: 4, activeLines: [3] },
  { activeVerse: 4, activeLines: [4] },
  { activeVerse: 5, activeLines: [1] },
  { activeVerse: 5, activeLines: [2] },
  { activeVerse: 5, activeLines: [3] },
  { activeVerse: 5, activeLines: [4] }
];

// Global variable to track currently displayed right‑column content
let currentGraph = "earth";  // starts with Earth

// Set up navigation buttons
document.getElementById("forward-button").addEventListener("click", forwardClicked);
document.getElementById("backward-button").addEventListener("click", backwardClicked);

// Combine wheel events for scrollytelling and globe rotation.
document.addEventListener("wheel", function(event) {
  if (event.deltaY > 0) {
    forwardClicked();
  } else if (event.deltaY < 0) {
    backwardClicked();
  }
  updateGlobeRotation(event.deltaY);
});

// Globe rotation: update background position if globe is visible.
let globeRotation = 0;
function updateGlobeRotation(deltaY) {
  const globe = document.getElementById("globe");
  if (!globe) return; // only update if the Earth is shown
  globeRotation += deltaY * 0.5;
  globe.style.backgroundPosition = `${globeRotation}px 0`;
}

// Reset all active lines.
function resetActiveLines() {
  document.querySelectorAll(".line").forEach(line => {
    line.classList.remove("active-line");
  });
}

// Update the active verse: remove active-verse from all verses and add to current one.
// Also scroll the left column so that the active verse is centered.
function updateActiveVerse(id) {
  document.querySelectorAll(".verse").forEach(verse => {
    verse.classList.remove("active-verse");
  });
  const activeVerse = document.getElementById("verse" + id);
  if (activeVerse) {
    activeVerse.classList.add("active-verse");
    scrollLeftColumnToActiveVerse(id);
  }
}

// Mark a specific line in the active verse as active.
function updateActiveLine(vid, lid) {
  const verse = document.querySelector("#verse" + vid);
  if (verse) {
    const line = verse.querySelector("#line" + lid);
    if (line) {
      line.classList.add("active-line");
    }
  }
}

// Smoothly scroll the left column so that the active verse is centered.
function scrollLeftColumnToActiveVerse(id) {
  const leftColumn = document.querySelector(".left-column-content");
  const activeVerse = document.getElementById("verse" + id);
  if (activeVerse) {
    const verseRect = activeVerse.getBoundingClientRect();
    const containerRect = leftColumn.getBoundingClientRect();
    const desiredScrollTop = verseRect.top + leftColumn.scrollTop - containerRect.top - (containerRect.height - verseRect.height) / 2;
    leftColumn.scrollTo({
      top: desiredScrollTop,
      behavior: "smooth"
    });
  }
}

// Draw (or update) the current keyframe: highlight the active verse and line,
// and update the right-column content accordingly.
function drawKeyframe(kfi) {
  const kf = keyframes[kfi];
  resetActiveLines();
  updateActiveVerse(kf.activeVerse);
  kf.activeLines.forEach(lineNum => {
    updateActiveLine(kf.activeVerse, lineNum);
  });
  updateRightColumnContent(kf.activeVerse);
}

// Advance to the next keyframe.
function forwardClicked() {
  if (keyframeIndex < keyframes.length - 1) {
    keyframeIndex++;
    drawKeyframe(keyframeIndex);
  }
}

// Move back to the previous keyframe.
function backwardClicked() {
  if (keyframeIndex > 0) {
    keyframeIndex--;
    drawKeyframe(keyframeIndex);
  }
}

// Update the right-column content based on the active verse.
// Mapping:
//   Verse 1: Earth (spinning globe)
//   Verse 2: River chart (river.html)
//   Verse 3: Tree chart (tree.html)
//   Verse 4: Air chart (air.html)
//   Verse 5 (and beyond): Earth
function updateRightColumnContent(verseNumber) {
  var rightDisplay = document.getElementById("right-display");
  var graphType;
  if (verseNumber === 1) {
    graphType = "earth";
  } else if (verseNumber === 2) {
    graphType = "river";
  } else if (verseNumber === 3) {
    graphType = "tree";
  } else if (verseNumber === 4) {
    graphType = "air";
  } else if (verseNumber >= 5) {
    graphType = "earth";
  }
  // If the requested content is already active, do nothing.
  if (graphType === currentGraph) return;

  // Fade out the current content, then update.
  rightDisplay.style.opacity = 0;
  setTimeout(function(){
    // Clear the container.
    rightDisplay.innerHTML = "";
    if (graphType === "earth") {
      // Insert the globe element.
      var globeDiv = document.createElement("div");
      globeDiv.id = "globe";
      rightDisplay.appendChild(globeDiv);
    } else {
      // Create an iframe for the graph page.
      var iframe = document.createElement("iframe");
      iframe.src = graphType + ".html"; // e.g., "river.html", "tree.html", "air.html"
      iframe.setAttribute("scrolling", "no"); // disable internal scrolling
      iframe.style.border = "none";
      iframe.style.width = "125%";
      iframe.style.height = "125%";
      iframe.style.transform = "scale(0.8)";
      iframe.style.transformOrigin = "0 0";
      iframe.style.marginTop = "0"; // ensure it starts at the top
      rightDisplay.appendChild(iframe);
    }
    currentGraph = graphType;
    // Fade in the new content.
    rightDisplay.style.opacity = 1;
  }, 500); // Duration matches the CSS transition for a smooth fade.
}

// Initialise the scrollytelling by drawing the first keyframe.
function initialise() {
  drawKeyframe(keyframeIndex);
}

initialise();
