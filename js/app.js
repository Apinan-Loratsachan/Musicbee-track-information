var g_title, g_artist, g_album, g_albumArtist, g_trackNumber, g_discNumber, g_discCount, spotifyDirectURL, spotifyAlbumDataTemp, flag = true, spotifyCustomImageFlag = true, alreadyAudio = false, headerIsTitle = true;
var s_title, s_artist, s_album, s_albumArtist
// เมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener("DOMContentLoaded", function () {
    // รับค่า parameter จาก URL
    const params = new URLSearchParams(window.location.search);

    g_title = params.get("tr") || '';
    g_artist = params.get("ar") || '';
    g_album = params.get("al") || '';
    g_albumArtist = params.get("alar") || '';
    g_trackNumber = params.get("tn") || '';
    g_discNumber = params.get("dn") || '';
    g_discCount = params.get("dc") || '';
    alt_title = params.get("atr") || '';
    custom_image = params.get("cti") || '';
    spotify_album_id = params.get("aref") || '';
    spotify_album_cover_id = params.get("cref") || '';
    audio = params.get("tref") || '';
    youtube_video_id = params.get("v") || '';
    title_artist = params.get("ar") || "Unknow artist";
    s_title = encodeURIComponent(g_title);
    s_artist = encodeURIComponent(g_artist);
    s_album = encodeURIComponent(g_album);
    s_albumArtist = encodeURIComponent(g_albumArtist);

    // ใส่ข้อมูลลงใน HTML
    if (g_title != '') {
        document.title = g_title + ' - ' + title_artist
        const headerText = document.getElementById("headerText")
        setTimeout(function () {
            headerText.classList.remove("animate__bounceIn")
            headerText.classList.add("animate__bounceOut")
            setTimeout(function () {
                headerText.innerText = g_title
                headerText.classList.remove("animate__bounceOut")
                headerText.classList.add("animate__bounceIn")
                // changeHeader()
            }, 750);
        }, 750);
        if (g_artist != '') {
            const artistHearder = document.createElement("h6")
            artistHearder.innerText = `By ${g_artist}`
            artistHearder.id = "headerSubText"
            artistHearder.classList = "headerText prevent-all animate__animated animate__fadeInDown delay-15"
            document.getElementById("header").appendChild(artistHearder)
        }
        if (alt_title != '') {
            const thElement = document.createElement('th')
            thElement.setAttribute('scope', 'row')
            thElement.className = 'subTH'
            thElement.id = 'alt-title-th'
            document.getElementById('altTitleZone').appendChild(thElement)
            const altTitleThDivElement = document.createElement('div')
            altTitleThDivElement.id = 'alt-title-div'
            altTitleThDivElement.className = 'thDiv'
            document.getElementById('alt-title-th').appendChild(altTitleThDivElement)
            const altTitleThSpanElement = document.createElement('span')
            altTitleThSpanElement.innerText = '⤷'
            altTitleThSpanElement.className = 'subThHeader'
            document.getElementById('alt-title-div').appendChild(altTitleThSpanElement)
            const altTitleThDivNameElement = document.createElement('div')
            altTitleThDivNameElement.innerText = 'Alternate Title'
            altTitleThDivNameElement.className = 'subThHeaderText'
            document.getElementById('alt-title-div').appendChild(altTitleThDivNameElement)

            const tdElement = document.createElement('td')
            tdElement.id = 'altTitleZoneTD'
            tdElement.setAttribute('colspan', '2')
            document.getElementById('altTitleZone').appendChild(tdElement)

            const atrArray = alt_title.split(';');

            for (let i = 0; i <= atrArray.length - 1; i++) {
                if (i != 0) {
                    const spanElement = document.createElement('span');
                    spanElement.innerText = ' / '
                    document.getElementById('altTitleZoneTD').appendChild(spanElement)
                }
                const linkElement = document.createElement('a');
                linkElement.classList = 'linkText subLink'
                linkElement.innerText = atrArray[i].trim();
                linkElement.href = `https://www.google.com/search?q=${encodeURIComponent(atrArray[i].trim())}`;
                linkElement.setAttribute('target', '_blank')
                document.getElementById('altTitleZoneTD').appendChild(linkElement)
            }
        }
    }
    if (g_title == '') {
        document.getElementById('title-zone').innerText = 'Unknown'
    } else {
        document.getElementById("title").innerText = params.get("tr") || "Unknown";
        document.getElementById("title").href = `https://www.google.com/search?q=${s_title}`;
    }
    if (g_artist == '') {
        document.getElementById('artist-zone').innerText = 'Unknown'
    } else {
        document.getElementById("artist").innerText = params.get("ar") || "Unknown";

        artistString = (params.get("ar") || "");
        const artistArray = artistString.split(/(?:feat\.|meets|×|with|cv\.|Cv\.|CV\.|cv:|Cv:|CV:|cv |Cv |CV |va\.|Va\.|VA\.|va:|Va:|VA:|va |Va |VA |vo\.|Vo\.|VO\.|vo:|Vo:|VO:|vo |Vo |VO |&|\(\s*|\s*\)|\[|\]|,)/g)
            .filter(artist => artist.trim() !== "")
            .map(artist => artist.trim());

        if (artistArray.length > 1) {
            const thElement = document.createElement('th')
            thElement.setAttribute('scope', 'row')
            thElement.className = 'subTH'
            thElement.id = 'contain-artist-th'
            document.getElementById('containArtistZone').appendChild(thElement)

            const containArtistThDivElement = document.createElement('div')
            containArtistThDivElement.id = 'contain-artist-div'
            containArtistThDivElement.className = 'thDiv'
            document.getElementById('contain-artist-th').appendChild(containArtistThDivElement)

            const containArtistThSpanElement = document.createElement('span')
            containArtistThSpanElement.innerText = '⤷'
            containArtistThSpanElement.className = 'subThHeader'
            document.getElementById('contain-artist-div').appendChild(containArtistThSpanElement)

            const containArtistThDivNameElement = document.createElement('div')
            containArtistThDivNameElement.innerText = 'Contain Artists'
            containArtistThDivNameElement.className = 'subThHeaderText'
            document.getElementById('contain-artist-div').appendChild(containArtistThDivNameElement)

            const tdElement = document.createElement('td')
            tdElement.id = 'containArtistTD'
            tdElement.setAttribute('colspan', '2')
            document.getElementById('containArtistZone').appendChild(tdElement)

            for (let i = 0; i <= artistArray.length - 1; i++) {
                if (i != 0) {
                    const spanElement = document.createElement('span');
                    spanElement.innerText = ' / '
                    document.getElementById('containArtistTD').appendChild(spanElement)
                }
                const linkElement = document.createElement('a');
                linkElement.classList = 'linkText subLink'
                linkElement.innerText = artistArray[i].trim();
                linkElement.href = `https://www.google.com/search?q=${encodeURIComponent(artistArray[i].trim())}`;
                linkElement.setAttribute('target', '_blank')
                document.getElementById('containArtistTD').appendChild(linkElement)
            }
        }
        document.getElementById("artist").href = `https://www.google.com/search?q=${encodeURIComponent(g_artist)}`;
    }

    if (g_album == '') {
        document.getElementById('album-zone').innerText = 'Unknown'
    } else {
        document.getElementById("album").innerText = params.get("al") || "Unknown";
        document.getElementById("album").href = `https://www.google.com/search?q=${s_album}`;
    }
    if (g_albumArtist == '') {
        document.getElementById('albumArtist-zone').innerText = 'Unknown'
    } else if (g_albumArtist == 'Various Artists') {
        document.getElementById('albumArtist-zone').innerText = 'Various Artists'
    } else {
        document.getElementById("albumArtist").innerText = params.get("alar") || "Unknown";
        document.getElementById("albumArtist").href = `https://www.google.com/search?q=${s_albumArtist}`;
    }
    try {
        document.getElementById("disc").innerText = `${params.get("dn").replace(/^0+/, '') || "Unknown"} / ${params.get("dc").replace(/^0+/, '') || "Unknown"}`;
        document.getElementById("track").innerText = `${params.get("tn").replace(/^0+/, '') || "Unknown"} / ${params.get("tc").replace(/^0+/, '') || "Unknown"}`;
    } catch (e) {
        document.getElementById("disc").innerText = "Unknown";
        document.getElementById("track").innerText = "Unknown";
    }
    document.getElementById("genre").innerText = params.get("ge") || "Unknown";
    document.getElementById("year").innerText = params.get("y") || "Unknown";
    document.getElementById("language").innerText = params.get("lang") || "Unknown";
    document.getElementById("length").innerText = params.get("len") || "Unknown";
    const relArray = (params.get("rel") || "None").split(';');
    if (relArray[0] == 'None') {
        document.getElementById('related').innerText = 'None'
    } else {
        for (let i = 0; i <= relArray.length - 1; i++) {
            if (i != 0) {
                const spanElement = document.createElement('span');
                spanElement.setAttribute('style', 'padding-left: 10px;')
                document.getElementById('related').appendChild(spanElement)
            }
            const linkElement = document.createElement('a');
            linkElement.className = 'linkText'
            linkElement.innerText = '#' + relArray[i].trim();
            linkElement.href = `https://www.google.com/search?q=${encodeURIComponent(relArray[i].trim())}`;
            linkElement.setAttribute('target', '_blank')
            document.getElementById('related').appendChild(linkElement)
        }
    }

    // เพิ่มปุ่ม Copy
    addCopyButton("btn-copy-title", params.get("tr") || "");
    addCopyButton("btn-copy-artist", params.get("ar") || "");
    addCopyButton("btn-copy-album", params.get("al") || "");
    addCopyButton("btn-copy-albumArtist", params.get("alar") || "");

    validateData(g_title, g_album)
    validatePowerSearch(g_title + g_artist + g_album + g_albumArtist)

    if (youtube_video_id != '') {
        console.log('%c[DATA] %cHas Youtube video ID tag : ' + youtube_video_id + "\n(https://www.youtube.com/watch?v=" + youtube_video_id + ")", 'font-weight: bold', '')
        const youtubeBtn = document.getElementById('btnYoutubeSearch')
        youtubeBtn.innerHTML = ''
        youtubeBtn.classList.add('youtube-active')
        youtubeBtn.removeAttribute("onclick");

        youtubeBtn.addEventListener("click", function () {
            window.open(`https://www.youtube.com/watch?v=${youtube_video_id}`, "_blank")
        })

        const div = document.createElement('div')
        div.id = 'youtubeBtnDiv'
        div.className = 'active-btn-animate'
        div.innerHTML = `
        <i class="fa-brands fa-youtube fa-bounce fa-xl" style="color: #ff0000;" aria-hidden="true"></i>
        Open in Youtube`
        youtubeBtn.appendChild(div)
    }

    if (spotify_album_id != '') {
        document.getElementById('openAlbumBtn').innerText = ''

        const spotifyOpenAlbum = document.createElement('button')
        spotifyOpenAlbum.id = 'spotifyOpenAlbumBtn'
        spotifyOpenAlbum.classList = 'btn btn-outline-dark long-btn very-long-btn-hover spotify-active'
        spotifyOpenAlbum.addEventListener("click", function () {
            window.open(`https://open.spotify.com/album/${spotify_album_id}`, "_blank")
        })
        document.getElementById('openAlbumBtn').appendChild(spotifyOpenAlbum)

        const div = document.createElement('div')
        div.id = 'spotifyAlbumBtnDiv'
        // div.classList = 'active-btn-animate delay-16'
        document.getElementById("spotifyOpenAlbumBtn").appendChild(div)

        const spotifyIcon = document.createElement('i')
        spotifyIcon.classList = 'fa-brands fa-spotify fa-beat-fade fa-xl'
        spotifyIcon.setAttribute('style', "color: #1ed760;")
        document.getElementById("spotifyAlbumBtnDiv").appendChild(spotifyIcon)

        const spotifyTextSpace = document.createElement('span')
        spotifyTextSpace.setAttribute('style', 'margin: 5px; font-weight: normal;')
        document.getElementById("spotifyAlbumBtnDiv").appendChild(spotifyTextSpace)

        const spotifyText = document.createElement('span')
        spotifyText.innerText = 'Open album in Spotify'
        spotifyText.classList = 'active-btn-animate'
        document.getElementById("spotifyAlbumBtnDiv").appendChild(spotifyText)
        getSpotifyAlbumData()
    }
    else if (custom_image !== '') {
        customAlbumCover(custom_image);
        if (audio != '') {
            getSpotifyTrackPreview(audio)
        }
    } else {
        searchForAlbumCover();
    }
    adjustSearchBtn()
});

