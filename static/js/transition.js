(function() {
    const cards = document.querySelectorAll('.modbox');
    if (!cards.length) return;

    let isTransitioning = false;

    window.addEventListener('pageshow', function(e) {
        if (e.persisted) {
            document.querySelectorAll('.transition-overlay').forEach(el => el.remove());
            isTransitioning = false;
        }
    });

    const frames = [
        ["........", "........", "........", "....Y...", "Y.Y...Y."],
        [".YYKYYY.", "...KYYYY", "YYK.YYYY", "Y.Y..YYY", ".YY.YYY."],
        ["KKYKYYYK", "K.KKKYK.", "KKKKYKKK", "YKKKYYKK", "YKYKKKKK"],
        ["KKKYKYYK", "K.KKKYKK", "KKKKKKKK", ".KKKYKKK", "KYKKYKKK"],
        ["KKKYKKKK", "KKKKKYKK", "KKKYKKKK", "KKKKKKKK", "YKKYKKYK"]
    ];

    const timings = [0, 67, 134, 167, 233];

    function nextPaint() {
        return new Promise(resolve => {
            requestAnimationFrame(() => {
                requestAnimationFrame(resolve);
            });
        });
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    cards.forEach(card => {
        card.addEventListener('click', async function(e) {
            e.preventDefault();
            if (isTransitioning) return;

            const targetUrl = this.href;
            if (!targetUrl) return;

            isTransitioning = true;

            const overlay = document.createElement('div');
            overlay.className = 'transition-overlay';

            const cols = 8;
            const rows = 5;
            const squareSize = Math.floor(window.innerWidth / cols);

            overlay.style.gridTemplateColumns = `repeat(${cols}, ${squareSize}px)`;
            overlay.style.gridTemplateRows = `repeat(${rows}, ${squareSize}px)`;

            document.body.appendChild(overlay);

            const grid = [];
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const square = document.createElement('div');
                    square.className = 'transition-square empty';
                    grid.push(square);
                    overlay.appendChild(square);
                }
            }

            function renderFrame(frame) {
                for (let r = 0; r < rows; r++) {
                    const row = frame[r];
                    for (let c = 0; c < cols; c++) {
                        const cell = grid[r * cols + c];
                        const ch = row[c];
                        if (ch === 'Y') {
                            cell.className = 'transition-square yellow';
                        } else if (ch === 'K') {
                            cell.className = 'transition-square dark';
                        } else {
                            cell.className = 'transition-square empty';
                        }
                    }
                }
            }

            for (let i = 0; i < frames.length; i++) {
                renderFrame(frames[i]);
                await nextPaint();

                try {
                    sessionStorage.setItem('transitionFrame', String(i));
                    sessionStorage.setItem('transitionFrameTime', String(Date.now()));
                } catch (err) {}

                if (i < frames.length - 1) {
                    const interval = timings[i + 1] - timings[i];
                    await sleep(Math.max(0, interval - 16));
                }
            }

            await sleep(80);

            window.location.href = targetUrl;
        });
    });
})();