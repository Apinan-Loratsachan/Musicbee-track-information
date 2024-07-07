var gitHost, whiteContrastTrusthold = 0, whiteContrast, rawWhiteContrast, hsv, imgData, file, fileType, resizeTimeout

const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

const inputElement = document.getElementById("inputAudio");
inputElement.addEventListener('change', function (event) {
    try {
        file = event.target.files[0];
        fileType = (event.target.files[0].type);
        console.log(fileType)
    } catch (error) {
        console.log('No file select')
    }

    if (file) {
        isLocal = true
        try {
            audioMotion.destroy()
            motionConnected = false
        } catch (error) {
            console.log('No motion connected')
        }
        // Create a URL for the selected file
        const audioURL = URL.createObjectURL(file);

        jsmediatags.read(file, {
            onSuccess: async function (result) {
                console.log(result);
                try {
                    const data = result.tags.picture.data;
                    const format = result.tags.picture.format;
                    let base64String = "";
                    for (i = 0; i < data.length; i++) {
                        base64String += String.fromCharCode(data[i]);
                    }
                    imgData = `data:${format};base64,${window.btoa(base64String)}`

                    const contentType = format;
                    const b64Data = window.btoa(base64String);

                    const blob = b64toBlob(b64Data, contentType);
                    imgData = URL.createObjectURL(blob);
                } catch (error) {
                    console.log('No picture in metadata')
                    imgData = 'assets/icon/logo_rounded.png'
                }

                document.getElementById('audio-section').innerHTML = `
                    <div class="player animate__animated animate__zoomIn prevent-select">
                            <div id="player__bar" class="player__bar">
                                <div id="player__album__container" class="player__album">
                                    <div id="player__albumImg" class="player__albumImg active-song" data-author="${result.tags.artist}" data-song="${result.tags.title}" data
                                        data-src="${audioURL}"
                                        style="background-image: url(${imgData})">
                                    </div>
                                </div>
                                <div id="player__title" class="d-flex align-items-center justify-content-center">
                                    Player
                                </div>
                                <div class="player__controls">
                                    <div class="player__prev">
                                        <svg id="iconPrev" class="icon">
                                            <use xlink:href="assets/player/sprite.svg#arrow"></use>
                                        </svg>
                                    </div>
                                    <div class="player__play">
                                        <svg id="iconPlay" class="icon play">
                                            <use xlink:href="assets/player/sprite.svg#play"></use>
                                        </svg>
                                        <svg id="iconPause" class="icon pause">
                                            <use xlink:href="assets/player/sprite.svg#pause"></use>
                                        </svg>
                                    </div>
                                    <!--
                                    <div class="player__next">
                                        <svg class="icon">
                                            <use xlink:href="assets/player/sprite.svg#arrow"></use>
                                        </svg>
                                    </div>
                                    -->
                                </div>
                            </div>
                            <div id="player__timeline" class="player__timeline" style="opacity: 0">
                                <div id="motion"></div>
                                <div id="player__song__container" style="font-weight: 700;">
                                    <p id="player__song" class="player__song"></p>
                                </div>
                                <div id="player__author__container">
                                    <p id="player__author" class="player__author"></p>
                                </div>
                                <div id="space__container" style="height: 0px;"></div>
                                <div id="playhead__container" class="player__timelineBar mt-3 pb-2">
                                    <div id="playhead"></div>
                                </div>
                                <div class="d-flex justify-content-between pt-1">
                                    <div id="nowDuration">0.00</div>
                                    <div id="duration">0.00</div>
                                </div>
                            </div>
                        </div>
                    </div>`
                adjustPlayerTitle()
                initializePlayer(result.tags.title, result.tags.artist)
                document.getElementById('area').style.opacity = 1
                document.getElementById("title").innerText = result.tags.title || 'Unknown'
                document.getElementById("artist").innerText = result.tags.artist || 'Unknown'
                document.getElementById("album").innerText = result.tags.album || 'Unknown'
                try {
                    document.getElementById("albumArtist").innerText = result.tags.TPE2.data || 'Unknown'
                } catch (error) {
                    document.getElementById("albumArtist").innerText = 'Unknown'
                }
                try {
                    document.getElementById("disc").innerText = result.tags.TPOS.data || 'Unknown'
                } catch (error) {
                    document.getElementById("disc").innerText = 'Unknown'
                }
                document.getElementById("track").innerText = result.tags.track || 'Unknown'
                document.getElementById("genre").innerText = result.tags.genre || 'Unknown'
                try {
                    document.getElementById("year").innerText = result.tags.year || 'Unknown'
                } catch (error) {
                    document.getElementById("year").innerText = 'Unknown'
                }
                try {
                    document.getElementById("language").innerText = result.tags.TLAN.data || 'Unknown'
                } catch (error) {
                    document.getElementById("language").innerText = 'Unknown'
                }
                document.getElementById("type").innerText = fileType
                document.getElementById("metatype").innerText = result.type || 'Unknown'

                document.getElementById("title").href = `https://www.google.com/search?q=${document.getElementById("title").innerText}`;
                document.getElementById("artist").href = `https://www.google.com/search?q=${document.getElementById("artist").innerText + " artist / singer"}`;
                document.getElementById("album").href = `https://www.google.com/search?q=${document.getElementById("album").innerText + " album"}`;
                document.getElementById("albumArtist").href = `https://www.google.com/search?q=${document.getElementById("albumArtist").innerText + " artist / singer"}`;

                showCoverImage(imgData, result)
            },
            onError: function (error) {
                console.log(':(', error.type, error.info);
            }
        });
    }
});

