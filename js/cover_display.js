var coverHeight, coverWidth, infoDiv, dominantColor, dominantPalette,
    dominentBG1 = 3,
    dominentBG2 = 2,
    dominentBG3 = 4,
    dominentBG4 = 5

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
    img.classList = 'cover-default animate__animated animate__fadeInUp'

    img.onload = async function () {
        document.getElementById('loader').remove()
        await getDominentColor(img)
        coverWidth = this.naturalWidth
        coverHeight = this.naturalHeight

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

        document.getElementById('image-viewer-container').appendChild(img);
        const toggleColorBtn = document.getElementById("toggleColor");
        const toggleFilterBtn = document.getElementById("toggleFilter");
        const toggleCoverBtn = document.getElementById("toggleCover");

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
        } else {
            infoColorDiv.style.opacity = 1
            toggleColorBtn.style.backgroundColor = `rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 1)`
            toggleFilterBtn.style.backgroundColor = `rgba(${dominantPalette[dominentBG3][0]}, ${dominantPalette[dominentBG3][1]}, ${dominantPalette[dominentBG3][2]}, 1)`
            toggleCoverBtn.style.backgroundColor = `rgba(${dominantPalette[dominentBG4][0]}, ${dominantPalette[dominentBG4][1]}, ${dominantPalette[dominentBG4][2]}, 1)`
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
        infoDiv.classList = 'text-shadow animate__animated animate__fadeInUp'
        document.getElementById('info-animate-container').appendChild(infoDiv)
        adjustInfo()
        adjustCoverToggleBtn()
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
            titleDiv.id = 'title-div'
            titleDiv.innerText = title + ' | ' + album
            titleDiv.classList = 'text-shadow animate__animated animate__fadeInDown'
            document.getElementById('title-animate-container').appendChild(titleDiv)
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
    const state = toggleBtn.getAttribute("data-show");
    const title = document.getElementById("title-animate-container");
    const info = document.getElementById("info-animate-container");
    const toggleColorBtn = document.getElementById("toggleColor");
    const toggleFilterBtn = document.getElementById("toggleFilter");
    const toggleCoverBtn = document.getElementById("toggleCover");
    const infoDiv = document.getElementById("info-div");
    const titleDiv = document.getElementById("title-div");
    if (state == "true") {
        titleDiv.classList.remove("animate__fadeInDown")
        titleDiv.classList.add("animate__fadeOutUp")
        infoDiv.classList.remove("animate__fadeInUp")
        infoDiv.classList.add("animate__fadeOutDown")
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
        toggleBtn.dataset.show = "false";
    } else {
        titleDiv.classList.remove("animate__fadeOutUp")
        titleDiv.classList.add("animate__fadeInDown")
        infoDiv.classList.remove("animate__fadeOutDown")
        infoDiv.classList.add("animate__fadeInUp")
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
        toggleBtn.dataset.show = "true";
    }
}

function toggleColor() {
    const toggleFilterBtn = document.getElementById("toggleFilter");
    const toggleCoverBtn = document.getElementById("toggleCover");
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
        infoColorDiv.style.opacity = 0
        infoMonotonerDiv.style.opacity = 0.5
        titleColorDiv.style.opacity = 0
        titleMonotonerDiv.style.opacity = 0.5
    } else {
        localStorage.setItem("colorSetting", "color");
        toggleColorBtn.style.backgroundColor = `rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 1)`
        toggleFilterBtn.style.backgroundColor = `rgba(${dominantPalette[dominentBG3][0]}, ${dominantPalette[dominentBG3][1]}, ${dominantPalette[dominentBG3][2]}, 1)`
        toggleCoverBtn.style.backgroundColor = `rgba(${dominantPalette[dominentBG4][0]}, ${dominantPalette[dominentBG4][1]}, ${dominantPalette[dominentBG4][2]}, 1)`
        infoColorDiv.style.opacity = 1
        infoMonotonerDiv.style.opacity = 0
        titleColorDiv.style.opacity = 1
        titleMonotonerDiv.style.opacity = 0
    }
}

