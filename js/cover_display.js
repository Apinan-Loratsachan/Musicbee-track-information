var coverHeight, coverWidth

const params = new URLSearchParams(window.location.search);

const imageUrl = `https://${params.get('image')}`;
const title = `${params.get('title')}`;

const img = new Image();
img.onload = function () {
    coverWidth = this.naturalWidth
    coverHeight = this.naturalWidth
    document.getElementById('image-info-container').innerText = coverWidth + 'x' + coverHeight;
    // document.getElementById('image-title-container').innerText = title;
    if(title != null) {
        document.title = `Cover | ${title}`
    }
}
img.src = imageUrl;
img.id = 'cover'
img.classList = 'cover'

var link = document.querySelector("link[rel~='icon']");
if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
}
link.href = imageUrl;

document.getElementById('image-viewer-container').appendChild(img);