window.addEventListener('resize', function (event) {
    adjustSearchBtn()
    changeImageGradient()
    adjustMotion()
    adjustPlayerTitle()
    // trigger on resize end
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(function () {
        if (playerInitialize) {
            adjustPlayerText()
        }
    }, 200);
}, true);

function adjustSearchBtn() {
    const mainDiv = document.getElementById('button-group')
    const buttonGroup1 = document.getElementById('button-group-1')
    const buttonGroup2 = document.getElementById('button-group-2')
    const googleBtnDiv = document.getElementById('btnGoogleSearch')
    const youtubeBtnDiv = document.getElementById('btnYoutubeSearch')
    const spotifyBtnDiv = document.getElementById('btnSpotifySearch')
    const appleMusicBtnDiv = document.getElementById('btnAppleMusicSearch')
    if (this.window.innerWidth < 535) {
        mainDiv.classList = 'd-flex align-items-center justify-content-center justify-content-sm-between flex-md-row flex-column'
        buttonGroup1.classList.remove('col-6')
        buttonGroup1.classList.add('col-12')
        buttonGroup2.classList.remove('col-6')
        buttonGroup2.classList.add('col-12')
        buttonGroup2.classList.add('mt-3')
        googleBtnDiv.classList.add('expand-button')
        youtubeBtnDiv.classList.add('expand-button')
        spotifyBtnDiv.classList.add('expand-button')
        appleMusicBtnDiv.classList.add('expand-button')
    } else {
        buttonGroup1.classList.remove('col-12')
        buttonGroup1.classList.add('col-6')
        buttonGroup2.classList.remove('col-12')
        buttonGroup2.classList.remove('mt-3')
        buttonGroup2.classList.add('col-6')
        mainDiv.classList = 'row'
        googleBtnDiv.classList.remove('expand-button')
        youtubeBtnDiv.classList.remove('expand-button')
        spotifyBtnDiv.classList.remove('expand-button')
        appleMusicBtnDiv.classList.remove('expand-button')
    }
}

function setCoverToBG(url) {
    var link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = url;
    document.getElementById('blur').style.opacity = 1
    setTimeout(() => {
        document.body.style.backgroundImage = `url('${url}')`;
        document.body.style.backgroundSize = 'cover';
    }, 250);
}

document.addEventListener('DOMContentLoaded', (event) => {
    const particles = document.querySelectorAll('.particles li');
    particles.forEach(particle => {
        const initRandomSize = getRandomInt(20, 150);
        particle.style.left = `${getRandomInt(0, 100)}%`;
        particle.style.borderRadius = getRandomInt(0, 70) + '%'
        particle.style.width = initRandomSize + 'px'
        particle.style.height = initRandomSize + 'px'
        particle.style.background = `rgba(${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, 0.5)`
    });

    particles.forEach(particle => {
        particle.addEventListener('animationiteration', () => {
            const randomSize = getRandomInt(20, 150);
            particle.style.left = `${getRandomInt(0, 100)}%`;
            particle.style.borderRadius = getRandomInt(0, 70) + '%'
            particle.style.width = randomSize + 'px'
            particle.style.height = randomSize + 'px'
            particle.style.background = `rgba(${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, 0.5)`
        });
    });
});

function adjustPlayerTitle() {
    if (window.innerWidth > 570) {
        $('#player__title').attr('style', 'font-weight: 700; font-size: 20px;');
    } else {
        $('#player__title').attr('style', 'font-weight: 700; padding-left: 20px');
    }
}

