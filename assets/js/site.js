// Squishy Says — site script (all pages).
(function () {
  'use strict';

  // ===== SHOP SETTINGS — the only place to edit for selling =====
  // status:  'coming-soon' | 'on-sale' | 'sold-out'
  //          'on-sale' only after the Gate 5 go-ahead in PLAN.md.
  //          'sold-out' greys out the buttons and turns the bottom box into a waitlist.
  // offers:  one entry per Stripe Payment Link. paymentLink must be a LIVE link
  //          (https://buy.stripe.com/...) — never a test_ link on main.
  //          Prices set by the owner 2026-11-16 (see PLAN.md decisions log).
  var SHOP = {
    status: 'on-sale',
    offers: {
      single: { price: '$12', note: 'Plus shipping · limit 3 per order', paymentLink: 'https://buy.stripe.com/9B65kCdPV5xh0fH1ei9Ve00' },
      three:  { price: '$32', note: 'Free shipping · save $4', paymentLink: 'https://buy.stripe.com/bJe14m6nt8Jt8Md0ae9Ve01' }
    }
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
  var offerEls = document.querySelectorAll('[data-offer]');
  if (offerEls.length) {
    var onSale = SHOP.status === 'on-sale';
    var soldOut = SHOP.status === 'sold-out';
    var anyLive = false;
    Array.prototype.forEach.call(offerEls, function (row) {
      var o = SHOP.offers[row.getAttribute('data-offer')] || {};
      row.querySelector('[data-price]').textContent = o.price || '';
      row.querySelector('[data-note]').textContent = o.note || '';
      var btn = row.querySelector('[data-buy]');
      if (onSale && o.paymentLink) {
        anyLive = true;
        btn.href = o.paymentLink;
        btn.textContent = 'Buy now';
        btn.classList.remove('is-disabled');
        btn.removeAttribute('aria-disabled');
      } else {
        btn.textContent = soldOut ? 'Sold out' : 'Coming soon';
      }
    });
    var pill = $('stockPill');
    if (anyLive) {
      pill.textContent = 'In stock';
      $('checkoutNote').textContent = 'Secure checkout through Stripe. Limit 3 per customer.';
      $('notifyBtn').hidden = true;
      if ($('notify')) $('notify').hidden = true;
    } else if (soldOut) {
      pill.textContent = 'Sold out';
      pill.classList.add('pill-soldout');
      $('notifyBtn').textContent = 'Join the waitlist';
      $('checkoutNote').textContent = 'Sold out! Join the waitlist and we\u2019ll email you when we restock.';
      $('notifyTitle').textContent = 'Sold out! Join the waitlist';
      $('notifyBody').textContent = 'Leave your email and we\u2019ll let you know the moment Squishy Says is back.';
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
  // ===== Waitlist (shop) → emailed to info@ via FormSubmit =====
  var wl = $('waitlistForm');
  if (wl) {
    var wlThanks = $('wlThanks');
    var wlError = $('wlError');
    var joined = function () {
      wl.hidden = true;
      wlError.hidden = true;
      wlThanks.hidden = false;
    };
    if (/[?&]joined=1/.test(window.location.search)) joined();
    wl.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = ($('wlEmail').value || '').trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        wlError.textContent = 'Please enter a valid email address.';
        wlError.hidden = false;
        return;
      }
      var btn = $('wlSubmit');
      btn.disabled = true;
      btn.textContent = 'Joining\u2026';
      var data = {};
      Array.prototype.forEach.call(wl.elements, function (f) { if (f.name) data[f.name] = f.value; });
      fetch('https://formsubmit.co/ajax/info@squishysays.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) { return r.json(); }).then(function (res) {
        if (String(res.success) === 'true') { joined(); return; }
        throw new Error(res.message || 'failed');
      }).catch(function () {
        wlError.innerHTML = '';
        wlError.appendChild(document.createTextNode('Sorry, that didn\u2019t go through. Email '));
        var a = el('a', '', 'info@squishysays.com');
        a.href = 'mailto:info@squishysays.com?subject=Add%20me%20to%20the%20Squishy%20Says%20waitlist';
        wlError.appendChild(a);
        wlError.appendChild(document.createTextNode(' and we\u2019ll add you.'));
        wlError.hidden = false;
        btn.disabled = false;
        btn.textContent = 'Join the waitlist';
      });
    });
  }
})();
