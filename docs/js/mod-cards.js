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
})();