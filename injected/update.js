async function updateStreams() {
    console.warn('Updating webcam videos');

    console.warn('Generating stream...');
    let stream = await navigator.mediaDevices.getUserMedia({})
    currStream = stream;
    console.warn('Stream generated');

    console.warn('Replacing targets');
    console.warn('Targets: ', spoofingTargets)
    for(let elm of spoofingTargets) {
        console.warn(`Replaced video of: `, elm);
        elm.srcObject = stream;
    }
}
