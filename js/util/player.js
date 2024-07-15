var getDuration, duration, currentTime, percentage, playState = false, checkTextOverflow, audioMotion, motionConnected = false, pauseMotion, audioElement, isLocal = false, musicTitle, musicArtist
function initializePlayer(title, artist) {
    musicTitle = title
    musicArtist = artist
    document.getElementById('audio-section').style.height = 100 + 'px'
    $(document).ready(function () {
        audioElement = document.createElement('audio');
        audioElement.crossOrigin = 'anonymous'
        audioElement.id = 'audioElement'
        audioElement.setAttribute('src', $('.active-song').attr('data-src'));
        if (isLocal) {
            setLenLocal = setInterval(() => {
                if (!isNaN(audioElement.duration)) {
                    clearInterval(setLenLocal)
                }
                document.getElementById('length').innerText = `${(Math.floor(Math.floor(audioElement.duration) / 60))}:${(Math.floor(audioElement.duration) % 60).toString().padStart(2, '0')}`
            }, 100);
        }

        var tl = new TimelineMax();
        tl.to('.player__albumImg', 3, {
            rotation: '360deg',
            repeat: -1,
            ease: Power0.easeNone
        }, '-=0.2');
        tl.pause();

        $('.player__play').click(function () {
            if ($('.player').hasClass('play')) {
                $('.player').removeClass('play');
                clearTimeout(pauseMotion)
                audioElement.pause();
                clearTimeout(checkTextOverflow)
                document.getElementById('player__song__container').style.transitionProperty = 'padding'
                document.getElementById('player__song__container').style.transitionDuration = '1s'
                document.getElementById('player__song__container').style.transitionTimingFunction = 'ease-in-out'
                document.getElementById('player__song__container').style.paddingTop = 0 + 'px'
                if (document.getElementById('playerScrollText') != null) {
                    document.getElementById('playerScrollText').style.fontSize = 4 + 'px'
                }
                if (document.getElementById('playerScrollTextEnd') != null) {
                    document.getElementById('playerScrollTextEnd').style.fontSize = 4 + 'px'
                }
                if (document.getElementById('playerSubScrollText') != null) {
                    document.getElementById('playerSubScrollText').style.fontSize = 4 + 'px'
                }
                if (document.getElementById('playerSubScrollTextEnd') != null) {
                    document.getElementById('playerSubScrollTextEnd').style.fontSize = 4 + 'px'
                }
                pauseMotion = setTimeout(() => {
                    audioMotion.stop()
                }, 500);
                document.getElementById('space__container').style.height = 0 + 'px'
                var changeTextBack = setTimeout(() => {
                    document.getElementById('player__song__container').innerHTML = `<p id="player__song" class="player__song">${musicTitle}</p>`
                    document.getElementById('player__author__container').innerHTML = `<p id="player__author" class="player__author">${musicArtist}</p>`
                }, 1100);
                if (getDominentComplete) {
                    setTimeout(() => {
                        document.getElementById('player__bar').style.background = `rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 0.5)`
                    }, 750);
                    document.getElementById('player__timeline').style.opacity = 0
                    document.getElementById('audio-section').style.height = 100 + 'px'
                    clearInterval(getDuration)
                }
                playState = false
                tl.pause();
            } else {
                clearTimeout(changeTextBack)
                $('.player').addClass('play');
                audioElement.play();
                document.getElementById('space__container').style.height = 100 + 'px'
                if (!motionConnected) {
                    audioMotion = new AudioMotionAnalyzer(
                        document.getElementById("motion"),
                        {
                            source: audioElement,
                            height: 100,
                            mode: 4,
                            frequencyScale: "log",
                            ansiBands: false,
                            showScaleX: false,
                            bgAlpha: 0,
                            overlay: true,
                            showPeaks: false,
                            reflexRatio: 0.5,
                            reflexAlpha: 1,
                            reflexBright: 1,
                            smoothing: 0.7,
                            gradient: "rainbow",
                            mirror: 1,
                            weightingFilter: "D",
                            fftSize: 8192,
                            minFreq: 30,
                            maxFreq: 16000,
                            minDecibels: -85,
                            maxDecibels: -25,
                            linearAmplitude: true,
                            linearBoost: 1.6,
                            roundBars: true,
                            barSpace: 0.25,
                            channelLayout: 'dual-horizontal',
                            onCanvasDraw: drawCallback
                        }
                    );
                    setTimeout(() => {
                        adjustMotion()
                    }, 200);
                    motionConnected = true
                } else {
                    audioMotion.start()
                }

                if (getDominentComplete) {
                    document.getElementById('player__bar').style.background = `rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 1)`
                    document.getElementById('player__timeline').style.opacity = 1
                    document.getElementById('audio-section').style.height = 350 + 'px'
                }
                // var playhead = document.getElementById("playhead");
                var durationElement = document.getElementById("duration");
                var nowDurationElement = document.getElementById("nowDuration");
                getDuration = setInterval(function () {
                    duration = audioElement.duration;
                    currentTime = audioElement.currentTime;
                    percentage = (currentTime / duration) * 100;
                    // playhead.style.width = percentage + '%';
                    nowDurationElement.innerText = `${(Math.floor(Math.floor(currentTime) / 60))}:${(Math.floor(currentTime) % 60).toString().padStart(2, '0')}`
                }, 30);
                setLenPLayerLocal = setInterval(() => {
                    if (!isNaN(audioElement.duration)) {
                        clearInterval(setLenPLayerLocal)
                        durationElement.innerText = `${(Math.floor(Math.floor(duration) / 60))}:${(Math.floor(duration) % 60).toString().padStart(2, '0')}`
                    }
                }, 100);
                checkTextOverflow = setTimeout(() => {
                    if ($('#player__song')[0].scrollWidth > $('#player__song').innerWidth()) {
                        document.getElementById('player__song').remove()
                        $('#player__song__container').attr('style', 'font-weight: 700;');
                        document.getElementById('player__song__container').style.paddingTop = 30 + 'px'
                        document.getElementById('player__song__container').style.marginTop = 9 + 'px'
                        document.getElementById('player__song__container').innerHTML = `
                        <div class="prevent-all">
                            <div class="player-scroll-container">
                                <div class="player-scroll-text" id="playerScrollText" style="animation: playerScroll ${calculateAnimation(musicTitle, 2.8)}s linear 2s infinite; font-size: 24px;">${musicTitle}</div>
                                <div class="player-scroll-text" id="playerScrollTextEnd" style="animation: playerScroll ${calculateAnimation(musicTitle, 2.8)}s linear 2s infinite; font-size: 24px;">${musicTitle}</div>
                            </div>
                        </div>
                        `
                        const scrollText = document.getElementById('playerScrollText')
                        const scrollTextEnd = document.getElementById('playerScrollTextEnd')
                        scrollText.addEventListener('animationiteration', () => {
                            scrollText.style.animationPlayState = 'paused'
                            scrollTextEnd.style.animationPlayState = 'paused'
                            mainScroll = setTimeout(() => {
                                scrollText.style.animationPlayState = 'running'
                                scrollTextEnd.style.animationPlayState = 'running'
                            }, 2500);
                        });
                    }
                    if ($('#player__author')[0].scrollWidth > $('#player__author').innerWidth()) {
                        document.getElementById('player__author').remove()
                        document.getElementById('player__author__container').innerHTML = `
                        <div class="prevent-all">
                            <div class="player-scroll-container">
                                <div class="player-scroll-text" id="playerSubScrollText" style="animation: playerScroll ${calculateAnimation(musicArtist, 2.4)}s linear 2s infinite; font-size: 18px; opacity: 0.75;">${musicArtist}</div>
                                <div class="player-scroll-text" id="playerSubScrollTextEnd" style="animation: playerScroll ${calculateAnimation(musicArtist, 2.4)}s linear 2s infinite; font-size: 18px; opacity: 0.75;">${musicArtist}</div>
                            </div>
                        </div>
                        `
                        const subScrollText = document.getElementById('playerSubScrollText')
                        const subScrollTextEnd = document.getElementById('playerSubScrollTextEnd')
                        subScrollText.addEventListener('animationiteration', () => {
                            subScrollText.style.animationPlayState = 'paused'
                            subScrollTextEnd.style.animationPlayState = 'paused'
                            subScroll = setTimeout(() => {
                                subScrollText.style.animationPlayState = 'running'
                                subScrollTextEnd.style.animationPlayState = 'running'
                            }, 2500);
                        });
                    }
                }, 1100);
                playState = true
                tl.resume();
            }

        });


        var playhead = document.getElementById("playhead");
        audioElement.addEventListener("timeupdate", function () {
            var percentage = (this.currentTime / this.duration) * 100;
            playhead.style.width = percentage + '%';
            if (percentage == 100) {
                $('.player__play').click()
            }

        });

        function updateInfo() {
            $('.player__song').text($('.active-song').attr('data-song'));
            $('.player__author').text($('.active-song').attr('data-author'));
        }
        updateInfo();

        $('.player__next').click(function () {
            if ($('.player .player__albumImg.active-song').is(':last-child')) {
                $('.player__albumImg.active-song').removeClass('active-song');
                $('.player .player__albumImg:first-child').addClass('active-song');
                audioElement.addEventListener("timeupdate", function () {
                    var duration = this.duration;
                    var currentTime = this.currentTime;
                    var percentage = (currentTime / duration) * 100;
                    playhead.style.width = percentage * 4 + 'px';
                });
            } else {
                $('.player__albumImg.active-song').removeClass('active-song').next().addClass('active-song');
                audioElement.addEventListener("timeupdate", function () {
                    var duration = this.duration;
                    var currentTime = this.currentTime;
                    var percentage = (currentTime / duration) * 100;
                    playhead.style.width = percentage + '%';
                });
            }
            updateInfo();
            audioElement.setAttribute('src', $('.active-song').attr('data-src'));
            audioElement.play();
        });

        $('.player__prev').click(function () {
            if (!playState) {
                $('.player__play').click()
            }
            if ($('.player .player__albumImg.active-song').is(':first-child')) {
                $('.player__albumImg.active-song').removeClass('active-song');
                $('.player .player__albumImg:last-child').addClass('active-song');
                // audioElement.addEventListener("timeupdate", function () {
                // var duration = this.duration;
                // var currentTime = this.currentTime;
                // var percentage = (currentTime / duration) * 100;
                // playhead.style.width = percentage * 4 + 'px';
                // });
            } else {
                $('.player__albumImg.active-song').removeClass('active-song').prev().addClass('active-song');
                // audioElement.addEventListener("timeupdate", function () {
                //     var duration = this.duration;
                //     var currentTime = this.currentTime;
                //     var percentage = (currentTime / duration) * 100;
                //     playhead.style.width = percentage + 'px';
                // });
            }
            updateInfo();
            audioElement.setAttribute('src', $('.active-song').attr('data-src'));
            audioElement.play();
        });

    });
    playerInitialize = true
}

