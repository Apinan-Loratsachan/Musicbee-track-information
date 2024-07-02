function initializePlayer() {
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
                TweenMax.to('.player__albumImg', 0.2, {
                    scale: 1,
                    ease: Power0.easeNone
                })
                document.getElementById('audioDominent').style.opacity = 1
                document.getElementById('previewTitleDiv').style.opacity = 1
                document.getElementById('previewHeaderTextContainer').style.opacity = 1
                // document.getElementById('info-section').style.marginTop = 30 + 'px'
                tl.pause();
            } else {
                $('.player').addClass('play');
                audioElement.play();
                TweenMax.to('.player__albumImg', 0.2, {
                    scale: 1.3,
                    ease: Power0.easeNone
                })
                document.getElementById('audioDominent').style.opacity = 0
                document.getElementById('previewTitleDiv').style.opacity = 0
                document.getElementById('previewHeaderTextContainer').style.opacity = 0
                // document.getElementById('info-section').style.marginTop = 100 + 'px'
                tl.resume();
            }

        });


        var playhead = document.getElementById("playhead");
        audioElement.addEventListener("timeupdate", function () {
            var duration = this.duration;
            var currentTime = this.currentTime;
            var percentage = (currentTime / duration) * 100;
            // playhead.style.width = percentage * 4 + 'px';
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