const isEnabledInput = document.getElementById("isEnabled");
const isBarEnabledInput = document.getElementById("isBarEnabled");

chrome.storage.sync.get("isBarEnabled", ({ isBarEnabled }) => {
  isBarEnabledInput.checked = !!isBarEnabled;
});

chrome.storage.sync.get("isEnabled", ({ isEnabled }) => {
  isEnabledInput.checked = !!isEnabled;

  if (!isEnabledInput.checked) {
    isBarEnabledInput.disabled = true;
    chrome.storage.sync.set({ isBarEnabled: false });
    isBarEnabledInput.checked = false;
  }
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
