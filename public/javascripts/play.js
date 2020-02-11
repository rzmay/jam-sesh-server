// Create & set up socket
const socket = io();

socket.on('joinedRoom', (data)=>{
    let room = data.id;

    console.log(`Joined room ${room}`);

    socket.on('audioData', async (base64string)=>{
        // Generate sound settings
        let soundId = Math.random().toString(36).substr(2, 5);

        let sound = document.createElement('audio');
        sound.id = 'audioPlayer-' + soundId;
        sound.src = 'data:audio/wav;base64,' + base64string;
        sound.type = 'audio/wav';
        document.body.appendChild(sound);

        // Add sound to document and play
        let soundInstance = document.getElementById(sound.id);
        soundInstance.play();

        // Destroy sound after 2s
        setTimeout(()=>{ soundInstance.outerHTML = ""; }, 2000);
    });
});


// Set up unity
setUpUnity(socket);