function searchForAlbumCover() {
    if (audio != '' && !alreadyAudio) {
        getSpotifyTrackPreview(audio)
    }
    if (g_album != '' && spotify_album_cover_id != '') {
        if (spotify_album_cover_id.includes('track/')) {
            console.log('%c[COVER] %cHas Spotify track ID tag : ' + spotify_album_cover_id.replace('track/', '') + "\n(https://open.spotify.com/" + spotify_album_cover_id + ")", 'font-weight: bold', '')
        } else {
            console.log('%c[COVER] %cHas Spotify album ID tag : ' + spotify_album_cover_id + "\n(https://open.spotify.com/album/" + spotify_album_cover_id + ")", 'font-weight: bold', '')
        }
        $(document).ready(function () {
            $(".now-precess").html("Reading tag");
        });
        spotifySearchImageByID(spotify_album_cover_id)
    } else if (g_album != '') {
        spotifySearchImage(g_album, g_artist)
    } else {
        document.getElementById('loading-cover').remove();
        document.getElementById('searching-text').remove();
        const messageElement = document.createElement('b');
        messageElement.innerText = 'Unknow album name.';
        messageElement.id = "noImageText"
        messageElement.classList = 'prevent-all animate__animated animate__headShake delay-2'
        document.getElementById('imageSection').appendChild(messageElement);
    }
}

