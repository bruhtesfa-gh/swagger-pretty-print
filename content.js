"use strict";

/**
 * Recursively renders JSON data as collapsible HTML elements.
 * @param {any} data - The JSON data to render.
 * @returns {HTMLElement} - The HTML element representing the JSON.
 */
function renderJSON(data, index = null) {
  // Handle objects and arrays recursively
  if (typeof data === "object" && data !== null) {
    const container = document.createElement("div");
    // Use a details/summary element for collapsible behavior
    const details = document.createElement("details");
    details.open = true; // open by default; set to false to collapse on load

    const summary = document.createElement("summary");
    // summary.style.display = "flex";
    const key = document.createElement("span");
    key.className = "json-key";
    const type = document.createElement("span");
    if (index != null) {
      key.textContent = `${index} : `;
    }
    type.textContent = Array.isArray(data)
      ? `Array [${data.length}]`
      : "Object";
    summary.appendChild(key);
    summary.appendChild(type);
    details.appendChild(summary);

    // Create a container for the children elements
    const childContainer = document.createElement("div");
    childContainer.style.marginLeft = "20px";

    // If the data is an array, iterate over its items
    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        const itemContainer = document.createElement("div");
        itemContainer.style.display = "flex";
        // Display index for array elements
        itemContainer.appendChild(renderJSON(item, index));
        childContainer.appendChild(itemContainer);
      });
    } else {
      // Otherwise iterate over object keys
      Object.keys(data).forEach((key) => {
        const itemContainer = document.createElement("div");
        itemContainer.style.display = "flex";
        if (typeof data[key] !== "object") {
          const keySpan = document.createElement("span");
          keySpan.className = "json-key";
          keySpan.textContent = key + ": ";
          itemContainer.appendChild(keySpan);
        }
        itemContainer.appendChild(renderJSON(data[key], key));
        childContainer.appendChild(itemContainer);
      });
    }
    details.appendChild(childContainer);
    container.appendChild(details);
    return container;
  } else {
    // Render primitives with appropriate styling
    const span = document.createElement("span");
    if (typeof data === "string") {
      span.className = "json-value-string";
      span.textContent = `"${data}"`;
    } else if (typeof data === "number") {
      span.className = "json-value-number";
      span.textContent = data;
    } else if (typeof data === "boolean") {
      span.className = "json-value-boolean";
      span.textContent = data;
    } else if (data === null) {
      span.className = "json-value-null";
      span.textContent = "null";
    }
    return span;
  }
}

/**
 * Accepts JSON data and returns an HTML element containing a pretty printed and collapsible view.
 * @param {Object|Array} jsonData - The JSON data to be displayed.
 * @returns {HTMLElement} - The container element with the pretty printed JSON.
 */
function createCollapsibleJSON(jsonData) {
  const container = document.createElement("div");
  container.className = "json-container";
  container.appendChild(renderJSON(jsonData));
  return container;
}

document.querySelectorAll(".language-json").forEach((codeElem) => {
  observeCodeElement(codeElem);
});

function extractJsonAndPrettyPrint(codeElem) {
  if (
    codeElem.textContent.startsWith("{") ||
    codeElem.textContent.startsWith("[")
  ) {
    try {
      let _data = JSON.parse(codeElem.textContent);
      try {
        codeElem.style.display = "none";
        codeElem.parentElement
          .querySelectorAll(".json-container")
          .forEach((e) => e.remove());
        codeElem.parentElement.appendChild(createCollapsibleJSON(_data));
      } catch (error) {
        console.error("createCollapsibleJSON:", error);
      }
    } catch (e) {
      console.log(e);
    }
  }
}

// Function to attach a MutationObserver to a given pre element
function observeCodeElement(codeElem) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      // For any change affecting text content, print the updated content.
      extractJsonAndPrettyPrint(codeElem);
    });
  });
  // Observe changes to child nodes, text (characterData), and subtree changes inside the <pre> element.
  observer.observe(codeElem, {
    childList: true,
    subtree: true,
    characterData: true,
  });
}

// Create an observer to monitor the document for any new nodes added that might contain <pre> elements.
const docObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      // If the added node is an element...
      if (node.nodeType === Node.ELEMENT_NODE) {
        // If the node itself is a <pre> element, attach an observer.
        if (
          node.tagName == "CODE" &&
          node.classList.contains("language-json")
        ) {
          observeCodeElement(node);
        }

        const nestedcodeElements = node.querySelectorAll(".language-json");
        if (nestedcodeElements.length > 0) {
          nestedcodeElements.forEach((codeElem) => {
            observeCodeElement(codeElem);
            extractJsonAndPrettyPrint(codeElem);
          });
        }
      }
    });
  });
});

// Enable the content script by default.
let enabled = true;
const keys = ["enabled"];

chrome.storage.sync.get(keys, (data) => {
  if (data.enabled) {
    // Start observing the document body for any new elements being added.
    docObserver.observe(document.body, { childList: true, subtree: true });

    document.querySelectorAll(".language-json").forEach((codeElem) => {
      observeCodeElement(codeElem);
    });
  }
});

// Listen for storage changes, specifically for the "enabled" key.
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "sync" && changes.enabled) {
    const newEnabled = changes.enabled.newValue;
    if (newEnabled) {
      // Start observing the document body for any new elements being added.
      docObserver.observe(document.body, { childList: true, subtree: true });

      document.querySelectorAll(".language-json").forEach((codeElem) => {
        extractJsonAndPrettyPrint(codeElem);
      });
    } else {
      // Stop observing the document body.
      document.querySelectorAll(".json-container").forEach((e) => e.remove());
      document
        .querySelectorAll(".language-json")
        .forEach((e) => (e.style.display = "block"));
      docObserver.disconnect();
    }
  }
});
