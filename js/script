/*
 * ============================================================
 *  BOUTIQUE MAROC — Main JavaScript
 * ============================================================
 *  Handles:
 *  - Mobile navigation toggle
 *  - Product gallery (thumbnail switching)
 *  - Quantity selector
 *  - Order form submission (Google Sheets + Telegram)
 *  - WhatsApp order links
 *  - Contact form submission (Telegram only)
 *  - WhatsApp / Telegram button links
 * ============================================================
 */

/* ================================================================
   MOBILE NAVIGATION
   ================================================================ */
document.addEventListener('DOMContentLoaded', function () {

  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    /* Close nav when a link is clicked (mobile) */
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---- Set WhatsApp links ---- */
  initWhatsAppLinks();

  /* ---- Set Telegram contact link ---- */
  initTelegramLink();

  /* ---- Floating WhatsApp button link ---- */
  initFloatingWA();

  /* ---- Social media icons ---- */
  initSocialIcons();

  /* ---- Scroll Reveal animations ---- */
  initScrollReveal();

});

/* ================================================================
   WHATSAPP LINKS — set href on all WhatsApp buttons
   ================================================================ */
function initWhatsAppLinks() {
  var phone = getConfigValue('WHATSAPP_NUMBER', '');
  if (!phone || phone === '212XXXXXXXXX') return;

  var defaultMsg = encodeURIComponent(
    'السلام عليكم ' + getConfigValue('STORE_NAME', 'بوتيك المغرب') +
    '! أنا مهتم بمنتجاتكم. هل يمكنكم مساعدتي؟'
  );
  var waUrl = 'https://wa.me/' + phone + '?text=' + defaultMsg;

  /* Hero WhatsApp button */
  var heroBtn = document.getElementById('heroWhatsApp');
  if (heroBtn) heroBtn.href = waUrl;

  /* Featured product WhatsApp button */
  var featuredBtn = document.getElementById('featuredWhatsApp');
  if (featuredBtn) featuredBtn.href = waUrl;

  /* Contact page WhatsApp button */
  var contactBtn = document.getElementById('contactWhatsApp');
  if (contactBtn) contactBtn.href = waUrl;
}

/* ================================================================
   TELEGRAM CONTACT LINK
   ================================================================ */
function initTelegramLink() {
  var token = getConfigValue('TELEGRAM_BOT_TOKEN', '');
  var chatId = getConfigValue('TELEGRAM_CHAT_ID', '');

  /* Contact page Telegram button — links to Telegram bot if configured */
  var telegramBtn = document.getElementById('contactTelegram');
  if (telegramBtn && token && !isPlaceholder(token)) {
    /* Extract bot username from token is not reliable; 
       use a generic Telegram link or leave as-is */
    telegramBtn.href = 'https://t.me/+' + getConfigValue('WHATSAPP_NUMBER', '');
  }
}

/* ================================================================
   PRODUCT GALLERY — thumbnail click handler
   ================================================================ */
function changeImage(thumb) {
  var mainImage = document.getElementById('mainImage');
  if (!mainImage || !thumb) return;

  mainImage.src = thumb.src;
  mainImage.alt = thumb.alt;

  /* Update active thumbnail */
  var thumbs = thumb.parentElement.querySelectorAll('img');
  thumbs.forEach(function (t) { t.classList.remove('active'); });
  thumb.classList.add('active');
}

/* ================================================================
   QUANTITY SELECTOR
   ================================================================ */
function changeQty(delta) {
  var input = document.getElementById('qtyInput');
  if (!input) return;
  var val = parseInt(input.value, 10) || 1;
  val += delta;
  if (val < 1) val = 1;
  if (val > 10) val = 10;
  input.value = val;
}

/* ================================================================
   ORDER FORM SUBMISSION — Google Sheets + Telegram
   ================================================================ */
