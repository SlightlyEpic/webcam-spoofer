injGlob.updateStreams = async () => {
    injGlob.spLogger.log(1, 'Updating webcam videos');

    injGlob.spLogger.log(2, 'Generating stream...');
    let stream = await navigator.mediaDevices.getUserMedia({})
    currStream = stream;
    injGlob.spLogger.log(2, 'Stream generated');

    injGlob.spLogger.log(2, 'Replacing targets');
    injGlob.spLogger.log(2, 'Targets: ', injGlob.spoofingTargets)

    for(let elm of injGlob.spoofingTargets) {
        injGlob.spLogger.log(2, `Replaced video of: `, elm);
        elm.srcObject = stream;
    }
}
