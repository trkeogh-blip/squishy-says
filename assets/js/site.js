// Squishy Says — fortune demo and answer key.
// ANSWERS is the single source of truth for color → answer. It matches the
// answer key on the back of the box. Change it here if the key changes.
(function () {
  'use strict';

  var ANSWERS = [
    { text: 'YES, GIRL!', color: 'Pink', hex: '#FF3D9A', tint: '#FFE3F1' },
    { text: 'NO WAY!', color: 'Purple', hex: '#8E4DE0', tint: '#EEE3FC' },
    { text: 'ASK AGAIN LATER', color: 'Yellow', hex: '#FFC93C', tint: '#FFF4CC' },
    { text: 'HECK NO!', color: 'Blue', hex: '#2F7BEA', tint: '#E1ECFD' },
    { text: 'GOOD THINGS AHEAD!', color: 'Green', hex: '#2FBF5A', tint: '#DDF6E4' },
    { text: 'MAYBE! THE UNIVERSE IS THINKING.', color: 'Orange', hex: '#FF8A2A', tint: '#FFE9D6' }
  ];
  var SPOTS = [[24, 28], [52, 20], [77, 32], [26, 66], [54, 60], [77, 70]];

  var ball = document.getElementById('ball');
  var result = document.getElementById('result');
  var input = document.getElementById('q');
  var squishBtn = document.getElementById('squishBtn');
  var ballBtn = document.getElementById('ballBtn');
  var grid = document.getElementById('answerGrid');
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = String(new Date().getFullYear());

  function gradient(hex) {
    return 'radial-gradient(circle at 35% 30%, rgba(255,255,255,.75) 0 10%, ' + hex + ' 45%, ' + hex + ' 100%)';
  }

  // Answer key cards
  var cards = ANSWERS.map(function (a) {
    var li = document.createElement('li');
    li.className = 'answer';
    var sw = document.createElement('span');
    sw.className = 'swatch';
    sw.style.background = gradient(a.hex);
    sw.setAttribute('aria-hidden', 'true');
    var txt = document.createElement('div');
    var t = document.createElement('div');
    t.className = 'answer-text';
    t.textContent = a.text;
    var c = document.createElement('div');
    c.className = 'answer-color';
    c.textContent = a.color;
    txt.appendChild(t);
    txt.appendChild(c);
    li.appendChild(sw);
    li.appendChild(txt);
    grid.appendChild(li);
    return li;
  });

  // Balls inside the squishy
  var dots = ANSWERS.map(function (a) {
    var d = document.createElement('span');
    d.className = 'dot';
    d.style.background = gradient(a.hex);
    ball.appendChild(d);
    return d;
  });

  var order = [0, 1, 2, 3, 4, 5];
  var busy = false;
  var rounds = 0;

  function place(picked) {
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
  }

  function shuffle() {
    for (var i = order.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = order[i]; order[i] = order[j]; order[j] = tmp;
    }
  }

  function show(picked) {
    var a = ANSWERS[picked];
    var q = input.value.trim();
    result.innerHTML = '';
    var asked = document.createElement('p');
    asked.className = 'asked';
    asked.textContent = q ? '“' + q + '”' : 'Squishy says…';
    var f = document.createElement('p');
    f.className = 'fortune';
    f.textContent = a.text;
    f.style.background = a.tint;
    f.style.borderColor = a.hex;
    result.appendChild(asked);
    result.appendChild(f);
  }

  function squish() {
    if (busy) return;
    busy = true;
    shuffle();
    place(-1);
    ball.classList.remove('squish');
    void ball.offsetWidth; // restart animation
    ball.classList.add('squish');
    setTimeout(function () {
      var picked = Math.floor(Math.random() * ANSWERS.length);
      place(picked);
      show(picked);
      rounds += 1;
      squishBtn.textContent = 'Squish again!';
      busy = false;
    }, 520);
  }

  place(-1);
  squishBtn.addEventListener('click', squish);
  ballBtn.addEventListener('click', squish);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); squish(); }
  });
})();
