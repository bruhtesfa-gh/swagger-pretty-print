# Swagger UI Pretty Print

A lightweight Chrome extension that automatically detects and pretty-prints JSON code blocks—especially useful when working with Swagger UI. The extension transforms raw JSON into a collapsible, easy-to-read format, making API responses more accessible and developer-friendly.

---

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Permissions](#permissions)
5. [How It Works](#how-it-works)
6. [Development and Contribution](#development-and-contribution)
7. [License](#license)
8. [Author](#author)

---

## Features

- **Automatic JSON Detection**: Finds `<code class="language-json">` blocks on any webpage (e.g., Swagger UI) and pretty-prints them.
- **Collapsible JSON**: Nested objects and arrays are rendered in collapsible `<details>` elements for quick navigation.
- **Toggle On/Off**: Quickly enable or disable the extension via the popup’s toggle switch.
- **Badge Indicator**: Displays “ON” or “OFF” on the extension’s icon in the toolbar.
- **No Data Collection**: Does not track or transmit user data—only modifies the page DOM locally.

---

## Installation

### From the Chrome Web Store

1. Install from the [Chrome Web Store link here](#) (replace `#` with your actual store URL once published).
2. Pin the extension to your toolbar if desired.
3. You're all set!

### From Source (Developer Mode)

1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer Mode**.
4. Click **Load unpacked** and select the folder containing `manifest.json`.
5. The extension will appear in your toolbar; pin it for easy access if you like.

---

## Usage

1. **Enable the Extension**:

   - Click the extension icon in the toolbar.
   - Toggle the switch to “Enable Extension.”
   - The badge text will change to “ON” or “OFF.”

2. **Navigate to a Swagger UI Page**:

   - The extension will automatically detect JSON code blocks and replace them with a collapsible viewer.

3. **Expand/Collapse JSON**:

   - Use the arrow in each `<details>` element to expand or collapse nested objects/arrays.

4. **Disable the Extension**:
   - Toggle the switch off in the popup to revert pages to their original view.

---

## Permissions

- **`storage`**:

  - Used to save the ON/OFF state of the extension. No personal data is collected or transmitted.

- **Content Scripts with `<all_urls>`**:
  - Required to detect and modify JSON code blocks on any webpage, particularly useful for Swagger UI or other documentation sites.
  - The extension only manipulates the DOM to display collapsible JSON; no data is collected or shared externally.

---

## How It Works

1. **Content Script (`content.js`)**:

   - Scans for `<code class="language-json">` elements.
   - Parses valid JSON text and replaces it with a collapsible DOM structure.
   - Uses `MutationObserver` to monitor for dynamically loaded or updated JSON blocks.

2. **Popup (`popup.html` + `popup.js`)**:

   - Provides a toggle switch to enable or disable the extension’s functionality.
   - Stores the user preference in `chrome.storage.sync`.

3. **Background Script (`background.js`)**:
   - Updates the extension’s badge (“ON”/“OFF”).
   - Listens for extension startup or installation events.

---

## Development and Contribution

1. **Prerequisites**:

   - A recent version of Chrome.
   - Basic knowledge of HTML, CSS, and JavaScript.

2. **Clone and Modify**:

   - Fork or clone this repository.
   - Make changes to the content scripts or UI as needed.

3. **Testing**:

   - Load the unpacked extension in Chrome (see [Installation](#installation)).
   - Open a Swagger UI page (or any page with JSON code blocks) to verify your changes.

4. **Pull Requests**:
   - If you have improvements or new features, feel free to open a pull request.
   - Provide a clear description of the changes and testing steps.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Author

**Bruhtesfa Enyew**

- **Email**: [bruhtesfazelealem436@gmail.com](mailto:bruhtesfazelealem436@gmail.com)
- **LinkedIn**: [linkedin.com/in/bruhtesfa-enyew](https://www.linkedin.com/in/bruhtesfa-enyew/)

If you find this extension helpful or have any suggestions, feel free to reach out!