function adjustMotion() {
    if (motionConnected) {
        if (window.innerWidth > 700) {
            audioMotion.setOptions({
                mode: 4,
            })
        } else if (window.innerWidth > 600) {
            audioMotion.setOptions({
                mode: 5,
            })
        } else if (window.innerWidth > 500) {
            audioMotion.setOptions({
                mode: 6,
            })
        } else {
            audioMotion.setOptions({
                mode: 7,
            })
        }
    }
}

function showCoverImage(image, result) {
    Image.prototype.load = function (url) {
        var thisImg = this;
        var xmlHTTP = new XMLHttpRequest();
        xmlHTTP.open('GET', url, true);
        xmlHTTP.responseType = 'arraybuffer';
        xmlHTTP.onload = function (e) {
            var blob = new Blob([this.response]);
            thisImg.src = window.URL.createObjectURL(blob);
        };
        xmlHTTP.onprogress = function (e) {
            thisImg.completedPercentage = parseInt((e.loaded / e.total) * 100);
            $(document).ready(function () {
                $(".now-precess").html("Getting album cover " + thisImg.completedPercentage + '%');
            });
            if (thisImg.completedPercentage == 100) {
                coverElement.onload = async function () {
                    await getDominentColor(coverElement)
                    changeInfoContainerColor()
                    document.getElementById("inputContainer").classList.add('pb-3');
                    document.getElementById("imageSection").className = 'imageCenter';
                    document.getElementById("imageSection").innerText = ''
                    document.getElementById("imageSection").appendChild(linkElement);
                    document.getElementById("albumImageLink").appendChild(coverElement);
                    setCoverToBG(image)
                }
            }
        };
        xmlHTTP.onloadstart = function () {
            thisImg.completedPercentage = 0;
        };
        xmlHTTP.send();
    };

    const linkElement = document.createElement("a");
    linkElement.id = 'albumImageLink';
    if (gitHost) {
        linkElement.href = `cover?title=${encodeURIComponent(result.tags.title)}&artist=${encodeURIComponent(result.tags.artist ?? 'Unknown artist')}&album=${encodeURIComponent(result.tags.album)}&cover=${encodeURIComponent(image)}&local=true`
    } else {
        linkElement.href = `cover.html?title=${encodeURIComponent(result.tags.title)}&artist=${encodeURIComponent(result.tags.artist ?? 'Unknown artist')}&album=${encodeURIComponent(result.tags.album)}&cover=${encodeURIComponent(image)}&local=true`
    }
    linkElement.setAttribute('target', '_blank')
    const coverElement = new Image();
    coverElement.src = image;
    coverElement.alt = "Album Cover";
    coverElement.className = "rounded-corner album-image animate__animated animate__jackInTheBox prevent-select";
    coverElement.id = 'albumImage';
    coverElement.style.opacity = 0;

    coverElement.load(image)
}

function changeImageGradient() {
    if (getDominentComplete) {
        if (this.window.innerWidth < 500) {
            document.getElementById("musicInfoDominent").style.backgroundImage = `linear-gradient(to bottom,
            rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 0.5),
            rgba(${dominantPalette[dominentBG2][0]}, ${dominantPalette[dominentBG2][1]}, ${dominantPalette[dominentBG2][2]}, 0.5),
            rgba(255, 255, 255, 0.45),
            rgba(255, 255, 255, 0.45),
            rgba(255, 255, 255, 0.45),
            rgba(255, 255, 255, 0.45)
            )`
        } else if (this.window.innerWidth < 600) {
            document.getElementById("musicInfoDominent").style.backgroundImage = `linear-gradient(to bottom,
            rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 0.5),
            rgba(${dominantPalette[dominentBG2][0]}, ${dominantPalette[dominentBG2][1]}, ${dominantPalette[dominentBG2][2]}, 0.5),
            rgba(255, 255, 255, 0.45),
            rgba(255, 255, 255, 0.45),
            rgba(255, 255, 255, 0.45)
            )`
        } else if (this.window.innerWidth < 725) {
            document.getElementById("musicInfoDominent").style.backgroundImage = `linear-gradient(to bottom,
            rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 0.5),
            rgba(${dominantPalette[dominentBG2][0]}, ${dominantPalette[dominentBG2][1]}, ${dominantPalette[dominentBG2][2]}, 0.5),
            rgba(${dominantPalette[dominentBG2][0]}, ${dominantPalette[dominentBG2][1]}, ${dominantPalette[dominentBG2][2]}, 0.5),
            rgba(255, 255, 255, 0.45),
            rgba(255, 255, 255, 0.45),
            rgba(255, 255, 255, 0.45),
            rgba(255, 255, 255, 0.45)
            )`
        } else {
            document.getElementById("musicInfoDominent").style.backgroundImage = `linear-gradient(to bottom,
            rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 0.5),
            rgba(${dominantPalette[dominentBG2][0]}, ${dominantPalette[dominentBG2][1]}, ${dominantPalette[dominentBG2][2]}, 0.5),
            rgba(${dominantPalette[dominentBG2][0]}, ${dominantPalette[dominentBG2][1]}, ${dominantPalette[dominentBG2][2]}, 0.5),
            rgba(255, 255, 255, 0.45),
            rgba(255, 255, 255, 0.45),
            rgba(255, 255, 255, 0.45)
            )`
        }
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    const particles = document.querySelectorAll('.particles li');

    particles.forEach(particle => {
        particle.addEventListener('animationiteration', () => {
            if (getDominentComplete) {
                const randomColor = getRandomInt(0, 9);
                const randomSize = getRandomInt(20, 150);
                particle.style.backgroundColor = `rgba(${dominantPalette[randomColor][0]}, ${dominantPalette[randomColor][1]}, ${dominantPalette[randomColor][2]}, 1)`
                particle.style.left = `${getRandomInt(0, 100)}%`;
                particle.style.borderRadius = getRandomInt(0, 70) + '%'
                particle.style.width = randomSize + 'px'
                particle.style.height = randomSize + 'px'
            }
        });
    });
});

