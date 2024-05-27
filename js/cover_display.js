var coverHeight, coverWidth, infoDiv, dominantColor, dominantPalette, uiState = true,
    dominentBG1 = 3,
    dominentBG2 = 2,
    dominentBG3 = 4,
    dominentBG4 = 5,
    dominentBG5 = 6

const params = new URLSearchParams(window.location.search);

const imageUrl = `https://${params.get('cover')}`;
const title = `${params.get('title')}`;
const artist = `${params.get('artist') || 'Unknow artist'}`;
const album = `${params.get('album')}`;

try {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.id = 'cover'
    img.alt = `album cover of ${title}`
    img.crossOrigin = 'anonymous'
    img.classList = 'cover-default animate__animated animate__fadeInUp'

    img.onload = async function () {
        document.getElementById('loader').remove()
        await getDominentColor(img)
        coverWidth = this.naturalWidth
        coverHeight = this.naturalHeight

        const toggleColorBtn = document.getElementById("toggleColor");
        const toggleFilterBtn = document.getElementById("toggleFilter");
        const toggleCoverBtn = document.getElementById("toggleCover");
        const toggleInfoBtn = document.getElementById("toggleInfo");

        uiColor = localStorage.getItem("colorSetting");
        if (uiColor == null) {
            localStorage.setItem("colorSetting", "color");
            uiColor = "color";
        }

        filter = localStorage.getItem("filterSetting");
        if (filter == null) {
            localStorage.setItem("filterSetting", "false");
            filter = "false";
        } else if (filter == "true") {
            toggleFilter()
        }

        info = localStorage.getItem("infoSetting");
        if (info == null) {
            localStorage.setItem("infoSetting", "between");
            info = "between";
        } else if (info == "center") {
            toggleInfoBtn.innerHTML = `<i class="fa-solid fa-align-center fa-lg"></i>`
        }

        document.getElementById('image-viewer-container').appendChild(img);

        const zoomImg = document.createElement('img');
        zoomImg.src = imageUrl;
        zoomImg.id = 'cover-zoom'
        zoomImg.alt = `zoom album cover of ${title}`
        zoomImg.crossOrigin = 'anonymous'
        zoomImg.classList = 'cover-contain animate__animated'
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
        } else {
            infoColorDiv.style.opacity = 1
            toggleColorBtn.style.backgroundColor = `rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 1)`
            toggleFilterBtn.style.backgroundColor = `rgba(${dominantPalette[dominentBG3][0]}, ${dominantPalette[dominentBG3][1]}, ${dominantPalette[dominentBG3][2]}, 1)`
            toggleCoverBtn.style.backgroundColor = `rgba(${dominantPalette[dominentBG4][0]}, ${dominantPalette[dominentBG4][1]}, ${dominantPalette[dominentBG4][2]}, 1)`
            toggleInfoBtn.style.backgroundColor = `rgba(${dominantPalette[dominentBG5][0]}, ${dominantPalette[dominentBG5][1]}, ${dominantPalette[dominentBG5][2]}, 1)`
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
        infoDiv.classList = 'd-flex align-items-center justify-content-center justify-content-sm-between flex-md-row flex-column text-shadow animate__animated animate__fadeInUp'
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

        adjustInfo()
        adjustCoverToggleBtn()
        adjustCoverBtnPosition()
        setCoverToBG(imageUrl)
        if (title != null) {
            document.title = `Cover | ${title}`

            const titleAnimateDiv = document.createElement('div')
            titleAnimateDiv.id = 'title-animate-container'
            titleAnimateDiv.classList = 'animate-container animate__animated animate__fadeInDown'
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
            titleDiv.id = 'header-between-container'
            titleDiv.classList = 'd-flex align-items-center justify-content-center justify-content-sm-between flex-md-row flex-column text-shadow animate__animated animate__fadeInDown'
            document.getElementById('title-animate-container').appendChild(titleDiv)

            const titleContainer = document.createElement('div')
            titleContainer.id = 'title-container'
            titleContainer.innerHTML = `<i class="fa-solid fa-music fa-lg"></i>&nbsp;&nbsp;&nbsp;${title}&nbsp;&nbsp;&nbsp;<i class="fa-solid fa-microphone fa-lg"></i>&nbsp;&nbsp;&nbsp;${artist}`
            titleContainer.classList = 'p-2 text-shadow animate__animated animate__fadeInDown'
            document.getElementById('header-between-container').appendChild(titleContainer)

            const albumContainer = document.createElement('div')
            albumContainer.id = 'album-container'
            albumContainer.innerHTML = `<i class="fa-solid fa-compact-disc"></i>&nbsp;&nbsp;&nbsp;${album}`
            albumContainer.classList = 'p-2 text-shadow animate__animated animate__fadeInDown'
            document.getElementById('header-between-container').appendChild(albumContainer)

            const header = document.getElementById("header-between-container")
            if (info == "center") {
                toggleInfoBtn.innerHTML = `<i class="fa-solid fa-align-center fa-lg"></i>`
                header.className = "text-shadow animate__animated animate__fadeInDown"
                header.innerHTML = `<div id="title-container" class="p-2 text-shadow animate__animated animate__fadeInDown"><i
                class="fa-solid fa-music fa-lg" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;${title}&nbsp;&nbsp;&nbsp;<i
                class="fa-solid fa-microphone fa-lg" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;${artist}&nbsp;&nbsp;&nbsp;
                <i class="fa-solid fa-compact-disc" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;${album}</div>`
            } else {
                toggleInfoBtn.innerHTML = `<i class="fa-solid fa-align-justify fa-lg"></i>`
                header.className = "d-flex align-items-center justify-content-center justify-content-sm-between flex-md-row flex-column text-shadow animate__animated animate__fadeInDown"
                header.innerHTML = `<div id="title-container" class="p-2 text-shadow animate__animated animate__fadeInDown"><i
                class="fa-solid fa-music fa-lg" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;${title}&nbsp;&nbsp;&nbsp;<i
                class="fa-solid fa-microphone fa-lg" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;${artist}</div>
        
                <div id="album-container" class="p-2 text-shadow animate__animated animate__fadeInDown"><i
                class="fa-solid fa-compact-disc" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;${album}</div>`
            }
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

function dominantColorLog() {
    const dominantColorDict = {
        Overall: dominantColor,
        Palette: dominantPalette,
        PaletteIndexInUse: [dominentBG1, dominentBG2, dominentBG3, dominentBG4]
    };
    return dominantColorDict
}

function toggleUI() {
    const toggleBtn = document.getElementById("toggleUI");
    const title = document.getElementById("title-animate-container");
    const info = document.getElementById("info-animate-container");
    const toggleInfoBtn = document.getElementById("toggleInfo");
    const toggleColorBtn = document.getElementById("toggleColor");
    const toggleFilterBtn = document.getElementById("toggleFilter");
    const toggleCoverBtn = document.getElementById("toggleCover");
    const infoDiv = document.getElementById("info-div");
    const titleDiv = document.getElementById("header-between-container");
    if (uiState == true) {
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
        uiState = false
    } else {
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
        uiState = true
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
    }
}

function adjustInfo() {
    const coverElement = document.getElementById('cover')
    const coverZoomElement = document.getElementById('cover-zoom')
    const toggleCoverBtn = document.getElementById("toggleCover")
    const infoOriginal = document.getElementById('info-original')
    const infoState = document.getElementById('info-state')
    const infoNow = document.getElementById('info-now')
    const fillState = toggleCoverBtn.getAttribute("data-fill")

    if (window.innerHeight > window.innerWidth) {
        scale = (window.innerWidth - coverWidth) * 100 / coverWidth
    } else {
        scale = (window.innerHeight - coverHeight) * 100 / coverHeight
    }

    if (coverWidth > coverElement.offsetWidth || coverHeight > coverElement.offsetHeight) {
        infoNow.innerHTML = `<i class="fa-solid fa-display fa-lg"></i>&nbsp;&nbsp;&nbsp;Render at <Strong>${coverElement.offsetWidth} × ${coverElement.offsetHeight}</Strong>`
    } else {
        infoNow.innerHTML = `<i class="fa-solid fa-display fa-lg"></i>&nbsp;&nbsp;&nbsp;Render at <Strong>Original Size</Strong>`
    }
    
    if (fillState == "true") {
        infoState.innerHTML = `<i class="fa-solid fa-magnifying-glass fa-lg"></i>&nbsp;&nbsp;&nbsp;Render mode <Strong>Scale (${(scale + 100).toFixed(2)}%)</Strong>`
    } else if (coverWidth > coverElement.offsetWidth || coverHeight > coverElement.offsetHeight) {
        infoState.innerHTML = `<i class="fa-solid fa-magnifying-glass fa-lg"></i>&nbsp;&nbsp;&nbsp;Render mode <Strong>Normal (${(scale + 100).toFixed(2)}%)</Strong>`
    } else {
        infoState.innerHTML = `<i class="fa-solid fa-magnifying-glass fa-lg"></i>&nbsp;&nbsp;&nbsp;Render mode <Strong>Normal</Strong>`
    }
    infoOriginal.innerHTML = `<i class="fa-solid fa-image fa-lg"></i>&nbsp;&nbsp;&nbsp;Original size <Strong>${coverWidth} × ${coverHeight}</Strong>`

    if (window.innerWidth < 770) {
        infoOriginal.classList.remove("text-end")
        infoState.classList.remove("text-start")
    } else {
        infoOriginal.classList.add("text-end")
        infoState.classList.add("text-start")
    }
}

window.addEventListener('resize', function (event) {
    adjustInfo()
    adjustCoverToggleBtn()
    adjustCoverBtnPosition()
}, true);

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
        localStorage.setItem("filterSetting", "false");
        toggleFilterBtn.dataset.show = "false";
    } else {
        toggleFilterBtn.innerHTML = `<i class="fa-regular fa-lightbulb fa-lg"></i>`
        filter.style.backgroundColor = `rgba(0, 0, 0, 0.75)`
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
            alertColor = `rgba(${dominantPalette[dominentBG4][0]}, ${dominantPalette[dominentBG4][1]}, ${dominantPalette[dominentBG4][2]}, 0.75);`
        } else {
            alertColor = `rgba(0, 0, 0, 0.75);`
        }
        document.getElementById("notification-container").innerHTML = `
            <div id="notification" class="animate__animated animate__bounceIn" style="background-color: ${alertColor}">
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
                alertColor = `rgba(${dominantPalette[dominentBG4][0]}, ${dominantPalette[dominentBG4][1]}, ${dominantPalette[dominentBG4][2]}, 0.75);`
            } else {
                alertColor = `rgba(0, 0, 0, 0.75);`
            }
            toggleCoverBtn.innerHTML = `<i class="fa-solid fa-up-right-and-down-left-from-center fa-lg"></i>`
            toggleCoverBtn.dataset.fill = "false";
            coverElement.classList.remove("animate__fadeOutUp")
            coverZoomElement.classList.remove("animate__fadeInUp")
            adjustInfo()
            document.getElementById("notification-container").innerHTML = `
            <div id="notification" class="animate__animated animate__bounceIn" style="background-color: ${alertColor}">
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
    const header = document.getElementById("header-between-container")
    const setting = localStorage.getItem("infoSetting")
    if (setting == "between") {
        toggleInfoBtn.innerHTML = `<i class="fa-solid fa-align-center fa-lg"></i>`
        header.className = "text-shadow animate__animated animate__fadeInDown"
        header.innerHTML = `<div id="title-container" class="p-2 text-shadow animate__animated animate__fadeInDown"><i
        class="fa-solid fa-music fa-lg" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;${title}&nbsp;&nbsp;&nbsp;<i
        class="fa-solid fa-microphone fa-lg" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;${artist}&nbsp;&nbsp;&nbsp;
        <i class="fa-solid fa-compact-disc" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;${album}</div>`
        localStorage.setItem("infoSetting", 'center')
    } else {
        toggleInfoBtn.innerHTML = `<i class="fa-solid fa-align-justify fa-lg"></i>`
        header.className = "d-flex align-items-center justify-content-center justify-content-sm-between flex-md-row flex-column text-shadow animate__animated animate__fadeInDown"
        header.innerHTML = `<div id="title-container" class="p-2 text-shadow animate__animated animate__fadeInDown"><i
        class="fa-solid fa-music fa-lg" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;${title}&nbsp;&nbsp;&nbsp;<i
        class="fa-solid fa-microphone fa-lg" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;${artist}</div>

        <div id="album-container" class="p-2 text-shadow animate__animated animate__fadeInDown"><i
        class="fa-solid fa-compact-disc" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;${album}</div>`
        localStorage.setItem("infoSetting", 'between')
    }
}