async function updateStreams() {
    if(__VERBOSE >= 1) console.log('Updating webcam videos');

    if(__VERBOSE >= 2) console.log('Generating stream...');
    let stream = await navigator.mediaDevices.getUserMedia({})
    currStream = stream;
    if(__VERBOSE >= 2) console.log('Stream generated');

    if(__VERBOSE >= 2) {
        console.log('Replacing targets');
        console.log('Targets: ', spoofingTargets)
    }
    for(let elm of spoofingTargets) {
        if(__VERBOSE >= 2) console.log  (`Replaced video of: `, elm);
        elm.srcObject = stream;
    }
}