function adjustInfo() {
    const coverElement = document.getElementById('cover')
    if (coverWidth > coverElement.offsetWidth || coverHeight > coverElement.offsetHeight) {
        document.getElementById('info-div').innerHTML = `Render at <Strong>${coverElement.offsetWidth} × ${coverElement.offsetHeight}</Strong> | Original Size <Strong>${coverWidth} × ${coverHeight}</Strong>`
    } else if (coverWidth < coverElement.offsetWidth || coverHeight < coverElement.offsetHeight) {
        document.getElementById('info-div').innerHTML = `<Strong>(ZOOM)</Strong> Render at Original Size <Strong>${coverWidth} × ${coverHeight}</Strong>`
    } else {
        document.getElementById('info-div').innerHTML = `Render at Original Size <Strong>${coverWidth} × ${coverHeight}</Strong>`
    }
}

window.addEventListener('resize', function (event) {
    adjustInfo()
    adjustCoverToggleBtn()
}, true);

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
    const state = toggleCoverBtn.getAttribute("data-fill");
    const colorSetting = localStorage.getItem("colorSetting");
    if (coverWidth > coverElement.offsetWidth || coverHeight > coverElement.offsetHeight) {
        if (colorSetting == "color") {
            alertColor = `rgba(${dominantPalette[dominentBG4][0]}, ${dominantPalette[dominentBG4][1]}, ${dominantPalette[dominentBG4][2]}, 0.75);`
        } else {
            alertColor = `rgba(0, 0, 0, 0.75);`
        }
        document.getElementById("ui-state-container").innerHTML = `
            <div id="ui-state" class="animate__animated animate__bounceIn" style="background-color: ${alertColor}">
                <i class="fa-solid fa-xmark fa-2xl"></i>
                <div style="height: 20px;"></div>
                <div id="ui-state-text">Disable zoom<br>your screen is small than cover</div>
            </div>`
        setTimeout(() => {
            document.getElementById("ui-state").classList.remove("animate__bounceIn")
            document.getElementById("ui-state").classList.add("animate__bounceOut")
        }, 2000);
    } else {
        if (state == "true") {
            toggleCoverBtn.innerHTML = `<i class="fa-solid fa-up-right-and-down-left-from-center fa-lg"></i>`
            coverElement.className = 'cover-default'
            adjustInfo()
            toggleCoverBtn.dataset.fill = "false";
        } else {
            toggleCoverBtn.innerHTML = `<i class="fa-solid fa-arrow-rotate-left fa-lg"></i>`
            toggleCoverBtn.setAttribute("data-bs-original-title", "Reset cover to default size")
            coverElement.className = 'cover-contain'
            adjustInfo()
            toggleCoverBtn.dataset.fill = "true";
        }
    }
}

function adjustCoverToggleBtn() {
    const coverElement = document.getElementById("cover");
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
            coverElement.className = 'cover-default'
            adjustInfo()
            toggleCoverBtn.dataset.fill = "false";
            document.getElementById("ui-state-container").innerHTML = `
            <div id="ui-state" class="animate__animated animate__bounceIn" style="background-color: ${alertColor}">
                <i class="fa-solid fa-rotate-left fa-2xl"></i>
                <div style="height: 20px;"></div>
                <div id="ui-state-text">Disable zoom<br>expand your screen for enable zoom again</div>
            </div>`
            setTimeout(() => {
                document.getElementById("ui-state").classList.remove("animate__bounceIn")
                document.getElementById("ui-state").classList.add("animate__bounceOut")
            }, 2000);
        }
        toggleCoverBtn.innerHTML = `<i class="fa-solid fa-xmark fa-lg"></i>`
    } else if (fillState != "true") {
        toggleCoverBtn.innerHTML = `<i class="fa-solid fa-up-right-and-down-left-from-center fa-lg"></i>`
    }
}