function searchGoogle() {
    if (g_artist == "") {
        window.open(`https://www.google.com/search?q=${s_title}`, "_blank");
    } else {
        window.open(`https://www.google.com/search?q=${s_title} - ${s_artist}`, "_blank");
    }
}

function searchLyrics() {
    if (g_artist == "") {
        window.open(`https://www.google.com/search?q=lyrics ${s_title}`, "_blank");
    } else {
        window.open(`https://www.google.com/search?q=lyrics ${s_title} - ${s_artist}`, "_blank");
    }
}

function powerSearchGoogle() {
    query = ""
    if (g_title != "") {
        query = `${s_title}`
    } else {
        query = "Music"
    } if (g_artist != "") {
        query += `%20by%20${s_artist}`
    } if (g_album != "") {
        query += `%20album%20${s_album}`
    } if (g_albumArtist != "") {
        query += `%20by%20${s_albumArtist}`
    }
    window.open(`https://www.google.com/search?q=${query}`, "_blank");
}

function searchYoutube() {
    if (g_artist == "") {
        window.open(`https://www.youtube.com/results?search_query=${s_title}`, "_blank");
    } else {
        window.open(`https://www.youtube.com/results?search_query=${s_title} - ${s_artist}`, "_blank");
    }
}

function searchSpotify() {
    if (spotifyDirectURL != null) {
        window.open(spotifyDirectURL, "_blank");
    } else if (audio != "") {
        window.open(`https://open.spotify.com/track/${audio}`, "_blank");
    } else if (g_artist == "") {
        window.open(`https://open.spotify.com/search/${g_title}/tracks`, "_blank");
    } else {
        window.open(`https://open.spotify.com/search/${g_artist} ${g_title}/tracks`, "_blank");
    }
}

function searchAppleMusic() {
    if (g_artist == "") {
        window.open(`https://music.apple.com/us/search?term=${s_title}`, "_blank");
    } else {
        window.open(`https://music.apple.com/us/search?term=${s_title} - ${s_artist}`, "_blank");
    }
}

function searchTrackCover() {
    if (g_artist == "") {
        window.open(`https://www.google.com/search?q=${s_title} album cover&tbm=isch`, "_blank");
    } else {
        window.open(`https://www.google.com/search?q=${s_title} - ${s_artist} album cover&tbm=isch`, "_blank");
    }
}

function searchAlbumCover() {
    if (g_artist == "") {
        window.open(`https://www.google.com/search?q=${s_album} album cover&tbm=isch`, "_blank");
    } else {
        window.open(`https://www.google.com/search?q=${s_album} - ${s_albumArtist} album cover&tbm=isch`, "_blank");
    }
}

function searchAlbum() {
    if (g_albumArtist == "") {
        window.open(`https://www.google.com/search?q=music album ${s_album}`, "_blank");
    } else {
        window.open(`https://www.google.com/search?q=${s_album} - ${s_albumArtist}`, "_blank");
    }
}

function addCopyButton(id, value) {
    if (value != "" && value != 'Various Artists') {
        const element = document.getElementById(id);
        const button = document.createElement("button");
        button.className = "btn btn-outline-dark btn-copy btn-hover";
        button.innerText = "Copy";
        button.addEventListener("click", function () {
            copyToClipboard(value);
            button.innerText = "Copied"; // เปลี่ยนข้อความปุ่มเป็น "Copied"
            button.classList.add("copied"); // เพิ่มคลาส "copied" เพื่อให้เกิดการเปลี่ยนสี

            // หลังจาก 0.75 วินาทีให้เปลี่ยนกลับเป็นเหมือนเดิม
            setTimeout(function () {
                button.innerText = "Copy";
                button.classList.remove("copied"); // ลบคลาส "copied"
            }, 750);
        });

        element.appendChild(button);
    }
}

// ฟังก์ชันคัดลอกข้อมูลไปยังคลิปบอร์ด
function copyToClipboard(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
}

