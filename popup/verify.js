// Send isVerified message to auth.js
chrome.runtime.sendMessage({ message: 'isVerified' }, res => {
    if(!res.success) return statusError(res.error);
    if(res.verified) return showMain();

    statusWarn('Trying to auto verify...');
    chrome.runtime.sendMessage({ message: 'autoVerify' }, res => {
        if(!res.success) return statusError(res.error);
        
        statusSuccess('Verified!');
        showMain();
    });
});

document.getElementById('verifyButton').addEventListener('click', () => {
    let key = document.getElementById('keyInput').value;
    let status = document.getElementById('status');

    if(key) {
        statusWarn('Verifying...');

        // Send verify message to auth.js
        chrome.runtime.sendMessage({ message: 'verify', licenseKey: key }, res => {

            if(!res.success) return statusError(res.error);
            if(!res.verified) return statusError('Invalid key');

            statusSuccess('Verified!');
            showMain();
        });
    } else {
        statusError('Please enter a key');
        console.warn(status.innerText);
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function statusError(err) {
    let status = document.getElementById('status');
    status.style.color = 'red';
    status.innerText = err;
}

function statusWarn(msg) {
    let status = document.getElementById('status');
    status.style.color = 'yellow';
    status.innerText = msg;
}

function statusSuccess(msg) {
    let status = document.getElementById('status');
    status.style.color = 'green';
    status.innerText = msg;
}

function showVerify() {
    document.getElementById('verifyContainer').style.display = 'block';
    document.getElementById('mainContainer').style.display = 'none';
}

function showMain() {
    document.getElementById('verifyContainer').style.display = 'none';
    document.getElementById('mainContainer').style.display = 'flex';
}