function handleOrderSubmit(e) {
  e.preventDefault();

  var btn = document.getElementById('submitOrderBtn');
  var msgEl = document.getElementById('formMessage');

  /* Gather form data */
  var product = 'شاحن متنقل 20000 مللي أمبير';
  var price = '199 درهم';
  var qty = document.getElementById('qtyInput') ? document.getElementById('qtyInput').value : '1';
  var name = document.getElementById('customerName').value.trim();
  var phone = document.getElementById('customerPhone').value.trim();
  var city = document.getElementById('customerCity').value.trim();
  var address = document.getElementById('customerAddress').value.trim();
  var notes = document.getElementById('customerNotes').value.trim();

  /* Basic validation */
  if (!name || !phone || !city || !address) {
    showMessage(msgEl, 'يرجى ملء جميع الحقول المطلوبة.', 'error');
    return false;
  }

  /* Disable button + show loading */
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> جاري الإرسال...';

  var orderData = {
    store: getConfigValue('STORE_NAME', 'بوتيك المغرب'),
    timestamp: new Date().toISOString(),
    product: product,
    price: price,
    qty: qty,
    name: name,
    phone: phone,
    city: city,
    address: address,
    notes: notes || '—'
  };

  /* Run Google Sheets + Telegram in parallel */
  var sheetsPromise = sendToGoogleSheets(orderData);
  var telegramPromise = sendToTelegram(formatOrderTelegram(orderData));

  Promise.allSettled([sheetsPromise, telegramPromise]).then(function (results) {
    var sheetsOk = results[0].status === 'fulfilled' && results[0].value === true;
    var telegramOk = results[1].status === 'fulfilled' && results[1].value === true;

    if (sheetsOk || telegramOk) {
      document.getElementById('orderForm').reset();
      if (document.getElementById('qtyInput')) document.getElementById('qtyInput').value = '1';
      openSuccessModal();
    } else {
      showMessage(msgEl, '⚠️ تعذر إرسال الطلب. يرجى المحاولة عبر واتساب.', 'error');
    }

    btn.disabled = false;
    btn.innerHTML = '📦 إرسال الطلب';
  });

  return false;
}

/* ================================================================
   SUCCESS MODAL (product page)
   ================================================================ */
function openSuccessModal() {
  var modal = document.getElementById('successModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeSuccessModal() {
  var modal = document.getElementById('successModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

document.addEventListener('DOMContentLoaded', function () {
  var modal = document.getElementById('successModal');
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeSuccessModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSuccessModal();
    });
  }
});

/* ================================================================
   GOOGLE SHEETS — POST to Apps Script Web App
   ================================================================ */
function sendToGoogleSheets(data) {
  var url = getConfigValue('GOOGLE_SHEETS_WEBAPP_URL', '');
  if (!url || isPlaceholder(url)) {
    console.warn('[Sheets] رابط Google Sheets غير مُعدّ — تم التخطي.');
    return Promise.resolve(false);
  }

  console.log('[Sheets] Sending to:', url);
  console.log('[Sheets] Data:', JSON.stringify(data));

  /* Build URLSearchParams — compatible with no-cors + Apps Script e.parameter */
  var params = new URLSearchParams();
  Object.keys(data).forEach(function (key) {
    params.append(key, data[key]);
  });

  console.log('[Sheets] Body:', params.toString());

  return fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    body: params
  })
    .then(function (res) {
      /* no-cors → opaque response (status 0). This is NORMAL. */
      console.log('[Sheets] ✅ Fetch completed. Response type:', res.type, '| Status:', res.status);
      console.log('[Sheets] (opaque response is expected with no-cors — check Google Sheet to confirm)');
      return true;
    })
    .catch(function (err) {
      console.error('[Sheets] ❌ Fetch failed:', err);
      return false;
    });
}

/* ================================================================
   TELEGRAM — Send message via Bot API
   ================================================================ */
function sendToTelegram(message) {
  var token = getConfigValue('TELEGRAM_BOT_TOKEN', '');
  var chatId = getConfigValue('TELEGRAM_CHAT_ID', '');

  if (!token || !chatId || isPlaceholder(token) || isPlaceholder(chatId)) {
    console.warn('[بوتيك المغرب] تليجرام غير مُعدّ — تم التخطي.');
    return Promise.resolve(false);
  }

  var url = 'https://api.telegram.org/bot' + token + '/sendMessage';

  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    })
  })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data.ok) {
        console.log('[بوتيك المغرب] تم إرسال الطلب إلى تليجرام.');
        return true;
      }
      console.error('[بوتيك المغرب] خطأ Telegram API:', data);
      return false;
    })
    .catch(function (err) {
      console.error('[بوتيك المغرب] خطأ اتصال تليجرام:', err);
      return false;
    });
}

/* ================================================================
   FORMAT ORDER FOR TELEGRAM
   ================================================================ */
