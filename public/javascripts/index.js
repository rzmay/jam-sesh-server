function startLiveText() {

    function getPlayers(callback) {
        const url = `${window.location.protocol}//${window.location.host}/data/players`;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = function () {
            var status = xhr.status;
            callback({status: status === 200 ? null : status, data: xhr.response})
        };
        xhr.send();
    }

    function displayPlayersInfo(element) {
        getPlayers((response)=>{
            if (response.status !== null) {
                console.log(`Error fetching players (${response.status}): ${response.data}`);
                return;
            }

            let playerCount = response.data.length;
            element.innerText = `Create tunes with ${playerCount} other player${playerCount > 1 ? 's' : ''}.`;
        });
    }

    let text = document.getElementById('gameDescription');

    displayPlayersInfo(text);
    let updateInterval = setInterval(()=>{ displayPlayersInfo(text); }, 10 * 1000);
    return updateInterval;
}

window.requestAnimationFrame(()=>{

    startLiveText();

});