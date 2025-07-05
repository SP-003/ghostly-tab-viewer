
// Content script that will be injected into web pages
let isTransparent = false;
let opacity = 50;
let customColor = '#4169E1';

// Create transparency overlay
function createTransparencyOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'ghostly-transparency-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    pointer-events: none;
    backdrop-filter: blur(2px);
    transition: all 0.3s ease-in-out;
  `;
  document.body.appendChild(overlay);
  return overlay;
}

// Update transparency effect
function updateTransparency() {
  let overlay = document.getElementById('ghostly-transparency-overlay');
  
  if (isTransparent) {
    if (!overlay) {
      overlay = createTransparencyOverlay();
    }
    
    const hexToRgba = (hex, alpha) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    
    overlay.style.background = `linear-gradient(45deg, 
      ${hexToRgba(customColor, opacity / 200)} 0%, 
      ${hexToRgba(customColor, opacity / 300)} 25%, 
      ${hexToRgba('#FFD700', opacity / 200)} 50%, 
      ${hexToRgba('#FF6B6B', opacity / 200)} 75%, 
      ${hexToRgba('#4ECDC4', opacity / 200)} 100%)`;
    overlay.style.display = 'block';
  } else {
    if (overlay) {
      overlay.style.display = 'none';
    }
  }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'toggle-transparency':
      isTransparent = !isTransparent;
      updateTransparency();
      break;
    case 'disable-transparency':
      isTransparent = false;
      updateTransparency();
      break;
  }
});

// Initialize
updateTransparency();
