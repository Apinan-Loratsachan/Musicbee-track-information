var coverHeight, coverWidth

const params = new URLSearchParams(window.location.search);

const imageUrl = `https://${params.get('cover')}`;
const title = `${params.get('title')}`;
const album = `${params.get('album')}`;

const img = new Image();
img.onload = function () {
    coverWidth = this.naturalWidth
    coverHeight = this.naturalHeight
    document.getElementById('image-info-container').innerText = coverWidth + ' × ' + coverHeight;
    setCoverToBG(imageUrl)
    if (title != null) {
        document.title = `Cover | ${title}`

        const titleDiv = document.createElement('div')
        titleDiv.id = 'title-div'
        titleDiv.innerText = title + ' | ' + album
        document.getElementById('image-title-container').appendChild(titleDiv)
    }
}
img.src = imageUrl;
img.id = 'cover'
img.alt = `albim cover of ${title}`
img.classList = 'cover'

var link = document.querySelector("link[rel~='icon']");
if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
}
link.href = imageUrl;

document.getElementById('image-viewer-container').appendChild(img);

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