function formatOrderTelegram(d) {
  return '🛒 <b>طلب جديد</b>\n' +
    '━━━━━━━━━━━━━━━\n' +
    '🏪 المتجر: ' + d.store + '\n' +
    '📦 المنتج: ' + d.product + '\n' +
    '💰 السعر: ' + d.price + '\n' +
    '🔢 الكمية: ' + d.qty + '\n' +
    '━━━━━━━━━━━━━━━\n' +
    '👤 الاسم: ' + d.name + '\n' +
    '📞 الهاتف: ' + d.phone + '\n' +
    '🏙️ المدينة: ' + d.city + '\n' +
    '📍 العنوان: ' + d.address + '\n' +
    '📝 ملاحظات: ' + d.notes + '\n' +
    '━━━━━━━━━━━━━━━\n' +
    '🕐 ' + d.timestamp;
}

/* ================================================================
   FORMAT CONTACT MESSAGE FOR TELEGRAM
   ================================================================ */
function formatContactTelegram(d) {
  return '✉️ <b>رسالة تواصل جديدة</b>\n' +
    '━━━━━━━━━━━━━━━\n' +
    '👤 الاسم: ' + d.name + '\n' +
    '📧 البريد: ' + d.email + '\n' +
    '📌 الموضوع: ' + d.subject + '\n' +
    '━━━━━━━━━━━━━━━\n' +
    '💬 الرسالة:\n' + d.message + '\n' +
    '━━━━━━━━━━━━━━━\n' +
    '🕐 ' + new Date().toISOString();
}

/* ================================================================
   WHATSAPP ORDER — opens WhatsApp with pre-filled message
   ================================================================ */
function orderViaWhatsApp() {
  var phone = getConfigValue('WHATSAPP_NUMBER', '');
  if (!phone || phone === '212XXXXXXXXX') {
    alert('رقم واتساب غير مُعدّ. يرجى التواصل معنا مباشرة.');
    return;
  }

  var product = 'شاحن متنقل 20000 مللي أمبير';
  var price = '199 درهم';
  var qty = document.getElementById('qtyInput') ? document.getElementById('qtyInput').value : '1';
  var name = document.getElementById('customerName').value.trim() || '(لم يُدخل)';
  var customerPhone = document.getElementById('customerPhone').value.trim() || '(لم يُدخل)';
  var city = document.getElementById('customerCity').value.trim() || '(لم يُدخل)';
  var address = document.getElementById('customerAddress').value.trim() || '(لم يُدخل)';
  var notes = document.getElementById('customerNotes').value.trim() || '—';

  var msg =
    '🛒 *طلب جديد — ' + getConfigValue('STORE_NAME', 'بوتيك المغرب') + '*\n\n' +
    '📦 المنتج: ' + product + '\n' +
    '💰 السعر: ' + price + '\n' +
    '🔢 الكمية: ' + qty + '\n\n' +
    '👤 الاسم: ' + name + '\n' +
    '📞 الهاتف: ' + customerPhone + '\n' +
    '🏙️ المدينة: ' + city + '\n' +
    '📍 العنوان: ' + address + '\n' +
    '📝 ملاحظات: ' + notes;

  var url = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg);
  window.open(url, '_blank');
}

/* ================================================================
   CONTACT FORM SUBMISSION — Telegram only
   ================================================================ */
function handleContactSubmit(e) {
  e.preventDefault();

  var btn = document.getElementById('submitContactBtn');
  var msgEl = document.getElementById('contactFormMessage');

  var name = document.getElementById('contactName').value.trim();
  var email = document.getElementById('contactEmail').value.trim() || '—';
  var subject = document.getElementById('contactSubject').value.trim();
  var message = document.getElementById('contactMessage').value.trim();

  if (!name || !subject || !message) {
    showMessage(msgEl, 'يرجى ملء جميع الحقول المطلوبة.', 'error');
    return false;
  }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> جاري الإرسال...';

  var contactData = {
    name: name,
    email: email,
    subject: subject,
    message: message
  };

  sendToTelegram(formatContactTelegram(contactData)).then(function (success) {
    if (success) {
      showMessage(msgEl, '✅ تم إرسال رسالتك! سنعود إليك قريباً.', 'success');
      document.getElementById('contactForm').reset();
    } else {
      showMessage(msgEl, '⚠️ تعذر إرسال الرسالة. يرجى التواصل معنا عبر واتساب.', 'error');
    }
    btn.disabled = false;
    btn.innerHTML = '✉️ إرسال الرسالة';
  });

  return false;
}

