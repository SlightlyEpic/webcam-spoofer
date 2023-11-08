const realSrcObjectSetter = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'srcObject').set;

let deviceLabels = [];
let trySetDeviceLabels = () => {
    navigator.mediaDevices.enumerateDevices()
    .then(devices => {
        deviceLabels = devices.map(d => d.label).filter(label => label.length > 0);
        if(deviceLabels.length === 0) setTimeout(trySetDeviceLabels, 1000);
    })
    .catch(err => {
        if(__VERBOSE >= 2) console.error(err);
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

        if(__VERBOSE >= 2) {
            console.log(tracks.some(t => deviceLabels.includes(t.label)));
            console.log(tracks);
            console.log(tracks.map(t => t.label));
        }

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
