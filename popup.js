document.getElementById('upload').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.executeScript(
            tabs[0].id,
            { code: 'setWebcamVideo();' }
        );
    });
});

document.getElementById('update').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.executeScript(
            tabs[0].id,
            { code: 'updateWebcamVideo();' }
        );
    });
});

document.getElementById('restore').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.executeScript(
            tabs[0].id,
            { code: 'restoreWebcam();' }
        );
    });
});