async function changeInfoContainerColor() {
    paletteWithHSV = [
        { rgb: dominantPalette[dominentBG1], hsv: rgb2hsv(dominantPalette[dominentBG1][0], dominantPalette[dominentBG1][1], dominantPalette[dominentBG1][2]), palette: 0 },
        { rgb: dominantPalette[dominentBG2], hsv: rgb2hsv(dominantPalette[dominentBG2][0], dominantPalette[dominentBG2][1], dominantPalette[dominentBG2][2]), palette: 1 },
        { rgb: dominantPalette[dominentBG3], hsv: rgb2hsv(dominantPalette[dominentBG3][0], dominantPalette[dominentBG3][1], dominantPalette[dominentBG3][2]), palette: 2 },
        { rgb: dominantPalette[dominentBG4], hsv: rgb2hsv(dominantPalette[dominentBG4][0], dominantPalette[dominentBG4][1], dominantPalette[dominentBG4][2]), palette: 3 },
        { rgb: dominantPalette[dominentBG5], hsv: rgb2hsv(dominantPalette[dominentBG5][0], dominantPalette[dominentBG5][1], dominantPalette[dominentBG5][2]), palette: 4 }
    ];
    paletteWithHSV.sort((b, a) => a.hsv.v - b.hsv.v);

    document.getElementById('area').style.backgroundImage = `linear-gradient(to bottom,
    rgba(${paletteWithHSV[0].rgb[0]}, ${paletteWithHSV[0].rgb[1]}, ${paletteWithHSV[0].rgb[2]}, 0.5),
    rgba(${paletteWithHSV[1].rgb[0]}, ${paletteWithHSV[1].rgb[1]}, ${paletteWithHSV[1].rgb[2]}, 0.5),
    rgba(${paletteWithHSV[2].rgb[0]}, ${paletteWithHSV[2].rgb[1]}, ${paletteWithHSV[2].rgb[2]}, 0.5),
    rgba(${paletteWithHSV[3].rgb[0]}, ${paletteWithHSV[3].rgb[1]}, ${paletteWithHSV[3].rgb[2]}, 0.5),
    rgba(${paletteWithHSV[4].rgb[0]}, ${paletteWithHSV[4].rgb[1]}, ${paletteWithHSV[4].rgb[2]}, 0.5)
    )`

    for (i = 0; i < 10; i++) {
        const randomSize = getRandomInt(20, 150);
        document.getElementById(`particle${i}`).style.backgroundColor = `rgba(${dominantPalette[i][0]}, ${dominantPalette[i][1]}, ${dominantPalette[i][2]}, 1)`
        document.getElementById(`particle${i}`).style.borderRadius = getRandomInt(0, 70) + '%'
        document.getElementById(`particle${i}`).style.left = `${getRandomInt(0, 100)}%`;
        document.getElementById(`particle${i}`).style.width = randomSize + 'px'
        document.getElementById(`particle${i}`).style.height = randomSize + 'px'
    }

    document.getElementById('area').style.opacity = 1

    changeImageGradient()

    document.getElementById("musicInfoDefault").style.opacity = 0
    document.getElementById("musicInfoDominent").style.opacity = 1

    rawWhiteContrast = contrast([255, 255, 255], dominantPalette[dominentBG1])
    whiteContrast = rawWhiteContrast + whiteContrastTrusthold
    blackContrast = contrast([0, 0, 0], dominantPalette[dominentBG1])
    hsv = rgb2hsv(dominantPalette[dominentBG1][0], dominantPalette[dominentBG1][1], dominantPalette[dominentBG1][2])
    if (hsv.v < 50 || whiteContrast >= blackContrast) {
        document.getElementById("audio-section").style.color = 'rgb(255, 255, 255)'
        document.getElementById("header").style.color = 'rgb(255, 255, 255)'
        let changeTone = setInterval(() => {
            console.log(1)
            if (playerInitialize) {
                clearInterval(changeTone)
                document.getElementById('playhead').style.background = `rgba(255, 255, 255, 0.75)`
                document.getElementById('playhead__container').style.background = `rgba(255, 255, 255, 0.35)`
                document.getElementById('iconPrev').style.fill = 'rgb(255, 255, 255)'
                document.getElementById('iconPlay').style.fill = 'rgb(255, 255, 255)'
                document.getElementById('iconPause').style.fill = 'rgb(255, 255, 255)'
                var checkMotionConnected = setInterval(() => {
                    if (motionConnected) {
                        clearInterval(checkMotionConnected)
                        audioMotion.registerGradient('white', {
                            bgColor: '#000000',
                            dir: 'h',
                            colorStops: [
                                `rgba(255, 255, 255, 0.75)`
                            ]
                        });
                        audioMotion.setOptions({
                            gradient: "white",
                        })
                    }
                }, 100);
            }
        })
    } else {
        document.getElementById("audio-section").style.color = 'rgb(0, 0, 0)'
        document.getElementById("header").style.color = 'rgb(0, 0, 0)'
        let changeTone = setInterval(() => {
            if (playerInitialize) {
                clearTimeout(changeTone)
                var checkMotionConnected = setInterval(() => {
                    if (motionConnected) {
                        clearInterval(checkMotionConnected)
                        audioMotion.registerGradient('black', {
                            bgColor: '#000000',
                            dir: 'h',
                            colorStops: [
                                `rgba(0, 0, 0, 0.75)`
                            ]
                        });
                        audioMotion.setOptions({
                            gradient: "black",
                        })
                    }
                }, 100);
            }
        }, 100);
    }
    let changeTone2 = setInterval(() => {
        if (playerInitialize) {
            clearInterval(changeTone2)
            document.getElementById('player__bar').style.background = `rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 0.5)`
            document.getElementById('player__timeline').style.background = `rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 0.5)`

            const style = document.createElement('style');

            // Function to change the background color of the pseudo-element
            style.innerHTML = `.player__album:before {background: rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 1);}`;

            document.head.appendChild(style);
        }
    })
}

