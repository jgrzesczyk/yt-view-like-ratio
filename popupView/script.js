const isEnabledInput = document.getElementById("isEnabled");
const isEnabledString = document.getElementById("isEnabledString");

chrome.storage.sync.get("isEnabled", ({ isEnabled }) => {
  isEnabledInput.checked = !!isEnabled;
  isEnabledString.innerHTML = isEnabled ? "Enabled" : "Disabled";
});

isEnabledInput.addEventListener("change", () => {
  chrome.storage.sync.set({ isEnabled: isEnabledInput.checked });
  isEnabledString.innerHTML = isEnabledInput.checked ? "Enabled" : "Disabled";
  chrome.tabs.reload(() => {});
});
