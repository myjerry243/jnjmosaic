/* JNJ Mosaic - Main JS */
document.addEventListener('DOMContentLoaded', function() {

  // ===== Hamburger Menu =====
  const hamburger = document.querySelector('.hamburger');
  const navList = document.querySelector('.nav-list');
  if (hamburger) {
    hamburger.addEventListener('click', function() {
      navList.classList.toggle('open');
    });
    // Close on outside click
    document.addEventListener('click', function(e) {
      if (!hamburger.contains(e.target) && !navList.contains(e.target)) {
        navList.classList.remove('open');
      }
    });
  }

  // ===== Product Filter =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');
  if (filterBtns.length) {
    filterBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        filterBtns.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-filter');
        productCards.forEach(function(card) {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ===== Product Modal =====
  const modal = document.getElementById('product-modal');
  const modalClose = document.querySelector('.modal-close');
  if (modal && modalClose) {
    // Open modal
    document.querySelectorAll('.product-card').forEach(function(card) {
      card.addEventListener('click', function() {
        var name = card.getAttribute('data-name');
        var img = card.getAttribute('data-img');
        var desc = card.getAttribute('data-desc');
        var cat = card.getAttribute('data-category');
        document.getElementById('modal-name').textContent = name;
        document.getElementById('modal-category').textContent = cat;
        document.getElementById('modal-img').src = img;
        document.getElementById('modal-img').alt = name;
        document.getElementById('modal-desc').textContent = desc || 'Contact us for detailed specifications and pricing information.';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
    // Close modal
    modalClose.addEventListener('click', function() { closeModal(); });
    modal.addEventListener('click', function(e) {
      if (e.target === modal) { closeModal(); }
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') { closeModal(); }
    });
  }
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ===== Contact Form =====
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = contactForm.querySelector('button[type="submit"]');
      var origText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      var formData = new FormData(contactForm);
      var formspreeId = contactForm.getAttribute('data-formspree-id');
      if (formspreeId) {
        fetch('https://formspree.io/f/' + formspreeId, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        }).then(function(response) {
          if (response.ok) {
            contactForm.innerHTML = '<div style="text-align:center;padding:2rem;"><h3>Thank You!</h3><p>Your message has been sent. We will get back to you within 24 hours.</p></div>';
          } else {
            btn.textContent = 'Error - Try Again';
            btn.disabled = false;
          }
        }).catch(function() {
          btn.textContent = 'Error - Try Again';
          btn.disabled = false;
        });
      } else {
        // Fallback: save to localStorage
        var entries = JSON.parse(localStorage.getItem('jnj_inquiries') || '[]');
        var data = {};
        formData.forEach(function(v, k) { data[k] = v; });
        data.timestamp = new Date().toISOString();
        entries.push(data);
        localStorage.setItem('jnj_inquiries', JSON.stringify(entries));
        contactForm.innerHTML = '<div style="text-align:center;padding:2rem;"><h3>Thank You!</h3><p>Your inquiry has been saved. We will contact you shortly.</p></div>';
      }
    });
  }
});
