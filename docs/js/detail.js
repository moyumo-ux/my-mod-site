(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const content = document.getElementById('modContent');
        const tocNav = document.getElementById('tocNav');
        if (!content || !tocNav) return;

        const headings = content.querySelectorAll('h2, h3');
        const tocItems = [];

        if (headings.length === 0) {
            tocNav.innerHTML = '<span style="font-size:0.75rem;color:#aaa;">无目录</span>';
            return;
        }

        // ===== 生成目录 =====
        headings.forEach(function(heading, index) {
            const level = heading.tagName.toLowerCase();
            const text = heading.textContent.trim();
            const id = heading.id || text.replace(/\s+/g, '-').toLowerCase();

            if (!heading.id) heading.id = id;

            const link = document.createElement('a');
            link.href = '#' + id;
            link.textContent = text;
            link.className = 'toc-' + level;
            link.dataset.target = id;
            link.style.animationDelay = (1 + index * 0.05) + 's';

            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.getElementById(id);
                if (!target) return;

                // 1. 如果目标本身在某个折叠块内部（h3 场景），向上展开所有嵌套
                let parent = target.closest('details');
                while (parent) {
                    if (!parent.open) parent.open = true;
                    const outer = parent.parentElement ? parent.parentElement.closest('details') : null;
                    parent = outer;
                }

                // 2. 如果目标是 h2，展开它后面的折叠块（标题下方的折叠内容）
                if (target.tagName === 'H2') {
                    let next = target.nextElementSibling;
                    while (next && next.tagName !== 'DETAILS') {
                        next = next.nextElementSibling;
                    }
                    if (next && next.classList.contains('fold-line') && !next.open) {
                        next.open = true;
                    }
                }

                // 3. 等布局重排后滚动到目标位置
                requestAnimationFrame(function() {
                    setTimeout(function() {
                        const topOffset = 80;
                        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - topOffset;
                        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                        updateActive(id);
                    }, 60);
                });
            });

            tocNav.appendChild(link);
            tocItems.push({ id: id, element: link });
        });

        // ===== 滚动高亮 =====
        function updateActive(activeId) {
            tocItems.forEach(function(item) {
                if (item.id === activeId) {
                    item.element.classList.add('active');
                } else {
                    item.element.classList.remove('active');
                }
            });
        }

        function onScroll() {
            const scrollPosition = window.pageYOffset + 100;
            let currentId = null;
            headings.forEach(function(heading) {
                const offset = heading.getBoundingClientRect().top + window.pageYOffset;
                if (offset <= scrollPosition) currentId = heading.id;
            });
            if (currentId) updateActive(currentId);
        }

        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    onScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });

        setTimeout(onScroll, 300);

        // 仅在新会话中强制收起所有折叠块（刷新不重置）
        if (!sessionStorage.getItem('foldInitialized')) {
            document.querySelectorAll('.mod-detail-content details.fold-line').forEach(function(details) {
                details.removeAttribute('open');
            });
            sessionStorage.setItem('foldInitialized', '1');
        }

                // ===== 折叠块：注入背景层 + 线条双层 + 标签 + 箭头 =====
        document.querySelectorAll('.mod-detail-content details.fold-line').forEach(function(details) {
            const summary = details.querySelector('summary');
            if (!summary || summary.querySelector('.fold-line-wrap')) return;

            // 背景层
            const bg = document.createElement('span');
            bg.className = 'fold-bg';

            // 线条双层
            const wrap = document.createElement('span');
            wrap.className = 'fold-line-wrap';

            const straight = document.createElement('span');
            straight.className = 'fold-line line-straight';

            const curve = document.createElement('span');
            curve.className = 'fold-line line-curve';

            wrap.appendChild(straight);
            wrap.appendChild(curve);

            // 标签
            const label = document.createElement('span');
            label.className = 'fold-label';
            label.textContent = '// 展开详情';

            // 箭头（从伪元素改为真实元素）
            const arrow = document.createElement('span');
            arrow.className = 'fold-arrow';

            // 把 label 和 arrow 包进一个容器，统一监听
            const rightGroup = document.createElement('span');
            rightGroup.className = 'fold-right-group';
            rightGroup.appendChild(label);
            rightGroup.appendChild(arrow);

            summary.appendChild(bg);
            summary.appendChild(wrap);
            summary.appendChild(rightGroup);

            details.addEventListener('toggle', function() {
                label.textContent = details.open ? '// 收起' : '// 展开详情';
            });

            // 悬停整个右侧组（文字 + 空隙 + 箭头）都触发
            rightGroup.addEventListener('mouseenter', function() {
                details.classList.add('fold-hover');
            });
            rightGroup.addEventListener('mouseleave', function() {
                details.classList.remove('fold-hover');
            });
        });

        // ===== 视频包装 + 视口播放 =====
        const videos = document.querySelectorAll('.mod-detail-content video');

        videos.forEach(function(v) {
            const wrapper = document.createElement('div');
            wrapper.className = 'video-wrapper';
            v.parentNode.insertBefore(wrapper, v);
            wrapper.appendChild(v);
        });

        if ('IntersectionObserver' in window && videos.length) {
            const videoObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    const video = entry.target;
                    if (entry.isIntersecting) {
                        const playPromise = video.play();
                        if (playPromise && playPromise.catch) playPromise.catch(function() {});
                    } else {
                        video.pause();
                    }
                });
            }, { rootMargin: '200px 0px', threshold: 0.1 });

            videos.forEach(function(v) { videoObserver.observe(v); });
        } else {
            videos.forEach(function(v) {
                const playPromise = v.play();
                if (playPromise && playPromise.catch) playPromise.catch(function() {});
            });
        }

        // ===== h2 自动编号 =====
        const h2List = document.querySelectorAll('.mod-detail-content h2');
        h2List.forEach(function(h2, i) {
            const num = String(i + 1).padStart(2, '0');
            h2.setAttribute('data-num', num);
        });

        function alignDecoLeft() {
            const header = document.querySelector('.mod-detail-header');
            const h1 = document.querySelector('.mod-detail-header h1');
            const deco = document.querySelector('.mod-detail-header .deco-left');
            if (!header || !h1 || !deco) return;

            const headerRect = header.getBoundingClientRect();
            const h1Rect = h1.getBoundingClientRect();

            const offsetX = h1Rect.left - headerRect.left - 10;

            const h1CenterY = h1Rect.top + h1Rect.height / 2;
            const offsetY = h1CenterY - headerRect.top - 34;

            deco.style.left = offsetX + 'px';
            deco.style.top = offsetY + 'px';
        }

        alignDecoLeft();
        window.addEventListener('resize', alignDecoLeft);
        window.addEventListener('load', alignDecoLeft);
    });
})();