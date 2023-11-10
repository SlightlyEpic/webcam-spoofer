const UNIVERSAL_PASSWORD = '7CEB54C43E9FD1E91379A77F39D2E';

let isVerified = false;
let activeLicenseKey = null;

const client = supabase.createClient('https://wzckrfrmhqevymvydfym.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6Y2tyZnJtaHFldnltdnlkZnltIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk2MzIwMjYsImV4cCI6MjAxNTIwODAyNn0.75XRzoYmqd9OKdV7P75YFa0L8RKKj4NuDJ52kjXuFN0');

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function tryAutoVerify() {
    chrome.storage.local.get(['verifyKey'], async result => {
        if(chrome.runtime.lastError) throw chrome.runtime.lastError;
        if(!('verifyKey' in result)) throw 'Verify key not in storage';

        let key = result.verifyKey;

        let { data, error } = await client.auth.signInWithPassword({
            email: `${key}@veri.fy`,
            password: UNIVERSAL_PASSWORD
        });

        if(error) {
            isVerified = false;
            activeLicenseKey = null;
            chrome.stoage.local.remove('verifyKey', () => {});
            throw error;
        }

        try { await client.auth.signOut() } catch(err) {}

        console.log(data);

        isVerified = true;
        activeLicenseKey = key;
        return data;
    });
}

async function tryVerify(licenseKey) {
    if(!licenseKey) throw Error('licenseKey is invalid');
    
    let { data, error } = await client.auth.signInWithPassword({
        email: `${licenseKey}@veri.fy`,
        password: UNIVERSAL_PASSWORD
    });

    if(error) throw error.message;
    if(!data) throw 'Invalid login';

    isVerified = true;
    activeLicenseKey = licenseKey;
    console.log(data);

    chrome.storage.local.set({ verifyKey: licenseKey }, () => {
        if(chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else {
            console.log('License key saved successfully');
        }
    });
    
    try { await client.auth.signOut() } catch(err) {}

    return data;
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
                    verified: true,
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
            tryVerify(req.licenseKey)
            .then(() => {
                sendRes({
                    success: true,
                    verified: true,
                    message: 'Verified!'
                });
            })
            .catch(err => {
                sendRes({
                    success: false,
                    error: err
                });
            })
            break;

        case 'isVerified':
            sendRes({ 
                success: true, 
                verified: isVerified,
                message: 'Verified!'
            });
            break;
        
        default:
            sendRes({ 
                success: false, 
                error: 'Unknown message' 
            });
            break;
    }

    return true;
});

console.log('Hello');