// ฟังก์ชันแสดง popup ของ Bootstrap
function showCopyResultModal(fieldName, value) {
    const modal = `
    <div class="modal fade" id="copyResultModal" tabindex="-1" role="dialog" aria-labelledby="copyResultModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-body">
                    Copied <b>${fieldName}</b> successfully!
                </div>
                <div class="modal-footer" style="justify-content: space-between;">
                    <div class="footer-text">
                        <u>${value}</u>
                    </div>
                    <div class="close-btn-container">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;

    // สร้าง DOM element จาก HTML string
    const modalElement = new DOMParser().parseFromString(modal, 'text/html').body.firstChild;

    // เพิ่ม modal ลงใน body
    document.body.appendChild(modalElement);

    // เรียกใช้ Modal
    $('#copyResultModal').modal('show');

    // ลบ modal ออกเมื่อซ่อน
    $('#copyResultModal').on('hidden.bs.modal', function (e) {
        document.body.removeChild(modalElement);
    });
}

function disableObjact(id, state) {
    document.getElementById(id).disabled = state;
}

function validateData(title, album) {
    if (title != "") {
        disableObjact("btnSearchTrackCover", false)
        disableObjact("btnGoogleSearch", false)
        disableObjact("btnYoutubeSearch", false)
        disableObjact("btnSpotifySearch", false)
        disableObjact("btnAppleMusicSearch", false)
        disableObjact("btnLyricsSearch", false)
    } else {
        disableObjact("btnSearchTrackCover", true)
        disableObjact("btnGoogleSearch", true)
        disableObjact("btnYoutubeSearch", true)
        disableObjact("btnSpotifySearch", true)
        disableObjact("btnAppleMusicSearch", true)
        disableObjact("btnLyricsSearch", true)
    }

    if (album != "") {
        disableObjact("btnSearchAlbumCover", false)
        disableObjact("btnAlbumSearch", false)
    } else {
        disableObjact("btnSearchAlbumCover", true)
        disableObjact("btnAlbumSearch", true)
    }
}

function validatePowerSearch(data) {
    if (data != "") {
        disableObjact("btnPowerSearch", false)
    } else {
        disableObjact("btnPowerSearch", true)
    }
}

async function spotifySearchImage(album, album_artist) {
    console.log("%c[COVER] %cSearching with Spotify", 'font-weight: bold', 'color: DodgerBlue')
    try {
        $(document).ready(function () {
            $(".now-precess").html("Searching album cover");
        });
        const clientId = apikey[0];
        const clientSecret = apikey[1];
        const base64Credentials = btoa(`${clientId}:${clientSecret}`);

        // Get access token
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${base64Credentials}`
            },
            body: 'grant_type=client_credentials'
        });

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // Search for album images
        const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(album)} ${encodeURIComponent(album_artist)}&type=album&limit=1&offset=0`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const searchData = await searchResponse.json();
        data_spotify = searchData
        data_inuse = searchData
        data_inuse_provider = 'Spotify'

        // Check if there are albums in the search result
        if (searchData.albums && searchData.albums.items.length > 0) {
            const albumID = searchData.albums.items[0].id;
            console.log("%c[COVER | SPOTIFY]\n%cFound album ID : " + albumID + "\n(https://open.spotify.com/album/" + albumID + ")", 'font-weight: bold', '')
            console.log('%c[COVER | SPOTIFY] %cGetting album cover', 'font-weight: bold', '')
            $(document).ready(function () {
                $(".now-precess").html("Getting album cover");
            });
            const albumImages = searchData.albums.items[0].images;
            showCoverImage(albumImages[0].url)
            console.log('%c[COVER | SPOTIFY] %cGet album cover success', 'font-weight: bold', 'color: green')
        } else {
            // If no album found, display a message
            const messageElement = document.createElement('b');
            messageElement.innerText = 'No album cover found.';
            messageElement.id = "noImageText"
            document.getElementById('loading-cover').remove();
            document.getElementById('searching-text').remove();
            document.getElementById('imageSection').appendChild(messageElement);
            console.log('%c[COVER | SPOTIFY] %cNot found album cover in Spotify', 'font-weight: bold', 'color: red')
        }
    }
    catch (e) {
        console.log("%c[COVER | SPOTIFY] %cError fetching album cover data\n" + e, 'font-weight: bold', 'color: red')
        coverLoadFail()
    }
}

async function spotifySearchImageByID(spotify_album_cover_id) {
    console.log("%c[COVER | SPOTIFY] %cGetting album cover by album ID", 'font-weight: bold', '')
    try {
        $(document).ready(function () {
            $(".now-precess").html("Getting album cover");
        });

        const clientId = apikey[0];
        const clientSecret = apikey[1];
        const base64Credentials = btoa(`${clientId}:${clientSecret}`);

        // Get access token
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${base64Credentials}`
            },
            body: 'grant_type=client_credentials'
        });

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // Search for album images by ID
        const searchResponse = await fetch(`https://api.spotify.com/v1/albums/${spotify_album_cover_id}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const searchData = await searchResponse.json();
        data_spotify = searchData
        data_inuse = searchData
        data_inuse_provider = 'Spotify'

        // Check if the album is found
        if (searchData.images && searchData.images.length > 0) {
            $(document).ready(function () {
                $(".now-precess").html("Getting album cover");
            });
            const albumImages = searchData.images;
            showCoverImageByID(albumImages[0].url);
            console.log('%c[COVER | SPOTIFY] %cGet album cover success', 'font-weight: bold', 'color: green');
        } else {
            // If no album found, display a message
            console.log("%c[COVER | SPOTIFY] %cCan't get image in spotify", 'font-weight: bold', 'color: red')
        }

    } catch {
        console.log("%c[COVER] %cCan't get image in spotify", 'font-weight: bold', 'color: red')
    }
}

async function getSpotifyTrackPreview(spotify_track_id) {
    try {
        $(document).ready(function () {
            $(".now-precess").html("Getting album cover");
        });

        const clientId = apikey[0];
        const clientSecret = apikey[1];
        const base64Credentials = btoa(`${clientId}:${clientSecret}`);

        // Get access token
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${base64Credentials}`
            },
            body: 'grant_type=client_credentials'
        });

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // Search for track images by ID
        const searchResponse = await fetch(`https://api.spotify.com/v1/tracks/${spotify_track_id}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const searchData = await searchResponse.json();
        audio_data = searchData
        audio_provider = 'Spotify'

        // Check if the album is found
        if (searchData.preview_url != null) {
            alreadyAudio = true
            showAudioControlAndMoreDataWithSpotifySrc(searchData.preview_url, searchData.name, searchData.artists)
        } else {
            // If no album found, display a message
            console.log(`%c[AUDIO] %cThis track not have audio preview\n(https://open.spotify.com/track/${spotify_track_id})`, 'font-weight: bold', 'color: red')
        }

    } catch (e) {
        console.log(`%c[AUDIO] %cFailed to get audio preview in spotify`, 'font-weight: bold', 'color: red')
        console.error(e)
    }

}

