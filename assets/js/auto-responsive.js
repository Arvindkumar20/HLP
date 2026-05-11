// ============================================
// AUTOMATIC RESPONSIVENESS DETECTOR & FIXER (NO INFINITE LOOP)
// ============================================

(function() {
    'use strict';

    const config = {
        debounceDelay: 250,          // increased to avoid rapid re-triggers
        breakpoints: {
            mobile: 640,
            tablet: 768,
            laptop: 1024,
            desktop: 1280,
            wide: 1536
        },
        retryAttempts: 2,
        retryDelay: 300
    };

    let currentState = null;
    let fixTimeout = null;
    let resizeObserver = null;
    let mutationObserver = null;
    let isApplyingFixes = false;          // 🔥 prevents recursive triggers
    let lastAppliedState = null;          // 🔥 avoid reapplying same state

    function detectScreenState() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const orientation = screen.orientation?.type || 
                           (window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
        
        let deviceType = 'unknown';
        if (width <= config.breakpoints.mobile) deviceType = 'mobile';
        else if (width <= config.breakpoints.tablet) deviceType = 'tablet';
        else if (width <= config.breakpoints.laptop) deviceType = 'laptop';
        else if (width <= config.breakpoints.desktop) deviceType = 'desktop';
        else deviceType = 'wide';

        return {
            width,
            height,
            orientation,
            deviceType,
            isMobile: deviceType === 'mobile',
            isTablet: deviceType === 'tablet',
            isDesktop: deviceType === 'laptop' || deviceType === 'desktop' || deviceType === 'wide',
            isPortrait: orientation === 'portrait' || orientation === 'portrait-primary',
            isLandscape: orientation === 'landscape' || orientation === 'landscape-primary',
            ratio: width / height
        };
    }

    // ---------- Safe style setter (only if changed) ----------
    function setStyleIfNeeded(el, property, value) {
        if (el.style[property] !== value) {
            el.style[property] = value;
            return true;
        }
        return false;
    }

    // ---------- Fix functions (all with safe checks) ----------
    function fixContainers(screenState) {
        const containers = document.querySelectorAll('.container, .wrapper, [class*="max-w-"], [class*="container"]');
        containers.forEach(container => {
            let paddingLeft, paddingRight;
            if (screenState.isMobile) {
                paddingLeft = paddingRight = '5px';
            } else if (screenState.isTablet) {
                paddingLeft = paddingRight = '5px';
            } else {
                paddingLeft = paddingRight = '5px';
            }
            // setStyleIfNeeded(container, 'paddingLeft', paddingLeft);
            // setStyleIfNeeded(container, 'paddingRight', paddingRight);
        });
        return 'containers-fixed';
    }

    function fixGrids(screenState) {
        const grids = document.querySelectorAll('[class*="grid"], .grid');
        grids.forEach(grid => {
            if (screenState.isMobile && grid.classList.contains('mentor-grid-layout')) {
                setStyleIfNeeded(grid, 'gridTemplateColumns', '1fr');
            } else if (screenState.isMobile) {
                const currentGap = parseInt(window.getComputedStyle(grid).gap) || 20;
                if (currentGap > 16) setStyleIfNeeded(grid, 'gap', '16px');
            }
        });
        return 'grids-fixed';
    }

    function fixHorizontalSliders(screenState) {
        const sliders = document.querySelectorAll('.feature-slider-container, .placement-slider, .logo-scroll');
        sliders.forEach(slider => {
            let gap, padding;
            if (screenState.isMobile) {
                gap = '12px';
                padding = '0 16px 24px 16px';
            } else if (screenState.isTablet) {
                gap = '20px';
                padding = '0 24px 32px 24px';
            } else {
                gap = '24px';
                padding = '0 40px 40px 40px';
            }
            setStyleIfNeeded(slider, 'gap', gap);
            setStyleIfNeeded(slider, 'padding', padding);
            if (screenState.isMobile || screenState.isTablet) {
                setStyleIfNeeded(slider, 'webkitOverflowScrolling', 'touch');
                setStyleIfNeeded(slider, 'scrollBehavior', 'smooth');
            }
        });
        return 'sliders-fixed';
    }

    function fixFontSizes(screenState) {
        const fontAdjustments = [
            { selector: 'h1, .text-4xl, .mentor-name-text', mobile: '1.75rem', tablet: '2rem', desktop: '2.5rem' },
            { selector: 'h2, .text-3xl', mobile: '1.5rem', tablet: '1.75rem', desktop: '2rem' },
            { selector: 'h3, .text-2xl', mobile: '1.25rem', tablet: '1.35rem', desktop: '1.5rem' },
            { selector: '.faq-question', mobile: '0.85rem', tablet: '0.9rem', desktop: '0.95rem' },
            { selector: '.stat-chip', mobile: '10px', tablet: '11px', desktop: '12px' }
        ];
        fontAdjustments.forEach(adjustment => {
            const elements = document.querySelectorAll(adjustment.selector);
            let fontSize;
            if (screenState.isMobile) fontSize = adjustment.mobile;
            else if (screenState.isTablet) fontSize = adjustment.tablet;
            else fontSize = adjustment.desktop;
            elements.forEach(el => {
                if (!el.getAttribute('data-auto-font') === 'false') {
                    setStyleIfNeeded(el, 'fontSize', fontSize);
                }
            });
        });
        return 'fonts-fixed';
    }

    function fixSpacing(screenState) {
        const sections = document.querySelectorAll('section, .section, [class*="section"]');
        sections.forEach(section => {
            if (screenState.isMobile && !section.classList.contains('premium-mentor-section')) {
                setStyleIfNeeded(section, 'paddingTop', '40px');
                setStyleIfNeeded(section, 'paddingBottom', '40px');
            } else if (screenState.isTablet) {
                setStyleIfNeeded(section, 'paddingTop', '100px');
                setStyleIfNeeded(section, 'paddingBottom', '60px');
            }
        });
        const roadmapContainer = document.querySelector('.roadmap-container');
        if (roadmapContainer && screenState.isMobile) {
            setStyleIfNeeded(roadmapContainer, 'padding', '40px 0 80px 0');
        }
        return 'spacing-fixed';
    }

    function fixMedia(screenState) {
        const images = document.querySelectorAll('img:not(.no-auto-responsive)');
        images.forEach(img => {
            if (!img.hasAttribute('data-original-width')) {
                img.setAttribute('data-original-width', img.width);
                img.setAttribute('data-original-height', img.height);
            }
            if (screenState.isMobile) {
                setStyleIfNeeded(img, 'maxWidth', '100%');
                setStyleIfNeeded(img, 'height', 'auto');
            }
        });
        const imageStacks = document.querySelectorAll('.image-stack');
        imageStacks.forEach(stack => {
            if (screenState.isMobile) {
                setStyleIfNeeded(stack, 'height', 'auto');
                setStyleIfNeeded(stack, 'minHeight', '300px');
            } else {
                setStyleIfNeeded(stack, 'height', '480px');
            }
        });
        return 'media-fixed';
    }

    function fixNavigation(screenState) {
        const navs = document.querySelectorAll('nav, .navbar, .menu');
        navs.forEach(nav => {
            if (screenState.isMobile && !nav.querySelector('.mobile-menu-toggle')) {
                const menu = nav.querySelector('ul');
                if (menu) {
                    const toggle = document.createElement('button');
                    toggle.className = 'mobile-menu-toggle';
                    toggle.innerHTML = '☰';
                    toggle.style.cssText = 'display:block; background:none; border:none; font-size:24px; cursor:pointer; padding:8px;';
                    nav.insertBefore(toggle, menu);
                    toggle.addEventListener('click', () => {
                        menu.classList.toggle('show-mobile');
                        menu.style.display = menu.classList.contains('show-mobile') ? 'flex' : 'none';
                    });
                }
            }
        });
        return 'navigation-fixed';
    }

    function fixTables(screenState) {
        if (!screenState.isMobile) return 'tables-fixed';
        const tables = document.querySelectorAll('table:not(.responsive-table)');
        tables.forEach(table => {
            if (!table.parentElement.classList.contains('table-responsive-wrapper')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'table-responsive-wrapper';
                wrapper.style.cssText = 'overflow-x: auto; -webkit-overflow-scrolling: touch;';
                table.parentNode.insertBefore(wrapper, table);
                wrapper.appendChild(table);
            }
        });
        return 'tables-fixed';
    }

    function fixAbsoluteElements(screenState) {
        const absoluteElements = document.querySelectorAll('.google-review-tab, .whatsapp-float, [style*="position: absolute"]');
        absoluteElements.forEach(el => {
            if (screenState.isMobile) {
                if (el.classList.contains('google-review-tab')) {
                    setStyleIfNeeded(el, 'transform', 'translateY(-50%) rotate(-90deg) scale(0.8)');
                } else if (el.classList.contains('whatsapp-float')) {
                    setStyleIfNeeded(el, 'bottom', '20px');
                    setStyleIfNeeded(el, 'right', '20px');
                    setStyleIfNeeded(el, 'width', '50px');
                    setStyleIfNeeded(el, 'height', '50px');
                    setStyleIfNeeded(el, 'fontSize', '24px');
                }
            } else {
                if (el.classList.contains('google-review-tab')) {
                    setStyleIfNeeded(el, 'transform', 'translateY(-50%) rotate(-90deg)');
                    setStyleIfNeeded(el, 'transformOrigin', 'left bottom');
                } else if (el.classList.contains('whatsapp-float')) {
                    setStyleIfNeeded(el, 'bottom', '30px');
                    setStyleIfNeeded(el, 'right', '30px');
                    setStyleIfNeeded(el, 'width', '60px');
                    setStyleIfNeeded(el, 'height', '60px');
                    setStyleIfNeeded(el, 'fontSize', '30px');
                }
            }
        });
        return 'absolute-fixed';
    }

    function fixFlexLayouts(screenState) {
        if (!screenState.isMobile) return 'flex-fixed';
        const flexContainers = document.querySelectorAll('[class*="flex"], .flex');
        flexContainers.forEach(container => {
            const flexDirection = window.getComputedStyle(container).flexDirection;
            if (flexDirection === 'row' && container.children.length > 3) {
                const containerWidth = container.clientWidth;
                let totalWidth = 0;
                Array.from(container.children).forEach(child => {
                    totalWidth += child.clientWidth;
                });
                if (totalWidth > containerWidth) {
                    setStyleIfNeeded(container, 'flexWrap', 'wrap');
                    setStyleIfNeeded(container, 'gap', '10px');
                }
            }
        });
        return 'flex-fixed';
    }

    function fixResponsiveness(screenState) {
        const fixes = [];
        fixes.push(fixContainers(screenState));
        // fixes.push(fixGrids(screenState));
        fixes.push(fixHorizontalSliders(screenState));
        fixes.push(fixFontSizes(screenState));
        // fixes.push(fixSpacing(screenState));
        // fixes.push(fixMedia(screenState));
        fixes.push(fixNavigation(screenState));
        fixes.push(fixTables(screenState));
        fixes.push(fixAbsoluteElements(screenState));
        fixes.push(fixFlexLayouts(screenState));
        return fixes;
    }

    // ---------- Apply fixes with state comparison ----------
    function applyFixesWithRetry(state, attempt = 1) {
        if (isApplyingFixes) return;
        
        // Avoid reapplying identical state
        if (lastAppliedState && 
            lastAppliedState.width === state.width && 
            lastAppliedState.deviceType === state.deviceType &&
            lastAppliedState.orientation === state.orientation) {
            return;
        }
        
        isApplyingFixes = true;
        
        try {
            const fixes = fixResponsiveness(state);
            console.log(`✅ Applied fixes: ${fixes.filter(f => f).join(', ')}`);
            
            // Update body classes
            document.body.classList.remove('mobile-view', 'tablet-view', 'desktop-view', 'portrait', 'landscape');
            if (state.isMobile) document.body.classList.add('mobile-view');
            else if (state.isTablet) document.body.classList.add('tablet-view');
            else document.body.classList.add('desktop-view');
            document.body.classList.add(state.isPortrait ? 'portrait' : 'landscape');
            
            lastAppliedState = { ...state };
            
            // Dispatch event for other scripts
            window.dispatchEvent(new CustomEvent('screenStateChanged', { detail: state }));
        } catch (error) {
            console.warn(`⚠️ Fix attempt ${attempt} failed:`, error);
            if (attempt < config.retryAttempts) {
                setTimeout(() => applyFixesWithRetry(state, attempt + 1), config.retryDelay);
            }
        } finally {
            // Small delay to allow DOM to settle before re-enabling flag
            setTimeout(() => { isApplyingFixes = false; }, 50);
        }
    }

    // ---------- Handle screen changes (debounced) ----------
    function handleScreenChange() {
        clearTimeout(fixTimeout);
        fixTimeout = setTimeout(() => {
            const newState = detectScreenState();
            if (!currentState || 
                currentState.width !== newState.width || 
                currentState.orientation !== newState.orientation ||
                currentState.deviceType !== newState.deviceType) {
                console.log(`🔄 Screen changed: ${newState.deviceType} | ${newState.orientation} | ${newState.width}px`);
                currentState = newState;
                applyFixesWithRetry(currentState);
            }
        }, config.debounceDelay);
    }

    // ---------- Observe DOM changes but ignore self-triggered mutations ----------
    function observeDOMChanges() {
        if (mutationObserver) mutationObserver.disconnect();
        
        mutationObserver = new MutationObserver((mutations) => {
            if (isApplyingFixes) return;  // 🔥 critical: ignore mutations caused by our own fixes
            
            let shouldRefresh = false;
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldRefresh = true;
                    break;
                }
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                    // Only refresh if the mutation wasn't caused by us
                    shouldRefresh = true;
                    break;
                }
            }
            if (shouldRefresh && currentState) {
                setTimeout(() => applyFixesWithRetry(currentState), 100);
            }
        });
        
        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
    }

    function observeResizeAndOrientation() {
        window.addEventListener('resize', handleScreenChange);
        window.addEventListener('orientationchange', () => setTimeout(handleScreenChange, 50));
        if (window.screen?.addEventListener) {
            window.screen.addEventListener('change', handleScreenChange);
        }
        if (window.ResizeObserver) {
            resizeObserver = new ResizeObserver(() => handleScreenChange());
            resizeObserver.observe(document.body);
        }
    }

    function addResponsiveCSSVariables() {
        const style = document.createElement('style');
        style.textContent = `
            .responsive-container {
                width: 100%;
                max-width: 1280px;
                margin-left: auto;
                margin-right: auto;
            }
            @media (max-width: 640px) {
                .responsive-container { padding-left: 16px; padding-right: 16px; }
            }
            @media (min-width: 641px) and (max-width: 768px) {
                .responsive-container { padding-left: 24px; padding-right: 24px; }
            }
            @media (min-width: 769px) {
                .responsive-container { padding-left: 32px; padding-right: 32px; }
            }
            .mobile-menu-toggle { display: none; }
            @media (max-width: 768px) {
                .mobile-menu-toggle { display: block !important; }
                nav ul:not(.show-mobile) { display: none !important; }
                nav ul.show-mobile {
                    display: flex !important;
                    flex-direction: column !important;
                    position: absolute !important;
                    top: 100% !important;
                    left: 0 !important;
                    right: 0 !important;
                    background: white !important;
                    padding: 20px !important;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
                    z-index: 1000 !important;
                }
            }
            body, html { overflow-x: hidden; width: 100%; }
            * { transition-property: padding, margin, font-size, gap; transition-duration: 0.2s; transition-timing-function: ease; }
            body.resizing * { transition: none !important; }
        `;
        document.head.appendChild(style);
    }

    function optimizePerformance() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            document.body.classList.add('resizing');
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => document.body.classList.remove('resizing'), 200);
        });
    }

    function initAutoResponsiveness() {
        console.log('🚀 Auto-Responsiveness System Initialized');
        addResponsiveCSSVariables();
        currentState = detectScreenState();
        applyFixesWithRetry(currentState);
        observeResizeAndOrientation();
        observeDOMChanges();
        optimizePerformance();
        window.responsiveSystem = {
            getState: () => currentState,
            refresh: () => handleScreenChange(),
            forceFix: () => applyFixesWithRetry(currentState),
            config
        };
        console.log(`✅ Initial state: ${currentState.deviceType} | ${currentState.orientation} | ${currentState.width}px`);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAutoResponsiveness);
    } else {
        initAutoResponsiveness();
    }
})();