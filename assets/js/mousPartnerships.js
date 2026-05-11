// --- MOU DATA (multiple colleges/universities) ---
const mouPartnerships = [

    {
        id: 2,
        university: "GGPL",
        subtext: "Lucknow",
        allianceType: "Industry Training Alliance",

        description:
            "Strategic partnership to provide practical exposure in modern technologies including MERN Stack, AI Tools, and Cloud Computing through workshops, seminars, and internship opportunities.",

        aboutPoints: [
            "Hands-on MERN Stack & AI workshops for students.",
            "Industry mentorship with live project exposure.",
            "Career-focused training for placement readiness.",
            "Practical cloud computing and deployment sessions."
        ],

        mainImage: "/assets/images/campus-trainig/mous/ggpl.png",

        thumbnails: [
            "https://images.unsplash.com/photo-1580537653466-0f78f673d09c?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&q=80&w=400"
        ],

        logo: "/assets/images/campus-trainig/mous/ggpllogo.jpg"
    },

    {
        id: 3,
        university: "GPL",
        subtext: "Lucknow",
        allianceType: "Skill Development Collaboration",

        description:
            "Focused on enhancing employability through hands-on coding bootcamps, placement preparation, live software development training, and real-world technical mentorship.",

        aboutPoints: [
            "Advanced coding bootcamps with real-world tasks.",
            "Placement preparation with interview practice.",
            "Software development training by industry experts.",
            "Team-based project collaboration and mentorship."
        ],

        mainImage: "./assets/images/campus-trainig/mous/gplmain.png",

        thumbnails: [
            "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1541823709867-1b206113eafd?auto=format&fit=crop&q=80&w=400"
        ],

        logo: "/assets/images/campus-trainig/mous/gpl.png"
    },

    {
        id: 1,
        university: "SR",
        subtext: "Institution",
        allianceType: "Academic Excellence Partnership",

        description:
            "Collaborative initiative focused on AI, Full Stack Development, and industry-oriented technical training. Students gain access to live projects, expert mentorship, and placement-driven programs.",

        aboutPoints: [
            "AI & Full Stack learning with practical implementation.",
            "Expert mentorship through live technical sessions.",
            "Industry-oriented curriculum for modern technologies.",
            "Placement-driven programs with career guidance."
        ],

        mainImage: "./assets/images/campus-trainig/mous/sr.jpeg",

        thumbnails: [
            "./assets/images/campus-trainig/mous/sr.jpeg",
        ],

        logo: "./assets/images/campus-trainig/mous/srg.png"
    }
];


// DOM elements
let currentIndex = 0;
const totalMOUs = mouPartnerships.length;

const mainImageEl = document.getElementById('mainImage');
const logoEl = document.getElementById('partnerLogo');
const allianceTypeEl = document.getElementById('allianceType');
const mouDescEl = document.getElementById('mouDesc');
const aboutList = document.getElementById("aboutList");

const prevBtn = document.getElementById('prevMouBtn');
const nextBtn = document.getElementById('nextMouBtn');

const contentWrapper = document.getElementById('mouContent');

// Update UI
function updateMOUContent() {
    if (!mouPartnerships[currentIndex]) return;

    const data = mouPartnerships[currentIndex];

    contentWrapper.style.opacity = '0.5';
    contentWrapper.style.transform = 'translateY(10px)';

    setTimeout(() => {

        // Main Image
        mainImageEl.src = data.mainImage;
        mainImageEl.alt =
            `${data.university} ${data.subtext} MOU Signing`;

        // Logo
        logoEl.src = data.logo;

        logoEl.onerror = function () {
            this.src =
                'https://placehold.co/200x200?text=Partner';
        };

        // Text
        allianceTypeEl.textContent = data.allianceType;
        mouDescEl.textContent = data.description;

        // About Points
        aboutList.innerHTML = '';

        data.aboutPoints.forEach(point => {

            aboutList.innerHTML += `
                <li class="flex items-start gap-3">
                    
                    <div class="w-2 h-2 rounded-full bg-brand mt-2 flex-shrink-0"></div>

                    <span class="text-sm md:text-base text-gray-600 font-medium leading-relaxed">
                        ${point}
                    </span>

                </li>
            `;
        });

        // Smooth Fade In
        contentWrapper.style.opacity = '1';
        contentWrapper.style.transform = 'translateY(0px)';

    }, 250);
}


// Navigation
function goPrev() {

    currentIndex =
        (currentIndex - 1 + totalMOUs) % totalMOUs;

    updateMOUContent();
}

function goNext() {

    currentIndex =
        (currentIndex + 1) % totalMOUs;

    updateMOUContent();
}


// Buttons
if (prevBtn) {
    prevBtn.addEventListener('click', goPrev);
}

if (nextBtn) {
    nextBtn.addEventListener('click', goNext);
}


// Keyboard Support
window.addEventListener('keydown', (e) => {

    if (e.key === 'ArrowLeft') {

        goPrev();

    } else if (e.key === 'ArrowRight') {

        goNext();
    }
});


// Smooth Auto Slide
let autoSlide = setInterval(() => {

    goNext();

}, 4000);


// Pause on Hover
contentWrapper.addEventListener("mouseenter", () => {

    clearInterval(autoSlide);

});

contentWrapper.addEventListener("mouseleave", () => {

    autoSlide = setInterval(() => {

        goNext();

    }, 4000);

});


// Initial Load
updateMOUContent();


// Extra Smooth Style
const style = document.createElement('style');

style.textContent = `

    #mouContent{
        transition:
            opacity 0.6s ease,
            transform 0.6s ease;
    }

    #mainImage{
        transition:
            transform 0.7s ease,
            opacity 0.7s ease;
    }

    #mainImage:hover{
        transform: scale(1.02);
    }

`;

document.head.appendChild(style);