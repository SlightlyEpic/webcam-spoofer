const APP_NAME = 'Verification Bot';
const OWNER_ID = 'QUwMZM0GVr';

let isInitialized = false;
let activeUser = null;
let activeSessionId = null;
let activeLicenseKey = null;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function tryInitialize() {
    return new Promise((resolve, reject) => {
        if(isInitialized) resolve(activeSessionId);

        if(!APP_NAME) reject('APP_NAME is not set');
        if(!OWNER_ID) reject('OWNER_ID is not set');

        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Host: 'keyauth.win',
                'content-type': 'application/x-www-form-urlencoded',
                'Sec-Fetch-Site': 'cross-site',
                'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
                'Origin': 'https://www.google.com',
                'Referer': 'https://www.google.com/'
            }
        };

        const params = {
            type: 'init',
            ver: '1.0',
            name: APP_NAME,
            ownerid: OWNER_ID
        };

        fetch('https://keyauth.win/api/1.2/?' + new URLSearchParams(params), options)
        .then(res => res.json())
        .then(res => {
            if(!res.success) reject(res.message);

            isInitialized = true;
            activeSessionId = res.sessionid;
            resolve(res.sessionid);
        })
        .catch(reject);

        // fetch('https://random-data-api.com/api/v2/users?size=2&response_type=json')
        // .then(res => res.json())
        // .then(console.log)
        // .catch(console.error);
    });
}

function tryAutoVerify() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['verifyKey'], result => {
            if(chrome.runtime.lastError) reject(chrome.runtime.lastError);

            if(!('verifyKey' in result)) reject('Verify key not in storage');

            tryInitialize()
            .then(() => tryVerify(result.verifyKey))
            .then(resolve)
            .catch(reject);
        });
    });
}

function tryVerify(licenseKey) {
    return new Promise((resolve, reject) => {
        if(!licenseKey) reject('licenseKey is invalid');
        if(!activeSessionId) reject('activeSessionId is not set');
        if(!APP_NAME) reject('APP_NAME is not set');
        if(!OWNER_ID) reject('OWNER_ID is not set');
        
        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                Host: 'keyauth.win',
                'content-type': 'application/x-www-form-urlencoded',
            }
        };

        const params = {
            type: 'license',
            key: licenseKey,
            sessionid: activeSessionId,
            name: APP_NAME,
            ownerid: OWNER_ID
        }
          
        fetch('https://keyauth.win/api/1.2/?' + new URLSearchParams(params), options)
        .then(res => {
            console.warn('aaa ', res);
            return res;
        })
        .then(res => res.json())
        .then(res => {
            if(!response.success) reject(res.message);

            activeLicenseKey = licenseKey;
            activeUser = res.info;
            resolve(res.info);
        })
        .catch(reject);
    });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

chrome.runtime.onMessage.addListener((req, sender, _sendRes) => {
    console.log(`Message: ${req.message}\n`, req);

    const sendRes = (...args) => {
        console.log(`Response: `, ...args);
        _sendRes(...args);
    };

    switch(req.message) {
        case 'autoVerify':
            tryAutoVerify()
            .then(() => {
                sendRes({
                    success: true,
                    message: 'Verified!'
                });
            })
            .catch(err => {
                sendRes({
                    success: false,
                    error: err
                });
            });
            break;

        case 'verify':
            tryInitialize()
            .then(() => tryVerify(req.licenseKey))
            .then(() => {
                chrome.storage.local.set({ verifyKey: req.licenseKey }, () => {
                    if(chrome.runtime.lastError) console.error(chrome.runtime.lastError);

                    sendRes({
                        success: true,
                        message: 'Verified!'
                    });
                });
            })
            .catch(err => {
                sendRes({
                    success: false,
                    error: err
                });
            });
            break;
        
        case 'isVerified':
            sendRes({ 
                success: true, 
                verified: (activeLicenseKey != null), 
                user: activeUser 
            });
            break;
        
        default:
            sendRes({ 
                success: false, 
                error: 'Unknown message' 
            });
            break;
    }
});

console.log('Hello');
