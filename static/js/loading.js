(function() {
    const cover = document.getElementById('loading-cover');
    const fill = document.getElementById('progressFill');
    const percent = document.getElementById('progressPercent');
    const statusText = document.getElementById('statusText');
    const quoteEl = document.getElementById('loadingQuote');
    const mainContent = document.getElementById('mainContent');

    const quotes = ['INITIALIZING', 'LOADING ASSETS', 'RENDERING LOGO', 'ALMOST READY', 'WELCOME'];
    const totalDuration = 200 + Math.random() * 200;
    const startTime = performance.now();

    let quoteIndex = 0;
    let animId = null;

    function updateProgress(timestamp) {
        const elapsed = timestamp - startTime;
        let progress = Math.min(elapsed / totalDuration, 1);
        const progressPercent = Math.floor(progress * 100);

        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            fill.style.width = (progress * 100) + '%';
        } else {
            fill.style.height = (progress * 100) + '%';
        }
        percent.textContent = progressPercent + '%';
        if (!isMobile) {
            document.getElementById('progressInfo').style.top = (progress * 100) + '%';
        }

        if (progress > 0.2 && quoteIndex < 1) { quoteIndex = 1; statusText.textContent = quotes[1]; }
        if (progress > 0.4 && quoteIndex < 2) { quoteIndex = 2; statusText.textContent = quotes[2]; }
        if (progress > 0.7 && quoteIndex < 3) { quoteIndex = 3; statusText.textContent = quotes[3]; }
        if (progress >= 1 && quoteIndex < 4) { quoteIndex = 4; statusText.textContent = quotes[4]; }

        if (progress < 1) {
            animId = requestAnimationFrame(updateProgress);
        } else {
            cover.classList.add('sweeping');
            setTimeout(function() {
                cover.classList.add('fadeout');
                mainContent.classList.add('visible');
                setTimeout(function() {
                    cover.style.display = 'none';
                    if (animId) {
                        cancelAnimationFrame(animId);
                        animId = null;
                    }
                }, 400);
            }, 500);
        }
    }

    const quoteList = ['"THE FUTURE IS BUILT."', '"BEYOND THE FRONTIER."', '"LIGHT IN THE DARK."', '"FORGE AHEAD."'];
    if (quoteEl) { quoteEl.textContent = quoteList[Math.floor(Math.random() * quoteList.length)]; }

    animId = requestAnimationFrame(updateProgress);

    var resizeTimer;
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