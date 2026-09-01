(function() {
    const cover = document.getElementById('loading-cover');
    const fill = document.getElementById('progressFill');
    const percent = document.getElementById('progressPercent');
    const statusText = document.getElementById('statusText');
    const quoteEl = document.getElementById('loadingQuote');
    const mainContent = document.getElementById('mainContent');

    const quotes = [
        'INITIALIZING',
        'LOADING ASSETS',
        'RENDERING LOGO',
        'ALMOST READY',
        'WELCOME'
    ];

    let progress = 0;
    let quoteIndex = 0;

    // 动态更新进度
    function updateProgress() {
        progress += Math.random() * 2 + 0.5;
        if (progress > 100) progress = 100;

        // 更新进度条
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            fill.style.width = progress + '%';
        } else {
            fill.style.height = progress + '%';
        }

        // 更新百分比显示
        percent.textContent = Math.floor(progress) + '%';

        // 更新进度信息的位置（桌面端跟随进度条）
        if (!isMobile) {
            const info = document.getElementById('progressInfo');
            info.style.top = progress + '%';
        }

        // 更新状态文字
        if (progress > 20 && quoteIndex < 1) { quoteIndex = 1; statusText.textContent = quotes[1]; }
        if (progress > 40 && quoteIndex < 2) { quoteIndex = 2; statusText.textContent = quotes[2]; }
        if (progress > 70 && quoteIndex < 3) { quoteIndex = 3; statusText.textContent = quotes[3]; }
        if (progress >= 100 && quoteIndex < 4) { quoteIndex = 4; statusText.textContent = quotes[4]; }

        if (progress < 100) {
            // 随机延迟，模拟加载
            const delay = Math.random() * 80 + 20;
            setTimeout(updateProgress, delay);
        } else {
            // 加载完成 → 触发扫光动画 → 淡出
            cover.classList.add('sweeping');
            setTimeout(() => {
                cover.classList.add('fadeout');
                setTimeout(() => {
                    cover.style.display = 'none';
                    if (mainContent) mainContent.style.display = 'block';
                }, 400);
            }, 500);
        }
    }

    // 设置引语（随机一句）
    const quoteList = [
        '"THE FUTURE IS BUILT."',
        '"BEYOND THE FRONTIER."',
        '"LIGHT IN THE DARK."',
        '"FORGE AHEAD."'
    ];
    if (quoteEl) {
        quoteEl.textContent = quoteList[Math.floor(Math.random() * quoteList.length)];
    }

    // 启动加载
    updateProgress();

    // 窗口大小变化时重新适配进度条显示
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            const isMobile = window.innerWidth <= 768;
            const currentProgress = parseFloat(percent.textContent) || 0;
            if (isMobile) {
                fill.style.width = currentProgress + '%';
                fill.style.height = '100%';
            } else {
                fill.style.width = '100%';
                fill.style.height = currentProgress + '%';
            }
        }, 100);
    });
})();