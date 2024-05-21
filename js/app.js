let g_title, g_artist, g_album, g_albumArtist, g_trackNumber, g_discNumber, g_discCount, spotifyDirectURL, spotifyAlbumDataTemp, flag = true, spotifyCustomImageFlag = true, alreadyAudio = false, headerIsTitle = true;

// เมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener("DOMContentLoaded", function () {
    // รับค่า parameter จาก URL
    const params = new URLSearchParams(window.location.search);

    g_title = params.get("tr") || "";
    g_artist = params.get("ar") || "";
    g_album = params.get("al") || "";
    g_albumArtist = params.get("alar") || "";
    g_trackNumber = params.get("tn") || "";
    g_discNumber = params.get("dn") || "";
    g_discCount = params.get("dc") || "";
    alt_title = params.get("atr") || "";
    spotify_album_id = params.get("aref") || "";
    spotify_album_cover_id = params.get("ref1") || '';
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
        const artistHearder = document.createElement("h6")
        artistHearder.innerText = `By ${g_artist}`
        artistHearder.id = "headerSubText"
        artistHearder.classList = "headerText prevent-all animate__animated animate__fadeInDown delay-15"
        document.getElementById("header").appendChild(artistHearder)
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
        let artistTemp = document.getElementById("artist").innerText = params.get("ar") || "Unknown"

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
    document.getElementById("disc").innerText = `${params.get("dn").replace(/^0+/, '') || "Unknown"} / ${params.get("dc").replace(/^0+/, '') || "Unknown"}`;
    document.getElementById("track").innerText = `${params.get("tn").replace(/^0+/, '') || "Unknown"} / ${params.get("tc").replace(/^0+/, '') || "Unknown"}`;
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

    // spotifySearchImage(Title, Artist, Album, AlbumArtist);
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
        // div.classList = 'spotify-animate delay-16'
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
        spotifyText.classList = 'spotify-animate'
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
    } else if (g_album != '' || vgm_album_id != '') {
        searchVGMdbAlbumID(g_album, g_albumArtist)
    } else {
        document.getElementById('loading-cover').remove();
        document.getElementById('searching-text').remove();
        const messageElement = document.createElement('b');
        messageElement.innerText = 'Unknow album name.';
        messageElement.id = "noImageText"
        messageElement.classList = 'animate__animated animate__headShake'
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
        const apiUrl = `https://vgmdb.info/search?q=${encodeURIComponent(g_title)}%20by%20${encodeURIComponent(g_artist)}&format=json`;
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
                    const apiUrl2 = `https://vgmdb.info/search?q=${encodeURIComponent(albumName)}%20by%20${encodeURIComponent(artistName)}&format=json`;
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
    const apiUrl = `https://vgmdb.info/album/${encodeURIComponent(albumId)}?format=json`;

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
    const apiUrl = `https://vgmdb.info/album/${encodeURIComponent(albumId)}?format=json`;

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
        searchVGMdbAlbumID(g_album, g_albumArtist)
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
    const linkElement = document.createElement("a");
    linkElement.id = 'albumImageLink';
    linkElement.href = `cover?title=${encodeURIComponent(g_title + ' - ' + g_artist ?? 'Unknow artist')}&album=${encodeURIComponent(g_album)}&cover=${encodeURIComponent(image.replace('https://', ''))}`
    linkElement.setAttribute('target', '_blank')
    const coverElement = document.createElement("img");
    coverElement.src = image;
    coverElement.alt = "Album Cover";
    coverElement.className = "card album-image animate__animated animate__jackInTheBox prevent-select";
    coverElement.id = 'albumImage';
    coverElement.style.opacity = 0;

    coverElement.onload = function () {
        document.getElementById('loading-cover').remove();
        document.getElementById('searching-text').remove();
        document.getElementById("imageSection").className = 'imageCenter';
        document.getElementById("imageSection").appendChild(linkElement);
        document.getElementById("albumImageLink").appendChild(coverElement);

        const coverSearchText = document.getElementById("coverSearchText")
        coverSearchText.classList.remove("animate__fadeIn")
        coverSearchText.classList.remove("delay-5")
        coverSearchText.classList.add("animate__fadeOutUp")
        setTimeout(function () {
            coverSearchText.innerText = "Search other cover"
            coverSearchText.classList.remove("animate__fadeOutUp")
            coverSearchText.classList.add("animate__fadeInUp")
        }, 500);
    };
}

