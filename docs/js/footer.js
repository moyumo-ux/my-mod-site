(function() {
    const popup = document.getElementById('mailPopup');
    const popupValue = document.getElementById('mailPopupValue');
    const closeBtn = document.getElementById('mailPopupClose');
    const copyBtn = document.getElementById('mailPopupCopy');

    if (!popup) return;

    let currentEmail = '';

    // 打开弹窗
    document.querySelectorAll('.mail-link').forEach(function(el) {
        el.addEventListener('click', function(e) {
            e.preventDefault();
            const user = el.dataset.user;
            const domain = el.dataset.domain;
            if (!user || !domain) return;

            currentEmail = user + '@' + domain;
            popupValue.textContent = currentEmail;
            copyBtn.textContent = '复制';
            popup.classList.add('active');
        });
    });

    // 关闭弹窗
    function closePopup() {
        popup.classList.remove('active');
    }

    closeBtn.addEventListener('click', closePopup);

    popup.addEventListener('click', function(e) {
        if (e.target === popup) closePopup();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closePopup();
    });

    // 复制到剪贴板
    copyBtn.addEventListener('click', function() {
        if (!currentEmail) return;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(currentEmail).then(function() {
                copyBtn.textContent = '已复制';
                setTimeout(function() { copyBtn.textContent = '复制'; }, 1500);
            }).catch(function() {
                fallbackCopy(currentEmail);
            });
        } else {
            fallbackCopy(currentEmail);
        }
    });

    // 兜底：旧浏览器
    function fallbackCopy(text) {
        const tmp = document.createElement('textarea');
        tmp.value = text;
        tmp.style.position = 'fixed';
        tmp.style.opacity = '0';
        document.body.appendChild(tmp);
        tmp.select();
        try {
            document.execCommand('copy');
            copyBtn.textContent = '已复制';
            setTimeout(function() { copyBtn.textContent = '复制'; }, 1500);
        } catch (err) {}
        document.body.removeChild(tmp);
    }
})();