/* ================================================================
   ORDER MODAL POPUP
   ================================================================ */
function openOrderModal() {
  var modal = document.getElementById('orderModal');
  if (modal) {
    /* Reset to form view (hide success if shown) */
    var successEl = document.getElementById('modalSuccess');
    var formEl = document.getElementById('modalOrderForm');
    var summaryEl = modal.querySelector('.modal-product-summary');
    var dividerEl = modal.querySelector('.modal-divider');
    var qtyEl = modal.querySelector('.qty-selector');
    if (successEl) successEl.classList.remove('active');
    if (formEl) formEl.style.display = '';
    if (summaryEl) summaryEl.style.display = '';
    if (dividerEl) dividerEl.style.display = '';
    if (qtyEl) qtyEl.style.display = '';

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function showModalSuccess() {
  var formEl = document.getElementById('modalOrderForm');
  var successEl = document.getElementById('modalSuccess');
  var modal = document.getElementById('orderModal');
  var summaryEl = modal ? modal.querySelector('.modal-product-summary') : null;
  var dividerEl = modal ? modal.querySelector('.modal-divider') : null;
  var qtyEl = modal ? modal.querySelector('.qty-selector') : null;

  if (formEl) formEl.style.display = 'none';
  if (summaryEl) summaryEl.style.display = 'none';
  if (dividerEl) dividerEl.style.display = 'none';
  if (qtyEl) qtyEl.style.display = 'none';
  if (successEl) successEl.classList.add('active');
}

function closeOrderModal() {
  var modal = document.getElementById('orderModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

document.addEventListener('DOMContentLoaded', function () {
  var modal = document.getElementById('orderModal');
  var closeBtn = document.getElementById('modalClose');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeOrderModal);
  }

  /* Close on overlay click (outside card) */
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeOrderModal();
    });
  }

  /* Close on Escape key */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeOrderModal();
  });
});

/* Modal quantity */
function changeModalQty(delta) {
  var input = document.getElementById('modalQtyInput');
  if (!input) return;
  var val = parseInt(input.value) + delta;
  if (val < 1) val = 1;
  if (val > 10) val = 10;
  input.value = val;
}

/* Modal order form submit */
function handleModalOrderSubmit(e) {
  e.preventDefault();

  var btn = document.getElementById('modalSubmitBtn');
  var msgEl = document.getElementById('modalFormMessage');

  var product = 'شاحن متنقل 20000 مللي أمبير';
  var price = '199 درهم';
  var qty = document.getElementById('modalQtyInput') ? document.getElementById('modalQtyInput').value : '1';
  var name = document.getElementById('modalName').value.trim();
  var phone = document.getElementById('modalPhone').value.trim();
  var city = document.getElementById('modalCity').value.trim();
  var address = document.getElementById('modalAddress').value.trim();
  var notes = document.getElementById('modalNotes').value.trim();

  if (!name || !phone || !city || !address) {
    showMessage(msgEl, 'يرجى ملء جميع الحقول المطلوبة.', 'error');
    return false;
  }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> جاري الإرسال...';

  var orderData = {
    store: getConfigValue('STORE_NAME', 'بوتيك المغرب'),
    timestamp: new Date().toISOString(),
    product: product,
    price: price,
    qty: qty,
    name: name,
    phone: phone,
    city: city,
    address: address,
    notes: notes || '—'
  };

  var sheetsPromise = sendToGoogleSheets(orderData);
  var telegramPromise = sendToTelegram(formatOrderTelegram(orderData));

  Promise.allSettled([sheetsPromise, telegramPromise]).then(function (results) {
    var sheetsOk = results[0].status === 'fulfilled' && results[0].value === true;
    var telegramOk = results[1].status === 'fulfilled' && results[1].value === true;

    if (sheetsOk || telegramOk) {
      document.getElementById('modalOrderForm').reset();
      if (document.getElementById('modalQtyInput')) document.getElementById('modalQtyInput').value = '1';
      showModalSuccess();
    } else {
      showMessage(msgEl, '⚠️ تعذر إرسال الطلب. يرجى المحاولة عبر واتساب.', 'error');
    }

    btn.disabled = false;
    btn.innerHTML = '📦 اطلب بسرعة';
  });

  return false;
}

