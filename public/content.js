// Content script that will be injected into web pages
let isTransparent = false;
let opacity = 50;
let customColor = '#4169E1';
let animationTheme = 'gradient';

// Create transparency overlay that covers the entire page
function createTransparencyOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'ghostly-transparency-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999999;
    pointer-events: none;
    backdrop-filter: blur(2px);
    transition: all 0.3s ease-in-out;
    display: none;
  `;
  document.body.appendChild(overlay);
  return overlay;
}

// Hide/show the main page content
function togglePageVisibility(hide) {
  const body = document.body;
  const html = document.documentElement;
  
  if (hide) {
    // Hide all page content except our overlay
    body.style.visibility = 'hidden';
    html.style.visibility = 'hidden';
    
    // Show only our overlay
    const overlay = document.getElementById('ghostly-transparency-overlay');
    if (overlay) {
      overlay.style.visibility = 'visible';
      overlay.style.display = 'block';
    }
  } else {
    // Restore page visibility
    body.style.visibility = 'visible';
    html.style.visibility = 'visible';
    
    // Hide overlay
    const overlay = document.getElementById('ghostly-transparency-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  }
}

// Update transparency effect with animations
function updateTransparency() {
  let overlay = document.getElementById('ghostly-transparency-overlay');
  
  if (isTransparent) {
    if (!overlay) {
      overlay = createTransparencyOverlay();
    }
    
    // Clear existing animation classes
    overlay.className = '';
    
    const hexToRgba = (hex, alpha) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    
    // Apply animation theme
    switch (animationTheme) {
      case 'ocean':
        overlay.classList.add('ghostly-theme-ocean', 'ghostly-particles');
        break;
      case 'sunset':
        overlay.classList.add('ghostly-theme-sunset', 'ghostly-shimmer');
        break;
      case 'forest':
        overlay.classList.add('ghostly-theme-forest', 'ghostly-particles');
        break;
      case 'neon':
        overlay.classList.add('ghostly-theme-neon', 'ghostly-animate');
        break;
      case 'custom':
        overlay.style.background = `linear-gradient(45deg, 
          ${hexToRgba(customColor, opacity / 100)} 0%, 
          ${hexToRgba(customColor, opacity / 150)} 25%, 
          ${hexToRgba('#FFD700', opacity / 100)} 50%, 
          ${hexToRgba('#FF6B6B', opacity / 100)} 75%, 
          ${hexToRgba('#4ECDC4', opacity / 100)} 100%)`;
        overlay.classList.add('ghostly-animate');
        break;
      default: // gradient
        overlay.classList.add('ghostly-animated-bg', 'ghostly-particles');
    }
    
    // Apply opacity
    overlay.style.opacity = opacity / 100;
    
    // Hide page content and show transparent overlay
    togglePageVisibility(true);
  } else {
    // Show page content and hide overlay
    togglePageVisibility(false);
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
    case 'update-settings':
      if (request.opacity !== undefined) {
        opacity = parseInt(request.opacity);
      }
      if (request.customColor !== undefined) {
        customColor = request.customColor;
      }
      if (request.animationTheme !== undefined) {
        animationTheme = request.animationTheme;
      }
      if (isTransparent) {
        updateTransparency();
      }
      break;
  }
});

// Initialize
updateTransparency();
