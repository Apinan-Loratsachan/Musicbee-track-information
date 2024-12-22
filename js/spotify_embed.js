function embedSpotifyPlayer(trackID) {
    widgetHeight = "152px";
    musicInfo = document.getElementById("musicInfo");
    spotifyEmbed = document.getElementById("spotify-embed");

    spotifyEmbed.innerHTML = `
    <div>
        <iframe id="spotify-embed-iframe" src="https://open.spotify.com/embed/track/${trackID}" width="${musicInfo.offsetWidth}" height="${widgetHeight}" frameborder="0"
            allowtransparency="true" allow="encrypted-media">
        </iframe>
    </div>
`

    setTimeout(() => {
        spotifyEmbed.style.height = widgetHeight;
        spotifyEmbed.style.opacity = "1";
        spotifyEmbed.style.scale = "1";
    }, 1000);
}

function resizeSpotifyEmbedPlayer() {
    document.getElementById("spotify-embed-iframe").style.width = `${document.getElementById("musicInfo").offsetWidth}px`;
}