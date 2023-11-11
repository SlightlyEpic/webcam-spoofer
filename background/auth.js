let bgGlob = {};

bgGlob.UNIVERSAL_PASSWORD = '7CEB54C43E9FD1E91379A77F39D2E';

bgGlob.isVerified = false;
bgGlob.activeLicenseKey = null;

bgGlob.client = supabase.createClient('https://wzckrfrmhqevymvydfym.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6Y2tyZnJtaHFldnltdnlkZnltIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk2MzIwMjYsImV4cCI6MjAxNTIwODAyNn0.75XRzoYmqd9OKdV7P75YFa0L8RKKj4NuDJ52kjXuFN0');

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

bgGlob.tryAutoVerify = () => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['verifyKey'], result => {
            if(chrome.runtime.lastError) reject(chrome.runtime.lastError);
            if(!('verifyKey' in result)) reject('Verify key not in storage');

            let key = result.verifyKey;

            bgGlob.client.auth.signInWithPassword({
                email: `${key}@veri.fy`,
                password: bgGlob.UNIVERSAL_PASSWORD
            })
            .then(({ data, error }) => {

                if(error) {
                    bgGlob.isVerified = false;
                    bgGlob.activeLicenseKey = null;
                    chrome.storage.local.remove('verifyKey', () => {});
                    reject(error);
                }

                try { bgGlob.client.auth.signOut() } catch(err) {}

                console.log(data);

                bgGlob.isVerified = true;
                bgGlob.activeLicenseKey = key;
                resolve(data);
            })
            .catch(reject)
        });
    });
}

bgGlob.tryVerify = async (licenseKey) => {
    if(!licenseKey) throw Error('licenseKey is invalid');
    
    let { data, error } = await bgGlob.client.auth.signInWithPassword({
        email: `${licenseKey}@veri.fy`,
        password: bgGlob.UNIVERSAL_PASSWORD
    });

    if(error) throw error.message;
    if(!data) throw 'Invalid login';

    bgGlob.isVerified = true;
    bgGlob.activeLicenseKey = licenseKey;
    console.log(data);

    chrome.storage.local.set({ verifyKey: licenseKey }, () => {
        if(chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else {
            console.log('License key saved successfully');
        }
    });
    
    try { bgGlob.client.auth.signOut() } catch(err) {}

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
            bgGlob.tryAutoVerify()
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
            bgGlob.tryVerify(req.licenseKey)
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
                verified: bgGlob.isVerified,
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
