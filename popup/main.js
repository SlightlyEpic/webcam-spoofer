document.getElementById('uploadMedia').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.executeScript(
            tabs[0].id,
            { code: 'cGlob.setWebcamVideo();' }
        );
    });
});

console.log('listener added');