/* Modal WhatsApp order */
function modalOrderWhatsApp() {
  var phone = getConfigValue('WHATSAPP_NUMBER', '');
  if (!phone || phone === '212XXXXXXXXX') {
    alert('رقم واتساب غير مهيأ. يرجى التواصل معنا مباشرة.');
    return;
  }

  var product = 'شاحن متنقل 20000 مللي أمبير';
  var price = '199 درهم';
  var qty = document.getElementById('modalQtyInput') ? document.getElementById('modalQtyInput').value : '1';
  var name = document.getElementById('modalName').value.trim() || '(لم يُدخل)';
  var customerPhone = document.getElementById('modalPhone').value.trim() || '(لم يُدخل)';
  var city = document.getElementById('modalCity').value.trim() || '(لم يُدخل)';
  var address = document.getElementById('modalAddress').value.trim() || '(لم يُدخل)';
  var notes = document.getElementById('modalNotes').value.trim() || '—';

  var msg =
    '🛒 *طلب جديد — ' + getConfigValue('STORE_NAME', 'بوتيك المغرب') + '*\n\n' +
    '📦 المنتج: ' + product + '\n' +
    '💰 السعر: ' + price + '\n' +
    '🔢 الكمية: ' + qty + '\n\n' +
    '👤 الاسم: ' + name + '\n' +
    '📞 الهاتف: ' + customerPhone + '\n' +
    '🏙️ المدينة: ' + city + '\n' +
    '📍 العنوان: ' + address + '\n' +
    '📝 ملاحظات: ' + notes;

  var url = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg);
  window.open(url, '_blank');
}

/* ================================================================
   REVIEWS SYSTEM — Load from JSON + Submit new reviews
   ================================================================ */
var allReviews = [];
var displayedCount = 0;
var REVIEWS_PER_PAGE = 100;

document.addEventListener('DOMContentLoaded', function () {
  var grid = document.getElementById('reviewsGrid');
  if (!grid) return;

  /* Load reviews from JSON file */
  fetch('data/reviews.json')
    .then(function (res) { return res.json(); })
    .then(function (jsonReviews) {
      /* Merge with localStorage reviews */
      var localReviews = JSON.parse(localStorage.getItem('bm-reviews') || '[]');
      allReviews = jsonReviews.concat(localReviews);
      allReviews.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
      displayedCount = 0;
      loadAllAndStartMarquee();
    })
    .catch(function () {
      /* Fallback: load only localStorage reviews */
      allReviews = JSON.parse(localStorage.getItem('bm-reviews') || '[]');
      if (allReviews.length) {
        displayedCount = 0;
        loadAllAndStartMarquee();
      }
    });

  /* Star rating picker */
  var starContainer = document.getElementById('starRating');
  if (starContainer) {
    var stars = starContainer.querySelectorAll('.star');
    stars.forEach(function (star) {
      star.addEventListener('click', function () {
        var val = parseInt(this.getAttribute('data-value'));
        document.getElementById('reviewRating').value = val;
        stars.forEach(function (s) {
          var sv = parseInt(s.getAttribute('data-value'));
          s.classList.toggle('active', sv <= val);
        });
      });
      star.addEventListener('mouseenter', function () {
        var val = parseInt(this.getAttribute('data-value'));
        stars.forEach(function (s) {
          var sv = parseInt(s.getAttribute('data-value'));
          s.classList.toggle('hovered', sv <= val);
        });
      });
      star.addEventListener('mouseleave', function () {
        stars.forEach(function (s) { s.classList.remove('hovered'); });
      });
    });
  }

});

function loadAllAndStartMarquee() {
  var track = document.getElementById('reviewsGrid');
  if (!track) return;

  /* Add all review cards */
  for (var i = 0; i < allReviews.length; i++) {
    track.appendChild(createReviewCard(allReviews[i]));
  }

  /* Duplicate all cards for seamless infinite loop */
  var cards = track.innerHTML;
  track.innerHTML = cards + cards;

  /* Adjust animation speed based on card count and start scrolling */
  var totalCards = track.children.length;
  var speed = Math.max(totalCards * 2.5, 30);
  track.style.setProperty('--marquee-speed', speed + 's');

  /* Small delay to let browser paint cards first, then start animation */
  requestAnimationFrame(function () {
    track.classList.add('scrolling');
  });
}

