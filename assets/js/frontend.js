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
        const warning = livePhoto.querySelector('.warning');

        // 标记为已初始化
        livePhoto.classList.add('initialized');

        // 确保视频属性正确设置
        video.playsInline = true;
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');

        // 设置初始静音状态
        const isMuted = livePhoto.getAttribute('data-muted') === 'true';
        video.muted = isMuted;
        
    // ...已移除声音控件相关逻辑...

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

        const start = async (e) => {
            e.stopPropagation();
            e.preventDefault();

            within = true;

            try {
                video.currentTime = 0;
                await video.play();
                livePhoto.classList.add('zoom');
            }
            catch(e) {
                console.log(e);
                if (within && e instanceof DOMException) {
                    if (['NotAllowedError','AbortError'].includes(e.name)) {
                        warning.innerText = '';
                    } else if (['NotSupportedError'].includes(e.name)) {
                        warning.innerText = '';
                    } else {
                        warning.innerText = `${e}`;
                    }
                    warning.classList.add('show');
                }
            }
        };

        const leave = (e) => {
            livePhoto.classList.remove('zoom');
            warning.classList.remove('show');

            // await play() 可能一直卡住不返回。
            // 在 pause 之前设置，如果  await play() 还没
            // 成功返回，就会进入异常处理。
            within = false;

            video.pause();
        };

        // 桌面设备：鼠标悬停在图标上播放
        icon.addEventListener('mouseenter', start);
        icon.addEventListener('mouseleave', leave);

        // 桌面设备：鼠标悬停在图标上播放
        icon.addEventListener('mouseenter', start);
        icon.addEventListener('mouseleave', leave);

        // 移动设备：触摸图片播放
        image.addEventListener('touchstart', start);
        image.addEventListener('touchend', leave);
        image.addEventListener('touchcancel', leave);

        video.addEventListener('ended', () => {
            livePhoto.classList.remove('zoom');
        });
    });
}