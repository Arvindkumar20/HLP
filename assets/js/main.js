let currentSlideIdx = 0;
const slides = document.querySelectorAll(".slide");
const thumbs = document.querySelectorAll(".thumb-btn");

function goToSlide(idx) {
  currentSlideIdx = idx;
  slides.forEach((slide, i) => slide.classList.toggle("active", i === idx));
  thumbs.forEach((thumb, i) => thumb.classList.toggle("active", i === idx));
}

setInterval(() => {
  currentSlideIdx = (currentSlideIdx + 1) % slides.length;
  goToSlide(currentSlideIdx);
}, 5000);

function toggleFAQ(element) {
  const isActive = element.classList.contains("active");
  document
    .querySelectorAll(".faq-item")
    .forEach((item) => item.classList.remove("active"));
  if (!isActive) element.classList.add("active");
}

let isExpanded = false;
function toggleMoreFaqs() {
  const hiddenItems = document.querySelectorAll(".hidden-faq");
  const btnText = document.getElementById("btn-text");
  const btnIcon = document.getElementById("btn-icon");

  isExpanded = !isExpanded;

  hiddenItems.forEach((item) => {
    item.style.display = isExpanded ? "block" : "none";
  });

  btnText.innerText = isExpanded
    ? "SHOW LESS QUESTIONS"
    : "SHOW MORE QUESTIONS";
  btnIcon.className = isExpanded
    ? "fas fa-chevron-up text-[10px]"
    : "fas fa-chevron-down text-[10px]";
}





        // ============================================
        // WHATSAPP INTEGRATION (opens WhatsApp on click)
        // ============================================
        (function() {
            // ⚙️ CONFIGURE YOUR WHATSAPP NUMBER HERE (without '+' sign)
            const WHATSAPP_NUMBER = "919876543210";  // Replace with your actual number
            const DEFAULT_MESSAGE = "Hello, I need career guidance. Please call me back.";

            function openWhatsApp(message) {
                const encodedMsg = encodeURIComponent(message);
                const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`;
                window.open(url, '_blank');
            }

            // Attach to both buttons (inside dropdown and external)
            const dropdownBtn = document.getElementById('callbackDropdownBtn');
            const externalBtn = document.getElementById('callbackExternalBtn');

            if (dropdownBtn) {
                dropdownBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();  // prevent dropdown from closing (if any)
                    openWhatsApp(DEFAULT_MESSAGE);
                });
            }

            if (externalBtn) {
                externalBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    openWhatsApp(DEFAULT_MESSAGE);
                });
            }

            // Also support any element with class 'request-callback'
            document.querySelectorAll('.request-callback, [data-callback="whatsapp"], .whatsapp').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const customMsg = this.getAttribute('data-message') || DEFAULT_MESSAGE;
                    openWhatsApp(customMsg);
                });
            });
        })();



        
        // Sidebar elements
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        const closeSidebarBtn = document.getElementById('closeSidebarBtn');

        // Open sidebar
        function openSidebar() {
            sidebar.classList.remove('sidebar-closed');
            sidebar.classList.add('sidebar-open');
            overlay.classList.remove('opacity-0', 'pointer-events-none');
            overlay.classList.add('opacity-100', 'pointer-events-auto');
            document.body.classList.add('no-scroll');
        }

        // Close sidebar
        function closeSidebar() {
            sidebar.classList.remove('sidebar-open');
            sidebar.classList.add('sidebar-closed');
            overlay.classList.remove('opacity-100', 'pointer-events-auto');
            overlay.classList.add('opacity-0', 'pointer-events-none');
            document.body.classList.remove('no-scroll');
        }

        // Event listeners
        hamburgerBtn.addEventListener('click', openSidebar);
        closeSidebarBtn.addEventListener('click', closeSidebar);
        overlay.addEventListener('click', closeSidebar);

        // Collapsible submenu logic
        function initCollapsibleMenus() {
            const collapsibleItems = document.querySelectorAll('.menu-item.has-collapsible');
            collapsibleItems.forEach(item => {
                const trigger = item.querySelector('a');
                const submenu = item.querySelector('.menu-child');
                const arrow = trigger.querySelector('.menu-rotate');

                if (!submenu) return;

                // Set initial state
                if (item.classList.contains('active')) {
                    submenu.classList.add('show');
                    if (arrow) arrow.style.transform = 'rotate(90deg)';
                } else {
                    submenu.classList.remove('show');
                    if (arrow) arrow.style.transform = 'rotate(0deg)';
                }

                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    item.classList.toggle('active');
                    const isActive = item.classList.contains('active');
                    if (isActive) {
                        submenu.classList.add('show');
                        if (arrow) arrow.style.transform = 'rotate(90deg)';
                    } else {
                        submenu.classList.remove('show');
                        if (arrow) arrow.style.transform = 'rotate(0deg)';
                    }
                });
            });
        }

        initCollapsibleMenus();

        // Ensure sidebar starts closed
        sidebar.classList.add('sidebar-closed');
        sidebar.style.transform = '';

        // WhatsApp integration for "Request A Call Back" inside dropdown
        const callbackBtn = document.getElementById('callbackDropdownBtn');
        if (callbackBtn) {
            callbackBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const phoneNumber = "919205004404"; // Replace with your WhatsApp number
                const message = "Hello HindTech, I need career guidance. Please call me back.";
                window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
            });
        }
    
    