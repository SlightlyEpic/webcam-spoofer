if(!window.originalEnumerateDevices) {
    window.originalEnumerateDevices = navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);
}

navigator.mediaDevices.enumerateDevices = async function () {
    let devices = await window.originalEnumerateDevices();
    return devices.map((device, index) => {
        if(device.kind === "videoinput") {
            let i = `|${index}|`;

            return new Proxy(device, {
                get: function (target, prop) {
                    return "label" === prop ? `FaceTime HD Camera (Built-in) (05ac:8514) ${i}` : target[prop];
                }
            });
        }
        
        return device;
    });
}
