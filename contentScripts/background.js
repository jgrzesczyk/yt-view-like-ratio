chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const regex = /.*youtube.com\/watch\?.*/gm;

  if (changeInfo.status === "complete" && !!tab.url.match(regex)) {
    chrome.tabs.sendMessage(tabId, {
      message: "NEW_VIDEO",
    });
  }
});
