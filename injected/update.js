async function updateStreams() {
    spLogger.log(1, 'Updating webcam videos');

    spLogger.log(2, 'Generating stream...');
    let stream = await navigator.mediaDevices.getUserMedia({})
    currStream = stream;
    spLogger.log(2, 'Stream generated');

    spLogger.log(2, 'Replacing targets');
    spLogger.log(2, 'Targets: ', spoofingTargets)

    for(let elm of spoofingTargets) {
        if(__VERBOSE >= 2) spLogger.log(2, `Replaced video of: `, elm);
        elm.srcObject = stream;
    }
}
