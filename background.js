// Google AI Overview Remover Background Script
chrome.runtime.onInstalled.addListener(() => {
    console.log('Google AI Overview Remover extension installed');
});

// Handle tab updates to ensure content script runs on navigation
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes('google.com/search')) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
        }).catch(() => {
            // Ignore errors (e.g., if content script already injected)
        });
    }
});
