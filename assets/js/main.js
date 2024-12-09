/**
* Updated: Dec 06 2024 with Bootstrap v5.3.3
* Author: Aleksis Kālis
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');

  function headerToggle() {
    document.querySelector('#header').classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
  }
  headerToggleBtn.addEventListener('click', headerToggle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();

document.addEventListener("DOMContentLoaded", function () {
  const statWithPercentage = document.querySelector("#stat-4");

  // Wait for PureCounter animation to finish, then append "%"
  setTimeout(() => {
    if (statWithPercentage) {
      statWithPercentage.textContent += "%";
    }
  }, 1000); // Adjust this delay based on PureCounter duration
});



document.addEventListener('DOMContentLoaded', function () {
  const serviceItems = document.querySelectorAll('.service-item');
  const chatBubble = document.getElementById('chat-bubble');
  const closeButton = chatBubble.querySelector('.chat-bubble-close');
  const footerContactButton = document.getElementById('footer-contact-btn'); // Footer Contact Me button

  serviceItems.forEach(item => {
    item.addEventListener('click', function () {
      showChatBubble(); // Show the chat bubble when a service item is clicked
    });
  });

  footerContactButton.addEventListener('click', function (e) {
    e.preventDefault(); // Prevent default anchor behavior
    showChatBubble(); // Show the chat bubble when the footer button is clicked
  });

  closeButton.addEventListener('click', () => {
    hideChatBubble(); // Hide the chat bubble when the close button is clicked
  });

  function showChatBubble() {
    // Make sure the bubble is visible and reset any hide animation state
    chatBubble.style.display = 'block'; // Reset display
    chatBubble.classList.remove('hide'); // Remove hide class if present

    // Force a reflow to ensure the next class addition triggers the transition anew
    void chatBubble.offsetWidth;

    // Now add the 'show' class to trigger the fade-in animation
    chatBubble.classList.add('show');

    // Automatically hide the chat bubble after 10 seconds
    setTimeout(() => {
      hideChatBubble();
    }, 10000);
  }

  function hideChatBubble() {
    // Remove the show class and add hide to start fade-out
    chatBubble.classList.remove('show');
    chatBubble.classList.add('hide');

    // After the fade-out duration, set display to none
    setTimeout(() => {
      chatBubble.style.display = 'none';
    }, 500); // Adjust this to match your CSS transition duration
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const contactTrigger = document.getElementById('contact-trigger');
  const contactCard = document.getElementById('contact-card');

  contactTrigger.addEventListener('click', function (e) {
    e.preventDefault();

    if (contactCard.classList.contains('show')) {
      contactCard.classList.remove('show');
      contactCard.classList.add('hide');

      setTimeout(() => {
        contactCard.classList.remove('hide');
        contactCard.style.display = 'none'; // Ensure it hides after animation
      }, 500); // Match the animation duration
    } else {
      contactCard.style.display = 'block'; // Ensure it's visible before animation
      contactCard.classList.remove('hide');
      contactCard.classList.add('show');
    }

    // Update button text
    contactTrigger.textContent = contactCard.classList.contains('show')
      ? "Hide Contact"
      : "Contact Me";
  });
});


document.addEventListener('DOMContentLoaded', function () {
  const footerContactTrigger = document.getElementById('footer-contact-trigger');
  const footerContactCard = document.getElementById('footer-contact-card');
  const footerInfo = document.getElementById('footer-info');

  footerContactTrigger.addEventListener('click', function (e) {
    e.preventDefault();

    if (footerContactCard.classList.contains('hide')) {
      footerContactCard.classList.remove('hide');
      footerContactCard.classList.add('show');
      footerContactTrigger.textContent = "Hide Contact";

      // Slide footer info down
      footerInfo.style.marginTop = "70px"; // Adjust gap to fit the contact card
    } else {
      footerContactCard.classList.remove('show');
      footerContactCard.classList.add('hide');
      footerContactTrigger.textContent = "Contact Me";

      // Slide footer info back up
      footerInfo.style.marginTop = "10px"; // Reduced default gap
    }
  });
});