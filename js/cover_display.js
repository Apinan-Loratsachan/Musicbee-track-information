var coverHeight, coverWidth, infoDiv, dominantColor, dominantPalette,
    dominentBG1 = 3,
    dominentBG2 = 2,
    dominentBG3 = 4,
    dominentText = 0

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

        const floatingInfoDiv = document.createElement('div')
        floatingInfoDiv.id = 'floatingInfo'
        floatingInfoDiv.classList = 'info-floating-container animate__animated animate__fadeInUp amimated__gradient'
        if (uiColor != "color") {
            toggleColorBtn.style.backgroundColor = `rgba(0, 0, 0, 0.75)`
            toggleFilterBtn.style.backgroundColor = `rgba(0, 0, 0, 0.75)`
            floatingInfoDiv.style.backgroundImage = `linear-gradient(to right,
                rgba(0, 0, 0, 0),
                rgba(0, 0, 0, 0),
                rgba(0, 0, 0, 0),
                rgba(0, 0, 0, 0),
                rgba(0, 0, 0, 0)
            )`
        } else {
            toggleColorBtn.style.backgroundColor = `rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 1)`
            toggleFilterBtn.style.backgroundColor = `rgba(${dominantPalette[dominentBG3][0]}, ${dominantPalette[dominentBG3][1]}, ${dominantPalette[dominentBG3][2]}, 1)`
            floatingInfoDiv.style.backgroundImage = `linear-gradient(to right,
                rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 0.75),
                rgba(${dominantPalette[dominentBG2][0]}, ${dominantPalette[dominentBG2][1]}, ${dominantPalette[dominentBG2][2]}, 0.75),
                rgba(${dominantPalette[dominentBG3][0]}, ${dominantPalette[dominentBG3][1]}, ${dominantPalette[dominentBG3][2]}, 0.75),
                rgba(${dominantPalette[dominentBG2][0]}, ${dominantPalette[dominentBG2][1]}, ${dominantPalette[dominentBG2][2]}, 0.75),
                rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 0.75)
            )`
        }
        document.getElementById('image-info-container').appendChild(floatingInfoDiv)
        adjustInfo()
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
            titleDiv.classList = 'title-solid animate__animated animate__fadeInDown amimated__gradient'
            if (uiColor != "color") {
                titleDiv.style.backgroundImage = `linear-gradient(to right,
                    rgba(0, 0, 0, 0),
                    rgba(0, 0, 0, 0),
                    rgba(0, 0, 0, 0),
                    rgba(0, 0, 0, 0),
                    rgba(0, 0, 0, 0)
                )`
            } else {
                titleDiv.style.backgroundImage = `linear-gradient(to right,
                    rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 0.75),
                    rgba(${dominantPalette[dominentBG2][0]}, ${dominantPalette[dominentBG2][1]}, ${dominantPalette[dominentBG2][2]}, 0.75),
                    rgba(${dominantPalette[dominentBG3][0]}, ${dominantPalette[dominentBG3][1]}, ${dominantPalette[dominentBG3][2]}, 0.75),
                    rgba(${dominantPalette[dominentBG2][0]}, ${dominantPalette[dominentBG2][1]}, ${dominantPalette[dominentBG2][2]}, 0.75),
                    rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 0.75)
                )`
            }
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

async function getDominentColor(image) {
    const colorThief = await new ColorThief();
    dominantColor = await colorThief.getColor(image);
    dominantPalette = await colorThief.getPalette(image);
}

function dominantColorLog() {
    const dominantColorDict = {
        Overall: [dominantColor],
        Palette: [dominantPalette],
    };
    return dominantColorDict
}