function setCoverToBG(url) {
    var link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = url;
    // สร้างอิลิเมนต์ภาพ
    const img = new Image();

    img.onload = function () {
        document.getElementById('blur').style.opacity = 1
        setTimeout(() => {
            document.body.style.backgroundImage = `url('${url}')`;
            document.body.style.backgroundSize = 'cover';
        }, 250);
    };

    img.src = url;
}

function changeHeader() {
    const headerText = document.getElementById("headerText")
    const headerSubText = document.getElementById("headerSubText")
    if (headerIsTitle) {
        setTimeout(function () {
            headerText.classList.remove("animate__bounceIn")
            headerText.classList.add("animate__bounceOut")
            setTimeout(function () {
                headerSubText.classList.remove("delay-15")
                headerText.innerText = 'Track Information'
                headerText.classList.remove("animate__bounceOut")
                headerText.classList.add("animate__bounceIn")
                headerSubText.classList.remove("animate__fadeInDown")
                headerSubText.classList.add("animate__fadeOutUp")
                headerIsTitle = false
            }, 750);
            headerIsTitle = false
            changeHeader()
        }, 5000);
    } else {
        setTimeout(function () {
            headerText.classList.remove("animate__bounceIn")
            headerText.classList.add("animate__bounceOut")
            setTimeout(function () {
                headerText.innerText = g_title
                headerText.classList.remove("animate__bounceOut")
                headerText.classList.add("animate__bounceIn")
                headerSubText.classList.remove("animate__fadeOutUp")
                headerSubText.classList.add("animate__fadeInDown")
                headerIsTitle = false
            }, 750);
            headerIsTitle = true
            changeHeader()
        }, 5000);
    }
}


function showCoverImage(image) {
    Image.prototype.load = function (url) {
        var thisImg = this;
        var xmlHTTP = new XMLHttpRequest();
        xmlHTTP.open('GET', url, true);
        xmlHTTP.responseType = 'arraybuffer';
        xmlHTTP.onload = function (e) {
            var blob = new Blob([this.response]);
            thisImg.src = window.URL.createObjectURL(blob);
        };
        xmlHTTP.onprogress = function (e) {
            thisImg.completedPercentage = parseInt((e.loaded / e.total) * 100);
            $(document).ready(function () {
                $(".now-precess").html("Getting album cover " + thisImg.completedPercentage + '%');
            });
            if (thisImg.completedPercentage == 100) {
                coverElement.onload = function () {
                    $(document).ready(function () {
                        $(".now-precess").html("Displaying album cover");
                    });
                    document.getElementById('loading-animate-out').classList.add('animate__bounceOut')
                    setTimeout(() => {
                        document.getElementById('loading-cover').remove();
                        document.getElementById('searching-text').remove();
                        document.getElementById('loading-animate-out').remove();
                        document.getElementById("imageSection").className = 'imageCenter';
                        document.getElementById("imageSection").appendChild(linkElement);
                        document.getElementById("albumImageLink").appendChild(coverElement);
                        setCoverToBG(image)
                    }, 750);
                }
            }
        };
        xmlHTTP.onloadstart = function () {
            thisImg.completedPercentage = 0;
        };
        xmlHTTP.send();
    };

    const linkElement = document.createElement("a");
    linkElement.id = 'albumImageLink';
    linkElement.href = `cover?title=${encodeURIComponent(g_title)}&artist=${encodeURIComponent(g_artist ?? 'Unknow artist')}&album=${encodeURIComponent(g_album)}&cover=${encodeURIComponent(image.replace('https://', ''))}`
    linkElement.setAttribute('target', '_blank')
    const coverElement = new Image();
    coverElement.src = image;
    coverElement.alt = "Album Cover";
    coverElement.className = "card album-image animate__animated animate__jackInTheBox prevent-select";
    coverElement.id = 'albumImage';
    coverElement.style.opacity = 0;

    coverElement.load(image)
}

function showCoverImageByID(image) {
    Image.prototype.load = function (url) {
        var thisImg = this;
        var xmlHTTP = new XMLHttpRequest();
        xmlHTTP.open('GET', url, true);
        xmlHTTP.responseType = 'arraybuffer';
        xmlHTTP.onload = function (e) {
            var blob = new Blob([this.response]);
            thisImg.src = window.URL.createObjectURL(blob);
        };
        xmlHTTP.onprogress = function (e) {
            thisImg.completedPercentage = parseInt((e.loaded / e.total) * 100);
            $(document).ready(function () {
                $(".now-precess").html("Getting album cover " + thisImg.completedPercentage + '%');
            });
            if (thisImg.completedPercentage == 100) {
                coverElement.onload = function () {
                    $(document).ready(function () {
                        $(".now-precess").html("Displaying album cover");
                    });
                    document.getElementById('loading-animate-out').classList.add('animate__bounceOut')
                    setTimeout(() => {
                        document.getElementById('loading-cover').remove();
                        document.getElementById('searching-text').remove();
                        document.getElementById('loading-animate-out').remove();
                        document.getElementById("imageSection").className = 'imageCenter';
                        document.getElementById("imageSection").appendChild(linkElement);
                        document.getElementById("albumImageLink").appendChild(coverElement);

                        const coverSearchText = document.getElementById("coverSearchText")
                        coverSearchText.classList.remove("animate__fadeIn")
                        coverSearchText.classList.remove("delay-5")
                        coverSearchText.classList.add("animate__fadeOutUp")
                        setCoverToBG(image)
                        setTimeout(function () {
                            coverSearchText.innerText = "Search other cover"
                            coverSearchText.classList.remove("animate__fadeOutUp")
                            coverSearchText.classList.add("animate__fadeInUp")
                        }, 500);
                    }, 750);
                }
            }
        };
        xmlHTTP.onloadstart = function () {
            thisImg.completedPercentage = 0;
        };
        xmlHTTP.send();
    };

    const linkElement = document.createElement("a");
    linkElement.id = 'albumImageLink';
    linkElement.href = `cover?title=${encodeURIComponent(g_title)}&artist=${encodeURIComponent(g_artist ?? 'Unknow artist')}&album=${encodeURIComponent(g_album)}&cover=${encodeURIComponent(image.replace('https://', ''))}`
    linkElement.setAttribute('target', '_blank')

    const coverElement = new Image();
    coverElement.src = image;
    coverElement.alt = "Album Cover";
    coverElement.className = "card album-image animate__animated animate__jackInTheBox prevent-select";
    coverElement.id = 'albumImage';
    coverElement.style.opacity = 0;

    coverElement.load(image);
}

