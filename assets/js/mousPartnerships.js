        // --- MOU DATA (multiple colleges/universities) ---
        const mouPartnerships = [
            {
                id: 1,
                university: "Amity",
                subtext: "University",
                allianceType: "Academic Alliance",
                description: "Establishing Center of Excellence for AI and Cloud Computing. Direct industry project access for students, joint research programs, and global faculty exchange.",
                mainImage: "https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&q=80&w=1200",
                thumbnails: [
                    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=400",
                    "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=400",
                    "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=400"
                ],
                logo: "https://png.pngtree.com/png-clipart/20211121/original/pngtree-university-logo-png-image_6950962.png"
            },
            {
                id: 2,
                university: "IIT",
                subtext: "Bombay",
                allianceType: "Research & Innovation Hub",
                description: "Strategic partnership to foster deep-tech incubation, AI research labs, and semester-long industry mentorship programs. Joint certification courses for next-gen engineers.",
                mainImage: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200",
                thumbnails: [
                    "https://images.unsplash.com/photo-1580537653466-0f78f673d09c?auto=format&fit=crop&q=80&w=400",
                    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=400",
                    "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&q=80&w=400"
                ],
                logo: "https://upload.wikimedia.org/wikipedia/en/thumb/2/2c/Indian_Institute_of_Technology_Bombay_Logo.svg/320px-Indian_Institute_of_Technology_Bombay_Logo.svg.png"
            },
            {
                id: 3,
                university: "Delhi",
                subtext: "University",
                allianceType: "Faculty Development Program",
                description: "Collaborative MOU to enhance curriculum with real-time data science modules, joint workshops, and placement bootcamps for 5000+ students across campuses.",
                mainImage: "https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?auto=format&fit=crop&q=80&w=1200",
                thumbnails: [
                    "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=400",
                    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=400",
                    "https://images.unsplash.com/photo-1541823709867-1b206113eafd?auto=format&fit=crop&q=80&w=400"
                ],
                logo: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/Delhi_University_logo.png/220px-Delhi_University_logo.png"
            },
            {
                id: 4,
                university: "Stanford",
                subtext: "International",
                allianceType: "Global Edge Partnership",
                description: "Cross-border research on sustainable AI, student exchange program, and joint executive education. Access to global innovation labs and silicon valley mentorship.",
                mainImage: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&q=80&w=1200",
                thumbnails: [
                    "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&q=80&w=400",
                    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=400",
                    "https://images.unsplash.com/photo-1544717305-996b815c338d?auto=format&fit=crop&q=80&w=400"
                ],
                logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Stanford_University_seal_2003.svg/200px-Stanford_University_seal_2003.svg.png"
            },
            {
                id: 5,
                university: "NUS",
                subtext: "Singapore",
                allianceType: "AI Center of Excellence",
                description: "Launch of dual-degree programs, faculty exchange and global internship tracks focusing on fintech and intelligent systems. Industry-led capstone projects.",
                mainImage: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=1200",
                thumbnails: [
                    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&q=80&w=400",
                    "https://images.unsplash.com/photo-1519456264917-42d0aa2e0625?auto=format&fit=crop&q=80&w=400",
                    "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=400"
                ],
                logo: "https://upload.wikimedia.org/wikipedia/en/thumb/3/34/National_University_of_Singapore_logo.svg/320px-National_University_of_Singapore_logo.svg.png"
            }
        ];

        // DOM elements
        let currentIndex = 0;
        const totalMOUs = mouPartnerships.length;

        // Image elements
        const mainImageEl = document.getElementById('mainImage');
        const thumb1El = document.getElementById('thumb1');
        const thumb2El = document.getElementById('thumb2');
        const thumb3El = document.getElementById('thumb3');
        const logoEl = document.getElementById('partnerLogo');
        const allianceTypeEl = document.getElementById('allianceType');
        const uniNameEl = document.getElementById('uniName');
        const uniSubtextEl = document.getElementById('uniSubtext');
        const mouDescEl = document.getElementById('mouDesc');
        
        const prevBtn = document.getElementById('prevMouBtn');
        const nextBtn = document.getElementById('nextMouBtn');

        // Fade transition on content update (smooth)
        const contentWrapper = document.getElementById('mouContent');
        
        // Helper: update UI with current MOU data
        function updateMOUContent() {
            if (!mouPartnerships[currentIndex]) return;
            const data = mouPartnerships[currentIndex];
            
            // Optional small fade animation
            contentWrapper.style.opacity = '0.6';
            setTimeout(() => {
                // main image
                mainImageEl.src = data.mainImage;
                mainImageEl.alt = `${data.university} ${data.subtext} MOU Signing`;
                // thumbnails
                thumb1El.src = data.thumbnails[0];
                thumb2El.src = data.thumbnails[1];
                thumb3El.src = data.thumbnails[2];
                thumb1El.alt = `MOU event thumbnail 1`;
                thumb2El.alt = `MOU event thumbnail 2`;
                thumb3El.alt = `MOU event thumbnail 3`;
                
                // logo with fallback if image broken
                logoEl.src = data.logo;
                logoEl.onerror = function() { this.src = 'https://placehold.co/400x400?text=Logo'; };
                
                // text details
                allianceTypeEl.textContent = data.allianceType;
                uniNameEl.textContent = data.university;
                uniSubtextEl.textContent = data.subtext;
                mouDescEl.textContent = data.description;
                
                contentWrapper.style.opacity = '1';
            }, 80);
        }
        
        // Thumbnail click: update main image to that thumbnail (enhance UX)
        function bindThumbnailEvents() {
            const thumbs = [thumb1El, thumb2El, thumb3El];
            thumbs.forEach((thumb, idx) => {
                if (!thumb) return;
                const newThumb = thumb.cloneNode(true);
                thumb.parentNode.replaceChild(newThumb, thumb);
                // re-assign id and event
                if (idx === 0) window.thumb1El = newThumb;
                if (idx === 1) window.thumb2El = newThumb;
                if (idx === 2) window.thumb3El = newThumb;
                newThumb.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const currentData = mouPartnerships[currentIndex];
                    if (currentData && currentData.thumbnails[idx]) {
                        mainImageEl.src = currentData.thumbnails[idx];
                        // optional subtle scale effect
                        mainImageEl.classList.add('scale-105');
                        setTimeout(() => mainImageEl.classList.remove('scale-105'), 200);
                    }
                });
                newThumb.classList.add('cursor-pointer', 'rounded-xl', 'transition', 'duration-150', 'hover:brightness-90');
            });
        }
        
        // update after each render to reattach thumbnail events
        function reattachThumbEvents() {
            // Because images get replaced with src update, we need to re-bind click to new DOM elements? 
            // But thumbnails elements remain same IDs, but their src changed. The event listeners remain attached unless removed.
            // However to be safe we remove old listeners and rebind. For simplicity we use event delegation? But easier: attach again after each render.
            // Since we replaced content via setAttribute only, events already exist. But if cloneNode in bindThumbnailEvents we manage.
            // Actually we only call bindThumbnailEvents once initially, but when src changes, the same elements keep listeners.
            // But we should ensure that after full update, thumbnails respond to click to change mainImage.
            // But thumbnails already have their own click listeners that reference current MOU data. We'll set robust handler.
            // Re-attach fresh to avoid stale closures.
            const thumb1 = document.getElementById('thumb1');
            const thumb2 = document.getElementById('thumb2');
            const thumb3 = document.getElementById('thumb3');
            if (thumb1) {
                const newThumb1 = thumb1.cloneNode(true);
                thumb1.parentNode.replaceChild(newThumb1, thumb1);
                newThumb1.id = 'thumb1';
                newThumb1.addEventListener('click', () => {
                    const data = mouPartnerships[currentIndex];
                    if (data?.thumbnails[0]) mainImageEl.src = data.thumbnails[0];
                });
            }
            if (thumb2) {
                const newThumb2 = thumb2.cloneNode(true);
                thumb2.parentNode.replaceChild(newThumb2, thumb2);
                newThumb2.id = 'thumb2';
                newThumb2.addEventListener('click', () => {
                    const data = mouPartnerships[currentIndex];
                    if (data?.thumbnails[1]) mainImageEl.src = data.thumbnails[1];
                });
            }
            if (thumb3) {
                const newThumb3 = thumb3.cloneNode(true);
                thumb3.parentNode.replaceChild(newThumb3, thumb3);
                newThumb3.id = 'thumb3';
                newThumb3.addEventListener('click', () => {
                    const data = mouPartnerships[currentIndex];
                    if (data?.thumbnails[2]) mainImageEl.src = data.thumbnails[2];
                });
            }
        }
        
        // navigation: previous and next (circular / infinite)
        function goPrev() {
            currentIndex = (currentIndex - 1 + totalMOUs) % totalMOUs;
            updateMOUContent();
            setTimeout(() => reattachThumbEvents(), 50);
            updateButtonStyles();
        }
        
        function goNext() {
            currentIndex = (currentIndex + 1) % totalMOUs;
            updateMOUContent();
            setTimeout(() => reattachThumbEvents(), 50);
            updateButtonStyles();
        }
        
        // Optional button disable styling when at ends? but with circular it's always enabled, but we keep enabled
        function updateButtonStyles() {
            // circular, always enabled but we still remove any disabled attribute if present
            if (prevBtn) prevBtn.disabled = false;
            if (nextBtn) nextBtn.disabled = false;
        }
        
        // Event listeners for buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', goPrev);
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', goNext);
        }
        
        // initial load
        updateMOUContent();
        setTimeout(() => {
            reattachThumbEvents();
        }, 100);
        
        // Also reattach on window load to ensure images are interactive
        window.addEventListener('load', () => {
            reattachThumbEvents();
            lucide.createIcons();   // refresh icons if needed
            updateButtonStyles();
        });
        
        // lucide icons rendering
        lucide.createIcons();
        
        // responsiveness: ensure thumbnails hover and main image smooth
        const style = document.createElement('style');
        style.textContent = `
            .thumbnail-hover {
                transition: transform 0.2s ease, opacity 0.2s;
            }
            .thumbnail-hover:hover {
                transform: scale(0.97);
                opacity: 0.9;
                cursor: pointer;
            }
            #mainImage {
                transition: transform 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1);
            }
            @media (max-width: 768px) {
                .mou-slider-container .rounded-3xl {
                    border-radius: 1.5rem;
                }
            }
        `;
        document.head.appendChild(style);
        
        // additional keyboard accessibility
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                goPrev();
                e.preventDefault();
            } else if (e.key === 'ArrowRight') {
                goNext();
                e.preventDefault();
            }
        });
        
        // ensure that fallback for logos works and all images are robust
        const imagesToCheck = [mainImageEl, logoEl];
        imagesToCheck.forEach(img => {
            if (img) {
                img.addEventListener('error', function() {
                    if (this.id === 'mainImage') this.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200';
                    if (this.id === 'partnerLogo') this.src = 'https://placehold.co/200x200?text=Partner';
                });
            }
        });
        
        // fix for missing thumbnail fallback
        const setThumbFallback = () => {
            const thumbs = [thumb1El, thumb2El, thumb3El];
            thumbs.forEach(thumb => {
                if (thumb) {
                    thumb.addEventListener('error', function() {
                        this.src = 'https://images.unsplash.com/photo-1544717305-996b815c338d?auto=format&fit=crop&q=80&w=400';
                    });
                }
            });
        };
        setThumbFallback();