function showCoverImageBycti(image) {
    console.log('%c[COVER] %cHas custom album cover tag\n(' + custom_image + ')', 'font-weight: bold', '')
    $(document).ready(function () {
        $(".now-precess").html("Getting album cover");
    });
    const coverElement = document.createElement("img");
    coverElement.src = image;
    coverElement.alt = "Album Cover";
    coverElement.className = "card album-image animate__animated animate__jackInTheBox prevent-select";
    coverElement.id = 'albumImage';
    coverElement.style.opacity = 0;

    coverElement.onload = function () {
        const linkElement = document.createElement("a");
        linkElement.id = 'albumImageLink';
        linkElement.href = `cover?title=${encodeURIComponent(g_title + ' - ' + g_artist ?? 'Unknow artist')}&album=${encodeURIComponent(g_album)}&cover=${encodeURIComponent(image.replace('https://', ''))}`
        linkElement.setAttribute('target', '_blank')
        console.log("%c[COVER | CUSTOM] %cGetting album cover", 'font-weight: bold', '')
        $(document).ready(function () {
            $(".now-precess").html("displaying album cover");
        });
        document.getElementById('loading-cover').remove();
        document.getElementById('searching-text').remove();
        document.getElementById("imageSection").className = "imageCenter";
        document.getElementById("imageSection").appendChild(linkElement);
        document.getElementById("albumImageLink").appendChild(coverElement);

        const coverSearchText = document.getElementById("coverSearchText")
        coverSearchText.classList.remove("animate__fadeIn")
        coverSearchText.classList.remove("delay-5")
        coverSearchText.classList.add("animate__fadeOutUp")
        setTimeout(function () {
            coverSearchText.innerText = "Search other cover"
            coverSearchText.classList.remove("animate__fadeOutUp")
            coverSearchText.classList.add("animate__fadeInUp")
        }, 500);
        console.log("%c[COVER | CUSTOM] %cGet album cover success", 'font-weight: bold', 'color: green')
    };
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
    setCoverToBG(image)
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
        div.classList = 'spotify-animate'
        document.getElementById("btnSpotifySearch").appendChild(div)

        const spotifyIcon = document.createElement('i')
        spotifyIcon.classList = 'fa-brands fa-spotify fa-beat-fade fa-xl'
        spotifyIcon.setAttribute('style', "color: #1ed760;")
        document.getElementById("spotifyBtnDiv").appendChild(spotifyIcon)

        const spotifyText = document.createElement('span')
        spotifyText.innerText = ' Open in Spotify'
        spotifyText.classList = 'spotify-animate'
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
        if (g_title != titleSrc || compareArtist != spotifyArtistsArrey.replaceAll("μ", "µ")) {
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

        console.log(`%c[DATA] %cFound alternate title in Spotify`, 'font-weight: bold', 'color: Blue')

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

        console.log(`%c[DATA] %cFound alternate title in Spotify`, 'font-weight: bold', 'color: Blue')

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
        console.log(`%c[DATA] %cFound alternate album name in Spotify`, 'font-weight: bold', 'color: Blue')

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
    console.log("%c[DATA] %cHas Spotify album tag", 'font-weight: bold', 'color: Blue')
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
            showCoverImage(albumImages[0].url);
            setCoverToBG(albumImages[0].url);
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
        searchVGMdbAlbumID(g_album, g_albumArtist)
    }
}