function showCoverImageBycti(image) {
    Image.prototype.load = function (url) {
        var thisImg = this;
        var xmlHTTP = new XMLHttpRequest();
        xmlHTTP.open('GET', url, true);
        xmlHTTP.responseType = 'arraybuffer';
        xmlHTTP.onload = function (e) {
            var blob = new Blob([this.response]);
            thisImg.src = window.URL.createObjectURL(blob);
        };
        xmlHTTP.onprogress = function (e) {
            thisImg.completedPercentage = parseInt((e.loaded / e.total) * 100);
            $(document).ready(function () {
                $(".now-precess").html("Getting album cover " + thisImg.completedPercentage + '%');
            });
            if (thisImg.completedPercentage == 100) {
                coverElement.onload = function () {
                    $(document).ready(function () {
                        $(".now-precess").html("Displaying album cover");
                    });
                    document.getElementById('loading-animate-out').classList.add('animate__bounceOut')
                    setTimeout(() => {
                        const linkElement = document.createElement("a");
                        linkElement.id = 'albumImageLink';
                        linkElement.href = `cover?title=${encodeURIComponent(g_title)}&artist=${encodeURIComponent(g_artist ?? 'Unknow artist')}&album=${encodeURIComponent(g_album)}&cover=${encodeURIComponent(image.replace('https://', ''))}`
                        linkElement.setAttribute('target', '_blank')
                        console.log("%c[COVER | CUSTOM] %cGetting album cover", 'font-weight: bold', '')

                        document.getElementById('loading-cover').remove();
                        document.getElementById('searching-text').remove();
                        document.getElementById('loading-animate-out').remove();
                        document.getElementById("imageSection").className = "imageCenter";
                        document.getElementById("imageSection").appendChild(linkElement);
                        document.getElementById("albumImageLink").appendChild(coverElement);

                        const coverSearchText = document.getElementById("coverSearchText")
                        coverSearchText.classList.remove("animate__fadeIn")
                        coverSearchText.classList.remove("delay-5")
                        coverSearchText.classList.add("animate__fadeOutUp")
                        setCoverToBG(image)
                        setTimeout(function () {
                            coverSearchText.innerText = "Search other cover"
                            coverSearchText.classList.remove("animate__fadeOutUp")
                            coverSearchText.classList.add("animate__fadeInUp")
                        }, 500);
                        console.log("%c[COVER | CUSTOM] %cGet album cover success", 'font-weight: bold', 'color: green')
                    }, 750);
                }
            }
        };
        xmlHTTP.onloadstart = function () {
            thisImg.completedPercentage = 0;
        };
        xmlHTTP.send();
    };

    Image.prototype.completedPercentage = 0;

    const coverElement = new Image();
    coverElement.src = image;
    coverElement.alt = "Album Cover";
    coverElement.className = "card album-image animate__animated animate__jackInTheBox prevent-select";
    coverElement.id = 'albumImage';
    coverElement.style.opacity = 0;

    coverElement.load(image);

    coverElement.onerror = function () {
        if (spotifyCustomImageFlag == false) {
            console.log(`%c[COVER | CUSTOM] %cCan't get image for this URL.\n(${custom_image})`, 'font-weight: bold', 'color: red')
            console.log(`%c[DATA → COVER] %cError on load custom album cover. Using album data instead.`, 'font-weight: bold', 'color: Fuchsia')
            showCoverImage(spotifyAlbumDataTemp.images[0].url);
            setCoverToBG(spotifyAlbumDataTemp.images[0].url);
            console.log(`%c[COVER] %cGet album cover success`, 'font-weight: bold', 'color: Green')
        }
        else {
            console.log("%c[COVER | CUSTOM] %cCan't get image for this URL. Begin searcing for album cover.", 'font-weight: bold', 'color: red')
            searchForAlbumCover()
        }
    }
}

function coverLoadFail() {
    const messageElement = document.createElement('b');
    messageElement.innerText = 'Failed to get album cover try to refresh this site.';
    messageElement.id = "noImageText"
    messageElement.classList = 'animate__animated animate__shakeY'
    document.getElementById('loading-cover').remove();
    document.getElementById('searching-text').remove();
    document.getElementById('imageSection').classList.remove("imageCenter");
    document.getElementById('imageSection').appendChild(messageElement);
}

function customAlbumCover(image) {
    data_inuse = null
    data_inuse_provider = 'Tag'
    showCoverImageBycti(image)
}