function drawCallback(instance, info) {
    const baseSize = (instance.isFullscreen ? 40 : 20) * instance.pixelRatio,
        canvas = instance.canvas,
        centerX = canvas.width / 2,
        centerY = canvas.height / 2,
        ctx = instance.canvasCtx;
    // maxHeight = centerY / 2,
    // maxWidth = centerX - baseSize * 5,
    // time = info.timestamp / 1e4;

    // the energy value is used here to increase the font size and make the logo pulsate to the beat
    // console.log(instance.getEnergy())
    // document.getElementById('albumImage').style.scale = `${ baseSize + instance.getEnergy() * 1 * instance.pixelRatio }`;

    document.getElementById('player__album__container').style.scale = `${1 + instance.getEnergy('bass') * 0.7}`;
    document.getElementById('particle0').style.scale = `${1 + instance.getEnergy(30, 52)}`;
    document.getElementById('particle1').style.scale = `${1 + instance.getEnergy(52, 74)}`;
    document.getElementById('particle2').style.scale = `${1 + instance.getEnergy(74, 96)}`;
    document.getElementById('particle3').style.scale = `${1 + instance.getEnergy(96, 118)}`;
    document.getElementById('particle4').style.scale = `${1 + instance.getEnergy(118, 140)}`;
    document.getElementById('particle5').style.scale = `${1 + instance.getEnergy(140, 162)}`;
    document.getElementById('particle6').style.scale = `${1 + instance.getEnergy(162, 184) * 1.3}`;
    document.getElementById('particle7').style.scale = `${1 + instance.getEnergy(184, 206) * 1.6}`;
    document.getElementById('particle8').style.scale = `${1 + instance.getEnergy(206, 228) * 1.9}`;
    document.getElementById('particle9').style.scale = `${1 + instance.getEnergy(228, 250) * 2.2}`;

    document.getElementById('particle0').style.opacity = `${0.3 + instance.getEnergy(30, 52) * 1.5}`;
    document.getElementById('particle1').style.opacity = `${0.3 + instance.getEnergy(52, 74) * 1.5}`;
    document.getElementById('particle2').style.opacity = `${0.3 + instance.getEnergy(74, 96) * 1.5}`;
    document.getElementById('particle3').style.opacity = `${0.3 + instance.getEnergy(96, 118) * 1.5}`;
    document.getElementById('particle4').style.opacity = `${0.3 + instance.getEnergy(118, 140) * 1.5}`;
    document.getElementById('particle5').style.opacity = `${0.3 + instance.getEnergy(140, 162) * 1.5}`;
    document.getElementById('particle6').style.opacity = `${0.3 + instance.getEnergy(162, 184) * 1.8}`;
    document.getElementById('particle7').style.opacity = `${0.3 + instance.getEnergy(184, 206) * 2.1}`;
    document.getElementById('particle8').style.opacity = `${0.3 + instance.getEnergy(206, 228) * 2.4}`;
    document.getElementById('particle9').style.opacity = `${0.3 + instance.getEnergy(228, 250) * 2.7}`;
}

