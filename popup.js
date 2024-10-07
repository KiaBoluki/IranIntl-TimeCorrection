// This function communicates with the content script to execute the updateTimeTags function on the active tab
document.getElementById('updateTime').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: updateTimeTags // this function must be available in the content script
        });
    });
});
