(function() {
    if (window.matchMedia('(max-width: 768px)').matches) return;

    const track = document.createElement('div');
    track.className = 'custom-scrollbar';

    const thumb = document.createElement('div');
    thumb.className = 'custom-scrollbar-thumb';
    track.appendChild(thumb);

    document.body.appendChild(track);

    let trackHeight = 0;
    let thumbHeight = 0;
    let maxScroll = 0;
    let maxThumbTop = 0;
    let isDragging = false;
    let dragStartY = 0;
    let dragStartScrollTop = 0;

    function getScrollTop() {
        return window.pageYOffset || document.documentElement.scrollTop || 0;
    }

    function updateMeasurements() {
        trackHeight = track.clientHeight;
        const docHeight = document.documentElement.scrollHeight;
        const viewHeight = window.innerHeight;

        maxScroll = docHeight - viewHeight;

        if (maxScroll <= 0) {
            track.classList.remove('visible');
            return;
        }

        track.classList.add('visible');

        thumbHeight = Math.max(30, (viewHeight / docHeight) * trackHeight);
        thumb.style.height = thumbHeight + 'px';

        maxThumbTop = trackHeight - thumbHeight;

        updatePosition();
    }

    function updatePosition() {
        if (maxScroll <= 0) return;
        const ratio = getScrollTop() / maxScroll;
        const top = ratio * maxThumbTop;
        thumb.style.transform = `translateY(${top}px)`;
    }

    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updatePosition();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateMeasurements, 100);
    });

    if (typeof ResizeObserver !== 'undefined') {
        const observer = new ResizeObserver(function() {
            updateMeasurements();
        });
        observer.observe(document.body);
    }

    thumb.addEventListener('pointerdown', function(e) {
        e.preventDefault();
        isDragging = true;
        dragStartY = e.clientY;
        dragStartScrollTop = getScrollTop();
        thumb.classList.add('dragging');
        try { thumb.setPointerCapture(e.pointerId); } catch (err) {}
    });

    thumb.addEventListener('pointermove', function(e) {
        if (!isDragging) return;
        e.preventDefault();

        const deltaY = e.clientY - dragStartY;
        const ratio = maxThumbTop > 0 ? deltaY / maxThumbTop : 0;
        const scrollDelta = ratio * maxScroll;

        window.scrollTo(0, dragStartScrollTop + scrollDelta);
    });

    thumb.addEventListener('pointerup', function(e) {
        isDragging = false;
        thumb.classList.remove('dragging');
        try { thumb.releasePointerCapture(e.pointerId); } catch (err) {}
    });

    thumb.addEventListener('pointercancel', function() {
        isDragging = false;
        thumb.classList.remove('dragging');
    });

    track.addEventListener('pointerdown', function(e) {
        if (e.target === thumb) return;

        const rect = track.getBoundingClientRect();
        const clickY = e.clientY - rect.top;
        const ratio = maxThumbTop > 0
            ? (clickY - thumbHeight / 2) / maxThumbTop
            : 0;
        const targetScroll = Math.max(0, Math.min(maxScroll, ratio * maxScroll));

        window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        });
    });

    updateMeasurements();
    window.addEventListener('load', updateMeasurements);
})();