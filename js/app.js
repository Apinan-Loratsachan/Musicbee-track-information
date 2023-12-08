let g_title, g_artist, g_album, g_albumArtist;

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

    // ใส่ข้อมูลลงใน HTML
    if (g_title == '') {
        document.getElementById('title-zone').innerText = 'Unknown'
    } else {
        document.getElementById("title").innerText = params.get("tr") || "Unknown";
        document.getElementById("title").href = encodeURI(`https://www.google.com/search?q=${g_title}`);
    }
    if (g_artist == '') {
        document.getElementById('artist-zone').innerText = 'Unknown'
    } else {
        document.getElementById("artist").innerText = params.get("ar") || "Unknown";
        document.getElementById("artist").href = encodeURI(`https://www.google.com/search?q=${g_artist}`);
    }
    if (g_album == '') {
        document.getElementById('album-zone').innerText = 'Unknown'
    } else {
        document.getElementById("album").innerText = params.get("al") || "Unknown";
        document.getElementById("album").href = encodeURI(`https://www.google.com/search?q=${g_album}`);
    }
    if (g_albumArtist == '') {
        document.getElementById('albumArtist-zone').innerText = 'Unknown'
    } else {
        document.getElementById("albumArtist").innerText = params.get("alar") || "Unknown";
        document.getElementById("albumArtist").href = encodeURI(`https://www.google.com/search?q=${g_albumArtist}`);
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
                spanElement.innerText = ', '
                document.getElementById('related').appendChild(spanElement)
            }
            const linkElement = document.createElement('a');
            linkElement.className = 'linkText'
            linkElement.innerText = '#' + relArray[i].trim();
            linkElement.href = encodeURI(`https://www.google.com/search?q=${relArray[i].trim()}`);
            linkElement.setAttribute('target', '_blank')
            document.getElementById('related').appendChild(linkElement)
        }
    }

    // เพิ่มปุ่ม Copy
    addCopyButton("btn-copy-title", "Title", params.get("tr") || "");
    addCopyButton("btn-copy-artist", "Artist", params.get("ar") || "");
    addCopyButton("btn-copy-album", "Album", params.get("al") || "");
    addCopyButton("btn-copy-albumArtist", "Album artist", params.get("alar") || "");

    const Title = params.get("tr") || ""
    const Artist = params.get("ar") || ""
    const Album = params.get("al") || ""
    const AlbumArtist = params.get("alar") || ""

    validateData(g_title)
    validatePowerSearch(g_title + g_artist + g_album + g_albumArtist)

    // spotifySearchImage(Title, Artist, Album, AlbumArtist);
    if (Album != '' && spotify_album_id != '') {
        try {
            console.log('Has Spotify album ID tag : ' + spotify_album_id)
            $(document).ready(function () {
                $(".now-precess").html("Reading tag");
            });
        } catch {
            searchVGMdbAlbumID(Album, AlbumArtist);
        }
        spotifySearchImageByID(spotify_album_id)
    } else if (Album != '' || vgm_album_id != '') {
        console.log('Has VGMDB album ID tag : ' + vgm_album_id)
        $(document).ready(function () {
            $(".now-precess").html("Reading tag");
        });
            searchVGMdbAlbumID(g_album, g_albumArtist)
    } else {
        document.getElementById('loading-cover').remove();
        document.getElementById('searching-text').remove();
        const messageElement = document.createElement('b');
        messageElement.innerText = 'Unknow album name.';
        messageElement.id = "noImageText"
        document.getElementById('imageSection').appendChild(messageElement);
    }
});

function searchGoogle() {
    if (g_artist == "") {
        window.open(`https://www.google.com/search?q=${g_title}`, "_blank");
    } else {
        window.open(`https://www.google.com/search?q=${g_title} - ${g_artist}`, "_blank");
    }
}

function searchLyrics() {
    if (g_artist == "") {
        window.open(`https://www.google.com/search?q=lyrics ${g_title}`, "_blank");
    } else {
        window.open(`https://www.google.com/search?q=lyrics ${g_title} - ${g_artist}`, "_blank");
    }
}

function powerSearchGoogle() {
    query = ""
    if (g_title != "") {
        query = `${g_title}`
    } else {
        query = "Music"
    } if (g_artist != "") {
        query += `%20by%20${g_artist}`
    } if (g_album != "") {
        query += `%20album%20${g_album}`
    } if (g_albumArtist != "") {
        query += `%20by%20${g_albumArtist}`
    }
    window.open(`https://www.google.com/search?q=${query}`, "_blank");
}

function searchYoutube() {
    if (g_artist == "") {
        window.open(`https://www.youtube.com/results?search_query=${g_title}`, "_blank");
    } else {
        window.open(`https://www.youtube.com/results?search_query=${g_title} - ${g_artist}`, "_blank");
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
        window.open(`https://music.apple.com/us/search?term=${g_title}`, "_blank");
    } else {
        window.open(`https://music.apple.com/us/search?term=${g_title} - ${g_artist}`, "_blank");
    }
}

function searchTrackCover() {
    if (g_artist == "") {
        window.open(`https://www.google.com/search?q=${g_title} album cover&tbm=isch`, "_blank");
    } else {
        window.open(`https://www.google.com/search?q=${g_title} - ${g_artist} album cover&tbm=isch`, "_blank");
    }
}

function searchAlbumCover() {
    if (g_artist == "") {
        window.open(`https://www.google.com/search?q=${g_album} album cover&tbm=isch`, "_blank");
    } else {
        window.open(`https://www.google.com/search?q=${g_album} - ${g_albumArtist} album cover&tbm=isch`, "_blank");
    }
}

