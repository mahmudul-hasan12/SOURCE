// SkySourcing Chrome Extension Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log("[SkySourcing] Extension successfully installed!");
  chrome.storage.local.set({
    exchangeRate: 17.5,
    profitMargin: 12,
    apiUrl: "http://localhost:3000/api/extension/import"
  });
});

// Relay messages if needed
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "OPEN_IMPORT_MODAL") {
    // If floating button on 1688 was clicked, open popup or notify
    console.log("[SkySourcing] Floating button triggered for product:", message.product);
    sendResponse({ received: true });
  }
  return true;
});
