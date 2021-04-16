/* eslint-disable no-unused-vars */
browser.browserAction.onClicked.addListener(async _ => {
  const standaloneURL = chrome.extension.getURL('index.html')
  chrome.tabs.create({
    'url': standaloneURL
  })
})

// setInterval(() => {
//   chrome.notifications.create('9a572b84-f45c-4fc1-9b61-f0ecede59d5e', {
//     iconUrl: './icons/48.png',
//     message: 'Lets gooo-o-o-o!',
//     title: 'Booya',
//     type: 'basic'
//   }, id => console.log(id))
// }, 10_000);


