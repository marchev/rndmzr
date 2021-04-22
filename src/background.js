import { isItReminderTime } from './helpers/reminder-helper'

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
