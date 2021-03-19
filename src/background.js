/*eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }]*/
import 'chrome-extension-async/chrome-extension-async'

browser.browserAction.onClicked.addListener(async _tab => {
  const standaloneURL = chrome.extension.getURL('index.html')

  const matchedTabs = await chrome.tabs.query({ url: standaloneURL })
  if (matchedTabs.length === 0) {
    console.log("Opening new tab: " + standaloneURL)
    chrome.tabs.create({
      'url': standaloneURL
    })
  } else {
    const [standaloneTab] = matchedTabs
    chrome.tabs.update(standaloneTab.id, { highlighted: true })
  }
})
