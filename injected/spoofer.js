if (!window.originalGetUserMedia) {
    window.originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
}

let spoofedStreamIds = new Set();
let currStream = null;

navigator.mediaDevices.getUserMedia = async constraints => {
    console.warn('User media requested');

    try {
        let element = document.getElementById('spoofVideo');
        // let blobUrl = element.getAttribute('spoofSrc');
        let blobUrl = element.src;
        
        if(!blobUrl) {
            console.warn('Spoof source was not provided, defaulting to webcam');
            return window.originalGetUserMedia(constraints);
        }

        let type = element.getAttribute('for');

        if(type === 'video') {
            console.warn('Sending video stream');

            let stream;
            
            const videoElement = document.getElementById('spoofVideo');
            videoElement.loop = true;
            videoElement.crossOrigin = '';

            console.warn('playing video');
            videoElement.play();
            console.warn('video played');

            if (videoElement.captureStream)         stream = videoElement.captureStream();
            else if(videoElement.mozCaptureStream)  stream = videoElement.mozCaptureStream();
            else                                    throw new Error('Cannot spoof due to incompatible browser');

            console.log('Override success!');
            
            spoofedStreamIds.add(stream.id);
            currStream = stream;

            console.warn('Returning user media');
            return stream;
        } else {
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            let image = new Image();
            image.crossOrigin = '';
            image.src = blobUrl;

            await new Promise((resolve, reject) => {
                image.addEventListener('load', () => {
                    canvas.width = image.width;
                    canvas.height = image.height;
                    resolve();
                });
            });

            function draw() {
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                requestAnimationFrame(draw);
            }

            if(!canvas.captureStream) throw new Error('Cannot spoof stream using image due to incompatible browser');

            draw();
            let stream = canvas.captureStream();

            console.log('Override success!');
            currStream = stream;
            return stream;
        }
    } catch (t) {
        console.warn(`Failed to create a stream from your media: `, t);

        return window.originalGetUserMedia(constraints);
    }
}
