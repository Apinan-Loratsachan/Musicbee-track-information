let g_title, g_artist, g_album, g_albumArtist, flag = true;

// เมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener("DOMContentLoaded", function () {
    // รับค่า parameter จาก URL
    const params = new URLSearchParams(window.location.search);


    g_title = params.get("tr") || "";
    g_artist = params.get("ar") || "";
    g_album = params.get("al") || "";
    g_albumArtist = params.get("alar") || "";
    spotify_album_id = params.get("ref1") || '';
    vgm_album_id = params.get("ref2") || '';
    custom_image = params.get("cti") || '';
    title_artist = params.get("ar") || "Unknow artist";
    audio = params.get("au") || "";
    s_title = encodeURIComponent(g_title);
    s_artist = encodeURIComponent(g_artist);
    s_album = encodeURIComponent(g_album);
    s_albumArtist = encodeURIComponent(g_albumArtist);

    // ใส่ข้อมูลลงใน HTML
    if (g_title != '') {
        document.title = g_title + ' - ' + title_artist
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
        let artistTemp = document.getElementById("artist").innerText = params.get("ar") || "Unknown"

        artistString = (params.get("ar") || "");
        const artistArray = artistString.split(/(?:feat\.|meets|×|with|cv\.|Cv\.|CV\.|cv:|Cv:|CV:|cv|Cv|CV|va\.|Va\.|VA\.|va:|Va:|VA:|va|Va|VA|&|\(\s*|\s*\)|\[|\]|,)/g)
            .filter(artist => artist.trim() !== "")
            .map(artist => artist.trim());

        if (artistArray.length > 1) {
            const thElement = document.createElement('th')
            thElement.innerText = 'Contain Artists'
            thElement.setAttribute('scope', 'row')
            document.getElementById('containArtistZone').appendChild(thElement)

            const tdElement = document.createElement('td')
            tdElement.id = 'containArtistTD'
            tdElement.setAttribute('colspan', '2')
            document.getElementById('containArtistZone').appendChild(tdElement)

            for (let i = 0; i <= artistArray.length - 1; i++) {
                if (i != 0) {
                    const spanElement = document.createElement('span');
                    spanElement.innerText = ' / '
                    // spanElement.setAttribute('style', 'padding-left: 10px;')
                    document.getElementById('containArtistTD').appendChild(spanElement)
                }
                const linkElement = document.createElement('a');
                linkElement.className = 'linkText'
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
    document.getElementById("disc").innerText = `${params.get("dn") || "Unknown"} / ${params.get("dc") || "Unknown"}`;
    document.getElementById("track").innerText = `${params.get("tn") || "Unknown"} / ${params.get("tc") || "Unknown"}`;
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

    validateData(g_title)
    validatePowerSearch(g_title + g_artist + g_album + g_albumArtist)

    // spotifySearchImage(Title, Artist, Album, AlbumArtist);
    if (custom_image !== '') {
        customAlbumCover(custom_image);
        if (audio != '') {
            getSpotifyTrackPreview(audio)
        }
    } else {
        searchForAlbumCover();
    }
});

function searchForAlbumCover() {
    if (audio != '') {
        getSpotifyTrackPreview(audio)
    }
    if (g_album != '' && spotify_album_id != '') {
        if (spotify_album_id.includes('track/')) {
            console.log('%c[COVER] %cHas Spotify track ID tag : ' + spotify_album_id.replace('track/', '') + "\n(https://open.spotify.com/" + spotify_album_id + ")", 'font-weight: bold', '')
        } else {
            console.log('%c[COVER] %cHas Spotify album ID tag : ' + spotify_album_id + "\n(https://open.spotify.com/album/" + spotify_album_id + ")", 'font-weight: bold', '')
        }
        $(document).ready(function () {
            $(".now-precess").html("Reading tag");
        });
        spotifySearchImageByID(spotify_album_id)
    } else if (g_album != '' || vgm_album_id != '') {
        searchVGMdbAlbumID(g_album, g_albumArtist)
    } else {
        document.getElementById('loading-cover').remove();
        document.getElementById('searching-text').remove();
        const messageElement = document.createElement('b');
        messageElement.innerText = 'Unknow album name.';
        messageElement.id = "noImageText"
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
    if (g_artist == "") {
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

function addCopyButton(id, value) {
    if (value != "" && value != 'Various Artists') {
        const element = document.getElementById(id);
        const button = document.createElement("button");
        button.className = "btn btn-outline-dark btn-copy";
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

function validateData(data) {
    if (data != "") {
        disableObjact("btnGoogleSearch", false)
        disableObjact("btnYoutubeSearch", false)
        disableObjact("btnSpotifySearch", false)
        disableObjact("btnAppleMusicSearch", false)
        disableObjact("btnLyricsSearch", false)
    } else {
        disableObjact("btnGoogleSearch", true)
        disableObjact("btnYoutubeSearch", true)
        disableObjact("btnSpotifySearch", true)
        disableObjact("btnAppleMusicSearch", true)
        disableObjact("btnLyricsSearch", true)
    }
}

function validatePowerSearch(data) {
    if (data != "") {
        disableObjact("btnPowerSearch", false)
    } else {
        disableObjact("btnPowerSearch", true)
    }
}

// ฟังก์ชันค้นหา AlbumID จาก vgmdb API
function searchVGMdbAlbumID(albumName, artistName) {
    if (vgm_album_id != '' && flag) {
        console.log('%c[COVER] %cHas VGMDB album ID tag : ' + vgm_album_id + "\n(https://vgmdb.net/album/" + vgm_album_id + ")", 'font-weight: bold', '')
        $(document).ready(function () {
            $(".now-precess").html("Reading tag");
        });
        displayVGMdbAlbumCoverByTag(vgm_album_id)
    } else {
        console.log('%c[COVER] %cSearching with VGMdb', 'font-weight: bold', 'color: DodgerBlue')
        const apiUrl = `https://vgmdb.info/search?q=${g_title}%20by%20${g_artist}&format=json`;
        $(document).ready(function () {
            $(".now-precess").html("Searching album cover by track");
        });
        console.log('%c[COVER | VGMDB] %cSearch by track', 'font-weight: bold', '')
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const albums = data.results.albums;

                if (albums.length > 0) {
                    const albumId = albums[0].link.split("/").pop();
                    displayVGMdbAlbumCover(albumId);
                    console.log('%c[COVER | VGMDB] %cFound VGMdb album ID : ' + albumId + "\n(https://vgmdb.net/album/" + albumId + ")", 'font-weight: bold', '')
                } else {
                    console.log('%c[COVER | VGMDB] %cNot found change to search by album', 'font-weight: bold', '')
                    const apiUrl2 = `https://vgmdb.info/search?q=${albumName}%20by%20${artistName}&format=json`;
                    $(document).ready(function () {
                        $(".now-precess").html("Searching album cover by album");
                    });
                    fetch(apiUrl2)
                        .then(response => response.json())
                        .then(data => {
                            const albums = data.results.albums;

                            if (albums.length > 0) {
                                const albumId = albums[0].link.split("/").pop();
                                displayVGMdbAlbumCover(albumId);
                                console.log('%c[COVER | VGMDB] %cFound VGMdb album ID : ' + albumId + "\n(https://vgmdb.net/album/" + albumId + ")", 'font-weight: bold', '')

                            } else {
                                console.log("%c[COVER | VGMDB] %cAlbum not found on VGMdb begin search in Spotify", 'font-weight: bold', 'color: orange');
                                spotifySearchImage(g_album, g_albumArtist);
                            }
                        })
                        .catch(error => {
                            console.error("%c[COVER | VGMDB] Error fetching album cover data\n%c" + error, 'font-weight: bold', '');
                            // coverLoadFail()
                            spotifySearchImage(g_album, g_albumArtist);
                        });
                }
            })
            .catch(error => {
                console.error("%c[COVER | VGMDB] Error fetching album cover data\n%c" + error, 'font-weight: bold', '');
                console.log("%c[COVER] %cFailed to search with VGMdb begin search with Spotify", 'font-weight: bold', 'color: red');
                spotifySearchImage(g_album, g_albumArtist);
            });
    }
}

// ฟังก์ชันแสดงรูปปกของอัลบั้ม
function displayVGMdbAlbumCover(albumId) {
    const apiUrl = `https://vgmdb.info/album/${albumId}?format=json`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            data_vgmdb = data
            data_inuse = data
            data_inuse_provider = 'VGMdb'
            const covers = data.covers;
            const picture = data.picture_full;
            console.log('%c[COVER | VGMDB] %cGetting album cover', 'font-weight: bold', '')
            if (covers.length > 0) {
                $(document).ready(function () {
                    $(".now-precess").html("Getting album cover");
                });
                const coverUrl = covers[0].full;
                showCoverImage(coverUrl)
                setCoverToBG(coverUrl)
                console.log('%c[COVER | VGMDB] %cGet album cover success', 'font-weight: bold', 'color: green')
            } else if (picture != '') {
                $(document).ready(function () {
                    $(".now-precess").html("Getting album cover");
                });
                console.log('%c[COVER | VGMDB] %cNot found cover in "covers" tag looking for "picture" tag', 'font-weight: bold', '')
                const coverUrl = picture;
                showCoverImage(coverUrl)
                setCoverToBG(coverUrl)
                console.log('%c[COVER | VGMDB] %cGet album cover success', 'font-weight: bold', 'color: green')
            } else {
                console.log('%c[COVER | VGMDB] %cNot found album cover on this vgmdb album ID', 'font-weight: bold', 'color: red')
                console.log('%c[COVER] %cNot Begin search in Spotify', 'font-weight: bold', '')
                spotifySearchImage(g_album, g_albumArtist);
            }
        })
        .catch(error => {
            console.error("%c[COVER | VGMDB] %cError fetching album cover data\n", 'font-weight: bold', error);
            coverLoadFail()
        });
}

function displayVGMdbAlbumCoverByTag(albumId) {
    const apiUrl = `https://vgmdb.info/album/${albumId}?format=json`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            data_vgmdb = data
            data_inuse = data
            data_inuse_provider = 'VGMdb'
            const covers = data.covers;
            const picture = data.picture_full;
            console.log('%c[COVER | VGMDB] %cGetting album cover', 'font-weight: bold', '')
            if (covers.length > 0) {
                $(document).ready(function () {
                    $(".now-precess").html("Getting album cover");
                });
                const coverUrl = covers[0].full;
                showCoverImage(coverUrl)
                setCoverToBG(coverUrl)
                console.log('%c[COVER | VGMDB] %cGet album cover success', 'font-weight: bold', 'color: green')
            } else if (picture != '') {
                $(document).ready(function () {
                    $(".now-precess").html("Getting album cover");
                });
                console.log('%c[COVER | VGMDB] %cNot found cover in "covers" tag looking for "picture" tag', 'font-weight: bold', '')
                const coverUrl = picture;
                showCoverImage(coverUrl)
                setCoverToBG(coverUrl)
                console.log('%c[COVER | VGMDB] %cGet album cover success', 'font-weight: bold', 'color: green')
            } else {
                console.log('%c[COVER | VGMDB] %cNot found album cover on this vgmdb album ID', 'font-weight: bold', 'color: red')
                console.log("%c[COVER] %cBegin search in Spotify", 'font-weight: bold', '');
                spotifySearchImage(g_album, g_albumArtist);
            }
        })
        .catch(error => {
            console.log('%c[COVER] %cNot found album cover on this vgmdb album ID', 'font-weight: bold', 'color: red')
            console.log('%c[COVER] %cBegin searching', 'font-weight: bold', 'color: red')
            searchVGMdbAlbumID(g_album, g_albumArtist)
            flag = false
        });
}