function createReviewCard(review) {
  var card = document.createElement('div');
  card.className = 'testimonial-card';

  var starsHtml = '';
  for (var s = 0; s < 5; s++) {
    starsHtml += s < review.rating ? '★' : '☆';
  }

  var initial = review.name.charAt(0);
  var dateStr = '';
  if (review.date) {
    var d = new Date(review.date);
    dateStr = d.toLocaleDateString('ar-MA', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  card.innerHTML =
    '<div class="testimonial-stars">' + starsHtml + '</div>' +
    '<p class="testimonial-text">"' + escapeHtml(review.text) + '"</p>' +
    '<div class="testimonial-author">' +
      '<div class="testimonial-avatar">' + initial + '</div>' +
      '<div>' +
        '<div class="testimonial-name">' + escapeHtml(review.name) + '</div>' +
        '<div class="testimonial-location">' + escapeHtml(review.city) + '</div>' +
        (dateStr ? '<div class="testimonial-date">' + dateStr + '</div>' : '') +
      '</div>' +
    '</div>';
  return card;
}

function escapeHtml(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/* Handle review form submission */
function handleReviewSubmit(e) {
  e.preventDefault();

  var btn = document.getElementById('submitReviewBtn');
  var msgEl = document.getElementById('reviewFormMessage');

  var name = document.getElementById('reviewName').value.trim();
  var city = document.getElementById('reviewCity').value.trim();
  var rating = parseInt(document.getElementById('reviewRating').value);
  var text = document.getElementById('reviewText').value.trim();

  if (!name || !city || !text) {
    showMessage(msgEl, 'يرجى ملء جميع الحقول المطلوبة.', 'error');
    return false;
  }

  if (rating < 1) {
    showMessage(msgEl, 'يرجى اختيار تقييم من 1 إلى 5 نجوم.', 'error');
    return false;
  }

  var newReview = {
    id: Date.now(),
    name: name,
    city: city,
    rating: rating,
    text: text,
    date: new Date().toISOString().split('T')[0]
  };

  /* Save to localStorage */
  var localReviews = JSON.parse(localStorage.getItem('bm-reviews') || '[]');
  localReviews.push(newReview);
  localStorage.setItem('bm-reviews', JSON.stringify(localReviews));

  /* Add to current display (prepend to top) */
  allReviews.unshift(newReview);
  var grid = document.getElementById('reviewsGrid');
  if (grid) {
    var card = createReviewCard(newReview);
    grid.insertBefore(card, grid.firstChild);
    displayedCount++;
  }

  /* Reset form */
  document.getElementById('reviewForm').reset();
  document.getElementById('reviewRating').value = '0';
  var stars = document.querySelectorAll('#starRating .star');
  stars.forEach(function (s) { s.classList.remove('active'); });

  showMessage(msgEl, '✅ شكراً لك! تم نشر تقييمك بنجاح.', 'success');

  /* Scroll to reviews section */
  var reviewsSection = document.getElementById('reviews');
  if (reviewsSection) {
    reviewsSection.scrollIntoView({ behavior: 'smooth' });
  }

  return false;
}

/* ================================================================
   HELPERS
   ================================================================ */

/* Safely read a CONFIG value */
function getConfigValue(key, fallback) {
  try {
    if (typeof CONFIG !== 'undefined' && CONFIG[key] !== undefined) {
      return CONFIG[key];
    }
  } catch (e) { /* CONFIG not loaded */ }
  return fallback;
}

/* Check if a value is still a placeholder */
function isPlaceholder(val) {
  if (!val) return true;
  return val.indexOf('PASTE_YOUR') !== -1 || val.indexOf('XXXXXXXXX') !== -1;
}

/* ================================================================
   SOCIAL MEDIA ICONS — show/hide based on config
   ================================================================ */
function initSocialIcons() {
  var socialMap = [
    { key: 'FACEBOOK_URL',  headerEl: 'headerFacebook',  footerEl: 'footerFacebook' },
    { key: 'INSTAGRAM_URL', headerEl: 'headerInstagram', footerEl: 'footerInstagram' },
    { key: 'TIKTOK_URL',    headerEl: 'headerTiktok',    footerEl: 'footerTiktok' },
    { key: 'TELEGRAM_URL',  headerEl: 'headerTelegram',  footerEl: 'footerTelegram' }
  ];

  socialMap.forEach(function (item) {
    var url = getConfigValue(item.key, '');
    if (url && url.trim() !== '') {
      var headerIcon = document.getElementById(item.headerEl);
      var footerIcon = document.getElementById(item.footerEl);
      if (headerIcon) { headerIcon.style.display = ''; headerIcon.href = url; }
      if (footerIcon) { footerIcon.style.display = ''; footerIcon.href = url; }
    }
  });
}

/* ================================================================
   DIRECT ORDER FORM (inline on landing page)
   ================================================================ */
function changeDirectQty(delta) {
  var input = document.getElementById('directQtyInput');
  if (!input) return;
  var val = parseInt(input.value, 10) || 1;
  val += delta;
  if (val < 1) val = 1;
  if (val > 10) val = 10;
  input.value = val;
}

function handleDirectOrderSubmit(e) {
  e.preventDefault();

  var btn = document.getElementById('directSubmitBtn');
  var msgEl = document.getElementById('directFormMessage');

  var product = '\u0634\u0627\u062d\u0646 \u0645\u062a\u0646\u0642\u0644 20000 \u0645\u0644\u0644\u064a \u0623\u0645\u0628\u064a\u0631';
  var price = '199 \u062f\u0631\u0647\u0645';
  var qty = document.getElementById('directQtyInput') ? document.getElementById('directQtyInput').value : '1';
  var name = document.getElementById('directName').value.trim();
  var phone = document.getElementById('directPhone').value.trim();
  var city = document.getElementById('directCity').value.trim();
  var address = document.getElementById('directAddress').value.trim();
  var notes = document.getElementById('directNotes').value.trim();

  if (!name || !phone || !city || !address) {
    showMessage(msgEl, '\u064a\u0631\u062c\u0649 \u0645\u0644\u0621 \u062c\u0645\u064a\u0639 \u0627\u0644\u062d\u0642\u0648\u0644 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629.', 'error');
    return false;
  }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> \u062c\u0627\u0631\u064a \u0627\u0644\u0625\u0631\u0633\u0627\u0644...';

  var orderData = {
    store: getConfigValue('STORE_NAME', '\u0628\u0648\u062a\u064a\u0643 \u0627\u0644\u0645\u063a\u0631\u0628'),
    timestamp: new Date().toISOString(),
    product: product,
    price: price,
    qty: qty,
    name: name,
    phone: phone,
    city: city,
    address: address,
    notes: notes || '\u2014'
  };

  var sheetsPromise = sendToGoogleSheets(orderData);
  var telegramPromise = sendToTelegram(formatOrderTelegram(orderData));

  Promise.allSettled([sheetsPromise, telegramPromise]).then(function (results) {
    var sheetsOk = results[0].status === 'fulfilled' && results[0].value === true;
    var telegramOk = results[1].status === 'fulfilled' && results[1].value === true;

    if (sheetsOk || telegramOk) {
      document.getElementById('directOrderForm').reset();
      if (document.getElementById('directQtyInput')) document.getElementById('directQtyInput').value = '1';
      showMessage(msgEl, '\u2705 \u062a\u0645 \u0625\u0631\u0633\u0627\u0644 \u0637\u0644\u0628\u0643 \u0628\u0646\u062c\u0627\u062d! \u0633\u0646\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0643 \u0642\u0631\u064a\u0628\u0627\u064b.', 'success');
    } else {
      showMessage(msgEl, '\u26a0\ufe0f \u062a\u0639\u0630\u0631 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0637\u0644\u0628. \u064a\u0631\u062c\u0649 \u0627\u0644\u0645\u062d\u0627\u0648\u0644\u0629 \u0639\u0628\u0631 \u0648\u0627\u062a\u0633\u0627\u0628.', 'error');
    }

    btn.disabled = false;
    btn.innerHTML = '\ud83d\udce6 \u0627\u0637\u0644\u0628 \u0628\u0633\u0631\u0639\u0629';
  });

  return false;
}

function directOrderWhatsApp() {
  var phone = getConfigValue('WHATSAPP_NUMBER', '');
  if (!phone || phone === '212XXXXXXXXX') {
    alert('\u0631\u0642\u0645 \u0648\u0627\u062a\u0633\u0627\u0628 \u063a\u064a\u0631 \u0645\u0647\u064a\u0623. \u064a\u0631\u062c\u0649 \u0627\u0644\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627 \u0645\u0628\u0627\u0634\u0631\u0629.');
    return;
  }

  var product = '\u0634\u0627\u062d\u0646 \u0645\u062a\u0646\u0642\u0644 20000 \u0645\u0644\u0644\u064a \u0623\u0645\u0628\u064a\u0631';
  var price = '199 \u062f\u0631\u0647\u0645';
  var qty = document.getElementById('directQtyInput') ? document.getElementById('directQtyInput').value : '1';
  var name = document.getElementById('directName').value.trim() || '(\u0644\u0645 \u064a\u064f\u062f\u062e\u0644)';
  var customerPhone = document.getElementById('directPhone').value.trim() || '(\u0644\u0645 \u064a\u064f\u062f\u062e\u0644)';
  var city = document.getElementById('directCity').value.trim() || '(\u0644\u0645 \u064a\u064f\u062f\u062e\u0644)';
  var address = document.getElementById('directAddress').value.trim() || '(\u0644\u0645 \u064a\u064f\u062f\u062e\u0644)';
  var notes = document.getElementById('directNotes').value.trim() || '\u2014';

  var msg =
    '\ud83d\uded2 *\u0637\u0644\u0628 \u062c\u062f\u064a\u062f \u2014 ' + getConfigValue('STORE_NAME', '\u0628\u0648\u062a\u064a\u0643 \u0627\u0644\u0645\u063a\u0631\u0628') + '*\n\n' +
    '\ud83d\udce6 \u0627\u0644\u0645\u0646\u062a\u062c: ' + product + '\n' +
    '\ud83d\udcb0 \u0627\u0644\u0633\u0639\u0631: ' + price + '\n' +
    '\ud83d\udd22 \u0627\u0644\u0643\u0645\u064a\u0629: ' + qty + '\n\n' +
    '\ud83d\udc64 \u0627\u0644\u0627\u0633\u0645: ' + name + '\n' +
    '\ud83d\udcde \u0627\u0644\u0647\u0627\u062a\u0641: ' + customerPhone + '\n' +
    '\ud83c\udfd9\ufe0f \u0627\u0644\u0645\u062f\u064a\u0646\u0629: ' + city + '\n' +
    '\ud83d\udccd \u0627\u0644\u0639\u0646\u0648\u0627\u0646: ' + address + '\n' +
    '\ud83d\udcdd \u0645\u0644\u0627\u062d\u0638\u0627\u062a: ' + notes;

  var url = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg);
  window.open(url, '_blank');
}

/* ================================================================
   FLOATING WHATSAPP BUTTON
   ================================================================ */
function initFloatingWA() {
  var phone = getConfigValue('WHATSAPP_NUMBER', '');
  var btn = document.getElementById('floatingWA');
  if (!btn) return;

  if (!phone || phone === '212XXXXXXXXX') {
    btn.style.display = 'none';
    return;
  }

  var msg = encodeURIComponent(
    'السلام عليكم ' + getConfigValue('STORE_NAME', 'بوتيك المغرب') +
    '! أنا مهتم بمنتجاتكم.'
  );
  btn.href = 'https://wa.me/' + phone + '?text=' + msg;
  btn.target = '_blank';
}

/* ================================================================
   SCROLL REVEAL — Intersection Observer
   ================================================================ */
function initScrollReveal() {
  var revealElements = document.querySelectorAll(
    '.section-title, .section-subtitle, .testimonial-card, .featured-card, ' +
    '.featured-image, .featured-info, .review-form-card, .order-form, ' +
    '.contact-info-card, .contact-form-card, .product-details, .gallery, ' +
    '.trust-badge, .feature-card, .order-form-card'
  );

  if (!revealElements.length || !('IntersectionObserver' in window)) return;

  revealElements.forEach(function (el) {
    el.classList.add('reveal');
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(function (el) {
    observer.observe(el);
  });
}

/* Show success / error message */
function showMessage(el, text, type) {
  if (!el) return;
  el.textContent = text;
  el.className = 'form-message ' + type;
  el.style.display = 'block';

  /* Auto-hide after 8 seconds */
  setTimeout(function () {
    el.style.display = 'none';
  }, 8000);
}