// function addCopyButton(id, fieldName, value) {
//     if (value !== "") {
//         const element = document.getElementById(id);
//         const button = document.createElement("button");
//         button.className = "btn btn-outline-dark btn-copy";
//         button.innerText = "Copy";
//         button.addEventListener("click", function () {
//             copyToClipboard(value);
//             showCopyResultModal(fieldName, value); // เรียกใช้ฟังก์ชันแสดงผล Modal
//         });

//         element.appendChild(button);
//     }
// }

function addCopyButton(id, fieldName, value) {
    if (value !== "") {
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
    if (vgm_album_id != '') {
        displayVGMdbAlbumCover(vgm_album_id)
    } else {
        const apiUrl = `https://vgmdb.info/search?q=${g_title}%20by%20${g_artist}&format=json`;
        $(document).ready(function () {
            $(".now-precess").html("Searching album cover by track");
        });
        console.log('Searching album cover by track')
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const albums = data.results.albums;
    
                if (albums.length > 0) {
                    const albumId = albums[0].link.split("/").pop();
                    displayVGMdbAlbumCover(albumId);
                    console.log('Found VGMdb album ID : ' + albumId)
                } else {
                    console.log('Not found change to searching by album')
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
                                console.log('Found VGMdb album ID : ' + albumId)
                            } else {
                                console.log("Album not found on VGMdb begin search in Spotify");
                                spotifySearchImage(g_album, g_albumArtist);
                            }
                        })
                        .catch(error => {
                            console.error("Error fetching vgmdb data", error);
                            coverLoadFail()
                        });
                }
            })
            .catch(error => {
                console.error("Error fetching vgmdb data", error);
                coverLoadFail()
            });
    }
}

// ฟังก์ชันแสดงรูปปกของอัลบั้ม
function displayVGMdbAlbumCover(albumId) {
    const apiUrl = `https://vgmdb.info/album/${albumId}?format=json`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const covers = data.covers;
            const picture = data.picture_full;
            console.log('Getting album cover')
            if (covers.length > 0) {
                $(document).ready(function () {
                    $(".now-precess").html("Getting album art");
                });
                const coverUrl = covers[0].full;
                showCoverImage(coverUrl)
                setCoverToBG(coverUrl)
                console.log('Get album cover success')
            } else if (picture != '') {
                $(document).ready(function () {
                    $(".now-precess").html("Getting album art");
                });
                console.log('Not found cover in "covers" tag looking for "picture" tag')
                const coverUrl = picture;
                showCoverImage(coverUrl)
                setCoverToBG(coverUrl)
                console.log('Get album cover success')
            } else {
                console.log("Not found album cover on this vgmdb album ID");
                console.log("Begin search in Spotify");
                spotifySearchImage(g_album, g_albumArtist);
            }
        })
        .catch(error => {
            console.error("Error fetching album cover data", error);
            coverLoadFail()
        });
}

async function spotifySearchImage(album, album_artist) {
    $(document).ready(function () {
        $(".now-precess").html("Searching album cover in streaming platform");
    });
    const clientId = '1cfc4e305f1c44b6a0807cc3de69f353';
    const clientSecret = '94d43218fd704db69eaa3184a26b11a6';
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

    // Check if there are albums in the search result
    if (searchData.albums && searchData.albums.items.length > 0) {
        $(document).ready(function () {
            $(".now-precess").html("Getting album art");
        });
        const albumImages = searchData.albums.items[0].images;
        showCoverImage(albumImages[0].url)
        setCoverToBG(albumImages[0].url)
        console.log('Get album cover in Spotify success')
    } else {
        // If no album found, display a message
        const messageElement = document.createElement('b');
        messageElement.innerText = 'No album cover found.';
        messageElement.id = "noImageText"
        document.getElementById('loading-cover').remove();
        document.getElementById('searching-text').remove();
        document.getElementById('imageSection').appendChild(messageElement);
        console.log('Not found album cover in Spotify')
    }
}

async function spotifySearchImageByID(spotify_album_id) {
    $(document).ready(function () {
        $(".now-precess").html("Searching album cover in streaming platform");
    });

    const clientId = '1cfc4e305f1c44b6a0807cc3de69f353';
    const clientSecret = '94d43218fd704db69eaa3184a26b11a6';
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

    // Check if the album is found
    if (searchData.images && searchData.images.length > 0) {
        $(document).ready(function () {
            $(".now-precess").html("Getting album art");
        });
        const albumImages = searchData.images;
        showCoverImage(albumImages[0].url);
        setCoverToBG(albumImages[0].url);
        console.log('Get album cover in Spotify success');
    } else {
        // If no album found, display a message
        const messageElement = document.createElement('b');
        messageElement.innerText = 'No album cover found.';
        messageElement.id = "noImageText";
        document.getElementById('loading-cover').remove();
        document.getElementById('searching-text').remove();
        document.getElementById('imageSection').appendChild(messageElement);
        console.log('Not found album cover in Spotify');
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
        document.getElementById('loading-cover').remove();
        document.getElementById('searching-text').remove();
        document.getElementById("imageSection").appendChild(coverElement);
        setTimeout(function () {
            coverElement.style.opacity = 1;
        }, 50);
    };
}

function coverLoadFail() {
    const messageElement = document.createElement('b');
    messageElement.innerText = 'Failed to get album art try to refresh this site.';
    messageElement.id = "noImageText"
    document.getElementById('loading-cover').remove();
    document.getElementById('searching-text').remove();
    document.getElementById('imageSection').appendChild(messageElement);
}

function customAlbumCover(image) {
    showCoverImage(image)
    setCoverToBG(image)
}