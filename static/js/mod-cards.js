(function() {
    const bgImages = [
        '/my-mod-site/images/smallbg1.png',
        '/my-mod-site/images/smallbg2.png',
        '/my-mod-site/images/smallbg3.png',
        '/my-mod-site/images/smallbg4.png'
    ];
    const cards = document.querySelectorAll('.modbox');
    cards.forEach(card => {
        const randomIndex = Math.floor(Math.random() * bgImages.length);
        card.style.backgroundImage = `url('${bgImages[randomIndex]}')`;
    });

    const descs = document.querySelectorAll('.mod-desc');
    descs.forEach(el => {
        const container = el.closest('.mod-text-area');
        if (!container) return;

        const header = container.querySelector('.mod-header');
        const headerHeight = header ? header.offsetHeight : 24;
        const containerHeight = container.offsetHeight;
        const availableHeight = containerHeight - headerHeight - 6;

        let fontSize = parseFloat(getComputedStyle(el).fontSize) || 12;
        const minFontSize = 8;
        let attempts = 0;

        el.style.fontSize = fontSize + 'px';

        while (el.scrollHeight > availableHeight && fontSize > minFontSize && attempts < 30) {
            fontSize -= 0.5;
            el.style.fontSize = fontSize + 'px';
            attempts++;
        }
    });

    const prefetched = new Set();

    function prefetch(url) {
        if (!url || prefetched.has(url)) return;
        prefetched.add(url);
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
    }

    function preloadDoc(url) {
        if (!url || prefetched.has(url)) return;
        prefetched.add(url);
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        link.as = 'document';
        document.head.appendChild(link);
    }

    function preloadAll() {
        cards.forEach(card => {
            if (card.href) preloadDoc(card.href);
        });

        prefetch('/my-mod-site/css/transition-detail.css');
        prefetch('/my-mod-site/js/transition-detail.js');
        prefetch('/my-mod-site/js/custom-scrollbar.js');
        prefetch('/my-mod-site/images/moddetail_top.png');
        prefetch('/my-mod-site/images/logo.png');
    }

    if ('requestIdleCallback' in window) {
        requestIdleCallback(preloadAll, { timeout: 3000 });
    } else {
        window.addEventListener('load', () => setTimeout(preloadAll, 500));
    }

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.href) return;
            fetch(this.href, { credentials: 'same-origin' }).catch(() => {});
        }, { once: true });
    });
})();