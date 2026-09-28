document.addEventListener('DOMContentLoaded', function () {

  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.toggle('open');
      var expanded = menu.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
    });
  }

  /* ---- Accordion dropdowns on touch / mobile (handles nested submenus too) ---- */
  var parents = document.querySelectorAll('.nav-menu li');
  parents.forEach(function (li) {
    var link = li.querySelector(':scope > a');
    var dropdown = li.querySelector(':scope > .dropdown');
    if (!dropdown || !link) return;

    link.addEventListener('click', function (e) {
      if (window.innerWidth <= 991) {
        e.preventDefault();
        var isOpen = li.classList.contains('open');
        var siblingLis = li.parentElement.querySelectorAll(':scope > li');
        siblingLis.forEach(function (sib) {
          if (sib !== li) {
            sib.classList.remove('open');
            sib.querySelectorAll('li.open').forEach(function (nested) { nested.classList.remove('open'); });
          }
        });
        li.classList.toggle('open', !isOpen);
      }
    });
  });

  /* Close mobile menu when a real link (no children) is clicked */
  document.querySelectorAll('.nav-menu a').forEach(function (a) {
    a.addEventListener('click', function () {
      if (window.innerWidth <= 991 && !a.parentElement.querySelector('.dropdown')) {
        menu.classList.remove('open');
      }
    });
  });

  /* Reset menu state on resize back to desktop */
  window.addEventListener('resize', function () {
    if (window.innerWidth > 991) {
      menu && menu.classList.remove('open');
      parents.forEach(function (li) { li.classList.remove('open'); });
    }
  });

  /* ---- WhatsApp enquiry helpers ---- */
  var COLLEGE_WHATSAPP_NUMBER = '919326446312';

  function restrictToDigits(input, maxLen) {
    if (!input) return;
    input.addEventListener('input', function () {
      var digits = input.value.replace(/\D/g, '').slice(0, maxLen);
      if (digits !== input.value) input.value = digits;
    });
  }

  function buildWhatsAppLink(name, email, phone, course) {
    var lines = [
      'Hello Sailee Degree College, I would like to enquire about admission.',
      'Name: ' + name,
      'Email: ' + email,
      'Phone: ' + phone,
      'Course: ' + course
    ];
    var text = encodeURIComponent(lines.join('\n'));
    return 'https://wa.me/' + COLLEGE_WHATSAPP_NUMBER + '?text=' + text;
  }

  /* ---- Enquiry / Choose Your Course form (redirects to WhatsApp) ---- */
  var enquiryForm = document.getElementById('enquiryForm');
  if (enquiryForm) {
    var enqPhoneInput = document.getElementById('enqPhone');
    restrictToDigits(enqPhoneInput, 10);

    enquiryForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = document.getElementById('formMsg');
      var name = document.getElementById('enqName').value.trim();
      var email = document.getElementById('enqEmail').value.trim();
      var phone = enqPhoneInput.value.trim();
      var course = document.getElementById('enqCourse').value;

      if (!name) {
        msg.style.color = '#a61d33';
        msg.textContent = 'Please enter your name to continue.';
        return;
      }
      if (!/^[0-9]{10}$/.test(phone)) {
        msg.style.color = '#a61d33';
        msg.textContent = 'Please enter a valid 10-digit phone number.';
        return;
      }
      if (!course) {
        msg.style.color = '#a61d33';
        msg.textContent = 'Please select a course.';
        return;
      }

      msg.style.color = '#1c8a4b';
      msg.textContent = 'Thank you, ' + name + '! Taking you to WhatsApp to send your enquiry\u2026';

      var waLink = buildWhatsAppLink(name, email, phone, course);
      enquiryForm.reset();
      setTimeout(function () {
        window.open(waLink, '_blank', 'noopener');
      }, 600);
    });
  }

  /* ---- Site-wide "Choose Your Course" popup ---- */
  (function () {
    var overlay = document.createElement('div');
    overlay.className = 'course-modal-overlay';
    overlay.id = 'courseModalOverlay';
    overlay.innerHTML =
      '<div class="course-modal" role="dialog" aria-modal="true" aria-labelledby="courseModalTitle">' +
        '<button type="button" class="course-modal-close" id="courseModalClose" aria-label="Close">&times;</button>' +
        '<h3 id="courseModalTitle">Choose Your Course</h3>' +
        '<p>Share your details and our admissions team will help you find the right programme for you.</p>' +
        '<form class="enquiry-form" id="courseModalForm">' +
          '<input type="text" id="courseModalName" placeholder="Your name" required>' +
          '<input type="email" id="courseModalEmail" placeholder="Your email" required>' +
          '<input type="tel" id="courseModalPhone" placeholder="Your 10-digit phone number" required maxlength="10" inputmode="numeric" pattern="[0-9]{10}" title="Enter a 10-digit mobile number">' +
          '<select id="courseModalCourse" required>' +
            '<option value="" selected disabled>Course you are interested in</option>' +
            '<option>B.Com &mdash; Bachelor of Commerce</option>' +
            '<option>B.A.F &mdash; Bachelor of Commerce in Accounting &amp; Finance</option>' +
            '<option>B.B.I &mdash; Bachelor of Commerce in Banking &amp; Insurance</option>' +
            '<option>B.M.S &mdash; Bachelor of Management Studies (AICTE Approved)</option>' +
            '<option>B.Sc &mdash; Bachelor of Science</option>' +
            '<option>B.Sc-CS &mdash; Bachelor of Science in Computer Science</option>' +
            '<option>B.Sc-IT &mdash; Bachelor of Science in Information Technology</option>' +
            '<option>B.Sc-DS &mdash; Bachelor of Science in Data Science</option>' +
            '<option>BCA (YCMOU) &mdash; Bachelor of Computer Applications (AICTE Approved)</option>' +
            '<option>BBA &mdash; Bachelor of Business Administration</option>' +
            '<option>BCA (University of Mumbai) &mdash; Bachelor of Computer Applications</option>' +
          '</select>' +
          '<button type="submit" class="btn btn-maroon btn-block">Submit</button>' +
          '<div class="form-msg" id="courseModalMsg"></div>' +
        '</form>' +
      '</div>';
    document.body.appendChild(overlay);

    var trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'course-modal-trigger';
    trigger.id = 'courseModalTrigger';
    trigger.setAttribute('aria-label', 'Choose your course');
    trigger.innerHTML = '&#127891;';
    document.body.appendChild(trigger);

    function openModal() {
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function closeModal() {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    trigger.addEventListener('click', openModal);
    document.getElementById('courseModalClose').addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });

    var modalForm = document.getElementById('courseModalForm');
    var modalPhoneInput = document.getElementById('courseModalPhone');
    restrictToDigits(modalPhoneInput, 10);

    modalForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = document.getElementById('courseModalMsg');
      var name = document.getElementById('courseModalName').value.trim();
      var email = document.getElementById('courseModalEmail').value.trim();
      var phone = modalPhoneInput.value.trim();
      var course = document.getElementById('courseModalCourse').value;

      if (!name) {
        msg.style.color = '#a61d33';
        msg.textContent = 'Please enter your name to continue.';
        return;
      }
      if (!/^[0-9]{10}$/.test(phone)) {
        msg.style.color = '#a61d33';
        msg.textContent = 'Please enter a valid 10-digit phone number.';
        return;
      }
      if (!course) {
        msg.style.color = '#a61d33';
        msg.textContent = 'Please select a course.';
        return;
      }

      msg.style.color = '#1c8a4b';
      msg.textContent = 'Thank you, ' + name + '! Taking you to WhatsApp to send your enquiry\u2026';

      var waLink = buildWhatsAppLink(name, email, phone, course);
      modalForm.reset();
      setTimeout(function () {
        window.open(waLink, '_blank', 'noopener');
        closeModal();
      }, 900);
    });

    /* Show automatically once per browser session */
    if (!sessionStorage.getItem('saileeCourseModalShown')) {
      setTimeout(function () {
        openModal();
        sessionStorage.setItem('saileeCourseModalShown', '1');
      }, 1400);
    }
  })();

  /* ---- Campus Videos grid (homepage) ----
     The four video cards are plain HTML (poster image + native controls),
     so they always render even before this script runs / on slow
     connections. This just adds one small enhancement: pause any other
     playing reel when a new one starts. */
  var reelsGrid = document.getElementById('reelsGrid');
  if (reelsGrid) {
    var reelVideos = reelsGrid.querySelectorAll('video.reel-video');
    reelVideos.forEach(function (v) {
      v.addEventListener('play', function () {
        reelVideos.forEach(function (other) {
          if (other !== v) other.pause();
        });
      });
    });
  }

  /* ---- Home notices tabs ---- */
  var noticeTabs = document.getElementById('noticeTabs');
  if (noticeTabs) {
    var tabButtons = noticeTabs.querySelectorAll('.notice-tab');
    var panels = document.querySelectorAll('.notice-list');
    tabButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        tabButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var target = btn.getAttribute('data-tab');
        panels.forEach(function (p) {
          p.style.display = (p.getAttribute('data-panel') === target) ? '' : 'none';
        });
      });
    });
  }

  /* ---- Highlight current nav link ---- */
  var here = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu > li > a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === here) {
      a.parentElement.classList.add('active');
    }
  });

});