async function spotifySearchImage(album, album_artist) {
    console.log("%c[COVER] %cSearching with Spotify", 'font-weight: bold', 'color: DodgerBlue')
    try {
        $(document).ready(function () {
            $(".now-precess").html("Searching album cover in streaming platform");
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
        const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=${album} ${album_artist}&type=album&limit=1&offset=0`, {
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
            setCoverToBG(albumImages[0].url)
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

async function spotifySearchImageByID(spotify_album_id) {
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
        const searchResponse = await fetch(`https://api.spotify.com/v1/albums/${spotify_album_id}`, {
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
            showCoverImage(albumImages[0].url);
            setCoverToBG(albumImages[0].url);
            console.log('%c[COVER | SPOTIFY] %cGet album cover success', 'font-weight: bold', 'color: green');
        } else {
            // If no album found, display a message
            console.log("%c[COVER | SPOTIFY] %cCan't get image in spotify", 'font-weight: bold', 'color: red')
            searchVGMdbAlbumID(g_album, g_albumArtist)
        }

    } catch {
        console.log("%c[COVER] %cCan't get image in spotify", 'font-weight: bold', 'color: red')
        searchVGMdbAlbumID(g_album, g_albumArtist)
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

        // Check if the album is found
        if (searchData.preview_url != null) {
            showAudioControlWithSpotifySrc(searchData.preview_url)
        } else {
            // If no album found, display a message
            console.log(`%c[AUDIO] %cThis track not have audio preview\n(https://open.spotify.com/track/${spotify_track_id})`, 'font-weight: bold', 'color: red')
        }

    } catch {
        console.log(`%c[AUDIO] %cFailed to get audio preview in spotify)`, 'font-weight: bold', 'color: red')
        searchVGMdbAlbumID(g_album, g_albumArtist)
    }

}

function setCoverToBG(url) {
    // สร้างอิลิเมนต์ภาพ
    const img = new Image();

    // เพิ่มการตรวจสอบว่ารูปภาพโหลดเสร็จแล้วหรือยัง
    img.onload = function () {
        // รูปโหลดเสร็จแล้ว
        document.body.style.backgroundImage = `url('${url}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.className = 'bg-blur';
    };

    // เซต source ของอิลิเมนต์ภาพเป็น URL ที่ได้รับ
    img.src = url;
}


function showCoverImage(image) {
    const coverElement = document.createElement("img");
    coverElement.src = image;
    coverElement.alt = "Album Cover";
    coverElement.className = "card album-image";
    coverElement.id = 'albumImage';
    coverElement.style.opacity = 0;

    coverElement.onload = function () {
        const favicon = document.getElementById('favicon');
        favicon.setAttribute('herf', image)
        document.getElementById('loading-cover').remove();
        document.getElementById('searching-text').remove();
        document.getElementById("imageSection").appendChild(coverElement);
        setTimeout(function () {
            coverElement.style.opacity = 1;
        }, 50);
    };
}

function showCoverImageBycti(image) {
    console.log('%c[COVER] %cHas custom album cover tag\n(' + custom_image + ')', 'font-weight: bold', '')
    $(document).ready(function () {
        $(".now-precess").html("Reading tag");
    });
    const coverElement = document.createElement("img");
    coverElement.src = image;
    coverElement.alt = "Album Cover";
    coverElement.className = "card album-image";
    coverElement.id = 'albumImage';
    coverElement.style.opacity = 0;

    coverElement.onload = function () {
        const favicon = document.getElementById('favicon');
        favicon.setAttribute('herf', image)
        console.log("%c[COVER | CUSTOM] %cGetting album cover", 'font-weight: bold', '')
        $(document).ready(function () {
            $(".now-precess").html("Getting album cover");
        });
        document.getElementById('loading-cover').remove();
        document.getElementById('searching-text').remove();
        document.getElementById("imageSection").appendChild(coverElement);
        setTimeout(function () {
            coverElement.style.opacity = 1;
        }, 50);
        console.log("%c[COVER | CUSTOM] %cGet album cover success", 'font-weight: bold', 'color: green')
    };
    coverElement.onerror = function () {
        console.log("%c[COVER | CUSTOM] %cCan't get image for this URL. Begin searcing for album cover.", 'font-weight: bold', 'color: red')
        searchForAlbumCover()
    }
}

function coverLoadFail() {
    const messageElement = document.createElement('b');
    messageElement.innerText = 'Failed to get album cover try to refresh this site.';
    messageElement.id = "noImageText"
    document.getElementById('loading-cover').remove();
    document.getElementById('searching-text').remove();
    document.getElementById('imageSection').appendChild(messageElement);
}

function customAlbumCover(image) {
    data_inuse = null
    data_inuse_provider = 'Tag'
    showCoverImageBycti(image)
    setCoverToBG(image)
}

function showAudioControlWithSpotifySrc(src) {
    console.log(`%c[AUDIO] %cThis track has audio preview\n(https://open.spotify.com/track/${audio})`, 'font-weight: bold', 'color: Black')
    const previewText = document.createElement('h4')
    previewText.innerText = `Track preview`
    previewText.setAttribute('style', 'margin-bottom: 10px; font-weight: bold;')
    document.getElementById('audio-section').appendChild(previewText)
    const previewTitle = document.createElement('strong')
    previewTitle.innerText = `${g_title} - ${g_artist}`
    previewTitle.setAttribute('style', 'margin-bottom: 10px;')
    document.getElementById('audio-section').appendChild(previewTitle)
    const audioElement = document.createElement('audio')
    audioElement.id = 'audio-preview'
    audioElement.className = 'audio-preview'
    audioElement.src = src
    audioElement.controls = true
    audioElement.autoplay = false
    audioElement.loop = false
    document.getElementById('audio-section').classList = 'row align-items-center card blur card-body'
    document.getElementById('audio-section').appendChild(audioElement)
    console.log(`%c[AUDIO] %cGet audio preview success\n(${src})`, 'font-weight: bold', 'color: green')
}