function showAudioControlAndMoreDataWithSpotifySrc(audioSrc, titleSrc, artistSrc, spotifyURL, albumSrc) {
    if (audio != "" || spotifyURL != '') {
        if (spotifyURL != '') {
            spotifyDirectURL = spotifyURL
        } else {
            console.log(`%c[AUDIO] %cThis track has audio preview\n(https://open.spotify.com/track/${audio})`, 'font-weight: bold', 'color: Black')
        }
        document.getElementById("btnSpotifySearch").innerText = ''
        document.getElementById("btnSpotifySearch").classList.add("spotify-active")

        const div = document.createElement('div')
        div.id = 'spotifyBtnDiv'
        div.classList = 'active-btn-animate'
        document.getElementById("btnSpotifySearch").appendChild(div)

        const spotifyIcon = document.createElement('i')
        spotifyIcon.classList = 'fa-brands fa-spotify fa-beat-fade fa-xl'
        spotifyIcon.setAttribute('style', "color: #1ed760;")
        document.getElementById("spotifyBtnDiv").appendChild(spotifyIcon)

        const spotifyText = document.createElement('span')
        spotifyText.innerText = ' Open in Spotify'
        spotifyText.classList = 'active-btn-animate'
        document.getElementById("spotifyBtnDiv").appendChild(spotifyText)
    }

    if (audioSrc != null) {
        document.getElementById('audio-section').classList = 'row align-items-center card blur card-body animate__animated animate__zoomIn'

        const previewText = document.createElement('h2')
        previewText.innerText = `Track Preview`
        previewText.setAttribute('style', 'margin: 0px; padding: 5px; font-weight: normal;')
        previewText.classList = 'animate__animated animate__zoomIn prevent-all'
        document.getElementById('audio-section').appendChild(previewText)

        const previewTitleDiv = document.createElement('div')
        previewTitleDiv.id = 'previewTitleDiv'
        previewTitleDiv.setAttribute('style', 'padding: 0px;')
        document.getElementById('audio-section').appendChild(previewTitleDiv)

        const previewTitle = document.createElement('h6')
        previewTitleText = `${g_title} - ${g_artist}`
        previewTitle.innerText = previewTitleText
        previewTitle.setAttribute('style', 'margin: 10px; font-weight: normal;')
        previewTitle.classList = 'animate__animated animate__zoomIn delay-3'
        document.getElementById('previewTitleDiv').appendChild(previewTitle)

        const spotifypreviewText = document.createElement('h6')
        var spotifyArtistsArrey = "";
        const artists = artistSrc;
        artists.forEach(artist => {
            const artistName = artist.name;
            if (spotifyArtistsArrey.length == 0) {
                spotifyArtistsArrey = artistName
            } else {
                spotifyArtistsArrey = `${spotifyArtistsArrey}, ${artistName}`
            }
        });
        const g_artist_arrey = g_artist.split(/(?:feat\.|meets|×|with|cv\.|Cv\.|CV\.|cv:|Cv:|CV:|cv |Cv |CV |va\.|Va\.|VA\.|va:|Va:|VA:|va |Va |VA |vo\.|Vo\.|VO\.|vo:|Vo:|VO:|vo |Vo |VO |&|\(\s*|\s*\)|\[|\]|,)/g)
            .filter(artist => artist.trim() !== "")
            .map(artist => artist.trim());
        const compareArtist = g_artist_arrey.join(", ");
        if (g_title != titleSrc || compareArtist.toUpperCase() != spotifyArtistsArrey.replaceAll("μ", "µ").toUpperCase()) {
            spotifyPreviewDisplayText = `${titleSrc} - ${spotifyArtistsArrey}`
            spotifypreviewText.innerText = `( ${spotifyPreviewDisplayText} )`
            spotifypreviewText.setAttribute('style', 'margin: 10px; font-weight: normal;')
            spotifypreviewText.classList = 'animate__animated animate__zoomIn delay-5'
            document.getElementById('previewTitleDiv').appendChild(spotifypreviewText)
        }

        const audioElement = document.createElement('audio')
        audioElement.id = 'audio-preview'
        audioElement.classList = 'audio-preview animate__animated animate__zoomIn delay-7'
        audioElement.src = audioSrc
        audioElement.controls = true
        audioElement.autoplay = false
        audioElement.loop = false
        document.getElementById('audio-section').appendChild(audioElement)

        console.log(`%c[AUDIO] %cGet audio preview success\n(${audioSrc})`, 'font-weight: bold', 'color: green')
    }

    if (alt_title == '' && titleSrc != g_title) {

        console.log(`%c[DATA] %cFound alternate title in Spotify`, 'font-weight: bold', '')

        const thElement = document.createElement('th')
        thElement.setAttribute('scope', 'row')
        thElement.className = 'subTH'
        thElement.id = 'alt-title-th'
        document.getElementById('altTitleZone').appendChild(thElement)

        const altTitleThDivElement = document.createElement('div')
        altTitleThDivElement.id = 'alt-title-div'
        altTitleThDivElement.className = 'thDiv'
        document.getElementById('alt-title-th').appendChild(altTitleThDivElement)

        const altTitleThSpanElement = document.createElement('span')
        altTitleThSpanElement.innerText = '⤷'
        altTitleThSpanElement.className = 'subThHeader'
        document.getElementById('alt-title-div').appendChild(altTitleThSpanElement)

        const altTitleThDivNameElement = document.createElement('div')
        altTitleThDivNameElement.innerText = 'Alternate Title'
        altTitleThDivNameElement.className = 'subThHeaderText'
        document.getElementById('alt-title-div').appendChild(altTitleThDivNameElement)

        const tdElement = document.createElement('td')
        tdElement.id = 'altTitleZoneTD'
        tdElement.setAttribute('colspan', '2')
        document.getElementById('altTitleZone').appendChild(tdElement)

        const linkElement = document.createElement('a');
        linkElement.classList = 'linkText subLink'
        linkElement.innerText = titleSrc;
        linkElement.href = `https://www.google.com/search?q=${encodeURIComponent(titleSrc)}`;
        linkElement.setAttribute('target', '_blank')
        document.getElementById('altTitleZoneTD').appendChild(linkElement)

        console.log(`%c[DATA] %cCreate and add alternate title to table success`, 'font-weight: bold', 'color: Green')

    } else if (alt_title != '' && titleSrc != g_title && alt_title.includes(titleSrc) == false) {

        console.log(`%c[DATA] %cFound alternate title in Spotify`, 'font-weight: bold', '')

        const spanElement = document.createElement('span');
        spanElement.innerText = ' / '
        document.getElementById('altTitleZoneTD').appendChild(spanElement)

        const linkElement = document.createElement('a');
        linkElement.classList = 'linkText subLink'
        linkElement.innerText = titleSrc;
        linkElement.href = `https://www.google.com/search?q=${encodeURIComponent(titleSrc)}`;
        linkElement.setAttribute('target', '_blank')
        document.getElementById('altTitleZoneTD').appendChild(linkElement)

        console.log(`%c[DATA] %cAdd alternate title to table success`, 'font-weight: bold', 'color: Green')
    }

    if (albumSrc != null && albumSrc != g_album) {
        console.log(`%c[DATA] %cFound alternate album name in Spotify`, 'font-weight: bold', '')

        const thElement = document.createElement('th')
        thElement.setAttribute('scope', 'row')
        thElement.className = 'subTH'
        thElement.id = 'alt-album-th'
        document.getElementById('altAlbumZone').appendChild(thElement)

        const altAlbumThDivElement = document.createElement('div')
        altAlbumThDivElement.id = 'alt-album-div'
        altAlbumThDivElement.className = 'thDiv'
        document.getElementById('alt-album-th').appendChild(altAlbumThDivElement)

        const altTitleThSpanElement = document.createElement('span')
        altTitleThSpanElement.innerText = '⤷'
        altTitleThSpanElement.className = 'subThHeader'
        document.getElementById('alt-album-div').appendChild(altTitleThSpanElement)

        const altTitleThDivNameElement = document.createElement('div')
        altTitleThDivNameElement.innerText = 'Alt Album Name'
        altTitleThDivNameElement.className = 'subThHeaderText'
        document.getElementById('alt-album-div').appendChild(altTitleThDivNameElement)

        const tdElement = document.createElement('td')
        tdElement.id = 'altAlbumZoneTD'
        tdElement.setAttribute('colspan', '2')
        document.getElementById('altAlbumZone').appendChild(tdElement)

        const linkElement = document.createElement('a');
        linkElement.classList = 'linkText subLink'
        linkElement.innerText = albumSrc;
        linkElement.href = `https://www.google.com/search?q=${encodeURIComponent(albumSrc)}`;
        linkElement.setAttribute('target', '_blank')
        document.getElementById('altAlbumZoneTD').appendChild(linkElement)

        console.log(`%c[DATA] %cCreate and add alternate album name to table success`, 'font-weight: bold', 'color: Green')
    }
}

