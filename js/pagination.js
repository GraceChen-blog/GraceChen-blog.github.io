document.addEventListener("DOMContentLoaded", function () {
    const book = document.querySelector("book");
    if (!book) return;
  
    const originalHtml = book.innerHTML;
    const wrapper = document.createElement("div");
    const controls = document.createElement("div");
  
    book.innerHTML = "";
    wrapper.id = "book-pages";
    controls.id = "book-pagination-controls";
  
    book.appendChild(wrapper);
    book.appendChild(controls);
  
    const container = document.createElement("div");
    container.innerHTML = originalHtml;
    const children = Array.from(container.children);
    const perPage = window.innerWidth < 768 ? 6 : 12;
    const totalPages = Math.ceil(children.length / perPage);
  
    let currentPage = getPageFromURL();
  
    function getPageFromURL() {
      const urlParams = new URLSearchParams(window.location.search);
      const page = parseInt(urlParams.get("page"), 10);
      return isNaN(page) || page < 1 ? 1 : Math.min(page, totalPages);
    }
  
    function updateURL(page) {
      const url = new URL(window.location.href);
      url.searchParams.set("page", page);
      window.history.replaceState({}, "", url);
    }
  
    function scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  
    function showPage(page) {
      currentPage = page;
      updateURL(page);
      wrapper.innerHTML = "";
      const start = (page - 1) * perPage;
      const end = page * perPage;
      children.slice(start, end).forEach((el) => {
        wrapper.appendChild(el.cloneNode(true));
      });
  
      controls.innerHTML = "";
  
      // 上一页按钮
      const prevBtn = document.createElement("button");
      prevBtn.textContent = "←";
      prevBtn.disabled = page === 1;
      prevBtn.onclick = () => {
        showPage(currentPage - 1);
        scrollToTop();
      };
      controls.appendChild(prevBtn);
  
      // 简洁页码显示
      const visiblePages = getVisiblePages(page, totalPages);
      visiblePages.forEach(p => {
        if (p === "...") {
          const span = document.createElement("span");
          span.textContent = "...";
          controls.appendChild(span);
        } else {
          const btn = document.createElement("button");
          btn.textContent = p;
          btn.disabled = p === page;
          btn.onclick = () => {
            showPage(p);
            scrollToTop();
          };
          controls.appendChild(btn);
        }
      });
  
      // 下一页按钮
      const nextBtn = document.createElement("button");
      nextBtn.textContent = "→";
      nextBtn.disabled = page === totalPages;
      nextBtn.onclick = () => {
        showPage(currentPage + 1);
        scrollToTop();
      };
      controls.appendChild(nextBtn);
  
      // 跳转输入框
      const jumpInput = document.createElement("input");
      jumpInput.type = "number";
      jumpInput.min = 1;
      jumpInput.max = totalPages;
      jumpInput.placeholder = "页码";
      jumpInput.style.width = window.innerWidth < 768 ? "3em" : "60px";
      jumpInput.onchange = () => {
          const val = parseInt(jumpInput.value);
          if (!isNaN(val) && val >= 1 && val <= totalPages) {
              showPage(val);
              scrollToTop();
          }
      };
      controls.appendChild(jumpInput);
    }
  
    function getVisiblePages(current, total) {
      const pages = [];
      if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i);
      } else {
        pages.push(1);
        const offset = window.innerWidth < 768 ? 1 : 2;
        if (current > 4) pages.push("...");
        for (let i = Math.max(2, current - offset); i <= Math.min(total - 1, current + offset); i++) {
          pages.push(i);
        }
        if (current < total - 1 - offset) pages.push("...");
        pages.push(total);
      }
      return pages;
    }
  
    showPage(currentPage);
    book.style.display = "block";
  });