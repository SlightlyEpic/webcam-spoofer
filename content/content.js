let extId = chrome.runtime.id;

let spoofVideo = document.createElement('video');
spoofVideo.setAttribute('id', 'spoofVideo');
spoofVideo.preload = 'auto';
spoofVideo.autoplay = true;
spoofVideo.muted = true;
spoofVideo.style.display = 'none';

const scriptsToInject = [
    `chrome-extension://${extId}/injected/logger.js`,
    // `chrome-extension://${extId}/injected/renamer.js`,
    `chrome-extension://${extId}/injected/spoofer.js`,
    `chrome-extension://${extId}/injected/setter.js`,
    `chrome-extension://${extId}/injected/update.js`,
];

document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(spoofVideo);
    
    for(let script of scriptsToInject) {
        let scriptElm = document.createElement('script');
        scriptElm.src = script;

        document.head.appendChild(scriptElm);
        console.log(`Injected: ${script}`);
    }
});

function setWebcamVideo() {
    console.log('hello im under the water');

    let input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*, image/png, image/jpeg, image/jpg';

    input.addEventListener('change', () => {
        let file = input.files[0];
        if(file) {
            console.warn('Recived new file');
            let blobUrl = URL.createObjectURL(file);
            console.warn('Blob url created: ', blobUrl);
            spoofVideo.src = blobUrl;
            // spoofVideo.setAttribute('spoofSrc', blobUrl);

            let imageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            if(imageTypes.includes(file.type)) spoofVideo.setAttribute('for', 'image');
            else spoofVideo.setAttribute('for', 'video');

            updateWebcamVideo();
            // setTimeout(updateWebcamVideo, 1000);
        }
    });

    input.click();
}

function updateWebcamVideo() {
    let scr = document.createElement('script');
    scr.innerHTML = 'updateStreams();';
    document.head.appendChild(scr);
    document.head.removeChild(scr);
}
