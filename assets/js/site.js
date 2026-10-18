// Squishy Says — site script (all pages).
(function () {
  'use strict';

  // ===== SHOP SETTINGS — the only place to edit when it's time to sell =====
  // paymentLink: paste a Stripe Payment Link (https://buy.stripe.com/...) or a
  //              Shopify Buy Button checkout URL. Empty = "Coming soon".
  // price:       the price shown on the Shop page, e.g. '$12.99'. Empty = "Price coming soon".
  var SHOP = {
    paymentLink: '',
    price: ''
  };

  // ===== ANSWER KEY — must match the back of the box =====
  var ANSWERS = [
    { text: 'YES, GIRL!', color: 'Pink', hex: '#FF3D9A', tint: '#FFE3F1' },
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
    if (SHOP.price) $('priceLabel').textContent = SHOP.price;
    if (SHOP.paymentLink) {
      buyBtn.href = SHOP.paymentLink;
      buyBtn.textContent = 'Buy now';
      buyBtn.classList.remove('is-disabled');
      buyBtn.removeAttribute('aria-disabled');
      $('stockPill').textContent = 'In stock';
      $('checkoutNote').textContent = 'Secure checkout. You’ll be taken to our payment page to finish your order.';
      $('notifyBtn').hidden = true;
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

  // ===== Wholesale inquiry form → pre-filled email =====
  var form = $('wholesaleForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (id) { return ($(id).value || '').trim(); };
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('email'));
      var err = $('formError');
      if (!v('store') || !v('contact') || !emailOk) { err.hidden = false; return; }
      err.hidden = true;
      var body = [
        'Store: ' + v('store'),
        'Contact: ' + v('contact'),
        'Email: ' + v('email'),
        'Phone: ' + (v('phone') || '-'),
        'Location: ' + (v('location') || '-'),
        'Store type: ' + v('storetype'),
        '',
        v('message')
      ].join('\n');
      window.location.href = 'mailto:info@squishysays.com?subject=' +
        encodeURIComponent('Wholesale inquiry — ' + v('store')) +
        '&body=' + encodeURIComponent(body);
    });
  }
})();
