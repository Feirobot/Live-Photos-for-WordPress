// 检测是否微信浏览器
const isWeixin = /MicroMessenger/i.test(navigator.userAgent);

document.addEventListener('DOMContentLoaded', () => {
    // 初始化所有实况照片
    initLivePhotos();
    
    // 监听动态内容加载
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(function(mutations) {
            let shouldInit = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    shouldInit = true;
                }
            });
            
            if (shouldInit) {
                setTimeout(initLivePhotos, 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
});

function initLivePhotos() {
    document.querySelectorAll('.live-photo:not(.initialized)').forEach(livePhoto => {
        const container = livePhoto.querySelector('.container');
        const icon = livePhoto.querySelector('.icon');
        const video = container.querySelector('video');

        // 标记为已初始化
        livePhoto.classList.add('initialized');

        // 获取遮罩层和背景图元素
        const overlay = container.querySelector('.overlay');
        const photoBg = container.querySelector('.photo-bg');

        // 设置背景图并获取尺寸
        if (photoBg) {
            const photoUrl = livePhoto.getAttribute('data-photo');
            if (photoUrl) {
                photoBg.style.backgroundImage = 'url(' + photoUrl + ')';

                // 创建 Image 对象获取尺寸
                const tempImg = new Image();
                tempImg.onload = function() {
                    const aspectRatio = tempImg.naturalWidth / tempImg.naturalHeight;
                    livePhoto.style.aspectRatio = aspectRatio;
                    livePhoto.setAttribute('data-aspect-ratio', aspectRatio);
                };
                tempImg.src = photoUrl;
            }
        }

        // 设置初始静音状态
        const isMuted = livePhoto.getAttribute('data-muted') === 'true';
        video.muted = isMuted;

        // 预加载视频
        video.load();

        // fix: 鼠标进入 → 开始加载 → 鼠标离开（加载成功前） → 加载失败。
        let within = false;
        let touchStartY = 0;
        let touchStartX = 0;
        let isTouchMoved = false;
        let isScrolling = false;
        let longPressTimer = null;
        const TOUCH_THRESHOLD = 10; // 滑动阈值，超过视为滚动
        const LONG_PRESS_DURATION = 300; // 长按阈值（毫秒），超过视为长按

        const start = async (e) => {
            e.stopPropagation();
            e.preventDefault();

            within = true;

            try {
                video.currentTime = 0;
                await video.play();
                livePhoto.classList.add('zoom');
            } catch(e) {
                console.log(e);
            }
        };

        const leave = (e) => {
            livePhoto.classList.remove('zoom');

            // await play() 可能一直卡住不返回。
            // 在pause之前设置，如果await play()还没
            // 成功返回，就会进入异常处理。
            within = false;

            video.pause();
        };

        // 播放视频
        const playVideo = async () => {
            try {
                video.currentTime = 0;
                await video.play();
                livePhoto.classList.add('zoom');
            } catch(e) {
                console.log(e);
            }
        };

        // 停止播放
        const stopVideo = () => {
            livePhoto.classList.remove('zoom');
            video.pause();
        };

        // 触摸开始
        const touchStart = (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
            isTouchMoved = false;

            // 启动长按定时器
            longPressTimer = setTimeout(() => {
                if (!isTouchMoved) {
                    playVideo();
                }
            }, LONG_PRESS_DURATION);
        };

        // 触摸移动 - 检测是否滑动
        const touchMove = (e) => {
            const touchY = e.touches[0].clientY;
            const touchX = e.touches[0].clientX;
            const deltaY = Math.abs(touchY - touchStartY);
            const deltaX = Math.abs(touchX - touchStartX);

            // 如果移动超过阈值，标记为滑动并取消长按
            if (deltaY > TOUCH_THRESHOLD || deltaX > TOUCH_THRESHOLD) {
                isTouchMoved = true;
                if (longPressTimer) {
                    clearTimeout(longPressTimer);
                    longPressTimer = null;
                }

                // 如果是滑动，确保后续触摸不会触发播放
                isScrolling = true;
            }
        };

        // 触摸结束
        const touchEnd = (e) => {
            // 取消长按定时器
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }

            // 如果正在播放，停止播放
            stopVideo();
        };

        const touchCancel = () => {
            isTouchMoved = false;
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
            stopVideo();
        };

        // 桌面设备：鼠标悬停在图标上播放
        icon.addEventListener('mouseenter', start);
        icon.addEventListener('mouseleave', leave);

        // 移动设备：触摸事件处理
        // 所有浏览器都使用遮罩层处理触摸事件
        if (overlay) {
            let touchTimer = null;
            let isPlaying = false;

            overlay.addEventListener('touchstart', function(e) {
                touchTimer = setTimeout(function() {
                    isPlaying = true;
                    playVideo();
                }, 300);
            }, { passive: true });

            overlay.addEventListener('touchmove', function(e) {
                if (touchTimer) {
                    clearTimeout(touchTimer);
                    touchTimer = null;
                }
            }, { passive: true });

            overlay.addEventListener('touchend', function(e) {
                if (touchTimer) {
                    clearTimeout(touchTimer);
                    touchTimer = null;
                }
                if (isPlaying) {
                    isPlaying = false;
                    stopVideo();
                }
            }, { passive: true });

            overlay.addEventListener('touchcancel', function(e) {
                if (touchTimer) {
                    clearTimeout(touchTimer);
                    touchTimer = null;
                }
                isPlaying = false;
                stopVideo();
            }, { passive: true });
        }

        // 微信浏览器：图标轻触播放
        if (isWeixin) {
            icon.addEventListener('touchstart', function(e) {
                e.stopPropagation();
                playVideo();
            }, { passive: true });

            icon.addEventListener('touchend', function(e) {
                e.stopPropagation();
                setTimeout(stopVideo, 2000);
            }, { passive: true });
        }

        video.addEventListener('ended', () => {
            livePhoto.classList.remove('zoom');
        });
    });
}