// ============================================
// AUTOMATIC RESPONSIVENESS DETECTOR & FIXER
// ============================================

(function() {
    'use strict';

    // Configuration
    const config = {
        debounceDelay: 150,
        breakpoints: {
            mobile: 640,
            tablet: 768,
            laptop: 1024,
            desktop: 1280,
            wide: 1536
        },
        observerThrottle: 100,
        retryAttempts: 3,
        retryDelay: 300
    };

    // ============================================
    // 1. DETECT CURRENT DEVICE & SCREEN STATE
    // ============================================
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

    // ============================================
    // 2. FIX ELEMENTS BASED ON SCREEN STATE
    // ============================================
    function fixResponsiveness(screenState) {
        const fixes = [];

        // Fix containers
        fixes.push(fixContainers(screenState));
        
        // Fix grid layouts
        fixes.push(fixGrids(screenState));
        
        // Fix horizontal sliders
        fixes.push(fixHorizontalSliders(screenState));
        
        // Fix font sizes
        fixes.push(fixFontSizes(screenState));
        
        // Fix spacing/margins
        fixes.push(fixSpacing(screenState));
        
        // Fix images and media
        fixes.push(fixMedia(screenState));
        
        // Fix navigation/menus
        fixes.push(fixNavigation(screenState));
        
        // Fix tables
        fixes.push(fixTables(screenState));
        
        // Fix absolute positioned elements
        fixes.push(fixAbsoluteElements(screenState));
        
        // Fix flex layouts
        fixes.push(fixFlexLayouts(screenState));

        return fixes;
    }

    // Fix container widths
    function fixContainers(screenState) {
        const containers = document.querySelectorAll('.container, .wrapper, .max-w-*, [class*="container"]');
        containers.forEach(container => {
            if (screenState.isMobile) {
                container.style.paddingLeft = '16px';
                container.style.paddingRight = '16px';
            } else if (screenState.isTablet) {
                container.style.paddingLeft = '24px';
                container.style.paddingRight = '24px';
            } else {
                container.style.paddingLeft = '32px';
                container.style.paddingRight = '32px';
            }
        });
        return 'containers-fixed';
    }

    // Fix grid layouts
    function fixGrids(screenState) {
        const grids = document.querySelectorAll('[class*="grid"], .grid');
        grids.forEach(grid => {
            const computedStyle = window.getComputedStyle(grid);
            const gridTemplateColumns = computedStyle.gridTemplateColumns;
            
            if (screenState.isMobile && gridTemplateColumns.includes('repeat')) {
                // Adjust grid columns for mobile
                if (grid.classList.contains('mentor-grid-layout')) {
                    grid.style.gridTemplateColumns = '1fr';
                } else {
                    const currentGap = parseInt(computedStyle.gap) || 20;
                    if (currentGap > 16) {
                        grid.style.gap = '16px';
                    }
                }
            } else if (screenState.isTablet && !screenState.isMobile) {
                // Tablet adjustments
                if (grid.classList.contains('roadmap-grid')) {
                    // Keep original but adjust
                }
            }
        });
        return 'grids-fixed';
    }

    // Fix horizontal sliders (scroll issues)
    function fixHorizontalSliders(screenState) {
        const sliders = document.querySelectorAll('.feature-slider-container, .placement-slider, .logo-scroll');
        sliders.forEach(slider => {
            if (screenState.isMobile) {
                slider.style.gap = '12px';
                slider.style.padding = '0 16px 24px 16px';
            } else if (screenState.isTablet) {
                slider.style.gap = '20px';
                slider.style.padding = '0 24px 32px 24px';
            } else {
                slider.style.gap = '24px';
                slider.style.padding = '0 40px 40px 40px';
            }
            
            // Ensure smooth scrolling on touch devices
            if (screenState.isMobile || screenState.isTablet) {
                slider.style.webkitOverflowScrolling = 'touch';
                slider.style.scrollBehavior = 'smooth';
            }
        });
        return 'sliders-fixed';
    }

    // Fix font sizes dynamically
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
                if (!el.style.fontSize || el.getAttribute('data-auto-font') !== 'false') {
                    el.style.fontSize = fontSize;
                }
            });
        });
        return 'fonts-fixed';
    }

    // Fix spacing and margins
    function fixSpacing(screenState) {
        // Fix sections padding
        const sections = document.querySelectorAll('section, .section, [class*="section"]');
        sections.forEach(section => {
            if (screenState.isMobile) {
                if (!section.classList.contains('premium-mentor-section')) {
                    section.style.paddingTop = '40px';
                    section.style.paddingBottom = '40px';
                }
            } else if (screenState.isTablet) {
                section.style.paddingTop = '60px';
                section.style.paddingBottom = '60px';
            }
        });
        
        // Fix roadmap section
        const roadmapContainer = document.querySelector('.roadmap-container');
        if (roadmapContainer) {
            if (screenState.isMobile) {
                roadmapContainer.style.padding = '60px 0 80px 0';
            }
        }
        
        return 'spacing-fixed';
    }

    // Fix images and media
    function fixMedia(screenState) {
        // Make all images responsive
        const images = document.querySelectorAll('img:not(.no-auto-responsive)');
        images.forEach(img => {
            if (!img.hasAttribute('data-original-width')) {
                img.setAttribute('data-original-width', img.width);
                img.setAttribute('data-original-height', img.height);
            }
            
            if (screenState.isMobile) {
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
            }
        });
        
        // Fix image-stack component
        const imageStacks = document.querySelectorAll('.image-stack');
        imageStacks.forEach(stack => {
            if (screenState.isMobile) {
                stack.style.height = 'auto';
                stack.style.minHeight = '300px';
            } else {
                stack.style.height = '480px';
            }
        });
        
        return 'media-fixed';
    }

    // Fix navigation
    function fixNavigation(screenState) {
        const navs = document.querySelectorAll('nav, .navbar, .menu');
        navs.forEach(nav => {
            if (screenState.isMobile) {
                // Check if mobile menu needs to be toggled
                const menuItems = nav.querySelectorAll('ul:not(.mobile-menu)');
                menuItems.forEach(menu => {
                    if (window.innerWidth <= 768 && !menu.classList.contains('hidden-mobile')) {
                        // Add mobile menu handling
                        if (!nav.querySelector('.mobile-menu-toggle')) {
                            createMobileToggle(nav);
                        }
                    }
                });
            }
        });
        return 'navigation-fixed';
    }

    // Create mobile menu toggle
    function createMobileToggle(nav) {
        const toggle = document.createElement('button');
        toggle.className = 'mobile-menu-toggle';
        toggle.innerHTML = '☰';
        toggle.style.cssText = `
            display: block;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            padding: 8px;
        `;
        
        const menu = nav.querySelector('ul');
        if (menu && !nav.querySelector('.mobile-menu-toggle')) {
            nav.insertBefore(toggle, menu);
            toggle.addEventListener('click', () => {
                menu.classList.toggle('show-mobile');
                menu.style.display = menu.classList.contains('show-mobile') ? 'flex' : 'none';
            });
        }
    }

    // Fix tables for responsiveness
    function fixTables(screenState) {
        const tables = document.querySelectorAll('table:not(.responsive-table)');
        tables.forEach(table => {
            if (screenState.isMobile) {
                if (!table.parentElement.classList.contains('table-responsive-wrapper')) {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'table-responsive-wrapper';
                    wrapper.style.cssText = 'overflow-x: auto; -webkit-overflow-scrolling: touch;';
                    table.parentNode.insertBefore(wrapper, table);
                    wrapper.appendChild(table);
                }
            }
        });
        return 'tables-fixed';
    }

    // Fix absolute positioned elements
    function fixAbsoluteElements(screenState) {
        const absoluteElements = document.querySelectorAll('.google-review-tab, .whatsapp-float, [style*="position: absolute"]');
        absoluteElements.forEach(el => {
            if (screenState.isMobile) {
                if (el.classList.contains('google-review-tab')) {
                    el.style.transform = 'translateY(-50%) rotate(-90deg) scale(0.8)';
                } else if (el.classList.contains('whatsapp-float')) {
                    el.style.bottom = '20px';
                    el.style.right = '20px';
                    el.style.width = '50px';
                    el.style.height = '50px';
                    el.style.fontSize = '24px';
                }
            } else {
                if (el.classList.contains('google-review-tab')) {
                    el.style.transform = 'translateY(-50%) rotate(-90deg)';
                    el.style.transformOrigin = 'left bottom';
                } else if (el.classList.contains('whatsapp-float')) {
                    el.style.bottom = '30px';
                    el.style.right = '30px';
                    el.style.width = '60px';
                    el.style.height = '60px';
                    el.style.fontSize = '30px';
                }
            }
        });
        return 'absolute-fixed';
    }

    // Fix flex layouts
    function fixFlexLayouts(screenState) {
        const flexContainers = document.querySelectorAll('[class*="flex"], .flex');
        flexContainers.forEach(container => {
            const flexDirection = window.getComputedStyle(container).flexDirection;
            if (screenState.isMobile && flexDirection === 'row' && container.children.length > 3) {
                // Check if items wrap
                const containerWidth = container.clientWidth;
                let totalWidth = 0;
                Array.from(container.children).forEach(child => {
                    totalWidth += child.clientWidth;
                });
                if (totalWidth > containerWidth) {
                    container.style.flexWrap = 'wrap';
                    container.style.gap = '10px';
                }
            }
        });
        return 'flex-fixed';
    }

    // ============================================
    // 3. DETECT CHANGES AND REAPPLY FIXES
    // ============================================
    let currentState = null;
    let fixTimeout = null;
    let resizeObserver = null;
    let mutationObserver = null;

    function handleScreenChange() {
        clearTimeout(fixTimeout);
        fixTimeout = setTimeout(() => {
            const newState = detectScreenState();
            
            // Check if screen state actually changed
            if (!currentState || 
                currentState.width !== newState.width || 
                currentState.orientation !== newState.orientation ||
                currentState.deviceType !== newState.deviceType) {
                
                console.log(`🔄 Screen changed: ${newState.deviceType} | ${newState.orientation} | ${newState.width}px`);
                
                currentState = newState;
                
                // Apply fixes with retry mechanism
                applyFixesWithRetry(newState);
                
                // Dispatch custom event for other scripts
                window.dispatchEvent(new CustomEvent('screenStateChanged', { detail: newState }));
            }
        }, config.debounceDelay);
    }

    function applyFixesWithRetry(state, attempt = 1) {
        try {
            const fixes = fixResponsiveness(state);
            console.log(`✅ Applied fixes: ${fixes.filter(f => f).join(', ')}`);
            
            // Add responsive class to body
            document.body.classList.remove('mobile-view', 'tablet-view', 'desktop-view');
            if (state.isMobile) document.body.classList.add('mobile-view');
            else if (state.isTablet) document.body.classList.add('tablet-view');
            else document.body.classList.add('desktop-view');
            
            // Add orientation class
            document.body.classList.remove('portrait', 'landscape');
            document.body.classList.add(state.isPortrait ? 'portrait' : 'landscape');
            
        } catch (error) {
            console.warn(`⚠️ Fix attempt ${attempt} failed:`, error);
            if (attempt < config.retryAttempts) {
                setTimeout(() => applyFixesWithRetry(state, attempt + 1), config.retryDelay);
            }
        }
    }

    // ============================================
    // 4. OBSERVE DOM CHANGES (Dynamic Content)
    // ============================================
    function observeDOMChanges() {
        if (mutationObserver) mutationObserver.disconnect();
        
        mutationObserver = new MutationObserver((mutations) => {
            let shouldRefresh = false;
            
            mutations.forEach(mutation => {
                // Check if new elements were added that might need responsive fixes
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldRefresh = true;
                }
                // Check if styles were changed
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                    shouldRefresh = true;
                }
            });
            
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

    // ============================================
    // 5. OBSERVE RESIZE AND ORIENTATION
    // ============================================
    function observeResizeAndOrientation() {
        // Standard resize event
        window.addEventListener('resize', handleScreenChange);
        
        // Orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(handleScreenChange, 50);
        });
        
        // Screen change API (for foldables, dual screens)
        if (window.screen?.addEventListener) {
            window.screen.addEventListener('change', handleScreenChange);
        }
        
        // ResizeObserver for container changes
        if (window.ResizeObserver) {
            resizeObserver = new ResizeObserver(() => {
                handleScreenChange();
            });
            resizeObserver.observe(document.body);
        }
        
        // Match media for dark/light mode changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleScreenChange);
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', handleScreenChange);
        
        // Match media for reduced motion preferences
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', handleScreenChange);
    }

    // ============================================
    // 6. ADD RESPONSIVE CSS VARIABLES
    // ============================================
    function addResponsiveCSSVariables() {
        const style = document.createElement('style');
        style.textContent = `
            /* Auto-responsive utility classes */
            .responsive-container {
                width: 100%;
                max-width: 1280px;
                margin-left: auto;
                margin-right: auto;
            }
            
            @media (max-width: 640px) {
                .responsive-container {
                    padding-left: 16px;
                    padding-right: 16px;
                }
            }
            
            @media (min-width: 641px) and (max-width: 768px) {
                .responsive-container {
                    padding-left: 24px;
                    padding-right: 24px;
                }
            }
            
            @media (min-width: 769px) {
                .responsive-container {
                    padding-left: 32px;
                    padding-right: 32px;
                }
            }
            
            /* Mobile menu animation */
            .mobile-menu-toggle {
                display: none;
            }
            
            @media (max-width: 768px) {
                .mobile-menu-toggle {
                    display: block !important;
                }
                
                nav ul:not(.show-mobile) {
                    display: none !important;
                }
                
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
            
            /* Prevent horizontal overflow */
            body, html {
                overflow-x: hidden;
                width: 100%;
            }
            
            /* Smooth transitions for responsive changes */
            * {
                transition-property: padding, margin, font-size, gap;
                transition-duration: 0.3s;
                transition-timing-function: ease;
            }
            
            /* Disable transitions on resize for performance */
            body.resizing * {
                transition: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // ============================================
    // 7. PERFORMANCE OPTIMIZATION
    // ============================================
    function optimizePerformance() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            document.body.classList.add('resizing');
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                document.body.classList.remove('resizing');
            }, 200);
        });
        
        // Throttle scroll events
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Update any scroll-dependent responsive elements
                    if (currentState && currentState.isMobile) {
                        const reviewTab = document.querySelector('.google-review-tab');
                        if (reviewTab) {
                            const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
                            reviewTab.style.opacity = Math.max(0, 1 - scrollPercent * 2);
                        }
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ============================================
    // 8. INITIALIZE
    // ============================================
    function initAutoResponsiveness() {
        console.log('🚀 Auto-Responsiveness System Initialized');
        
        // Add CSS variables
        addResponsiveCSSVariables();
        
        // Initial detection and fix
        currentState = detectScreenState();
        applyFixesWithRetry(currentState);
        
        // Set up observers
        observeResizeAndOrientation();
        observeDOMChanges();
        
        // Performance optimization
        optimizePerformance();
        
        // Export state to window for debugging
        window.responsiveSystem = {
            getState: () => currentState,
            refresh: () => handleScreenChange(),
            forceFix: () => applyFixesWithRetry(currentState),
            config: config
        };
        
        console.log(`✅ Initial state: ${currentState.deviceType} | ${currentState.orientation} | ${currentState.width}px`);
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAutoResponsiveness);
    } else {
        initAutoResponsiveness();
    }

})();