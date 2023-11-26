// เมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener("DOMContentLoaded", function() {
    // รับค่า parameter จาก URL
    const params = new URLSearchParams(window.location.search);

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
    addCopyButton("title", "Title");
    addCopyButton("artist", "Artist");
    addCopyButton("album", "Album");
    addCopyButton("albumArtist", "Album Artist");

    const Title = params.get("Title") || ""
    const Artist = params.get("Artist") || ""
    const Album = params.get("Album") || ""
    const AlbumArtist = params.get("AlbumArtist") || ""

    searchAlbumImage(Title, Artist, Album, AlbumArtist);
});

// ฟังก์ชันเพิ่มปุ่ม Copy
function addCopyButton(id, fieldName) {
    const element = document.getElementById(id);
    const button = document.createElement("button");
    button.className = "btn btn-primary btn-sm btn-copy";
    button.innerText = "Copy";
    button.addEventListener("click", function() {
        copyToClipboard(element.innerText, fieldName);
    });
    element.insertAdjacentElement("afterend", button);
}

// ฟังก์ชันคัดลอกข้อมูลไปยังคลิปบอร์ด
function copyToClipboard(text, field) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert(`Copied ${field} to clipboard!`);
}

function searchGoogle() {
    const title = encodeURIComponent(document.getElementById("title").innerText);
    const artist = encodeURIComponent(document.getElementById("artist").innerText);
    window.open(`https://www.google.com/search?q=${title} - ${artist}`, "_blank");
}

function searchYoutube() {
    const title = encodeURIComponent(document.getElementById("title").innerText);
    const artist = encodeURIComponent(document.getElementById("artist").innerText);
    window.open(`https://www.youtube.com/results?search_query=${title} - ${artist}`, "_blank");
}

function searchSpotify() {
    const title = encodeURIComponent(document.getElementById("title").innerText);
    const artist = encodeURIComponent(document.getElementById("artist").innerText);
    const searchQuery = `${title}%20${artist}`;
    window.open(`https://open.spotify.com/search/${searchQuery}`, "_blank");
}

function searchAppleMusic() {
    const title = encodeURIComponent(document.getElementById("title").innerText);
    const artist = encodeURIComponent(document.getElementById("artist").innerText);
    window.open(`https://music.apple.com/us/search?term=${title} - ${artist}`, "_blank");
}

function searchTrackCover() {
    const title = encodeURIComponent(document.getElementById("title").innerText);
    const artist = encodeURIComponent(document.getElementById("artist").innerText);
    window.open(`https://www.google.com/search?q=${title} - ${artist}&tbm=isch`, "_blank");
}

function searchAlbumCover() {
    const album = encodeURIComponent(document.getElementById("album").innerText);
    const albumArtist = encodeURIComponent(document.getElementById("albumArtist").innerText);
    window.open(`https://www.google.com/search?q=${album} - ${albumArtist}&tbm=isch`, "_blank");
}

async function searchAlbumImage(title, artist, album, album_artist) {
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
    const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=${album} ${album_artist}&type=album`, {
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
            imageElement.id = 'albumImage';
            imageElement.alt = 'Album Image';
            document.getElementById('imageSection').appendChild(imageElement);
        }

        // Display the first image in the specified HTML element
        imageElement.src = albumImages[0].url;
    } else {
        // If no album found, display a message
        const messageElement = document.createElement('div');
        messageElement.innerText = 'ไม่พบรูปภาพ';
        messageElement.id = "noImageText"
        document.getElementById('imageSection').appendChild(messageElement);
    }
}

