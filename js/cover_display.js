var coverHeight, coverWidth, infoDiv, dominantColor, dominantPalette,
titleBgColorIndex = 1,
titleTextColorIndex = 0,
titleTextShadowColorIndex = 0,
infoBgColorIndex = 0,
infoBg2ColorIndex = 1

const params = new URLSearchParams(window.location.search);

const imageUrl = `https://${params.get('cover')}`;
const title = `${params.get('title')}`;
const album = `${params.get('album')}`;

try {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.id = 'cover'
    img.alt = `album cover of ${title}`
    img.crossOrigin = 'anonymous'
    img.classList = 'cover'

    img.onload = async function () {
        document.getElementById('loader').remove()
        await getDominentColor(img)
        coverWidth = this.naturalWidth
        coverHeight = this.naturalHeight

        document.getElementById('image-viewer-container').appendChild(img);

        const infoDivContainer = document.createElement('div')
        infoDivContainer.id = 'info-div-container'
        infoDivContainer.className = 'info-floating-container'
        document.getElementById('image-viewer-container').appendChild(infoDivContainer)

        infoDiv = document.createElement('div')
        infoDiv.id = 'info-div'
        infoDiv.style.width = this.width + 'px'
        // infoDiv.style.textShadow = `1px 1px 5px rgb(${dominantPalette[titleTextShadowColorIndex][0]}, ${dominantPalette[titleTextShadowColorIndex][1]}, ${dominantPalette[titleTextShadowColorIndex][2]})`
        document.getElementById('info-div-container').appendChild(infoDiv)
        document.getElementById('info-div').innerText = coverWidth + ' × ' + coverHeight
        setCoverToBG(imageUrl)
        adjustInfoStyle()
        if (title != null) {
            document.title = `Cover | ${title}`
            const titleDiv = document.createElement('div')
            titleDiv.id = 'title-div'
            titleDiv.innerText = title + ' | ' + album
            // titleDiv.style.color = `rgb(${dominantPalette[titleTextColorIndex][0]}, ${dominantPalette[titleTextColorIndex][1]}, ${dominantPalette[titleTextColorIndex][2]})`
            // titleDiv.style.backgroundImage = `linear-gradient(to right, rgba(${dominantPalette[titleBgColorIndex][0]}, ${dominantPalette[titleBgColorIndex][1]}, ${dominantPalette[titleBgColorIndex][2]}, 0.75), rgba(0, 0, 0, 0))`
            // titleDiv.style.textShadow = `1px 1px 5px rgb(${dominantPalette[titleTextShadowColorIndex][0]}, ${dominantPalette[titleTextShadowColorIndex][1]}, ${dominantPalette[titleTextShadowColorIndex][2]})`
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
        // titleDiv.style.backgroundImage = `radial-gradient(circle, rgba(${dominantPalette[titleBgColorIndex][0]}, ${dominantPalette[titleBgColorIndex][1]}, ${dominantPalette[titleBgColorIndex][2]}, 0.75), rgba(0, 0, 0, 0))`
        imageTitleContainer.style.paddingTop = '0vh'
    } else {
        titleDiv.className = 'title-linear'
        // titleDiv.style.backgroundImage = `linear-gradient(to right, rgba(${dominantPalette[titleBgColorIndex][0]}, ${dominantPalette[titleBgColorIndex][1]}, ${dominantPalette[titleBgColorIndex][2]}, 0.75), rgba(0, 0, 0, 0))`
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
        // infoDiv.style.backgroundImage = `radial-gradient(circle, rgba(${dominantPalette[infoBgColorIndex][0]}, ${dominantPalette[infoBgColorIndex][1]}, ${dominantPalette[infoBgColorIndex][2]}, 0.5), rgba(${dominantPalette[infoBg2ColorIndex][0]}, ${dominantPalette[infoBg2ColorIndex][1]}, ${dominantPalette[infoBg2ColorIndex][2]}, 0.5))`
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
        // infoDiv.style.backgroundImage = `radial-gradient(circle, rgba(${dominantPalette[infoBgColorIndex][0]}, ${dominantPalette[infoBgColorIndex][1]}, ${dominantPalette[infoBgColorIndex][2]}, 0.5), rgba(${dominantPalette[infoBg2ColorIndex][0]}, ${dominantPalette[infoBg2ColorIndex][1]}, ${dominantPalette[infoBg2ColorIndex][2]}, 0.5))`
        imageTopSpace.style.height = '24px'
        if (imageInfoContainer.querySelector('#info-div') !== null) {
            infoDivElement.remove()
            document.getElementById('info-div-container').appendChild(infoDiv)
            infoDivElement.className = 'info-floating'
        } else {
            if (imageInfoContainer.querySelector('#info-div') == null) {
            }
            infoDivElement.className = 'info-floating'
        }
    }
}

async function getDominentColor(image) {
    const colorThief = await new ColorThief();
    dominantColor = await colorThief.getColor(image);
    dominantPalette = await colorThief.getPalette(image);
    console.log('dominantColor',dominantColor)
    console.log('dominantPalette',dominantPalette)
}