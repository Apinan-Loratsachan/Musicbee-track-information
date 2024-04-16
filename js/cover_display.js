var coverHeight, coverWidth, infoDiv

const params = new URLSearchParams(window.location.search);

const imageUrl = `https://${params.get('cover')}`;
const title = `${params.get('title')}`;
const album = `${params.get('album')}`;

try {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.id = 'cover'
    img.alt = `album cover of ${title}`
    img.classList = 'cover'

    img.onload = function () {
        document.getElementById('loader').remove()
        coverWidth = this.naturalWidth
        coverHeight = this.naturalHeight
        infoDiv = document.createElement('div')
        infoDiv.id = 'info-div'
        infoDiv.style.width = this.width + 'px'
        document.getElementById('image-viewer-container').appendChild(infoDiv)
        document.getElementById('info-div').innerText = coverWidth + ' × ' + coverHeight
        setCoverToBG(imageUrl)
        adjustInfoStyle()
        if (title != null) {
            document.title = `Cover | ${title}`
            const titleDiv = document.createElement('div')
            titleDiv.id = 'title-div'
            titleDiv.innerText = title + ' | ' + album
            document.getElementById('image-title-container').appendChild(titleDiv)
            adjustTitleStyle()
        }
    }

    img.onerror = function () {
        console.error('Failed to load image:', imageUrl)
        document.getElementById('loader').remove()
        document.getElementById('cover').remove()
        const errorMsg = document.createElement('h1')
        errorMsg.innerHTML = 'Something went wrong'
        document.getElementById('image-viewer-container').appendChild(errorMsg)
        const errorDetail = document.createElement('h2')
        errorDetail.innerHTML = 'Failed to load image';
        document.getElementById('image-viewer-container').appendChild(errorDetail)
        document.title = `Cover | Failed to load image`

        var link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = 'assets/icon/logo_rounded.png';
    }

    var link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = imageUrl;
    const imgTopSpace = document.createElement('div')
    imgTopSpace.id = 'img-top-space'
    document.getElementById('image-viewer-container').appendChild(imgTopSpace)
    document.getElementById('image-viewer-container').appendChild(img);

    function setCoverToBG(url) {

        const img = new Image();

        img.onload = function () {
            document.body.style.backgroundImage = `url('${url}')`;
            document.body.style.backgroundSize = 'cover';
        };

        img.src = url;
    }
} catch (e) {
    console.error(e)
    document.title = `Cover | Something went wrong`
}

window.addEventListener('resize', function () {
    adjustTitleStyle()
    adjustInfoStyle()
});

function adjustTitleStyle() {
    var titleDiv = document.getElementById('title-div');
    var imageTitleContainer = document.getElementById('image-title-container');
    var titleDivHight = titleDiv.offsetHeight;

    if (titleDivHight > 28) {
        titleDiv.className = 'title-radial'
        imageTitleContainer.style.paddingTop = '0vh'
    } else {
        titleDiv.className = 'title-linear'
        imageTitleContainer.style.paddingTop = '2vh'
    }
}

function adjustInfoStyle() {
    const infoDivElement = document.getElementById('info-div')
    const imageViewerContainer = document.getElementById('image-viewer-container')
    const imageInfoContainer = document.getElementById('image-info-container')
    const imageTopSpace = document.getElementById('img-top-space')
    const coverElement = document.getElementById('cover')
    if (coverHeight + 24 > window.innerHeight || coverWidth > window.innerWidth) {
        infoDiv.innerText = `Render at ${coverElement.offsetWidth} × ${coverElement.offsetHeight} | Original Size ${coverWidth} × ${coverHeight}`
        if (imageViewerContainer.querySelector('#info-div') !== null) {
            infoDivElement.remove()
            imageTopSpace.style.height = '0px'
            infoDiv.style.width = '100%'
            document.getElementById('image-info-container').appendChild(infoDiv)
            infoDivElement.className = 'info-bottom'
        }
    } else {
        infoDiv.innerText = `${coverWidth} × ${coverHeight}`
        infoDiv.style.width = `${coverElement.offsetWidth}px`
        imageTopSpace.style.height = '24px'
        if (imageInfoContainer.querySelector('#info-div') !== null) {
            infoDivElement.remove()
            document.getElementById('image-viewer-container').appendChild(infoDiv)
            infoDivElement.className = 'info-floating'
        } else {
            if (imageInfoContainer.querySelector('#info-div') == null) {
            }
            infoDivElement.className = 'info-floating'
        }
    }
}