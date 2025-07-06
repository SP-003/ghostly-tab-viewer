// Popup script for extension controls
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggleBtn');
  const opacitySlider = document.getElementById('opacitySlider');
  const opacityValue = document.getElementById('opacityValue');
  const colorPicker = document.getElementById('colorPicker');
  const colorInput = document.getElementById('colorInput');
  const themeSelect = document.getElementById('themeSelect');
  const customColorGroup = document.getElementById('customColorGroup');

  // Load saved settings
  chrome.storage.sync.get(['opacity', 'customColor', 'animationTheme'], (result) => {
    if (result.opacity) {
      opacitySlider.value = result.opacity;
      opacityValue.textContent = result.opacity + '%';
    }
    if (result.customColor) {
      colorPicker.value = result.customColor;
      colorInput.value = result.customColor;
    }
    if (result.animationTheme) {
      themeSelect.value = result.animationTheme;
      toggleCustomColorGroup(result.animationTheme === 'custom');
    }
  });

  function toggleCustomColorGroup(show) {
    customColorGroup.style.display = show ? 'block' : 'none';
  }

  // Toggle transparency
  toggleBtn.addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'toggle-transparency'});
    });
  });

  // Theme selection
  themeSelect.addEventListener('change', (e) => {
    const theme = e.target.value;
    toggleCustomColorGroup(theme === 'custom');
    chrome.storage.sync.set({animationTheme: theme});
    
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'update-settings',
        animationTheme: theme
      });
    });
  });

  // Opacity slider
  opacitySlider.addEventListener('input', (e) => {
    const value = e.target.value;
    opacityValue.textContent = value + '%';
    chrome.storage.sync.set({opacity: value});
    
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'update-settings',
        opacity: value
      });
    });
  });

  // Color picker
  colorPicker.addEventListener('change', (e) => {
    const color = e.target.value;
    colorInput.value = color;
    chrome.storage.sync.set({customColor: color});
    
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'update-settings',
        customColor: color
      });
    });
  });

  // Color input
  colorInput.addEventListener('change', (e) => {
    const color = e.target.value;
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      colorPicker.value = color;
      chrome.storage.sync.set({customColor: color});
      
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'update-settings',
          customColor: color
        });
      });
    }
  });
});
