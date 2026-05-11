
// ========== FAQ TOGGLE ==========
function toggleFAQ(element) {
  if (!element) return;
  const isActive = element.classList.contains("active");
  document
    .querySelectorAll(".faq-item")
    .forEach((item) => item.classList.remove("active"));
  if (!isActive) element.classList.add("active");
}

// ========== SHOW MORE FAQS ==========
let isExpanded = false;
function toggleMoreFaqs() {
  const hiddenItems = document.querySelectorAll(".hidden-faq");
  const btnText = document.getElementById("btn-text");
  const btnIcon = document.getElementById("btn-icon");
  if (!hiddenItems.length) return;
  isExpanded = !isExpanded;
  hiddenItems.forEach((item) => {
    item.style.display = isExpanded ? "block" : "none";
  });

  if (btnText)
    btnText.innerText = isExpanded
      ? "SHOW LESS QUESTIONS"
      : "SHOW MORE QUESTIONS";
  if (btnIcon)
    btnIcon.className = isExpanded
      ? "fas fa-chevron-up text-[10px]"
      : "fas fa-chevron-down text-[10px]";
}

// ========== WHATSAPP CALLBACK ==========
const phoneNumber = "6307738600";
const callbackButtons = document.querySelectorAll(".callbackBtn");

callbackButtons.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    const message =
      "Hello HindTech, I need career guidance. Please call me back.";
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  });
});

document.querySelectorAll("video").forEach((video) => {
  video.addEventListener("loadeddata", () => {
    video.currentTime = 0.1; // thoda aage le jaake first frame render
  });

  video.addEventListener("click", () => {
    video.setAttribute("controls", "true");
    video.play();
  });
});

/* ================= CONFIG ================= */

const COURSE_CONFIG = {
  mern: {
    title: "MERN Stack",
    options: {
      summer: "mern-summer.pdf",
      internship: "mern-internship.pdf",
    },
  },
  flutter: {
    title: "Flutter",
    options: {
      summer: "flutter-summer.pdf",
      internship: "flutter-summer.pdf",
    },
  },
  php: {
    title: "PHP",
    options: {
      summer: "php-summer.pdf",

      internship: "php-internship.pdf",
    },
  },
  generative_ai: {
    title: "Generative AI",
    options: {
      summer: "genai-summer.pdf",
      internship: "genai-internship.pdf",
    },
  },
};

let selectedCourse = null;

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {
  initModal();
  if (window.lucide) lucide.createIcons();
});

/* ================= MAIN LOGIC ================= */

function initModal() {
  const modal = document.getElementById("syllabusModal");
  const overlay = document.getElementById("modalOverlay");
  const closeBtn = document.getElementById("closeSyllabusModalBtn");

  // OPEN + DOWNLOAD (single listener ⚡)
  document.addEventListener("click", (e) => {
    // OPEN
    const openBtn = e.target.closest(".openSyllabusModal");
    if (openBtn) {
      selectedCourse = openBtn.dataset.course;
      openModal();
      return;
    }

    // DOWNLOAD
    const downloadBtn = e.target.closest(".download-option");
    if (downloadBtn) {
      handleDownload(downloadBtn);
      return;
    }
  });

  // CLOSE
  closeBtn.addEventListener("click", closeModal);
  // overlay.addEventListener("click", closeModal);

  function openModal() {
    renderContent(selectedCourse);
    modal.classList.remove("hidden");

    if (window.lucide) lucide.createIcons();
  }

  function closeModal() {
    modal.classList.add("hidden");
  }
}

/* ================= RENDER ================= */

function renderContent(course) {
  const config = COURSE_CONFIG[course];
  if (!config) return;

  const title = document.getElementById("modalTitle");
  const container = document.getElementById("optionsContainer");

  title.innerHTML = `Download <span style="color:#233fff">${config.title}</span> Syllabus`;

  container.innerHTML = Object.keys(config.options)
    .map(
      (type, index) => `
      <button data-type="${type}"
        class="download-option w-full p-6 rounded-2xl border-2 border-slate-100 hover:border-[#233fff] hover:bg-blue-50/50 transition-all flex items-center justify-between group">

        <div class="text-left">
          <div class="font-black text-xs uppercase mb-1">Option ${index + 1}</div>
          <div class="font-bold text-lg">
            ${type === "summer" ? "Summer Training" : "Apprenticeship"}
          </div>
        </div>

        <i data-lucide="download" class="text-slate-300 group-hover:text-[#233fff]"></i>
      </button>
    `,
    )
    .join("");
}

/* ================= DOWNLOAD ================= */

function handleDownload(btn) {
  const type = btn.dataset.type;
  const file = COURSE_CONFIG[selectedCourse]?.options[type];

  if (!file) {
    alert("File not available");
    return;
  }

  const link = document.createElement("a");
  link.href = "assets/" + file;
  link.download = file;
  link.click();

  document.getElementById("syllabusModal").classList.add("hidden");
}
