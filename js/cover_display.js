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

        // const infoDivContainer = document.createElement('div')
        // infoDivContainer.id = 'info-div-container'
        // infoDivContainer.classList = 'animate__animated animate__zoomIn delay-10'
        // document.getElementById('image-viewer-container').appendChild(infoDivContainer)

        const floatingInfoDiv = document.createElement('div')
        floatingInfoDiv.id = 'floatingInfo'
        floatingInfoDiv.classList = 'info-floating-container animate__animated animate__fadeInUp'
        floatingInfoDiv.innerText = "Render at 0 × 0 | Original Size 0 × 0"
        document.getElementById('image-info-container').appendChild(floatingInfoDiv)

        // infoDiv = document.createElement('div')
        // infoDiv.id = 'info-div'
        // infoDiv.style.width = coverWidth + 'px'
        // infoDiv.style.textAlign = 'center'
        // infoDiv.style.textShadow = `1px 1px 5px rgb(${dominantPalette[titleTextShadowColorIndex][0]}, ${dominantPalette[titleTextShadowColorIndex][1]}, ${dominantPalette[titleTextShadowColorIndex][2]})`
        // document.getElementById('info-div-container').appendChild(infoDiv)
        const coverElement = document.getElementById('cover')
        // document.getElementById('info-div').innerText = coverWidth + ' × ' + coverHeight
        document.getElementById('floatingInfo').innerText = `Render at ${coverElement.offsetWidth} × ${coverElement.offsetHeight} | Original Size ${coverWidth} × ${coverHeight}`
        setCoverToBG(imageUrl)
        if (title != null) {
            // document.getElementById("ui-state-container").innerHTML = `
            // <div id="ui-state" class="animate__animated animate__bounceIn">
            //     <i class="fa-solid fa-eye-slash fa-lg"></i>
            //     <div style="height: 20px;"></div>
            //     <div id="ui-state-text">Click or Touch for hide Information</div>
            // </div>`
            // setTimeout(() => {
            //     document.getElementById("ui-state").classList.remove("animate__bounceIn")
            //     document.getElementById("ui-state").classList.add("animate__bounceOut")
            // }, 1500);
            document.title = `Cover | ${title}`
            const titleDiv = document.createElement('div')
            titleDiv.id = 'title-div'
            titleDiv.innerText = title + ' | ' + album
            titleDiv.classList = 'title-solid animate__animated animate__fadeInDown'
            // titleDiv.style.color = `rgb(${dominantPalette[titleTextColorIndex][0]}, ${dominantPalette[titleTextColorIndex][1]}, ${dominantPalette[titleTextColorIndex][2]})`
            // titleDiv.style.backgroundImage = `linear-gradient(to right, rgba(${dominantPalette[titleBgColorIndex][0]}, ${dominantPalette[titleBgColorIndex][1]}, ${dominantPalette[titleBgColorIndex][2]}, 0.75), rgba(0, 0, 0, 0))`
            // titleDiv.style.textShadow = `1px 1px 5px rgb(${dominantPalette[titleTextShadowColorIndex][0]}, ${dominantPalette[titleTextShadowColorIndex][1]}, ${dominantPalette[titleTextShadowColorIndex][2]})`
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

function adjustTitleStyle() {
    var titleDiv = document.getElementById('title-div');
    var imageTitleContainer = document.getElementById('image-title-container');
    var titleDivHight = titleDiv.offsetHeight;

    if (titleDivHight > 28) {
        titleDiv.classList = 'title-radial animate__animated animate__fadeInDown'
        // titleDiv.style.backgroundImage = `radial-gradient(circle, rgba(${dominantPalette[titleBgColorIndex][0]}, ${dominantPalette[titleBgColorIndex][1]}, ${dominantPalette[titleBgColorIndex][2]}, 0.75), rgba(0, 0, 0, 0))`
        imageTitleContainer.style.paddingTop = '0vh'
    } else {
        titleDiv.classList = 'title-linear animate__animated animate__fadeInLeft'
        // titleDiv.style.backgroundImage = `linear-gradient(to right, rgba(${dominantPalette[titleBgColorIndex][0]}, ${dominantPalette[titleBgColorIndex][1]}, ${dominantPalette[titleBgColorIndex][2]}, 0.75), rgba(0, 0, 0, 0))`
        imageTitleContainer.style.paddingTop = '2vh'
    }
}

async function getDominentColor(image) {
    const colorThief = await new ColorThief();
    dominantColor = await colorThief.getColor(image);
    dominantPalette = await colorThief.getPalette(image);
    console.log('dominantColor', dominantColor)
    console.log('dominantPalette', dominantPalette)
}

function toggleUI() {
    const toggleBtn = document.getElementById("togleUI");
    const state = toggleBtn.getAttribute("data-show");
    const title = document.getElementById("title-div");
    const info = document.getElementById("floatingInfo");
    const stateContainer = document.getElementById("ui-state");
    const stateText = document.getElementById("ui-state-text");
    if (state == "true") {
        // stateText.innerText = 'Hide information'
        // stateContainer.classList.remove("animate__bounceOut")
        // stateContainer.classList.add("animate__bounceIn")
        // setTimeout(() => {
        //     stateContainer.classList.remove("animate__bounceIn")
        //     stateContainer.classList.add("animate__bounceOut")
        // }, 1500);
        title.classList.remove("delay-10")
        title.classList.remove("animate__fadeInDown")
        title.classList.add("animate__fadeOutUp")
        info.classList.remove("delay-10")
        info.classList.remove("animate__fadeInUp")
        info.classList.add("animate__fadeOutDown")
        toggleBtn.dataset.show = "false";
        // toggleBtn.innerHTML = `<i class="fa-solid fa-eye fa-lg"></i>`
    } else {
        // stateText.innerText = 'Display information'
        // stateContainer.classList.remove("animate__bounceOut")
        // stateContainer.classList.add("animate__bounceIn")
        // setTimeout(() => {
        //     stateContainer.classList.remove("animate__bounceIn")
        //     stateContainer.classList.add("animate__bounceOut")
        // }, 1500);
        title.classList.remove("animate__fadeOutUp")
        title.classList.add("animate__fadeInDown")
        info.classList.remove("animate__fadeOutDown")
        info.classList.add("animate__fadeInUp")
        toggleBtn.dataset.show = "true";
        // toggleBtn.innerHTML = `<i class="fa-solid fa-eye-slash fa-lg"></i>`
    }
}