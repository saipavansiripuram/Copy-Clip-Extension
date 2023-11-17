document.addEventListener("DOMContentLoaded", function () {
  const linksList = document.getElementById("links-list");
  const nameInput = document.getElementById("name-input");
  const linkInput = document.getElementById("link-input");
  const addLinkBtn = document.getElementById("add-link-btn");
  const notificationContainer = document.getElementById("notification-container");

  // Load links from storage on extension popup open
  chrome.storage.sync.get(["links"], function (result) {
    const links = result.links || [];
    displayLinks(links);
  });

  function displayLinks(links) {
    linksList.innerHTML = "";
    for (const link of links) {
      createLinkItem(link.name, link.url);
    }
  }

  function saveLinks(links) {
    chrome.storage.sync.set({ links: links });
  }

  function createLinkItem(name, linkUrl) {
    const li = document.createElement("li");
    li.classList.add("link-item");

    const nameSpan = document.createElement("span");
    nameSpan.textContent = name;
    nameSpan.classList.add("name-text");
    li.appendChild(nameSpan);
    // const nameInput = document.createElement("input");
    // nameInput.type = "text";
    // nameInput.value = name;
    // nameInput.readOnly = true;
    // li.appendChild(nameInput);

    const linkInput = document.createElement("input");
    linkInput.type = "text";
    linkInput.value = linkUrl;
    linkInput.readOnly = true;
    li.appendChild(linkInput);

    const copyBtn = document.createElement("button");
    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
    copyBtn.addEventListener("click", function () {
      navigator.clipboard.writeText(linkUrl).then(function () {
        showNotification("Link copied to clipboard!");
      });
    });
    li.appendChild(copyBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.addEventListener("click", function () {
      chrome.storage.sync.get(["links"], function (result) {
        const links = result.links || [];
        const index = links.findIndex(item => item.name === name && item.url === linkUrl);
        if (index !== -1) {
          links.splice(index, 1);
          saveLinks(links);
          displayLinks(links);
        }
      });
    });
    li.appendChild(deleteBtn);

    linksList.appendChild(li);
  }

  addLinkBtn.addEventListener("click", function () {
    const name = nameInput.value.trim();
    const linkUrl = linkInput.value.trim();
    if (name !== "" && linkUrl !== "") {
      chrome.storage.sync.get(["links"], function (result) {
        const links = result.links || [];
        links.push({ name, url: linkUrl });
        saveLinks(links);
        createLinkItem(name, linkUrl);
        nameInput.value = "";
        linkInput.value = "";
      });
    }
  });

  function showNotification(message) {
    notificationContainer.textContent = message;
    notificationContainer.style.display = "block";

    setTimeout(function () {
      notificationContainer.style.display = "none";
    }, 3000);
  }
});
