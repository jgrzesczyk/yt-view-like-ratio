const isEnabledInput = document.getElementById("isEnabled");
const isBarEnabledInput = document.getElementById("isBarEnabled");
const apiKeyInput = document.getElementById("apiKey");

chrome.storage.sync.get("isEnabled", ({ isEnabled }) => {
  if (isEnabled === undefined) {
    chrome.storage.sync.set({ isEnabled: true });
    isEnabledInput.checked = true;
  } else {
    isEnabledInput.checked = !!isEnabled;
  }
});

chrome.storage.sync.get("isBarEnabled", ({ isBarEnabled }) => {
  if (isBarEnabled === undefined) {
    chrome.storage.sync.set({ isBarEnabled: true });
    isBarEnabledInput.checked = true;
  } else {
    isBarEnabledInput.checked = !!isBarEnabled && !!isEnabledInput.checked;
  }
});

chrome.storage.sync.get("apiKey", ({ apiKey }) => {
  apiKeyInput.value = apiKey || "";
});

isEnabledInput.addEventListener("change", () => {
  chrome.storage.sync.set({ isEnabled: isEnabledInput.checked });
  isBarEnabledInput.disabled = !isEnabledInput.checked;

  if (!isEnabledInput.checked) {
    chrome.storage.sync.set({ isBarEnabled: false });
    isBarEnabledInput.checked = false;
  }
});

isBarEnabledInput.addEventListener("change", () => {
  chrome.storage.sync.set({ isBarEnabled: isBarEnabledInput.checked });
});

apiKeyInput.addEventListener("input", () => {
  chrome.storage.sync.set({ apiKey: apiKeyInput.value });
});
