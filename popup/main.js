document.getElementById('uploadMedia').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.executeScript(
            tabs[0].id,
            { code: 'setWebcamVideo();' }
        );
    });
});

console.log('listener added');