async function getSpotifyAlbumData() {
    console.log("%c[DATA] %cHas Spotify album tag", 'font-weight: bold', '')
    console.log("%c[DATA | SPOTIFY] %cGetting album data in Spotify by album ID", 'font-weight: bold', '')
    try {
        $(document).ready(function () {
            $(".now-precess").html("Getting album data");
        });

        const clientId = apikey[0];
        const clientSecret = apikey[1];
        const base64Credentials = btoa(`${clientId}:${clientSecret}`);

        // Get access token
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${base64Credentials}`
            },
            body: 'grant_type=client_credentials'
        });

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // Search for album images by ID
        const searchResponse = await fetch(`https://api.spotify.com/v1/albums/${spotify_album_id}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const searchData = await searchResponse.json();
        data_spotify = searchData
        data_inuse = searchData
        data_inuse_provider = 'Spotify'
        spotifyAlbumDataTemp = searchData
        if (custom_image != '' && spotifyCustomImageFlag) {
            console.log('%c[DATA → COVER] %cHas custom album cover tag change to custom cover function', 'font-weight: bold', 'color: Fuchsia');
            spotifyCustomImageFlag = false
            customAlbumCover(custom_image);
        } else {
            console.log('%c[DATA → COVER] %cSend image src to cover function', 'font-weight: bold', 'color: Fuchsia');
            $(document).ready(function () {
                $(".now-precess").html("Getting album cover");
            });
            const albumImages = searchData.images;
            showCoverImageByID(albumImages[0].url);
            console.log('%c[COVER] %cGet album cover in Spotify success', 'font-weight: bold', 'color: green');
        }
        if (g_discCount != 1) {
            console.log('%c[DATA | SPOTIFY] %cThis album is multiple disc search for track in this album', 'font-weight: bold', 'color: blue');
            let trackData
            for (i = 0; i <= searchData.tracks.items.length - 1; i++) {
                if (searchData.tracks.items[i].disc_number == g_discNumber && searchData.tracks.items[i].track_number == g_trackNumber) {
                    console.log('%c[DATA | SPOTIFY] %cFound this track', 'font-weight: bold', 'color: green');
                    trackData = searchData.tracks.items[i]
                    if (trackData.preview_url == 'null') {
                        console.log('%c[DATA] %cThis track not have audio preview', 'font-weight: bold', 'color: red');
                    } else {
                        console.log('%c[DATA → AUDIO] %cSend audio src to audio function', 'font-weight: bold', 'color: Fuchsia');
                    }
                    showAudioControlAndMoreDataWithSpotifySrc(trackData.preview_url, trackData.name, trackData.artists, trackData.external_urls.spotify, searchData.name)
                    return
                }
            }
            console.log("%c[DATA | SPOTIFY] %cCan't find this track in album", 'font-weight: bold', 'color: red')
        } else {
            const trackData = searchData.tracks.items[g_trackNumber - 1]
            if (trackData.preview_url == null) {
                console.log('%c[DATA] %cThis track not have audio preview', 'font-weight: bold', 'color: red');
            } else {
                console.log('%c[DATA → AUDIO] %cSend audio src to audio function', 'font-weight: bold', 'color: Fuchsia');
            }
            showAudioControlAndMoreDataWithSpotifySrc(trackData.preview_url, trackData.name, trackData.artists, trackData.external_urls.spotify, searchData.name)
        }
        console.log('%c[DATA] %cGet track data in this album success', 'font-weight: bold', 'color: green');

    } catch (e) {
        console.error(e)
        console.log("%c[DATA] %cCan't get album data in spotify", 'font-weight: bold', 'color: red')
    }
}

window.addEventListener('resize', function (event) {
    adjustSearchBtn()
}, true);

function adjustSearchBtn() {
    const mainDiv = document.getElementById('botton-group')
    const bottonGroup1 = document.getElementById('botton-group-1')
    const bottonGroup2 = document.getElementById('botton-group-2')
    const googleBtnDiv = document.getElementById('btnGoogleSearch')
    const youtubeBtnDiv = document.getElementById('btnYoutubeSearch')
    const spotifyBtnDiv = document.getElementById('btnSpotifySearch')
    const appleMusicBtnDiv = document.getElementById('btnAppleMusicSearch')
    if (this.window.innerWidth < 535) {
        mainDiv.classList = 'd-flex align-items-center justify-content-center justify-content-sm-between flex-md-row flex-column'
        bottonGroup1.classList.remove('col-6')
        bottonGroup1.classList.add('col-12')
        bottonGroup2.classList.remove('col-6')
        bottonGroup2.classList.add('col-12')
        bottonGroup2.classList.add('mt-3')
        googleBtnDiv.classList.add('expand-button')
        youtubeBtnDiv.classList.add('expand-button')
        spotifyBtnDiv.classList.add('expand-button')
        appleMusicBtnDiv.classList.add('expand-button')
    } else {
        bottonGroup1.classList.remove('col-12')
        bottonGroup1.classList.add('col-6')
        bottonGroup2.classList.remove('col-12')
        bottonGroup2.classList.remove('mt-3')
        bottonGroup2.classList.add('col-6')
        mainDiv.classList = 'row'
        googleBtnDiv.classList.remove('expand-button')
        youtubeBtnDiv.classList.remove('expand-button')
        spotifyBtnDiv.classList.remove('expand-button')
        appleMusicBtnDiv.classList.remove('expand-button')
    }
}