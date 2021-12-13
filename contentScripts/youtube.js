const YOUR_API_KEY = "<your-api-key>";

chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "NEW_VIDEO") {
    chrome.storage.sync.get("isEnabled", ({ isEnabled }) => {
      isEnabled && onNewVideo(location.href);
    });
  }
});

function onNewVideo(url) {
  const id = new URL(url).searchParams.get("v");

  fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${id}&key=${YOUR_API_KEY}`
  )
    .then((x) => x.json())
    .then(async (x) => {
      const { commentCount, likeCount } = x.items[0].statistics;
      const { status, ratio } = getVideoRatio(commentCount, likeCount);

      await replaceDislikeButton(ratio, status);
    });
}

const getVideoRatio = (commentCount, likeCount) => {
  if (commentCount < 10 || likeCount < 50) {
    return {
      status: "not_enough_data",
    };
  }

  return {
    status: "ok",
    ratio: Math.max(
      Math.min(
        +(0.567092 + Math.log(likeCount / commentCount) * 0.102449).toFixed(2),
        1
      ),
      0
    ),
  };
};

const replaceDislikeButton = async (ratio, status) => {
  if (!fillDislikeButtonIfExists(ratio, status)) {
    await new Promise(() =>
      setTimeout(() => {
        fillDislikeButtonIfExists(ratio, status);
      }, 2000)
    );
  }
};

const fillDislikeButtonIfExists = (ratio, status) => {
  const buttonsContainer = !document.getElementById("menu-container")
    ?.offsetParent
    ? document.querySelector("ytd-menu-renderer.ytd-watch-metadata > div")
    : document
        .getElementById("menu-container")
        ?.querySelector("#top-level-buttons-computed");

  const dislikeButton = buttonsContainer?.children[1];
  if (!dislikeButton) return false;

  dislikeButton.style.display = "flex";
  dislikeButton.style.alignItems = "center";
  dislikeButton.style.justifyContent = "center";
  dislikeButton.style.flexDirection = "column";
  dislikeButton.style.gap = "2px";
  dislikeButton.style.width = "120px";
  dislikeButton.style.marginBottom = "4px";

  const ratioText = status === "ok" ? `${ratio * 100}%` : "N/A";
  dislikeButton.innerHTML = `<span>Ratio: ${ratioText}</span>`;

  chrome.storage.sync.get("isBarEnabled", ({ isBarEnabled }) => {
    isBarEnabled && !!ratio && createRatioBar(dislikeButton, ratio);
  });

  return true;
};

const createRatioBar = (dislikeButton, ratio) => {
  const barColor = ratio > 0.8 ? "green" : ratio > 0.6 ? "yellow" : "red";
  const barWidth = 120 * ratio;

  const ratioBar = `<span style="\
    width: ${barWidth}px; \
    height: 4px; \
    background: ${barColor}; \
  "/>`;

  const ratioBarContainer = `<span style="\
    width:120px; \
    border: 1px solid #888; \
    display: flex; \
    box-sizing: border-box; \
    align-items: flex-start;\
  ">${ratioBar}</span>`;

  dislikeButton.innerHTML += ratioBarContainer;
};