function adjustPlayerText() {
    clearTimeout(checkTextOverflow)
    document.getElementById('player__song__container').style.paddingTop = 0 + 'px'
    document.getElementById('player__song__container').innerHTML = `<p id="player__song" class="player__song animate__animated animate__zoomIn">${musicTitle}</p>`
    document.getElementById('player__author__container').innerHTML = `<p id="player__author" class="player__author animate__animated animate__fadeInDown">${musicArtist}</p>`
    if ($('#player__song')[0].scrollWidth > $('#player__song').innerWidth()) {
        document.getElementById('player__song').remove()
        $('#player__song__container').attr('style', 'font-weight: 700;');
        document.getElementById('player__song__container').style.paddingTop = 30 + 'px'
        document.getElementById('player__song__container').style.marginTop = 9 + 'px'
        document.getElementById('player__song__container').innerHTML = `
            <div class="prevent-all animate__animated animate__zoomIn">
                <div class="player-scroll-container">
                    <div class="player-scroll-text" id="playerScrollText" style="animation: playerScroll ${calculateAnimation(musicTitle, 2.8)}s linear 2s infinite; font-size: 24px;">${musicTitle}</div>
                    <div class="player-scroll-text" id="playerScrollTextEnd" style="animation: playerScroll ${calculateAnimation(musicTitle, 2.8)}s linear 2s infinite; font-size: 24px;">${musicTitle}</div>
                </div>
            </div>
            `
        const scrollText = document.getElementById('playerScrollText')
        const scrollTextEnd = document.getElementById('playerScrollTextEnd')
        scrollText.addEventListener('animationiteration', () => {
            scrollText.style.animationPlayState = 'paused'
            scrollTextEnd.style.animationPlayState = 'paused'
            mainScroll = setTimeout(() => {
                scrollText.style.animationPlayState = 'running'
                scrollTextEnd.style.animationPlayState = 'running'
            }, 2500);
        });
    }
    if ($('#player__author')[0].scrollWidth > $('#player__author').innerWidth()) {
        document.getElementById('player__author').remove()
        document.getElementById('player__author__container').innerHTML = `
            <div class="prevent-all animate__animated animate__fadeInDown">
                <div class="player-scroll-container">
                    <div class="player-scroll-text" id="playerSubScrollText" style="animation: playerScroll ${calculateAnimation(musicArtist, 2.4)}s linear 2s infinite; font-size: 18px; opacity: 0.75;">${musicArtist}</div>
                    <div class="player-scroll-text" id="playerSubScrollTextEnd" style="animation: playerScroll ${calculateAnimation(musicArtist, 2.4)}s linear 2s infinite; font-size: 18px; opacity: 0.75;">${musicArtist}</div>
                </div>
            </div>
            `
        const subScrollText = document.getElementById('playerSubScrollText')
        const subScrollTextEnd = document.getElementById('playerSubScrollTextEnd')
        subScrollText.addEventListener('animationiteration', () => {
            subScrollText.style.animationPlayState = 'paused'
            subScrollTextEnd.style.animationPlayState = 'paused'
            subScroll = setTimeout(() => {
                subScrollText.style.animationPlayState = 'running'
                subScrollTextEnd.style.animationPlayState = 'running'
            }, 2500);
        });
    }
}