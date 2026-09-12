(function() {
    const overlay = document.getElementById('transitionDetail');
    if (!overlay) return;

    const frames = [
        ["........", "........", "........", "....Y...", "Y.Y...Y."],
        [".YYKYYY.", "...KYYYY", "YYK.YYYY", "Y.Y..YYY", ".YY.YYY."],
        ["KKYKYYYK", "K.KKKYK.", "KKKKYKKK", "YKKKYYKK", "YKYKKKKK"],
        ["KKKYKYYK", "K.KKKYKK", "KKKKKKKK", ".KKKYKKK", "KYKKYKKK"],
        ["KKKYKKKK", "KKKKKYKK", "KKKYKKKK", "KKKKKKKK", "YKKYKKYK"]
    ];

    const timings = [0, 67, 134, 167, 233];
    const HOLD_TIME = 150;

    const cols = 8;
    const rows = 5;
    const squareSize = Math.floor(window.innerWidth / cols);

    overlay.style.gridTemplateColumns = `repeat(${cols}, ${squareSize}px)`;
    overlay.style.gridTemplateRows = `repeat(${rows}, ${squareSize}px)`;

    const grid = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const square = document.createElement('div');
            square.className = 'td-square empty';
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
                    cell.className = 'td-square yellow';
                } else if (ch === 'K') {
                    cell.className = 'td-square white';
                } else {
                    cell.className = 'td-square empty';
                }
            }
        }
    }

    let startIndex = frames.length - 1;
    try {
        const stored = sessionStorage.getItem('transitionFrame');
        const storedTime = parseInt(sessionStorage.getItem('transitionFrameTime') || '0', 10);
        const age = Date.now() - storedTime;

        if (stored !== null && age < 5000) {
            const parsed = parseInt(stored, 10);
            if (!isNaN(parsed) && parsed >= 0 && parsed < frames.length) {
                startIndex = parsed;
            }
        }
    } catch (err) {}

    renderFrame(frames[startIndex]);

    const reverseFrames = [];
    for (let i = startIndex; i >= 0; i--) {
        reverseFrames.push(frames[i]);
    }

    const reverseTimings = [0];
    let elapsed = 0;
    for (let i = startIndex; i > 0; i--) {
        const step = timings[i] - timings[i - 1];
        elapsed += step;
        reverseTimings.push(elapsed);
    }

    reverseFrames.forEach((frame, i) => {
        setTimeout(() => {
            renderFrame(frame);
        }, HOLD_TIME + reverseTimings[i]);
    });

    const totalTime = HOLD_TIME + reverseTimings[reverseTimings.length - 1];
    setTimeout(() => {
        const el = document.getElementById('transitionDetail');
        if (el) el.remove();
    }, totalTime);

    try {
        sessionStorage.removeItem('transitionFrame');
        sessionStorage.removeItem('transitionFrameTime');
    } catch (err) {}
})();