function setUpUnity(socket) {
    window.SocketIOUnityConnect = function (unityInstance) {
        const onevent = socket.onevent;
        socket.onevent = function (packet) {
            let args = packet.data || [];
            onevent.call(this, packet);    // original call
            packet.data = ['*'].concat(args);
            onevent.call(this, packet);      // additional call to catch-all
        };

        socket.on('*', function (e, args) {
            // console.log(`OnEvent: ${e} (${JSON.stringify(args)})`);

            let data = {
                eventName: e,
                eventData: JSON.stringify(args) || null
            };

            unityInstance.SendMessage(window.gameObjectName, 'OnEvent', JSON.stringify(data));
        });

        socket.on('disconnect', function () {
            unityInstance.SendMessage(window.gameObjectName, 'OnDisconnect');
        });

        window.socket = socket;
    };

    window.SocketIOUnityEmit = function (event, data) {
        // console.log(`Event: ${event}, Data: ${data}`);
        window.socket.emit(event, data);
    };

    window.unityInstance = UnityLoader.instantiate("unityContainer", "/unity/Build/unity.json", {onProgress: UnityProgress});
}