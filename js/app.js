let g_title, g_artist, g_album, g_albumArtist;

// เมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener("DOMContentLoaded", function () {
    // รับค่า parameter จาก URL
    const params = new URLSearchParams(window.location.search);

    g_title = params.get("Title") || "";
    g_artist = params.get("Artist") || "";
    g_album = params.get("Album") || "";
    g_albumArtist = params.get("AlbumArtist") || "";

    // ใส่ข้อมูลลงใน HTML
    document.getElementById("title").innerText = params.get("Title") || "Unknown";
    document.getElementById("artist").innerText = params.get("Artist") || "Unknown";
    document.getElementById("album").innerText = params.get("Album") || "Unknown";
    document.getElementById("albumArtist").innerText = params.get("AlbumArtist") || "Unknown";
    document.getElementById("disc").innerText = `${params.get("DiscNo") || "Unknown"} / ${params.get("DiscCount") || "Unknown"}`;
    document.getElementById("track").innerText = `${params.get("TrackNo") || "Unknown"} / ${params.get("TrackCount") || "Unknown"}`;
    document.getElementById("genre").innerText = params.get("Genre") || "Unknown";
    document.getElementById("year").innerText = params.get("Year") || "Unknown";
    document.getElementById("language").innerText = params.get("Language") || "Unknown";

    // เพิ่มปุ่ม Copy
    addCopyButton("btn-copy-title", "Title", params.get("Title") || "");
    addCopyButton("btn-copy-artist", "Artist", params.get("Artist") || "");
    addCopyButton("btn-copy-album", "Album", params.get("Album") || "");
    addCopyButton("btn-copy-albumArtist", "Album artist", params.get("AlbumArtist") || "");

    const Title = params.get("Title") || ""
    const Artist = params.get("Artist") || ""
    const Album = params.get("Album") || ""
    const AlbumArtist = params.get("AlbumArtist") || ""

    validateData(g_title)
    validatePowerSearch(g_title + g_artist + g_album + g_albumArtist)

    searchAlbumImage(Title, Artist, Album, AlbumArtist);
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
    } if(g_artist != "") {
        query += `%20by%20${g_artist}`
    } if(g_album != "") {
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

async function searchAlbumImage(title, artist, album, album_artist) {
    if (album != "") {
        const clientId = '1cfc4e305f1c44b6a0807cc3de69f353'; // Replace with your Spotify API Client ID
    const clientSecret = '94d43218fd704db69eaa3184a26b11a6'; // Replace with your Spotify API Client Secret
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
    const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=${album_artist} ${album}&type=album&limit=1&offset=0`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    const searchData = await searchResponse.json();

    // Check if there are albums in the search result
    if (searchData.albums && searchData.albums.items.length > 0) {
        const albumImages = searchData.albums.items[0].images;

        // Create or select the existing image element
        let imageElement = document.getElementById('albumImage');
        if (!imageElement) {
            // If the image element doesn't exist, create it
            imageElement = document.createElement('img');
            imageElement.className = "card"
            imageElement.id = 'albumImage';
            imageElement.alt = 'Album Image';
            document.getElementById('imageSection').appendChild(imageElement);
        }

        // Display the first image in the specified HTML element
        imageElement.src = albumImages[0].url;
    } else {
        // If no album found, display a message
        const messageElement = document.createElement('b');
        messageElement.innerText = 'No album cover found.';
        messageElement.id = "noImageText"
        document.getElementById('imageSection').appendChild(messageElement);
    }
    }
}

function addCopyButton(id, fieldName, value) {
    if (value !== "") {
        const element = document.getElementById(id);
        const button = document.createElement("button");
        button.className = "btn btn-outline-dark btn-copy";
        button.innerText = "Copy";
        button.addEventListener("click", function () {
            copyToClipboard(value);
            showCopyResultModal(fieldName, value); // เรียกใช้ฟังก์ชันแสดงผล Modal
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
                    <div class="close-btn-container"> <!-- เพิ่ม class "text-right" ที่จะช่วยให้ปุ่ม Close อยู่ทางขวา -->
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
        disableObjact("btnGoogleSearch",false)
        disableObjact("btnYoutubeSearch",false)
        disableObjact("btnSpotifySearch",false)
        disableObjact("btnAppleMusicSearch",false)
        disableObjact("btnLyricsSearch",false)
    } else {
        disableObjact("btnGoogleSearch",true)
        disableObjact("btnYoutubeSearch",true)
        disableObjact("btnSpotifySearch",true)
        disableObjact("btnAppleMusicSearch",true)
        disableObjact("btnLyricsSearch",true)
    }
}

function validatePowerSearch(data) {
    if (data != "") {
        disableObjact("btnPowerSearch",false)
    } else {
        disableObjact("btnPowerSearch",true)
    }
}