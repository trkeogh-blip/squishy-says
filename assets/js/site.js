// Squishy Says — site script (all pages).
(function () {
  'use strict';

  // ===== SHOP SETTINGS — the only place to edit when it's time to sell =====
  // One entry per thing a customer can buy. Each gets its own Stripe Payment
  // Link (with its own shipping rate) so multi-packs can carry a shipping deal.
  //   label:       what the button row is called, e.g. 'Single' or '3-Pack'
  //   detail:      one short line under the label
  //   price:       shown on the page, e.g. '$12.99' (Stripe charges the real amount)
  //   paymentLink: a LIVE Stripe Payment Link, https://buy.stripe.com/...
  // An offer only appears once it has BOTH a price and a live link. With none
  // ready, the Shop page shows "Coming soon". Never put a test link here, and
  // never fill these in without the owners' go-ahead (see PLAN.md, Gate 5).
  // shipNote: shown under the price before and after launch ('' hides it).
  // preorder: true = the pill says "Pre-order" once links are live.
  var SHOP = {
    shipNote: 'Pre-order — ships mid-November',
    preorder: true,
    offers: [
      { label: 'Single', detail: '1 Squishy Says · $4.95 shipping', price: '$13.99', paymentLink: '' },
      { label: '3-Pack', detail: '3 Squishy Says · free shipping', price: '$41.97', paymentLink: '' },
      // Owners: photos and price to come. Stays hidden until price + live link are set.
      { label: 'Make-Your-Own Fortune Cards', detail: '10 blank cards', price: '', paymentLink: '' }
    ]
  };

  // ===== ANSWER KEY — must match the back of the box =====
  var ANSWERS = [
    { text: 'TOTALLY!', color: 'Pink', hex: '#FF3D9A', tint: '#FFE3F1' },
    { text: 'NO WAY!', color: 'Purple', hex: '#8E4DE0', tint: '#EEE3FC' },
    { text: 'ASK AGAIN LATER', color: 'Yellow', hex: '#FFC93C', tint: '#FFF4CC' },
    { text: 'HECK NO!', color: 'Blue', hex: '#2F7BEA', tint: '#E1ECFD' },
    { text: 'GOOD THINGS AHEAD!', color: 'Green', hex: '#2FBF5A', tint: '#DDF6E4' },
    { text: 'MAYBE! THE UNIVERSE IS THINKING.', color: 'Orange', hex: '#FF8A2A', tint: '#FFE9D6' }
  ];

  function $(id) { return document.getElementById(id); }
  function gradient(hex) {
    return 'radial-gradient(circle at 35% 30%, rgba(255,255,255,.75) 0 10%, ' + hex + ' 45%, ' + hex + ' 100%)';
  }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  Array.prototype.forEach.call(document.querySelectorAll('.yr'), function (n) {
    n.textContent = String(new Date().getFullYear());
  });

  // ===== Answer key cards (home) =====
  var cards = [];
  var grid = $('answerGrid');
  if (grid) {
    cards = ANSWERS.map(function (a) {
      var li = el('li', 'answer');
      var sw = el('span', 'swatch');
      sw.style.background = gradient(a.hex);
      sw.setAttribute('aria-hidden', 'true');
      var txt = el('div');
      txt.appendChild(el('div', 'answer-text', a.text));
      txt.appendChild(el('div', 'answer-color', a.color));
      li.appendChild(sw);
      li.appendChild(txt);
      grid.appendChild(li);
      return li;
    });
  }

  // ===== Compact answer list (shop) =====
  var list = $('answerList');
  if (list) {
    ANSWERS.forEach(function (a) {
      var li = el('li');
      var sw = el('span', 'mini-swatch');
      sw.style.background = gradient(a.hex);
      sw.setAttribute('aria-hidden', 'true');
      li.appendChild(sw);
      li.appendChild(el('span', '', a.color + ' — ' + a.text));
      list.appendChild(li);
    });
  }

  // ===== Fortune demo (home) =====
  var ball = $('ball');
  if (ball) {
    var SPOTS = [[24, 28], [52, 20], [77, 32], [26, 66], [54, 60], [77, 70]];
    var result = $('result');
    var input = $('q');
    var squishBtn = $('squishBtn');
    var order = [0, 1, 2, 3, 4, 5];
    var busy = false;

    var dots = ANSWERS.map(function (a) {
      var d = el('span', 'dot');
      d.style.background = gradient(a.hex);
      ball.appendChild(d);
      return d;
    });

    var place = function (picked) {
      dots.forEach(function (d, i) {
        var isPick = i === picked;
        var spot = SPOTS[order.indexOf(i)];
        d.style.left = (isPick ? 50 : spot[0]) + '%';
        d.style.top = (isPick ? 50 : spot[1]) + '%';
        d.classList.toggle('picked', isPick);
        d.classList.toggle('dim', picked >= 0 && !isPick);
      });
      cards.forEach(function (c, i) {
        c.style.borderColor = i === picked ? ANSWERS[i].hex : 'transparent';
      });
    };

    var show = function (picked) {
      var a = ANSWERS[picked];
      var q = input.value.trim();
      result.innerHTML = '';
      result.appendChild(el('p', 'asked', q ? '“' + q + '”' : 'Squishy says…'));
      var f = el('p', 'fortune', a.text);
      f.style.background = a.tint;
      f.style.borderColor = a.hex;
      result.appendChild(f);
    };

    var squish = function () {
      if (busy) return;
      busy = true;
      for (var i = order.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = order[i]; order[i] = order[j]; order[j] = tmp;
      }
      place(-1);
      ball.classList.remove('squish');
      void ball.offsetWidth;
      ball.classList.add('squish');
      setTimeout(function () {
        var picked = Math.floor(Math.random() * ANSWERS.length);
        place(picked);
        show(picked);
        squishBtn.textContent = 'Squish again!';
        busy = false;
      }, 520);
    };

    place(-1);
    squishBtn.addEventListener('click', squish);
    $('ballBtn').addEventListener('click', squish);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); squish(); }
    });
  }

  // ===== Shop page =====
  var buyBtn = $('buyBtn');
  if (buyBtn) {
    var isLiveLink = function (url) {
      // Only real, live Stripe Payment Links; test links never render.
      return /^https:\/\/buy\.stripe\.com\/(?!test_)[A-Za-z0-9_]+$/.test(url || '');
    };
    var ready = SHOP.offers.filter(function (o) {
      return o && o.label && o.price && isLiveLink(o.paymentLink);
    });
    if (SHOP.offers[0] && SHOP.offers[0].price) $('priceLabel').textContent = SHOP.offers[0].price;
    if (SHOP.shipNote) { $('shipNote').textContent = SHOP.shipNote; $('shipNote').hidden = false; }
    if (ready.length) {
      var box = $('offers');
      ready.forEach(function (o) {
        var row = el('div', 'offer');
        var txt = el('div', 'offer-text');
        txt.appendChild(el('span', 'offer-label', o.label));
        if (o.detail) txt.appendChild(el('span', 'offer-detail', o.detail));
        row.appendChild(txt);
        row.appendChild(el('span', 'offer-price', o.price));
        var a = el('a', 'btn btn-pink', 'Buy now');
        a.href = o.paymentLink;
        a.setAttribute('aria-label', 'Buy ' + o.label + ', ' + o.price);
        row.appendChild(a);
        box.appendChild(row);
      });
      box.hidden = false;
      buyBtn.hidden = true;
      if (ready.length === 1) $('priceLabel').textContent = ready[0].price;
      else $('priceLabel').hidden = true;
      $('stockPill').textContent = SHOP.preorder ? 'Pre-order' : 'In stock';
      $('checkoutNote').textContent = 'Secure checkout by Stripe. Shipping and any sales tax are shown before you pay.';
      $('notifyBtn').hidden = true;
      var notify = $('notify');
      if (notify) notify.hidden = true;
    }
    var main = $('mainImg');
    var thumbs = document.querySelectorAll('.thumb');
    Array.prototype.forEach.call(thumbs, function (t) {
      t.addEventListener('click', function () {
        main.src = t.getAttribute('data-src');
        main.alt = t.getAttribute('data-alt');
        Array.prototype.forEach.call(thumbs, function (o) { o.classList.toggle('is-active', o === t); });
      });
    });
  }

  // ===== Wholesale inquiry form → emailed to info@ via FormSubmit =====
  // First-ever submission sends an activation email to info@squishysays.com;
  // click "Activate" in it once and every later inquiry arrives directly.
  var form = $('wholesaleForm');
  if (form) {
    var thanks = $('formThanks');
    var showThanks = function () {
      form.hidden = true;
      thanks.hidden = false;
      thanks.focus();
    };
    if (/[?&]sent=1/.test(window.location.search)) showThanks();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (id) { return ($(id).value || '').trim(); };
      var err = $('formError');
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('email'));
      if (!v('store') || !v('contact') || !emailOk) {
        err.textContent = 'Please fill in your store name, your name and a valid email.';
        err.hidden = false;
        return;
      }
      err.hidden = true;
      var btn = $('formSubmit');
      btn.disabled = true;
      btn.textContent = 'Sending\u2026';

      var data = {};
      Array.prototype.forEach.call(form.elements, function (f) {
        if (f.name) data[f.name] = f.value;
      });
      data._subject = 'Wholesale inquiry \u2014 ' + v('store');

      fetch('https://formsubmit.co/ajax/info@squishysays.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) { return r.json(); }).then(function (res) {
        if (String(res.success) === 'true') { showThanks(); return; }
        throw new Error(res.message || 'failed');
      }).catch(function (ex) {
        var msg = (ex && ex.message) || '';
        err.textContent = /activat/i.test(msg)
          ? 'This form is still being set up. Please email info@squishysays.com for now.'
          : 'Sorry, that didn\u2019t send. Please try again, or email info@squishysays.com.';
        if (window.console) console.warn('Form service said:', msg);
        err.hidden = false;
        btn.disabled = false;
        btn.textContent = 'Send inquiry';
      });
    });
  }
})();
