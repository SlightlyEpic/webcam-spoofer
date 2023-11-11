let popGlob = {};

// Send isVerified message to auth.js
chrome.runtime.sendMessage({ message: 'isVerified' }, res => {
    console.log('isVerified request: ', res);

    if(!res.success) return popGlob.statusError(res.error);

    console.log(res.verified);
    if(res.verified) return popGlob.showMain();
    console.log('a');

    popGlob.statusWarn('Trying to auto verify...');
    chrome.runtime.sendMessage({ message: 'autoVerify' }, res => {
        if(!res.success) return popGlob.statusError(res.error);
        
        popGlob.statusSuccess('Verified!');
        popGlob.showMain();
    });
});

document.getElementById('verifyButton').addEventListener('click', () => {
    let key = document.getElementById('keyInput').value;
    let status = document.getElementById('status');

    if(key) {
        popGlob.statusWarn('Verifying...');

        // Send verify message to auth.js
        chrome.runtime.sendMessage({ message: 'verify', licenseKey: key }, res => {

            if(!res.success) return popGlob.statusError(res.error);
            if(!res.verified) return popGlob.statusError('Invalid key');

            popGlob.statusSuccess('Verified!');
            popGlob.showMain();
        });
    } else {
        popGlob.statusError('Please enter a key');
        console.warn(status.innerText);
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

popGlob.statusError = (err) => {
    let status = document.getElementById('status');
    status.style.color = 'red';
    status.innerText = err;
}

popGlob.statusWarn = (msg) => {
    let status = document.getElementById('status');
    status.style.color = 'yellow';
    status.innerText = msg;
}

popGlob.statusSuccess = (msg) => {
    let status = document.getElementById('status');
    status.style.color = 'green';
    status.innerText = msg;
}

popGlob.showVerify = () => {
    document.getElementById('verifyContainer').style.display = 'block';
    document.getElementById('mainContainer').style.display = 'none';
}

popGlob.showMain = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.executeScript(
            tabs[0].id,
            { code: 'cGlob.updateVerifyStatus();' }
        );
    });

    document.getElementById('verifyContainer').style.display = 'none';
    document.getElementById('mainContainer').style.display = 'flex';
}
