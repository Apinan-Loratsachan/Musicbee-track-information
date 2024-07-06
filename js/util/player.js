var getDuration, duration, currentTime, percentage, playState = false, checkTextOverflow
function initializePlayer() {
    document.getElementById('audio-section').style.height = 100 + 'px'
    $(document).ready(function () {
        var audioElement = document.createElement('audio');
        audioElement.setAttribute('src', $('.active-song').attr('data-src'));

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
                var changeTextBack = setTimeout(() => {
                    document.getElementById('player__song__container').innerHTML = `<p id="player__song" class="player__song">${spotifyTitle}</p>`
                    document.getElementById('player__author__container').innerHTML = `<p id="player__author" class="player__author">${spotifyArtistsArrey}</p>`
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
                if (getDominentComplete) {
                    document.getElementById('player__bar').style.background = `rgba(${dominantPalette[dominentBG1][0]}, ${dominantPalette[dominentBG1][1]}, ${dominantPalette[dominentBG1][2]}, 1)`
                    document.getElementById('player__timeline').style.opacity = 1
                    document.getElementById('audio-section').style.height = 270 + 'px'
                }
                // var playhead = document.getElementById("playhead");
                var durationElement = document.getElementById("duration");
                var nowDurationElement = document.getElementById("nowDuration");
                getDuration = setInterval(function () {
                    duration = audioElement.duration;
                    currentTime = audioElement.currentTime;
                    percentage = (currentTime / duration) * 100;
                    // playhead.style.width = percentage + '%';
                    durationElement.innerText = '0:' + Math.floor(duration)
                    nowDurationElement.innerText = '0:' + Math.floor(currentTime).toString().padStart(2, '0')
                }, 30);
                checkTextOverflow = setTimeout(() => {
                    if ($('#player__song')[0].scrollWidth > $('#player__song').innerWidth()) {
                        document.getElementById('player__song').remove()
                        $('#player__song__container').attr('style', 'font-weight: 700;');
                        document.getElementById('player__song__container').style.paddingTop = 30 + 'px'
                        document.getElementById('player__song__container').style.marginTop = 9 + 'px'
                        document.getElementById('player__song__container').innerHTML = `
                        <div class="prevent-all">
                            <div class="player-scroll-container">
                                <div class="player-scroll-text" id="playerScrollText" style="animation: playerScroll ${calculateAnimation(spotifyTitle, 2.8)}s linear 2s infinite; font-size: 24px;">${spotifyTitle}</div>
                                <div class="player-scroll-text" id="playerScrollTextEnd" style="animation: playerScroll ${calculateAnimation(spotifyTitle, 2.8)}s linear 2s infinite; font-size: 24px;">${spotifyTitle}</div>
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
                                <div class="player-scroll-text" id="playerSubScrollText" style="animation: playerScroll ${calculateAnimation(spotifyArtistsArrey, 2.4)}s linear 2s infinite; font-size: 18px; opacity: 0.75;">${spotifyArtistsArrey}</div>
                                <div class="player-scroll-text" id="playerSubScrollTextEnd" style="animation: playerScroll ${calculateAnimation(spotifyArtistsArrey, 2.4)}s linear 2s infinite; font-size: 18px; opacity: 0.75;">${spotifyArtistsArrey}</div>
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
                audioElement.addEventListener("timeupdate", function () {
                    var duration = this.duration;
                    var currentTime = this.currentTime;
                    var percentage = (currentTime / duration) * 100;
                    playhead.style.width = percentage * 4 + 'px';
                });
            } else {
                $('.player__albumImg.active-song').removeClass('active-song').prev().addClass('active-song');
                audioElement.addEventListener("timeupdate", function () {
                    var duration = this.duration;
                    var currentTime = this.currentTime;
                    var percentage = (currentTime / duration) * 100;
                    playhead.style.width = percentage + 'px';
                });
            }
            updateInfo();
            audioElement.setAttribute('src', $('.active-song').attr('data-src'));
            audioElement.play();
        });

    });
    playerInitialize = true
}

function adjustPlayerText() {
    clearTimeout(checkTextOverflow)
    document.getElementById('player__song__container').style.paddingTop = 0 + 'px'
    document.getElementById('player__song__container').innerHTML = `<p id="player__song" class="player__song animate__animated animate__zoomIn">${spotifyTitle}</p>`
    document.getElementById('player__author__container').innerHTML = `<p id="player__author" class="player__author animate__animated animate__fadeInDown">${spotifyArtistsArrey}</p>`
    if ($('#player__song')[0].scrollWidth > $('#player__song').innerWidth()) {
        document.getElementById('player__song').remove()
        $('#player__song__container').attr('style', 'font-weight: 700;');
        document.getElementById('player__song__container').style.paddingTop = 30 + 'px'
        document.getElementById('player__song__container').style.marginTop = 9 + 'px'
        document.getElementById('player__song__container').innerHTML = `
            <div class="prevent-all animate__animated animate__zoomIn">
                <div class="player-scroll-container">
                    <div class="player-scroll-text" id="playerScrollText" style="animation: playerScroll ${calculateAnimation(spotifyTitle, 2.8)}s linear 2s infinite; font-size: 24px;">${spotifyTitle}</div>
                    <div class="player-scroll-text" id="playerScrollTextEnd" style="animation: playerScroll ${calculateAnimation(spotifyTitle, 2.8)}s linear 2s infinite; font-size: 24px;">${spotifyTitle}</div>
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
                    <div class="player-scroll-text" id="playerSubScrollText" style="animation: playerScroll ${calculateAnimation(spotifyArtistsArrey, 2.4)}s linear 2s infinite; font-size: 18px; opacity: 0.75;">${spotifyArtistsArrey}</div>
                    <div class="player-scroll-text" id="playerSubScrollTextEnd" style="animation: playerScroll ${calculateAnimation(spotifyArtistsArrey, 2.4)}s linear 2s infinite; font-size: 18px; opacity: 0.75;">${spotifyArtistsArrey}</div>
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