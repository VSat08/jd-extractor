/**
 * JD Extractor v3.0 — Background Service Worker
 * Native Browser Side Panel Architecture (Edge & Chrome)
 *
 * Configures the extension to open in the browser's native side panel frame (like Microsoft Copilot),
 * remaining active and accessible across all tabs.
 */

'use strict';

// Ensure the side panel opens directly when the user clicks the extension toolbar icon
if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
    .catch((err) => console.warn('[JD Extractor] setPanelBehavior warning:', err));
}

// Fallback listener for action click if setPanelBehavior is not supported
if (chrome.action && chrome.action.onClicked) {
  chrome.action.onClicked.addListener(async (tab) => {
    if (tab && tab.windowId && chrome.sidePanel && chrome.sidePanel.open) {
      try {
        await chrome.sidePanel.open({ windowId: tab.windowId });
      } catch (err) {
        console.warn('[JD Extractor] action.onClicked sidePanel.open warning:', err);
      }
    }
  });
}

// Support keyboard shortcut (Ctrl+Shift+J) to open the native side panel
if (chrome.commands && chrome.commands.onCommand) {
  chrome.commands.onCommand.addListener(async (command) => {
    if (command === '_execute_action') {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.windowId && chrome.sidePanel && chrome.sidePanel.open) {
          await chrome.sidePanel.open({ windowId: tab.windowId });
        }
      } catch (err) {
        console.warn('[JD Extractor] Command open error:', err);
      }
    }
  });
}
