
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("downloadBrochure")) {
      const file = e.target.getAttribute("data-file");

      const link = document.createElement("a");
      link.href = file;
      link.download = "";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  });
