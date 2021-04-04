/* eslint-disable no-unused-vars */
browser.browserAction.onClicked.addListener(async _ => {
  const standaloneURL = chrome.extension.getURL('index.html')
  chrome.tabs.create({
    'url': standaloneURL
  })
})
