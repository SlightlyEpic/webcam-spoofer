injGlob.realSrcObjectSetter = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'srcObject').set;

injGlob.deviceLabels = [];
injGlob.trySetDeviceLabels = () => {
    navigator.mediaDevices.enumerateDevices()
    .then(devices => {
        injGlob.deviceLabels = devices.map(d => d.label).filter(label => label.length > 0);
        if(injGlob.deviceLabels.length === 0) setTimeout(injGlob.trySetDeviceLabels, 1000);
    })
    .catch(err => {
        injGlob.spLogger.error(2, err);
        setTimeout(injGlob.trySetDeviceLabels, 1000);
    });
}
injGlob.trySetDeviceLabels();

injGlob.spoofingTargets = [];
injGlob.currUid = 1;

Object.defineProperty(HTMLMediaElement.prototype, 'srcObject', {
    async set(stream) {
        injGlob.realSrcObjectSetter.call(this, stream);
        if(!stream) return;

        const tracks = stream.getTracks();

        injGlob.spLogger.log(2, tracks.some(t => injGlob.deviceLabels.includes(t.label)));
        injGlob.spLogger.log(2, tracks);
        injGlob.spLogger.log(2, tracks.map(t => t.label));

        if(tracks.some(t => injGlob.deviceLabels.includes(t.label))) {
            // This element is a spoofing target
            if(!this.hasAttribute('spoof-uid')) {
                this.setAttribute('spoof-uid', `${injGlob.currUid}`);
                injGlob.spoofingTargets.push(this);
            }

            if(injGlob.spoofedStreamIds.has(stream.id)) {
                injGlob.realSrcObjectSetter.call(this, spoofed);
            } else {
                await navigator.mediaDevices.getUserMedia({ video: true })
                .then(spoofed => {
                    injGlob.realSrcObjectSetter.call(this, spoofed);
                });
            }
        }
    }
});