function searchYoutube() {
    window.open(`https://www.youtube.com/results?search_query=${document.getElementById("title").innerText} - ${document.getElementById("artist").innerText}`, "_blank");
}

function searchSpotify() {
    window.open(`https://open.spotify.com/search/${document.getElementById("title").innerText} ${document.getElementById("artist").innerText}/tracks`, "_blank");
}

function searchAppleMusic() {
    window.open(`https://music.apple.com/us/search?term=${document.getElementById("title").innerText} - ${document.getElementById("artist").innerText}`, "_blank");
}

function searchTrackCover() {
    window.open(`https://www.google.com/search?q=${document.getElementById("title").innerText} - ${document.getElementById("artist").innerText} album cover&tbm=isch`, "_blank");
}

function searchAlbumCover() {
    window.open(`https://www.google.com/search?q=${document.getElementById("album").innerText} - ${document.getElementById("albumArtist").innerText} album cover&tbm=isch`, "_blank");
}

function searchAlbum() {
    window.open(`https://www.google.com/search?q=music album ${document.getElementById("album").innerText}  - ${document.getElementById("albumArtist").innerText}`, "_blank");
}

function searchLyrics() {
    window.open(`https://www.google.com/search?q=lyrics ${document.getElementById("title").innerText} - ${document.getElementById("artist").innerText}`, "_blank");
}

function powerSearchGoogle() {
    window.open(`https://www.google.com/search?q=${document.getElementById("title").innerText} by ${document.getElementById("artist").innerText} album ${document.getElementById("album").innerText} by ${document.getElementById("albumArtist").innerText}`, "_blank");
}