/* ============================================================
   Muhammad Atif — portfolio · REALTIME theme interactions
   Vanilla JS, zero dependencies.
   ============================================================ */
(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = window.matchMedia('(pointer: fine)').matches;
  var d = document;

  d.documentElement.classList.add('js');
  d.body.classList.remove('no-scroll');

  /* ---------- Cursor trail (glowing particles, 2-3s fade) ---------- */
  var trailCanvas, trailCtx, trailParts = [], trailRAF = 0;
  function initTrail() {
    if (REDUCED || !FINE) return;
    trailCanvas = d.createElement('canvas');
    trailCanvas.id = 'cursor-trail';
    trailCanvas.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:9999;';
    d.body.appendChild(trailCanvas);
    trailCtx = trailCanvas.getContext('2d');
    function resize() {
      trailCanvas.width = window.innerWidth * (window.devicePixelRatio || 1);
      trailCanvas.height = window.innerHeight * (window.devicePixelRatio || 1);
      trailCanvas.style.width = window.innerWidth + 'px';
      trailCanvas.style.height = window.innerHeight + 'px';
      trailCtx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });
    function spawn(x, y) {
      var count = 3 + Math.floor(Math.random() * 3);
      for (var i = 0; i < count; i++) {
        var angle = Math.random() * 6.283;
        var speed = 0.8 + Math.random() * 1.2;
        trailParts.push({
          x: x, y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: 2.2 + Math.random() * 0.8,
          r: 1.5 + Math.random() * 2,
          hue: 180 + Math.floor(Math.random() * 40)
        });
      }
    }
    function step(dt) {
      trailCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (var i = trailParts.length - 1; i >= 0; i--) {
        var p = trailParts[i];
        p.x += p.vx * dt * 60;
        p.y += p.vy * dt * 60;
        p.vy += 0.015 * dt * 60;
        p.life -= dt;
        var a = Math.max(0, p.life / p.maxLife);
        if (a <= 0) { trailParts.splice(i, 1); continue; }
        trailCtx.beginPath();
        trailCtx.arc(p.x, p.y, p.r * a, 0, 6.283);
        trailCtx.fillStyle = 'hsla(' + p.hue + ', 90%, 60%, ' + (a * 0.6).toFixed(3) + ')';
        trailCtx.fill();
      }
      trailRAF = requestAnimationFrame(step);
    }
    var last = performance.now();
    function loop(now) {
      var dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      step(dt);
      trailRAF = requestAnimationFrame(loop);
    }
    trailRAF = requestAnimationFrame(loop);
    d.addEventListener('mousemove', function (e) {
      if (Math.random() < 0.15) spawn(e.clientX, e.clientY);
    }, { passive: true });
  }

  /* ---------- Click reaction: nearby UI pulses / status flash ---------- */
  function pulseNearby(x, y) {
    if (REDUCED) return;
    var candidates = d.querySelectorAll('[data-spot], [data-mag], .project, .cap, .metric, .step, .gate-card, .contact-card, .hr-card, .timeline-body, .compare-col, .view-btn, .btn, a[href^="#"]');
    var best = null, bestDist = 180;
    candidates.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      var dx = x - cx, dy = y - cy;
      var dist = Math.sqrt(dx * dx + dy * dy) - Math.max(r.width, r.height) * 0.4;
      if (dist < bestDist) { bestDist = dist; best = el; }
    });
    if (!best) return;
    var original = best.style.transition;
    best.style.transition = 'box-shadow 0.12s ease, transform 0.12s ease, background 0.12s ease';
    best.style.boxShadow = '0 0 0 3px rgba(34,211,238,0.55), 0 0 24px rgba(34,211,238,0.25)';
    best.style.transform = 'scale(1.015)';
    if (best.classList.contains('cstat-v') || best.closest('.cstat')) {
      var num = best.closest('.cstat') ? best.closest('.cstat').querySelector('[data-count]') : best;
      if (num && num.textContent) {
        var cur = parseInt(num.textContent, 10);
        if (!isNaN(cur)) { num.textContent = cur + 1; }
      }
    }
    setTimeout(function () {
      best.style.boxShadow = '';
      best.style.transform = '';
      best.style.transition = original || '';
    }, 180);
    var feed = d.getElementById('live-feed');
    if (feed && Math.random() < 0.35) {
      var tags = ['{click}', '{tap}', '{evt}'];
      var msgs = [
        'interaction received · sector ' + Math.floor(Math.random() * 8),
        'input processed · latency <2ms',
        'telemetry ping · system nominal',
        'event logged · audit trail updated'
      ];
      var tag = tags[Math.floor(Math.random() * tags.length)];
      var msg = msgs[Math.floor(Math.random() * msgs.length)];
      var now = new Date();
      var ts = (now.getHours() < 10 ? '0' : '') + now.getHours() + ':' +
               (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ':' +
               (now.getSeconds() < 10 ? '0' : '') + now.getSeconds();
      var li = d.createElement('li');
      li.innerHTML = '<span class="ts">' + ts + '</span><span class="ev info">' + tag + ' ' + msg + '</span>';
      li.style.animation = 'fadeIn 0.2s ease';
      feed.appendChild(li);
      while (feed.children.length > 7) feed.removeChild(feed.firstChild);
    }
  }

  d.addEventListener('click', function (e) {
    if (e.target.closest('a[href^="http"], a[target="_blank"], .contact-wa')) return;
    pulseNearby(e.clientX, e.clientY);
  }, { passive: true });

  /* ---------- Year ---------- */
  var yearEl = d.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Smooth scroll for in-page links ---------- */
  function onClick(e, el) {
    var href = el.getAttribute('href') || '';
    if (href.charAt(0) !== '#' || href.length < 2) return;
    var target = d.querySelector(href);
    if (!target) return;
    e.preventDefault();
    var off = (href === '#top') ? 0 : -(window.innerWidth < 640 ? 8 : 64);
    var y = target.getBoundingClientRect().top + window.scrollY + off;
    if (REDUCED) { window.scrollTo(0, y); return; }
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    try { history.replaceState(null, '', href); } catch (err) {}
  }
  d.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) { onClick(e, a); });
  });

  /* ---------- Progress bar ---------- */
  var prog = d.getElementById('progress');
  function onScroll() {
    var st = d.documentElement.scrollTop || d.body.scrollTop;
    var max = (d.documentElement.scrollHeight || d.body.scrollHeight) - window.innerHeight;
    if (prog) prog.style.width = (max > 0 ? (st / max) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- UTC+5 clock ---------- */
  var clock = d.getElementById('clock');
  var sts = d.getElementById('status-ts');
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function tickClock() {
    var now = new Date();
    var utc = now.getTime() + now.getTimezoneOffset() * 60000;
    var t = new Date(utc + 5 * 3600000);
    var s = pad(t.getUTCHours()) + ':' + pad(t.getUTCMinutes()) + ':' + pad(t.getUTCSeconds());
    if (clock) clock.textContent = 'SYS · UTC+5 ' + s;
    if (sts) sts.textContent = 'UTC+5 ' + s;
  }
  tickClock();
  setInterval(tickClock, 1000);

  /* ---------- Custom cursor ---------- */
  if (FINE && !REDUCED) {
    d.body.classList.add('has-cursor');
    var dot = d.querySelector('.cursor-dot');
    var ring = d.querySelector('.cursor-ring');
    var cx = -100, cy = -100, rx = -100, ry = -100, seen = false;
    d.addEventListener('mousemove', function (e) {
      cx = e.clientX; cy = e.clientY;
      if (!seen) { seen = true; dot.style.opacity = 1; ring.style.opacity = 1; }
      var t = e.target;
      var hit = t.closest('a, button, input, textarea, [data-mag], .view-btn');
      d.body.classList.toggle('is-hover', !!hit && t.nodeName !== 'BODY');
    }, { passive: true });
    d.addEventListener('mousedown', function () { d.body.classList.add('is-down'); });
    d.addEventListener('mouseup', function () { d.body.classList.remove('is-down'); });
    d.addEventListener('mouseleave', function () { dot.style.opacity = 0; ring.style.opacity = 0; });
    d.addEventListener('mouseenter', function () { dot.style.opacity = 1; ring.style.opacity = 1; });
    (function loop() {
      rx += (cx - rx) * 0.16;
      ry += (cy - ry) * 0.16;
      if (dot) dot.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)';
      if (ring) ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
  } else {
    var cur = d.querySelector('.cursor');
    if (cur) cur.style.display = 'none';
  }

  /* Initialize cursor trail */
  initTrail();

  /* ---------- Particle network ---------- */
  var net = d.getElementById('net');
  if (net && !REDUCED) {
    var ctx = net.getContext('2d');
    var W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);
    var parts = [], mouse = { x: -1e4, y: -1e4 };
    var LINK = 125;
    function size() {
      W = net.clientWidth; H = net.clientHeight;
      net.width = W * DPR; net.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      var n = Math.max(24, Math.min(85, Math.round((W * H) / 17000)));
      parts = [];
      for (var i = 0; i < n; i++) {
        parts.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
          r: Math.random() * 1.6 + 0.7
        });
      }
    }
    function step() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.x += p.vx; p.y += p.vy;
        var dx = mouse.x - p.x, dy = mouse.y - p.y;
        var md = Math.sqrt(dx * dx + dy * dy);
        if (md < 160 && md > 0.001) { p.x -= (dx / md) * 0.06; p.y -= (dy / md) * 0.06; }
        if (p.x < -12) p.x = W + 12; if (p.x > W + 12) p.x = -12;
        if (p.y < -12) p.y = H + 12; if (p.y > H + 12) p.y = -12;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.2832);
        ctx.fillStyle = 'rgba(129,140,248,.55)';
        ctx.fill();
        for (var j = i + 1; j < parts.length; j++) {
          var q = parts[j], ax = p.x - q.x, ay = p.y - q.y, al = ax * ax + ay * ay;
          if (al < LINK * LINK) {
            var o = 1 - Math.sqrt(al) / LINK;
            ctx.strokeStyle = 'rgba(34,211,238,' + (o * 0.16).toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
      }
      requestAnimationFrame(step);
    }
    d.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX; mouse.y = e.clientY;
    }, { passive: true });
    d.addEventListener('mouseleave', function () { mouse.x = -1e4; mouse.y = -1e4; });
    window.addEventListener('resize', size, { passive: true });
    size(); step();
  }

  /* ---------- Reveal + counters ---------- */
  var counts = d.querySelectorAll('.count, [data-count]');
  var observed = [];
  d.querySelectorAll('.reveal').forEach(function (el) { observed.push(el); });
  counts.forEach(function (el) { if (!el.closest('.reveal')) observed.push(el); });

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (REDUCED) { el.textContent = target; return; }
    var t0 = null;
    function tick(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / 980, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * e);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        if (REDUCED) {
          el.classList.add('is-in');
          if (el.hasAttribute('data-count')) el.textContent = el.getAttribute('data-count');
        } else {
          el.classList.add('is-in');
          if (el.hasAttribute('data-count')) animateCount(el);
        }
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    observed.forEach(function (el) { io.observe(el); });
  } else {
    observed.forEach(function (el) {
      el.classList.add('is-in');
      if (el.hasAttribute('data-count')) el.textContent = el.getAttribute('data-count');
    });
  }

  /* ---------- Spotlight follows mouse (data-spot) ---------- */
  if (FINE) {
    d.querySelectorAll('[data-spot]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      }, { passive: true });
    });
  }

  /* ---------- Dual-view toggle ---------- */
  var viewBtns = d.querySelectorAll('.view-btn');
  var cards = d.querySelectorAll('[data-card]');
  viewBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var v = btn.getAttribute('data-view');
      viewBtns.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      cards.forEach(function (card) {
        card.querySelectorAll('[data-block]').forEach(function (blk) {
          blk.hidden = blk.getAttribute('data-block') !== v;
        });
      });
    });
  });

  /* ---------- Live console feed ---------- */
  var feed = d.getElementById('live-feed');
  if (feed && !REDUCED) {
    var lines = [
      ['{sys}', 'boot sequence completed in 0.42s', 'info'],
      ['{srv}', 'club.snooker live database connected', 'ok'],
      ['{tab}', 'TABLE-03 status: active · rate=peak', 'warn'],
      ['{bill}', 'invoice #241 paid ° JazzCash +₨860', 'ok'],
      ['{mem}', 'member Ahmed K. checked in', 'info'],
      ['{rem}', 'whatsapp reminder sent · 4 unpaid sessions', 'warn'],
      ['{srv}', 'daily backup → snapshot ingested · 0.9s', 'ok'],
      ['{rep}', 'report /dashboard/realtime delivered to owner', 'info'],
      ['{tab}', 'TABLE-07 start · timer(rate-band) running', 'info'],
      ['{bill}', 'invoice #242 paid ° cash +₨1,240', 'ok'],
      ['{aud}', 'role change audited · operator → cashier', 'warn'],
      ['{sys}', 'journey+payments sync · 48 records', 'ok']
    ];
    var li = 0, rows = [];
    function feedLine() {
      var item = lines[li % lines.length];
      li++;
      var now = new Date();
      var ts = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
      var liEl = d.createElement('li');
      liEl.innerHTML = '<span class="ts">' + ts + '</span><span class="ev ' + item[2] + '">' + item[0] + ' ' + item[1] + '</span>';
      feed.appendChild(liEl);
      rows.push(liEl);
      while (rows.length > 7) { var old = rows.shift(); if (old && old.parentNode) old.remove(); }
      setTimeout(feedLine, 1900);
    }
    feedLine();
  }

  /* ---------- Live GitHub activity ---------- */
  var ghNote = d.getElementById('gh-note');
  var ghList = d.getElementById('gh-repos');
  if (ghList) {
    var fallback = [
      { name: 'asif-snooker-club', desc: 'Club management CRM — live tables, billing, bookings, payments, reports. Docker-ready.', lang: 'PHP', stars: 0, top: true },
      { name: 'gravityh', desc: 'Event-driven professional-services CRM with automation and AI hooks.', lang: 'PHP', stars: 0, top: true },
      { name: 'syed-professional-crm', desc: 'Production CRM platform with installer and server re-configure screen.', lang: 'PHP', stars: 0, top: true },
      { name: 'matif157.github.io', desc: 'This portfolio — vanilla HTML/CSS/JS, zero dependencies.', lang: 'HTML', stars: 0, top: true }
    ];
    function es(s) {
      var t = d.createElement('textarea'); t.textContent = s == null ? '' : String(s); return t.innerHTML;
    }
    function renderRepos(repos) {
      ghList.innerHTML = '';
      repos.forEach(function (r) {
        var li = d.createElement('li');
        li.className = 'gh-repo';
        var url = 'https://github.com/matif157/' + encodeURIComponent(r.name);
        li.innerHTML =
          '<a class="gh-name" href="' + url + '" target="_blank" rel="noopener">' + es(r.name) + ' &#8599;</a>' +
          '<span class="gh-desc">' + es(r.desc) + '</span>' +
          '<span class="gh-meta"><span class="gh-lang">● ' + es(r.lang || 'n/a') + '</span>' +
          '<span>★ ' + (r.stars || 0) + '</span>' +
          (r.upd ? '<span>' + es(r.upd) + '</span>' : '') + '</span>';
        ghList.appendChild(li);
      });
    }
    function daysAgo(iso) {
      if (!iso) return '';
      var dd = Math.round((Date.now() - new Date(iso).getTime()) / 86400000);
      if (dd <= 1) return 'updated today';
      if (dd < 30) return 'updated ' + dd + 'd ago';
      return 'updated ' + Math.round(dd / 30) + 'mo ago';
    }
    var done = false;
    var whitelist = ['asif-snooker-club', 'gravityh', 'syed-professional-crm', 'matif157.github.io'];
    var badge = ghNote || d.querySelector('.live-badge');
    fetch('https://api.github.com/users/matif157/repos?sort=updated&per_page=40')
      .then(function (res) { if (!res.ok) throw new Error(res.status); return res.json(); })
      .then(function (data) {
        var keep = (data || []).filter(function (r) {
          return whitelist.indexOf(r.name) !== -1 && !r.archived;
        });
        if (!keep.length) throw new Error('empty');
        done = true;
        if (ghNote) ghNote.textContent = 'Live from GitHub (api.github.com):';
        if (badge) badge.innerHTML = '<i class="live-dot"></i>live · api.github.com';
        renderRepos(keep.map(function (r) {
          return { name: r.name, desc: r.description || '', lang: r.language, stars: r.stargazers_count, upd: daysAgo(r.updated_at), top: !r.fork };
        }));
      })
      .catch(function () {
        if (done) return;
        if (ghNote) ghNote.textContent = 'Live fetch unavailable — verified snapshot:';
        if (badge) badge.innerHTML = '<i class="live-dot"></i>verified snapshot';
        renderRepos(fallback);
      });
  }
})();