/**
 * MySpace - 主脚本
 * 处理导航、滚动动画等交互逻辑
 */

document.addEventListener("DOMContentLoaded", () => {

  /* ========================================
     导航栏 - 移动端菜单切换
     ======================================== */
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("active");
      navMenu.classList.toggle("open");
    });

    // 点击菜单项后自动关闭
    navMenu.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.classList.remove("active");
        navMenu.classList.remove("open");
      });
    });

    // 点击页面其他区域关闭菜单
    document.addEventListener("click", (e) => {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navToggle.classList.remove("active");
        navMenu.classList.remove("open");
      }
    });
  }

  /* ========================================
     导航栏 - 滚动高亮当前区域
     ======================================== */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function highlightNavOnScroll() {
    const scrollY = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", highlightNavOnScroll);

  /* ========================================
     滚动渐入动画
     ======================================== */
  const fadeElements = document.querySelectorAll(".fade-in");

  function checkFadeIn() {
    const triggerBottom = window.innerHeight * 0.85;

    fadeElements.forEach((el) => {
      const boxTop = el.getBoundingClientRect().top;
      if (boxTop < triggerBottom) {
        el.classList.add("visible");
      }
    });
  }

  // 为功能卡片等元素添加 fade-in 类
  const animatableSelectors = [".feature-card", ".about-content", ".contact-link"];
  animatableSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.classList.add("fade-in");
    });
  });

  // 重新获取包含新增的 fade-in 元素
  const allFadeElements = document.querySelectorAll(".fade-in");

  function checkAllFadeIn() {
    const triggerBottom = window.innerHeight * 0.85;
    allFadeElements.forEach((el) => {
      const boxTop = el.getBoundingClientRect().top;
      if (boxTop < triggerBottom) {
        el.classList.add("visible");
      }
    });
  }

  window.addEventListener("scroll", checkAllFadeIn);
  // 初始检查一次
  checkAllFadeIn();

  /* ========================================
     导航栏 - 滚动时添加阴影
     ======================================== */
  const navbar = document.querySelector(".navbar");

  function handleNavbarShadow() {
    if (window.scrollY > 10) {
      navbar.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.3)";
    } else {
      navbar.style.boxShadow = "none";
    }
  }

  window.addEventListener("scroll", handleNavbarShadow);
});
