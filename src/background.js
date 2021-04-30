import { isItReminderTime } from './helpers/reminder-helper'

// Dark mode icon support
if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  chrome.browserAction.setIcon({
    path: {
      "16": "icons/16-white.png",
      "48": "icons/48-white.png",
      "128": "icons/128-white.png"
    }
  })
}

/* eslint-disable no-unused-vars */
browser.browserAction.onClicked.addListener(async _ => {
  const standaloneURL = chrome.extension.getURL('index.html')
  chrome.tabs.create({
    'url': standaloneURL
  })
})


setInterval(() => {
  const vuex = JSON.parse(localStorage.getItem('vuex'))
  if (vuex.reminder && isItReminderTime(vuex.reminderDays, vuex.reminderTime)) {
    chrome.notifications.create('rndmzr-reminder', {
      iconUrl: './icons/48.png',
      message: 'Time to fill in your timesheets 🧐',
      title: 'rndmzr',
      type: 'basic',
      requireInteraction: true
    })
  }
}, 61_000);
