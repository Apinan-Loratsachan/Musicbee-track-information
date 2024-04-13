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
        const infoDiv = document.createElement('div')
        infoDiv.id = 'info-div'
        document.getElementById('image-info-container').appendChild(infoDiv)
        document.getElementById('info-div').innerText = coverWidth + ' × ' + coverHeight
        setCoverToBG(imageUrl)
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

window.addEventListener('resize', function() {
    adjustTitleStyle()
});

function adjustTitleStyle() {
    var titleDiv = document.getElementById('title-div');
    var imageTitleContainer = document.getElementById('image-title-container');
    var screenWidth = window.innerWidth;
    var titleDivWidth = titleDiv.offsetWidth;
    var titleDivHight = titleDiv.offsetHeight;
    
    if (titleDivHight > 28) {
        titleDiv.className = 'title-radial'
        imageTitleContainer.style.paddingTop = '0vh'
    } else {
        titleDiv.className = 'title-linear'
        imageTitleContainer.style.paddingTop = '2vh'
    }
}