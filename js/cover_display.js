var coverHeight, coverWidth, infoDiv, dominantColor, dominantPalette, useWhite = true, uiState = true,
    dominentBG1 = 3,
    dominentBG2 = 2,
    dominentBG3 = 4,
    dominentBG4 = 5,
    dominentBG5 = 6,
    whiteContrastTrusthold = 5, whiteContrast, rawWhiteContrast,
    displayAlert

const params = new URLSearchParams(window.location.search);

const imageUrl = `https://${params.get('cover')}`;
const title = `${params.get('title') || 'Unknow title'}`;
const artist = `${params.get('artist') || 'Unknow artist'}`;
const album = `${params.get('album') || 'Unknow artist'}`;

const render = document.getElementById("render");
const renderText = document.getElementById("render-text");
const renderEnd = document.getElementById("render-fade");

try {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.id = 'cover'
    img.alt = `album cover of ${title}`
    img.crossOrigin = 'anonymous'
    img.classList = 'cover cover-default animate__animated animate__fadeInUp'

    img.onload = async function () {
        document.getElementById('loader').remove()
        await getDominentColor(img)
        coverWidth = this.naturalWidth
        coverHeight = this.naturalHeight

        const toggleColorBtn = document.getElementById("toggleColor");
        const toggleFilterBtn = document.getElementById("toggleFilter");
        const toggleCoverBtn = document.getElementById("toggleCover");
        const toggleInfoBtn = document.getElementById("toggleInfo");
        const tip = document.getElementById("tip");
        const tipText = document.getElementById("tip-text");
        const tipEnd = document.getElementById("tip-fade");

        rawWhiteContrast = contrast([255, 255, 255], dominantPalette[dominentBG1])
        whiteContrast = rawWhiteContrast + whiteContrastTrusthold
        blackContrast = contrast([0, 0, 0], dominantPalette[dominentBG1])
        if (whiteContrast >= blackContrast) {
            useWhite = true
        } else {
            useWhite = false
        }

        uiColor = localStorage.getItem("colorSetting");
        if (uiColor == null) {
            localStorage.setItem("colorSetting", "color");
            uiColor = "color";
        }

        info = localStorage.getItem("infoSetting");
        if (info == null) {
            localStorage.setItem("infoSetting", "between");
            info = "between";
        } else if (info == "center") {
            toggleInfoBtn.innerHTML = `<i class="fa-solid fa-align-center fa-lg"></i>`
        }

        filter = localStorage.getItem("filterSetting");


        document.getElementById('image-viewer-container').appendChild(img);

        const zoomImg = document.createElement('img');
        zoomImg.src = imageUrl;
        zoomImg.id = 'cover-zoom'
        zoomImg.alt = `zoom album cover of ${title}`
        zoomImg.crossOrigin = 'anonymous'
        zoomImg.classList = 'cover cover-contain animate__animated'
        zoomImg.style.opacity = 0
        document.getElementById('zoom-image-container').appendChild(zoomImg);

        const infoAnimateDiv = document.createElement('div')
        infoAnimateDiv.id = 'info-animate-container'
        infoAnimateDiv.classList = 'animate-container animate__animated animate__fadeInUp'
        document.getElementById('image-info-container').appendChild(infoAnimateDiv)

        const infoColorDiv = document.createElement('div')
        infoColorDiv.id = 'info-color-div'
        infoColorDiv.classList = 'color-container'
        infoColorDiv.style.backgroundImage = `linear-gradient(to right,
                rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 0.5),
                rgba(${dominantPalette[dominentBG2][0]}, ${dominantPalette[dominentBG2][1]}, ${dominantPalette[dominentBG2][2]}, 0.5),
                rgba(${dominantPalette[dominentBG3][0]}, ${dominantPalette[dominentBG3][1]}, ${dominantPalette[dominentBG3][2]}, 0.5),
                rgba(${dominantPalette[dominentBG2][0]}, ${dominantPalette[dominentBG2][1]}, ${dominantPalette[dominentBG2][2]}, 0.5),
                rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 0.5)
            )`
        if (uiColor != "color") {
            infoColorDiv.style.opacity = 0
            toggleColorBtn.style.backgroundColor = `rgba(0, 0, 0, 0.75)`
            toggleFilterBtn.style.backgroundColor = `rgba(0, 0, 0, 0.75)`
            toggleCoverBtn.style.backgroundColor = `rgba(0, 0, 0, 0.75)`
            toggleInfoBtn.style.backgroundColor = `rgba(0, 0, 0, 0.75)`
            tipText.style.backgroundImage = `linear-gradient(to right,
                rgba(0, 0, 0, 0.5),
                rgba(0, 0, 0, 0.5)
            )`
            tipEnd.style.backgroundImage = `linear-gradient(to right,
                rgba(0, 0, 0, 0.5),
                rgba(0, 0, 0, 0)
            )`
        } else {
            infoColorDiv.style.opacity = 1
            toggleColorBtn.style.backgroundColor = `rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 1)`
            toggleFilterBtn.style.backgroundColor = `rgba(${dominantPalette[dominentBG3][0]}, ${dominantPalette[dominentBG3][1]}, ${dominantPalette[dominentBG3][2]}, 1)`
            toggleCoverBtn.style.backgroundColor = `rgba(${dominantPalette[dominentBG4][0]}, ${dominantPalette[dominentBG4][1]}, ${dominantPalette[dominentBG4][2]}, 1)`
            toggleInfoBtn.style.backgroundColor = `rgba(${dominantPalette[dominentBG5][0]}, ${dominantPalette[dominentBG5][1]}, ${dominantPalette[dominentBG5][2]}, 1)`

            tipText.style.backgroundColor = `rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 0.5)`
            if (useWhite || filter == 'true') {
                tipText.style.color = "rgba(255, 255, 255, 1)"
            } else {
                tipText.style.color = "rgba(20, 20, 20, 1)"
            }
            tipEnd.style.backgroundImage = `linear-gradient(to right,
                rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 0.5),
                rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 0)
            )`
        }

        displaytip = parseInt(localStorage.getItem("displaytip"));
        if (displaytip == null || isNaN(displaytip)) {
            localStorage.setItem("displaytip", 10);
            tip.classList.add("animate__fadeInLeft")
            setTimeout(() => {
                tip.classList.remove("animate__fadeInLeft")
                tip.classList.add("animate__slower")
                tip.classList.add("animate__fadeOutLeft")
            }, 4000);
        } else if (displaytip == 0) {
            localStorage.setItem("displaytip", 10)
            tip.classList.add("animate__fadeInLeft")
            setTimeout(() => {
                tip.classList.remove("animate__fadeInLeft")
                tip.classList.add("animate__slower")
                tip.classList.add("animate__fadeOutLeft")
            }, 4000);
        } else {
            localStorage.setItem("displaytip", displaytip - 1);
        }

        document.getElementById('info-animate-container').appendChild(infoColorDiv)

        const infoMonotoneDiv = document.createElement('div')
        infoMonotoneDiv.id = 'info-monotone-div'
        infoMonotoneDiv.classList = 'color-container'
        infoMonotoneDiv.style.backgroundColor = 'rgb(0, 0, 0)'
        if (uiColor != "color") {
            infoMonotoneDiv.style.opacity = 0.5
        } else {
            infoMonotoneDiv.style.opacity = 0
        }
        document.getElementById('info-animate-container').appendChild(infoMonotoneDiv)

        const infoDiv = document.createElement('div')
        infoDiv.id = 'info-div'
        infoDiv.classList = 'd-flex align-items-center justify-content-center justify-content-sm-between flex-md-row flex-column animate__animated animate__fadeInUp'
        document.getElementById('info-animate-container').appendChild(infoDiv)

        const infoState = document.createElement('div')
        infoState.id = 'info-state'
        infoState.classList = "infoText text-start p-2 flex-fill"
        document.getElementById('info-div').appendChild(infoState)

        const infoNow = document.createElement('div')
        infoNow.id = 'info-now'
        infoNow.classList = "infoText p-2 flex-fill"
        document.getElementById('info-div').appendChild(infoNow)

        const infoOriginal = document.createElement('div')
        infoOriginal.id = 'info-original'
        infoOriginal.classList = "infoText text-end p-2 flex-fill"
        document.getElementById('info-div').appendChild(infoOriginal)

        if (useWhite) {
            document.getElementById('info-div').style.color = 'rgba(255, 255, 255, 1)'
        } else {
            document.getElementById('info-div').style.color = 'rgba(20, 20, 20, 1)'
        }

        setCoverToBG(imageUrl)
        document.title = `Cover | ${title}`

        const titleAnimateDiv = document.createElement('div')
        titleAnimateDiv.id = 'title-animate-container'
        titleAnimateDiv.classList = 'infoText animate-container animate__animated animate__fadeInDown'
        document.getElementById('image-title-container').appendChild(titleAnimateDiv)

        const titleColorDiv = document.createElement('div')
        titleColorDiv.id = 'title-color-div'
        titleColorDiv.classList = 'color-container'
        titleColorDiv.style.backgroundImage = `linear-gradient(to right,
                rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 0.5),
                rgba(${dominantPalette[dominentBG2][0]}, ${dominantPalette[dominentBG2][1]}, ${dominantPalette[dominentBG2][2]}, 0.5),
                rgba(${dominantPalette[dominentBG3][0]}, ${dominantPalette[dominentBG3][1]}, ${dominantPalette[dominentBG3][2]}, 0.5),
                rgba(${dominantPalette[dominentBG2][0]}, ${dominantPalette[dominentBG2][1]}, ${dominantPalette[dominentBG2][2]}, 0.5),
                rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 0.5)
            )`

        if (uiColor != "color") {
            titleColorDiv.style.opacity = 0
        } else {
            titleColorDiv.style.opacity = 1
        }
        document.getElementById('title-animate-container').appendChild(titleColorDiv)

        const titleMonotoneDiv = document.createElement('div')
        titleMonotoneDiv.id = 'title-monotone-div'
        titleMonotoneDiv.classList = 'color-container'
        titleMonotoneDiv.style.backgroundColor = 'rgb(0, 0, 0)'
        if (uiColor != "color") {
            titleMonotoneDiv.style.opacity = 0.5
        } else {
            titleMonotoneDiv.style.opacity = 0
        }
        document.getElementById('title-animate-container').appendChild(titleMonotoneDiv)

        const titleDiv = document.createElement('div')
        titleDiv.id = 'header-container'
        titleDiv.classList = 'd-flex align-items-center justify-content-center justify-content-sm-between flex-md-row flex-column animate__animated animate__fadeInDown'
        document.getElementById('title-animate-container').appendChild(titleDiv)

        const titleContainer = document.createElement('div')
        titleContainer.id = 'title-container'
        titleContainer.innerHTML = `<i class="fa-solid fa-music fa-lg"></i>&nbsp;&nbsp;&nbsp;${title}&nbsp;&nbsp;&nbsp;<i class="fa-solid fa-microphone fa-lg"></i>&nbsp;&nbsp;&nbsp;${artist}`
        titleContainer.classList = 'headerText p-2 animate__animated animate__fadeInDown'
        document.getElementById('header-container').appendChild(titleContainer)

        const albumContainer = document.createElement('div')
        albumContainer.id = 'album-container'
        albumContainer.innerHTML = `<i class="fa-solid fa-compact-disc"></i>&nbsp;&nbsp;&nbsp;${album}`
        albumContainer.classList = 'headerText p-2 animate__animated animate__fadeInDown'
        document.getElementById('header-container').appendChild(albumContainer)

        if (useWhite) {
            document.getElementById('header-container').style.color = 'rgba(255, 255, 255, 1)'
        } else {
            document.getElementById('header-container').style.color = 'rgba(20, 20, 20, 1)'
        }

        const header = document.getElementById("header-container")
        if (info == "center") {
            toggleInfoBtn.innerHTML = `<i class="fa-solid fa-align-center fa-lg"></i>`
            header.className = "animate__animated animate__fadeInDown"
            header.innerHTML = `<div id="title-container" class="headerText p-2 animate__animated animate__fadeInDown"><i
                class="fa-solid fa-music fa-lg" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;${title}&nbsp;&nbsp;&nbsp;<i
                class="fa-solid fa-microphone fa-lg" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;${artist}&nbsp;&nbsp;&nbsp;
                <i class="fa-solid fa-compact-disc" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;${album}</div>`
        } else {
            toggleInfoBtn.innerHTML = `<i class="fa-solid fa-align-justify fa-lg"></i>`
            header.className = "d-flex align-items-center justify-content-center justify-content-sm-between flex-md-row flex-column animate__animated animate__fadeInDown"
            header.innerHTML = `<div id="title-container" class="headerText p-2 animate__animated animate__fadeInDown"><i
                class="fa-solid fa-music fa-lg" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;${title}&nbsp;&nbsp;&nbsp;<i
                class="fa-solid fa-microphone fa-lg" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;${artist}</div>
        
                <div id="album-container" class="headerText p-2 animate__animated animate__fadeInDown"><i
                class="fa-solid fa-compact-disc" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;${album}</div>`
        }
        adjustCover()
        adjustCoverToggleBtn()
        adjustCoverBtnPosition()
        adjustGradient()
        adjustShadow()
        var intervalId = window.setInterval(function () {
            adjustInfo()
        }, 1);
        setTimeout(() => {
            clearInterval(intervalId)
        }, 1500);
        if (filter == null) {
            localStorage.setItem("filterSetting", "false");
            filter = "false";
        } else if (filter == "true") {
            toggleFilter()
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

async function getDominentColor(image) {
    const colorThief = await new ColorThief();
    dominantColor = await colorThief.getColor(image);
    dominantPalette = await colorThief.getPalette(image);
}

function data() {
    const dataDict = {
        settings: {
            color: localStorage.getItem("colorSetting"),
            filter: localStorage.getItem("filterSetting") === 'true',
            info: localStorage.getItem("infoSetting")
        },
        tipCountdown: parseInt(localStorage.getItem("displaytip")),
        cover: {
            image: {
                url: imageUrl,
                size: {
                    height: coverHeight,
                    width: coverWidth
                }
            },
            meta: {
                title: title,
                artist: artist,
                album: album,
            },
            contrast: {
                white: rawWhiteContrast,
                black: blackContrast,
                whiteTrusthold: whiteContrastTrusthold,
                whiteFinal: whiteContrast
            }
        },
        dominantColor: {
            Overall: dominantColor,
            Palette: dominantPalette,
            PaletteIndexInUse: [dominentBG1, dominentBG2, dominentBG3, dominentBG4, dominentBG5]
        },
        device: {
            userAgent: navigator.userAgent,
            type: isMobile() ? 'Mobile' : isMobileTablet() ? 'Tablet' : 'Desktop'
        }
    };
    return dataDict
}

function toggleUI() {
    // const toggleBtn = document.getElementById("toggleUI");
    const title = document.getElementById("title-animate-container");
    const info = document.getElementById("info-animate-container");
    const toggleInfoBtn = document.getElementById("toggleInfo");
    const toggleColorBtn = document.getElementById("toggleColor");
    const toggleFilterBtn = document.getElementById("toggleFilter");
    const toggleCoverBtn = document.getElementById("toggleCover");
    const infoDiv = document.getElementById("info-div");
    const titleDiv = document.getElementById("header-container");

    const cover = document.getElementById('image-viewer-container')
    const zoomCover = document.getElementById('zoom-image-container')
    const header = document.getElementById('image-title-container')
    const footer = document.getElementById('image-info-container')

    // toggleBtn.classList.remove('unprevent-poiter')
    // setTimeout(() => {
    //     toggleBtn.classList.add('unprevent-poiter')
    // }, 1000);

    var intervalId = window.setInterval(function () {
        adjustInfo()
    }, 1);
    setTimeout(() => {
        clearInterval(intervalId)
    }, 1500);

    if (uiState == true) {
        uiState = false

        cover.style.paddingTop = '0px'
        cover.style.paddingBottom = '0px'

        zoomCover.style.paddingTop = '0px'
        zoomCover.style.paddingBottom = '0px'

        updateAlert(true)

        titleDiv.classList.remove("animate__fadeInDown")
        titleDiv.classList.add("animate__fadeOutUp")
        infoDiv.classList.remove("animate__fadeInUp")
        infoDiv.classList.add("animate__fadeOutDown")
        toggleInfoBtn.classList.remove("unprevent-poiter")
        toggleInfoBtn.classList.remove("animate__fadeInRight")
        toggleInfoBtn.classList.add("animate__fadeOutRight")
        toggleCoverBtn.classList.remove("unprevent-poiter")
        toggleCoverBtn.classList.remove("animate__fadeInRight")
        toggleCoverBtn.classList.add("animate__fadeOutRight")
        toggleFilterBtn.classList.remove("unprevent-poiter")
        toggleFilterBtn.classList.remove("animate__fadeInRight")
        toggleFilterBtn.classList.add("animate__fadeOutRight")
        toggleColorBtn.classList.remove("unprevent-poiter")
        toggleColorBtn.classList.remove("animate__fadeInRight")
        toggleColorBtn.classList.add("animate__fadeOutRight")
        title.classList.remove("delay-10")
        title.classList.remove("animate__fadeInDown")
        title.classList.add("animate__fadeOutUp")
        info.classList.remove("delay-10")
        info.classList.remove("animate__fadeInUp")
        info.classList.add("animate__fadeOutDown")
    } else {
        uiState = true

        updateAlert(true)

        cover.style.paddingTop = `${header.offsetHeight}px`
        cover.style.paddingBottom = `${footer.offsetHeight}px`

        zoomCover.style.paddingTop = `${header.offsetHeight}px`
        zoomCover.style.paddingBottom = `${footer.offsetHeight}px`

        titleDiv.classList.remove("animate__fadeOutUp")
        titleDiv.classList.add("animate__fadeInDown")
        infoDiv.classList.remove("animate__fadeOutDown")
        infoDiv.classList.add("animate__fadeInUp")
        toggleInfoBtn.classList.remove("animate__fadeOutRight")
        toggleInfoBtn.classList.add("animate__fadeInRight")
        toggleInfoBtn.classList.add("unprevent-poiter")
        toggleCoverBtn.classList.remove("animate__fadeOutRight")
        toggleCoverBtn.classList.add("animate__fadeInRight")
        toggleCoverBtn.classList.add("unprevent-poiter")
        toggleFilterBtn.classList.remove("animate__fadeOutRight")
        toggleFilterBtn.classList.add("animate__fadeInRight")
        toggleFilterBtn.classList.add("unprevent-poiter")
        toggleColorBtn.classList.remove("animate__fadeOutRight")
        toggleColorBtn.classList.add("animate__fadeInRight")
        toggleColorBtn.classList.add("unprevent-poiter")
        title.classList.remove("animate__fadeOutUp")
        title.classList.add("animate__fadeInDown")
        info.classList.remove("animate__fadeOutDown")
        info.classList.add("animate__fadeInUp")
    }
}

function updateAlert(init) {
    const coverElement = document.getElementById('cover')
    const zoomCoverElement = document.getElementById('cover-zoom')
    const toggleCoverBtn = document.getElementById("toggleCover");
    const fillState = toggleCoverBtn.getAttribute("data-fill")
    if (!uiState) {
        if (localStorage.getItem("colorSetting") != "color") {
            renderText.style.backgroundColor = `rgba(0, 0, 0, 0)`
            renderText.style.backgroundImage = `linear-gradient(to right,
                rgba(0, 0, 0, 0.5),
                rgba(0, 0, 0, 0.5)
            )`
            renderEnd.style.backgroundImage = `linear-gradient(to right,
                rgba(0, 0, 0, 0.5),
                rgba(0, 0, 0, 0)
            )`
        } else {
            renderText.style.backgroundColor = `rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 0.5)`
            if (useWhite || filter == 'true') {
                renderText.style.color = "rgba(255, 255, 255, 1)"
            } else {
                renderText.style.color = "rgba(20, 20, 20, 1)"
            }
            renderText.style.backgroundImage = `linear-gradient(to right,
                rgba(0, 0, 0, 0),
                rgba(0, 0, 0, 0)
            )`
            renderEnd.style.backgroundImage = `linear-gradient(to right,
                rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 0.5),
                rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 0)
            )`
        }

        if (window.innerHeight > window.innerWidth) {
            scale = (coverElement.offsetWidth - coverWidth) * 100 / coverWidth
            zoomScale = (zoomCoverElement.offsetWidth - coverWidth) * 100 / coverWidth
        } else {
            scale = (coverElement.offsetHeight - coverHeight) * 100 / coverHeight
            zoomScale = (zoomCoverElement.offsetHeight - coverHeight) * 100 / coverHeight
        }

        if (init) {
            var updateRenderAlert = window.setInterval(function () {
                if (fillState == "true") {
                    renderText.innerHTML = `<i class="fa-solid fa-magnifying-glass fa-lg"></i>&nbsp;&nbsp;&nbsp;Render mode <Strong>Scale (${(zoomScale + 100).toFixed(2)}%)</Strong>`
                } else if (coverWidth > coverElement.offsetWidth || coverHeight > coverElement.offsetHeight) {
                    renderText.innerHTML = `<i class="fa-solid fa-magnifying-glass fa-lg"></i>&nbsp;&nbsp;&nbsp;Render mode <Strong>Normal (${(scale + 100).toFixed(2)}%)</Strong>`
                } else {
                    renderText.innerHTML = `<i class="fa-solid fa-magnifying-glass fa-lg"></i>&nbsp;&nbsp;&nbsp;Render mode <Strong>Normal</Strong>`
                }

                if (isMobile()) {
                    if (coverWidth > coverElement.offsetWidth || coverHeight > coverElement.offsetHeight) {
                        renderText.innerHTML += `<div style="height: 10px"></div><i class="fa-solid fa-mobile-screen fa-lg"></i>&nbsp;&nbsp;&nbsp;Render at <Strong>${coverElement.offsetWidth} × ${coverElement.offsetHeight}</Strong>`
                    } else {
                        renderText.innerHTML += `<div style="height: 10px"></div><i class="fa-solid fa-mobile-screen fa-lg"></i>&nbsp;&nbsp;&nbsp;Render at <Strong>Original Size</Strong>`
                    }
                } else if (isMobileTablet()) {
                    if (coverWidth > coverElement.offsetWidth || coverHeight > coverElement.offsetHeight) {
                        renderText.innerHTML += `<div style="height: 10px"></div><i class="fa-solid fa-tablet-screen-button fa-lg"></i>&nbsp;&nbsp;&nbsp;Render at <Strong>${coverElement.offsetWidth} × ${coverElement.offsetHeight}</Strong>`
                    } else {
                        renderText.innerHTML += `<div style="height: 10px"></div><i class="fa-solid fa-tablet-screen-button fa-lg"></i>&nbsp;&nbsp;&nbsp;Render at <Strong>Original Size</Strong>`
                    }
                } else {
                    if (coverWidth > coverElement.offsetWidth || coverHeight > coverElement.offsetHeight) {
                        renderText.innerHTML += `<div style="height: 10px"></div><i class="fa-solid fa-display fa-lg"></i>&nbsp;&nbsp;&nbsp;Render at <Strong>${coverElement.offsetWidth} × ${coverElement.offsetHeight}</Strong>`
                    } else {
                        renderText.innerHTML += `<div style="height: 10px"></div><i class="fa-solid fa-display fa-lg"></i>&nbsp;&nbsp;&nbsp;Render at <Strong>Original Size</Strong>`
                    }
                }

                renderText.innerHTML += `<div style="height: 10px"></div><i class="fa-solid fa-image fa-lg"></i>&nbsp;&nbsp;&nbsp;Original size <Strong>${coverWidth} × ${coverHeight}</Strong>`
            }, 1);

            setTimeout(() => {
                clearInterval(updateRenderAlert)
            }, 1500);
        } else {
            if (fillState == "true") {
                renderText.innerHTML = `<i class="fa-solid fa-magnifying-glass fa-lg"></i>&nbsp;&nbsp;&nbsp;Render mode <Strong>Scale (${(zoomScale + 100).toFixed(2)}%)</Strong>`
            } else if (coverWidth > coverElement.offsetWidth || coverHeight > coverElement.offsetHeight) {
                renderText.innerHTML = `<i class="fa-solid fa-magnifying-glass fa-lg"></i>&nbsp;&nbsp;&nbsp;Render mode <Strong>Normal (${(scale + 100).toFixed(2)}%)</Strong>`
            } else {
                renderText.innerHTML = `<i class="fa-solid fa-magnifying-glass fa-lg"></i>&nbsp;&nbsp;&nbsp;Render mode <Strong>Normal</Strong>`
            }

            if (isMobile()) {
                if (coverWidth > coverElement.offsetWidth || coverHeight > coverElement.offsetHeight) {
                    renderText.innerHTML += `<div style="height: 10px"></div><i class="fa-solid fa-mobile-screen fa-lg"></i>&nbsp;&nbsp;&nbsp;Render at <Strong>${coverElement.offsetWidth} × ${coverElement.offsetHeight}</Strong>`
                } else {
                    renderText.innerHTML += `<div style="height: 10px"></div><i class="fa-solid fa-mobile-screen fa-lg"></i>&nbsp;&nbsp;&nbsp;Render at <Strong>Original Size</Strong>`
                }
            } else if (isMobileTablet()) {
                if (coverWidth > coverElement.offsetWidth || coverHeight > coverElement.offsetHeight) {
                    renderText.innerHTML += `<div style="height: 10px"></div><i class="fa-solid fa-tablet-screen-button fa-lg"></i>&nbsp;&nbsp;&nbsp;Render at <Strong>${coverElement.offsetWidth} × ${coverElement.offsetHeight}</Strong>`
                } else {
                    renderText.innerHTML += `<div style="height: 10px"></div><i class="fa-solid fa-tablet-screen-button fa-lg"></i>&nbsp;&nbsp;&nbsp;Render at <Strong>Original Size</Strong>`
                }
            } else {
                if (coverWidth > coverElement.offsetWidth || coverHeight > coverElement.offsetHeight) {
                    renderText.innerHTML += `<div style="height: 10px"></div><i class="fa-solid fa-display fa-lg"></i>&nbsp;&nbsp;&nbsp;Render at <Strong>${coverElement.offsetWidth} × ${coverElement.offsetHeight}</Strong>`
                } else {
                    renderText.innerHTML += `<div style="height: 10px"></div><i class="fa-solid fa-display fa-lg"></i>&nbsp;&nbsp;&nbsp;Render at <Strong>Original Size</Strong>`
                }
            }

            renderText.innerHTML += `<div style="height: 10px"></div><i class="fa-solid fa-image fa-lg"></i>&nbsp;&nbsp;&nbsp;Original size <Strong>${coverWidth} × ${coverHeight}</Strong>`
        }

        render.classList.remove("animate__fadeOutLeft")
        render.classList.remove("animate__slower")
        render.classList.add("animate__fadeInLeft")

        window.clearTimeout(displayAlert);
        displayAlert = window.setTimeout(() => {
            render.classList.remove("animate__fadeInLeft")
            render.classList.add("animate__slower")
            render.classList.add("animate__fadeOutLeft")
        }, 2500);
    } else {
        render.classList.remove("animate__fadeInLeft")
        render.classList.add("animate__slower")
        render.classList.add("animate__fadeOutLeft")
    }
}

function toggleColor() {
    const toggleFilterBtn = document.getElementById("toggleFilter");
    const toggleCoverBtn = document.getElementById("toggleCover");
    const toggleInfoBtn = document.getElementById("toggleInfo");
    const colorSetting = localStorage.getItem("colorSetting");
    const toggleColorBtn = document.getElementById("toggleColor");
    const infoColorDiv = document.getElementById("info-color-div");
    const infoMonotonerDiv = document.getElementById("info-monotone-div");
    const titleColorDiv = document.getElementById("title-color-div");
    const titleMonotonerDiv = document.getElementById("title-monotone-div");
    if (colorSetting == "color") {
        localStorage.setItem("colorSetting", "monotone");
        toggleColorBtn.style.backgroundColor = `rgba(0, 0, 0, 0.75)`
        toggleFilterBtn.style.backgroundColor = `rgba(0, 0, 0, 0.75)`
        toggleCoverBtn.style.backgroundColor = `rgba(0, 0, 0, 0.75)`
        toggleInfoBtn.style.backgroundColor = `rgba(0, 0, 0, 0.75)`
        infoColorDiv.style.opacity = 0
        infoMonotonerDiv.style.opacity = 0.5
        titleColorDiv.style.opacity = 0
        titleMonotonerDiv.style.opacity = 0.5
        document.getElementById('info-div').style.color = 'rgba(255, 255, 255, 1)'
        document.getElementById('header-container').style.color = 'rgba(255, 255, 255, 1)'
    } else {
        localStorage.setItem("colorSetting", "color");
        toggleColorBtn.style.backgroundColor = `rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 1)`
        toggleFilterBtn.style.backgroundColor = `rgba(${dominantPalette[dominentBG3][0]}, ${dominantPalette[dominentBG3][1]}, ${dominantPalette[dominentBG3][2]}, 1)`
        toggleCoverBtn.style.backgroundColor = `rgba(${dominantPalette[dominentBG4][0]}, ${dominantPalette[dominentBG4][1]}, ${dominantPalette[dominentBG4][2]}, 1)`
        toggleInfoBtn.style.backgroundColor = `rgba(${dominantPalette[dominentBG5][0]}, ${dominantPalette[dominentBG5][1]}, ${dominantPalette[dominentBG5][2]}, 1)`
        infoColorDiv.style.opacity = 1
        infoMonotonerDiv.style.opacity = 0
        titleColorDiv.style.opacity = 1
        titleMonotonerDiv.style.opacity = 0
        if (useWhite) {
            document.getElementById('info-div').style.color = 'rgba(255, 255, 255, 1)'
            document.getElementById('header-container').style.color = 'rgba(255, 255, 255, 1)'
        } else {
            document.getElementById('info-div').style.color = 'rgba(20, 20, 20, 1)'
            document.getElementById('header-container').style.color = 'rgba(20, 20, 20, 1)'
        }
    }
}

function adjustInfo() {
    const coverElement = document.getElementById('cover')
    const zoomCoverElement = document.getElementById('cover-zoom')
    const toggleCoverBtn = document.getElementById("toggleCover")
    const infoOriginal = document.getElementById('info-original')
    const infoState = document.getElementById('info-state')
    const infoNow = document.getElementById('info-now')
    const fillState = toggleCoverBtn.getAttribute("data-fill")

    if (window.innerHeight > window.innerWidth) {
        scale = (coverElement.offsetWidth - coverWidth) * 100 / coverWidth
        zoomScale = (zoomCoverElement.offsetWidth - coverWidth) * 100 / coverWidth
    } else {
        scale = (coverElement.offsetHeight - coverHeight) * 100 / coverHeight
        zoomScale = (zoomCoverElement.offsetHeight - coverHeight) * 100 / coverHeight
    }

    if (isMobile()) {
        if (coverWidth > coverElement.offsetWidth || coverHeight > coverElement.offsetHeight) {
            infoNow.innerHTML = `<i class="fa-solid fa-mobile-screen fa-lg"></i>&nbsp;&nbsp;&nbsp;Render at <Strong>${coverElement.offsetWidth} × ${coverElement.offsetHeight}</Strong>`
        } else {
            infoNow.innerHTML = `<i class="fa-solid fa-mobile-screen fa-lg"></i>&nbsp;&nbsp;&nbsp;Render at <Strong>Original Size</Strong>`
        }
    } else if (isMobileTablet()) {
        if (coverWidth > coverElement.offsetWidth || coverHeight > coverElement.offsetHeight) {
            infoNow.innerHTML = `<i class="fa-solid fa-tablet-screen-button fa-lg"></i>&nbsp;&nbsp;&nbsp;Render at <Strong>${coverElement.offsetWidth} × ${coverElement.offsetHeight}</Strong>`
        } else {
            infoNow.innerHTML = `<i class="fa-solid fa-tablet-screen-button fa-lg"></i>&nbsp;&nbsp;&nbsp;Render at <Strong>Original Size</Strong>`
        }
    } else {
        if (coverWidth > coverElement.offsetWidth || coverHeight > coverElement.offsetHeight) {
            infoNow.innerHTML = `<i class="fa-solid fa-display fa-lg"></i>&nbsp;&nbsp;&nbsp;Render at <Strong>${coverElement.offsetWidth} × ${coverElement.offsetHeight}</Strong>`
        } else {
            infoNow.innerHTML = `<i class="fa-solid fa-display fa-lg"></i>&nbsp;&nbsp;&nbsp;Render at <Strong>Original Size</Strong>`
        }
    }

    if (fillState == "true") {
        infoState.innerHTML = `<i class="fa-solid fa-magnifying-glass fa-lg"></i>&nbsp;&nbsp;&nbsp;Render mode <Strong>Scale (${(zoomScale + 100).toFixed(2)}%)</Strong>`
    } else if (coverWidth > coverElement.offsetWidth || coverHeight > coverElement.offsetHeight) {
        infoState.innerHTML = `<i class="fa-solid fa-magnifying-glass fa-lg"></i>&nbsp;&nbsp;&nbsp;Render mode <Strong>Normal (${(scale + 100).toFixed(2)}%)</Strong>`
    } else {
        infoState.innerHTML = `<i class="fa-solid fa-magnifying-glass fa-lg"></i>&nbsp;&nbsp;&nbsp;Render mode <Strong>Normal</Strong>`
    }
    infoOriginal.innerHTML = `<i class="fa-solid fa-image fa-lg"></i>&nbsp;&nbsp;&nbsp;Original size <Strong>${coverWidth} × ${coverHeight}</Strong>`

    if (window.innerWidth < 1000) {
        infoOriginal.classList.remove("text-end")
        infoState.classList.remove("text-start")
    } else {
        infoOriginal.classList.add("text-end")
        infoState.classList.add("text-start")
    }
}

function adjustGradient() {
    if (window.innerWidth > 767) {
        document.getElementById('title-color-div').style.backgroundImage = `linear-gradient(to right,
            rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 0.5),
            rgba(${dominantPalette[dominentBG2][0]}, ${dominantPalette[dominentBG2][1]}, ${dominantPalette[dominentBG2][2]}, 0.5),
            rgba(${dominantPalette[dominentBG3][0]}, ${dominantPalette[dominentBG3][1]}, ${dominantPalette[dominentBG3][2]}, 0.5),
            rgba(${dominantPalette[dominentBG2][0]}, ${dominantPalette[dominentBG2][1]}, ${dominantPalette[dominentBG2][2]}, 0.5),
            rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 0.5)
        )`
        document.getElementById('info-color-div').style.backgroundImage = `linear-gradient(to right,
            rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 0.5),
            rgba(${dominantPalette[dominentBG2][0]}, ${dominantPalette[dominentBG2][1]}, ${dominantPalette[dominentBG2][2]}, 0.5),
            rgba(${dominantPalette[dominentBG3][0]}, ${dominantPalette[dominentBG3][1]}, ${dominantPalette[dominentBG3][2]}, 0.5),
            rgba(${dominantPalette[dominentBG2][0]}, ${dominantPalette[dominentBG2][1]}, ${dominantPalette[dominentBG2][2]}, 0.5),
            rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 0.5)
        )`
    } else {
        document.getElementById('title-color-div').style.backgroundImage = `linear-gradient(to bottom,
            rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 0.5),
            rgba(${dominantPalette[dominentBG3][0]}, ${dominantPalette[dominentBG3][1]}, ${dominantPalette[dominentBG3][2]}, 0.5)
        )`
        document.getElementById('info-color-div').style.backgroundImage = `linear-gradient(to bottom,
            rgba(${dominantPalette[dominentBG3][0]}, ${dominantPalette[dominentBG3][1]}, ${dominantPalette[dominentBG3][2]}, 0.5),
            rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 0.5)
        )`
    }
}

window.addEventListener('resize', function (event) {
    adjustInfo()
    adjustCoverToggleBtn()
    adjustCoverBtnPosition()
    adjustGradient()
    adjustCover()
    updateAlert()
}, true);

function adjustShadow() {
    if (useWhite) {
        document.getElementById('header-container').classList.add('white-text-shadow')
        document.getElementById('info-div').classList.add('white-text-shadow')
        document.getElementById('notification-container').classList.add('white-text-shadow')
    } else {
        document.getElementById('header-container').classList.add('black-text-shadow')
        document.getElementById('info-div').classList.add('black-text-shadow')
        document.getElementById('notification-container').classList.add('black-text-shadow')
    }
}

function adjustCover() {
    const cover = document.getElementById('image-viewer-container')
    const zoomCover = document.getElementById('zoom-image-container')
    const header = document.getElementById('image-title-container')
    const info = document.getElementById('image-info-container')

    if (uiState) {
        cover.style.paddingTop = `${header.offsetHeight}px`
        cover.style.paddingBottom = `${info.offsetHeight}px`

        zoomCover.style.paddingTop = `${header.offsetHeight}px`
        zoomCover.style.paddingBottom = `${info.offsetHeight}px`
    }
}

function adjustCoverBtnPosition() {
    const coverBtn = document.getElementById('cover-button-group-container')
    const info = document.getElementById('image-info-container')
    coverBtn.style.paddingBottom = info.offsetHeight + 'px'
}

function toggleFilter() {
    const toggleFilterBtn = document.getElementById("toggleFilter");
    const filter = document.getElementById("filter");
    const state = toggleFilterBtn.getAttribute("data-show");
    if (state == "true") {
        toggleFilterBtn.innerHTML = `<i class="fa-solid fa-lightbulb fa-lg"></i>`
        filter.style.backgroundColor = `rgba(0, 0, 0, 0)`
        if (useWhite) {
            document.getElementById('info-div').style.color = 'rgba(255, 255, 255, 1)'
            document.getElementById('header-container').style.color = 'rgba(255, 255, 255, 1)'
        } else {
            document.getElementById('info-div').style.color = 'rgba(20, 20, 20, 1)'
            document.getElementById('header-container').style.color = 'rgba(20, 20, 20, 1)'
        }
        localStorage.setItem("filterSetting", "false");
        toggleFilterBtn.dataset.show = "false";
    } else {
        toggleFilterBtn.innerHTML = `<i class="fa-regular fa-lightbulb fa-lg"></i>`
        filter.style.backgroundColor = `rgba(0, 0, 0, 0.75)`
        document.getElementById('info-div').style.color = 'rgba(255, 255, 255, 1)'
        document.getElementById('header-container').style.color = 'rgba(255, 255, 255, 1)'
        localStorage.setItem("filterSetting", "true");
        toggleFilterBtn.dataset.show = "true";
    }
}

function clearLocalStorage() {
    localStorage.clear()
    return "Clear localStorage success"
}

function toggleCover() {
    const toggleCoverBtn = document.getElementById("toggleCover");
    const coverElement = document.getElementById("cover");
    const coverZoomElement = document.getElementById("cover-zoom");
    const state = toggleCoverBtn.getAttribute("data-fill");
    const colorSetting = localStorage.getItem("colorSetting");
    if (coverWidth > coverElement.offsetWidth || coverHeight > coverElement.offsetHeight) {
        if (colorSetting == "color") {
            alertColor = `rgba(${dominantPalette[dominentBG4][0]}, ${dominantPalette[dominentBG4][1]}, ${dominantPalette[dominentBG4][2]}, 0.85);`
        } else {
            alertColor = `rgba(0, 0, 0, 0.75);`
        }

        if (colorSetting == 'color') {
            const alertWhiteContrast = contrast([255, 255, 255], dominantPalette[dominentBG4])
            const alertBlackContrast = contrast([0, 0, 0], dominantPalette[dominentBG4])

            if (alertWhiteContrast + whiteContrastTrusthold > alertBlackContrast) {
                alertTextColor = `rgba(255, 255, 255, 1);`
                textShadow = 'white-text-shadow'
            } else {
                alertTextColor = `rgba(0, 0, 0, 1);`
                textShadow = 'black-text-shadow'
            }
        } else {
            alertTextColor = `rgba(255, 255, 255, 1);`
            textShadow = 'white-text-shadow'
        }

        document.getElementById("notification-container").innerHTML = `
            <div id="notification" class="animate__animated animate__bounceIn" style="background-color: ${alertColor}; color: ${alertTextColor};">
                <i class="fa-solid fa-xmark fa-2xl"></i>
                <div style="height: 20px;"></div>
                <div id="notification-text">Disable fit cover<br>your screen is small than cover</div>
            </div>`
        setTimeout(() => {
            document.getElementById("notification").classList.remove("animate__bounceIn")
            document.getElementById("notification").classList.add("animate__bounceOut")
        }, 2000);
    } else {
        if (state == "true") {
            toggleCoverBtn.innerHTML = `<i class="fa-solid fa-up-right-and-down-left-from-center fa-lg"></i>`
            coverElement.classList.remove("animate__fadeOutUp")
            coverElement.classList.add("animate__fadeInDown")
            coverZoomElement.classList.remove("animate__fadeInUp")
            coverZoomElement.classList.add("animate__fadeOutDown")
            toggleCoverBtn.dataset.fill = "false";
            adjustInfo()
        } else {
            toggleCoverBtn.innerHTML = `<i class="fa-solid fa-arrow-rotate-left fa-lg"></i>`
            toggleCoverBtn.setAttribute("data-bs-original-title", "Reset cover to default size")
            coverElement.classList.remove("animate__fadeInUp")
            coverElement.classList.remove("animate__fadeInDown")
            coverElement.classList.add("animate__fadeOutUp")
            coverZoomElement.classList.remove("animate__fadeOutDown")
            coverZoomElement.classList.add("animate__fadeInUp")
            toggleCoverBtn.dataset.fill = "true";
            adjustInfo()
        }
    }
}

function adjustCoverToggleBtn() {
    const coverElement = document.getElementById("cover");
    const coverZoomElement = document.getElementById("cover-zoom");
    const toggleCoverBtn = document.getElementById("toggleCover");
    const fillState = toggleCoverBtn.getAttribute("data-fill");
    const colorSetting = localStorage.getItem("colorSetting");
    if (coverWidth > coverElement.offsetWidth || coverHeight > coverElement.offsetHeight) {
        if (fillState == "true") {
            if (colorSetting == "color") {
                alertColor = `rgba(${dominantPalette[dominentBG4][0]}, ${dominantPalette[dominentBG4][1]}, ${dominantPalette[dominentBG4][2]}, 0.85);`
            } else {
                alertColor = `rgba(0, 0, 0, 0.75);`
            }

            if (colorSetting == 'color') {
                const alertWhiteContrast = contrast([255, 255, 255], dominantPalette[dominentBG4])
                const alertBlackContrast = contrast([0, 0, 0], dominantPalette[dominentBG4])

                if (alertWhiteContrast + whiteContrastTrusthold > alertBlackContrast) {
                    alertTextColor = `rgba(255, 255, 255, 1);`
                    textShadow = 'white-text-shadow'
                } else {
                    alertTextColor = `rgba(0, 0, 0, 1);`
                    textShadow = 'black-text-shadow'
                }
            } else {
                alertTextColor = `rgba(255, 255, 255, 1);`
                textShadow = 'white-text-shadow'
            }

            toggleCoverBtn.innerHTML = `<i class="fa-solid fa-up-right-and-down-left-from-center fa-lg"></i>`
            toggleCoverBtn.dataset.fill = "false";
            coverElement.classList.remove("animate__fadeOutUp")
            coverZoomElement.classList.remove("animate__fadeInUp")
            adjustInfo()
            document.getElementById("notification-container").innerHTML = `
            <div id="notification" class="${textShadow} animate__animated animate__bounceIn" style="background-color: ${alertColor}; color: ${alertTextColor};">
                <i class="fa-solid fa-rotate-left fa-2xl"></i>
                <div style="height: 20px;"></div>
                <div id="notification-text">Disable fit cover<br>expand your screen for enable zoom again</div>
            </div>`
            setTimeout(() => {
                document.getElementById("notification").classList.remove("animate__bounceIn")
                document.getElementById("notification").classList.add("animate__bounceOut")
            }, 2000);
        }
        toggleCoverBtn.innerHTML = `<i class="fa-solid fa-xmark fa-lg"></i>`
    } else if (fillState != "true") {
        toggleCoverBtn.innerHTML = `<i class="fa-solid fa-up-right-and-down-left-from-center fa-lg"></i>`
    }
}

function toggleInfo() {
    const toggleInfoBtn = document.getElementById("toggleInfo")
    const header = document.getElementById("header-container")
    const setting = localStorage.getItem("infoSetting")
    if (setting == "between") {
        toggleInfoBtn.innerHTML = `<i class="fa-solid fa-align-center fa-lg"></i>`
        header.className = "animate__animated animate__fadeInDown"
        header.innerHTML = `<div id="title-container" class="headerText p-2 animate__animated animate__fadeInDown"><i
        class="fa-solid fa-music fa-lg" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;${title}&nbsp;&nbsp;&nbsp;<i
        class="fa-solid fa-microphone fa-lg" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;${artist}&nbsp;&nbsp;&nbsp;
        <i class="fa-solid fa-compact-disc" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;${album}</div>`
        localStorage.setItem("infoSetting", 'center')
    } else {
        toggleInfoBtn.innerHTML = `<i class="fa-solid fa-align-justify fa-lg"></i>`
        header.className = "d-flex align-items-center justify-content-center justify-content-sm-between flex-md-row flex-column animate__animated animate__fadeInDown"
        header.innerHTML = `<div id="title-container" class="headerText p-2 animate__animated animate__fadeInDown"><i
        class="fa-solid fa-music fa-lg" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;${title}&nbsp;&nbsp;&nbsp;<i
        class="fa-solid fa-microphone fa-lg" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;${artist}</div>

        <div id="album-container" class="headerText p-2 animate__animated animate__fadeInDown"><i
        class="fa-solid fa-compact-disc" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;${album}</div>`
        localStorage.setItem("infoSetting", 'between')
    }
}