function toggleUI() {
    const toggleBtn = document.getElementById("toggleUI");
    const state = toggleBtn.getAttribute("data-show");
    const title = document.getElementById("title-div");
    const info = document.getElementById("floatingInfo");
    const stateContainer = document.getElementById("ui-state");
    const stateText = document.getElementById("ui-state-text");
    const toggleColorBtn = document.getElementById("toggleColor");
    const toggleFilterBtn = document.getElementById("toggleFilter");
    if (state == "true") {
        // stateText.innerText = 'Hide information'
        // stateContainer.classList.remove("animate__bounceOut")
        // stateContainer.classList.add("animate__bounceIn")
        // setTimeout(() => {
        //     stateContainer.classList.remove("animate__bounceIn")
        //     stateContainer.classList.add("animate__bounceOut")
        // }, 1500);
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
        // toggleBtn.innerHTML = `<i class="fa-solid fa-eye fa-lg"></i>`
    } else {
        // stateText.innerText = 'Display information'
        // stateContainer.classList.remove("animate__bounceOut")
        // stateContainer.classList.add("animate__bounceIn")
        // setTimeout(() => {
        //     stateContainer.classList.remove("animate__bounceIn")
        //     stateContainer.classList.add("animate__bounceOut")
        // }, 1500);
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
        // toggleBtn.innerHTML = `<i class="fa-solid fa-eye-slash fa-lg"></i>`
    }
}

function toggleColor() {
    const toggleFilterBtn = document.getElementById("toggleFilter");
    const colorSetting = localStorage.getItem("colorSetting");
    const toggleColorBtn = document.getElementById("toggleColor");
    const floatingInfoDiv = document.getElementById("floatingInfo");
    const titleDiv = document.getElementById("title-div");
    if (colorSetting == "color") {
        localStorage.setItem("colorSetting", "monotone");
        toggleColorBtn.style.backgroundColor = `rgba(0, 0, 0, 0.75)`
        toggleFilterBtn.style.backgroundColor = `rgba(0, 0, 0, 0.75)`
        floatingInfoDiv.style.backgroundImage = `linear-gradient(to right,
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 0)
        )`
        titleDiv.style.backgroundImage = `linear-gradient(to right,
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 0)
        )`
    } else {
        localStorage.setItem("colorSetting", "color");
        toggleColorBtn.style.backgroundColor = `rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 1)`
        toggleFilterBtn.style.backgroundColor = `rgba(${dominantPalette[dominentBG3][0]}, ${dominantPalette[dominentBG3][1]}, ${dominantPalette[dominentBG3][2]}, 1)`
        floatingInfoDiv.style.backgroundImage = `linear-gradient(to right,
            rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 0.75),
            rgba(${dominantPalette[dominentBG2][0]}, ${dominantPalette[dominentBG2][1]}, ${dominantPalette[dominentBG2][2]}, 0.75),
            rgba(${dominantPalette[dominentBG3][0]}, ${dominantPalette[dominentBG3][1]}, ${dominantPalette[dominentBG3][2]}, 0.75),
            rgba(${dominantPalette[dominentBG2][0]}, ${dominantPalette[dominentBG2][1]}, ${dominantPalette[dominentBG2][2]}, 0.75),
            rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 0.75)
        )`
        titleDiv.style.backgroundImage = `linear-gradient(to right,
            rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 0.75),
            rgba(${dominantPalette[dominentBG2][0]}, ${dominantPalette[dominentBG2][1]}, ${dominantPalette[dominentBG2][2]}, 0.75),
            rgba(${dominantPalette[dominentBG3][0]}, ${dominantPalette[dominentBG3][1]}, ${dominantPalette[dominentBG3][2]}, 0.75),
            rgba(${dominantPalette[dominentBG2][0]}, ${dominantPalette[dominentBG2][1]}, ${dominantPalette[dominentBG2][2]}, 0.75),
            rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 0.75)
        )`
    }
}

function adjustInfo() {
    const coverElement = document.getElementById('cover')
    if (coverWidth > coverElement.offsetWidth || coverHeight > coverElement.offsetHeight) {
        document.getElementById('floatingInfo').innerHTML = `Render at <Strong>${coverElement.offsetWidth} × ${coverElement.offsetHeight}</Strong> | Original Size <Strong>${coverWidth} × ${coverHeight}</Strong>`
    } else {
        document.getElementById('floatingInfo').innerHTML = `Render at Original Size <Strong>${coverWidth} × ${coverHeight}</Strong>`
    }
}

window.addEventListener('resize', function (event) {
    adjustInfo()
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