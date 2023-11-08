const realSrcObjectSetter = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'srcObject').set;

let deviceLabels = [];
let trySetDeviceLabels = () => {
    navigator.mediaDevices.enumerateDevices()
    .then(devices => {
        deviceLabels = devices.map(d => d.label).filter(label => label.length > 0);
        if(deviceLabels.length === 0) setTimeout(trySetDeviceLabels, 1000);
    })
    .catch(err => {
        spLogger.error(2, err);
        setTimeout(trySetDeviceLabels, 1000);
    });
}
trySetDeviceLabels();

let spoofingTargets = [];
let currUid = 1;


Object.defineProperty(HTMLMediaElement.prototype, 'srcObject', {
    async set(stream) {
        realSrcObjectSetter.call(this, stream);
        if(!stream) return;

        const tracks = stream.getTracks();

        spLogger.log(2, tracks.some(t => deviceLabels.includes(t.label)));
        spLogger.log(2, tracks);
        spLogger.log(2, tracks.map(t => t.label));

        if(tracks.some(t => deviceLabels.includes(t.label))) {
            // This element is a spoofing target
            if(!this.hasAttribute('spoof-uid')) {
                this.setAttribute('spoof-uid', `${currUid}`);
                spoofingTargets.push(this);
            }

            if(spoofedStreamIds.has(stream.id)) {
                realSrcObjectSetter.call(this, spoofed);
            } else {
                await navigator.mediaDevices.getUserMedia({ video: true })
                .then(spoofed => {
                    realSrcObjectSetter.call(this, spoofed);
                });
            }
        }
    }
});
