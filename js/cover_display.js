var coverHeight, coverWidth

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
    }
    
    var link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = imageUrl;
    
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