let cGlob = {};

cGlob.extId = chrome.runtime.id;

cGlob.spoofVideo = document.createElement('video');
cGlob.spoofVideo.setAttribute('id', 'spoofVideo');
cGlob.spoofVideo.preload = 'auto';
cGlob.spoofVideo.autoplay = true;
cGlob.spoofVideo.muted = true;
cGlob.spoofVideo.style.display = 'none';

const scriptsToInject = [
    `chrome-extension://${cGlob.extId}/injected/logger.js`,
    // `chrome-extension://${extId}/injected/renamer.js`,
    `chrome-extension://${cGlob.extId}/injected/spoofer.js`,
    `chrome-extension://${cGlob.extId}/injected/setter.js`,
    `chrome-extension://${cGlob.extId}/injected/update.js`,
];

cGlob.isLoaded = false;

cGlob.loadCallback = () => {
    chrome.runtime.sendMessage({ message: 'isVerified' }, res => {
        if(!res.success) return;
        if(!res.verified) return;

        cGlob.isLoaded = true;
        document.body.appendChild(cGlob.spoofVideo);
        
        for(let script of scriptsToInject) {
            let scriptElm = document.createElement('script');
            scriptElm.src = script;
            scriptElm.defer = true;

            document.head.appendChild(scriptElm);
            console.log(`Injected: ${script}`);
        }
    });
}

document.addEventListener('DOMContentLoaded', cGlob.loadCallback);

cGlob.setWebcamVideo = () => {
    chrome.runtime.sendMessage({ message: 'isVerified' }, res => {
        if(!res.success) return;
        if(!res.verified) return;

        let input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*, image/png, image/jpeg, image/jpg';

        input.addEventListener('change', () => {
            let file = input.files[0];
            if(file) {
                console.warn('Recived new file');
                let blobUrl = URL.createObjectURL(file);
                console.warn('Blob url created: ', blobUrl);
                cGlob.spoofVideo.src = blobUrl;
                // spoofVideo.setAttribute('spoofSrc', blobUrl);

                let imageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
                if(imageTypes.includes(file.type)) cGlob.spoofVideo.setAttribute('for', 'image');
                else cGlob.spoofVideo.setAttribute('for', 'video');

                cGlob.updateWebcamVideo();
                // setTimeout(cGlob.updateWebcamVideo, 1000);
            }
        });

        input.click();
    });
}

cGlob.updateWebcamVideo = () => {
    let scr = document.createElement('script');
    scr.innerHTML = 'injGlob.updateStreams();';
    document.head.appendChild(scr);
    document.head.removeChild(scr);
}

cGlob.updateVerifyStatus = () => {
    if(cGlob.isLoaded) return;
    cGlob.loadCallback();
}
