/*eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }]*/
import 'chrome-extension-async/chrome-extension-async'

browser.browserAction.onClicked.addListener(async _tab => {
  const standaloneURL = chrome.extension.getURL('index.html')
  chrome.tabs.create({
    'url': standaloneURL
  })
})
