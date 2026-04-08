// 全局函数，用于图片加载后初始化比例
window.livePhotosInit = function(img) {
    const container = img.closest('.live-photo');
    if (!container) return;
    
    // 获取图片自然尺寸
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    
    if (naturalWidth > 0 && naturalHeight > 0) {
        // 计算并设置比例
        const aspectRatio = naturalWidth / naturalHeight;
        container.style.aspectRatio = aspectRatio;
        container.setAttribute('data-aspect-ratio', aspectRatio);
    }
};

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
        const image = container.querySelector('img');

        // 标记为已初始化
        livePhoto.classList.add('initialized');

        // 确保视频属性正确设置
        video.playsInline = true;
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');

        // 设置初始静音状态
        const isMuted = livePhoto.getAttribute('data-muted') === 'true';
        video.muted = isMuted;

        // 预加载视频
        video.load();

        // 如果图片已经加载，设置比例
        if (image.complete && image.naturalWidth > 0) {
            const aspectRatio = image.naturalWidth / image.naturalHeight;
            livePhoto.style.aspectRatio = aspectRatio;
            livePhoto.setAttribute('data-aspect-ratio', aspectRatio);
        }

        // fix: 鼠标进入 → 开始加载 → 鼠标离开（加载成功前） → 加载失败。
        let within = false;
        let touchStartY = 0;
        let touchStartX = 0;
        let isTouchMoved = false;
        const TOUCH_THRESHOLD = 10; // 滑动阈值，超过视为滚动

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

        // 触摸开始
        const touchStart = (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
            isTouchMoved = false;
        };

        // 触摸移动 - 检测是否滑动
        const touchMove = (e) => {
            const touchY = e.touches[0].clientY;
            const touchX = e.touches[0].clientX;
            const deltaY = Math.abs(touchY - touchStartY);
            const deltaX = Math.abs(touchX - touchStartX);

            // 如果移动超过阈值，标记为滑动
            if (deltaY > TOUCH_THRESHOLD || deltaX > TOUCH_THRESHOLD) {
                isTouchMoved = true;
            }
        };

        // 触摸结束 - 只有未滑动时才播放
        const touchEnd = async (e) => {
            // 如果发生了滑动，不播放视频
            if (isTouchMoved) {
                return;
            }

            e.stopPropagation();

            within = true;

            try {
                video.currentTime = 0;
                await video.play();
                livePhoto.classList.add('zoom');
            } catch(e) {
                console.log(e);
            }
        };

        const touchCancel = () => {
            isTouchMoved = false;
            leave();
        };

        // 桌面设备：鼠标悬停在图标上播放
        icon.addEventListener('mouseenter', start);
        icon.addEventListener('mouseleave', leave);

        // 移动设备：触摸事件处理
        image.addEventListener('touchstart', touchStart, { passive: true });
        image.addEventListener('touchmove', touchMove, { passive: true });
        image.addEventListener('touchend', touchEnd);
        image.addEventListener('touchcancel', touchCancel);

        video.addEventListener('ended', () => {
            livePhoto.classList.remove('zoom');
        });
    });
}