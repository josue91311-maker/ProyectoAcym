/**
 * IACyM Perú — Centenario & Evangelio Cuádruple Motion Controller
 * - The 4 Symbols Physically Descend from the Hero Emblem into the 4 Card Sockets
 * - Smooth Color Morph: Pure White (#ffffff) on Dark Navy Hero -> Deep Navy (#131d3b) on White Cards
 */
(function () {
  'use strict';

  var currentProgress = 0;

  document.addEventListener('DOMContentLoaded', function () {
    initSymbolFlightToCards();
    initHeroMouseParallax();
    initCardHoverSync();
  });

  /* ==========================================================================
     1. DIRECT FLIGHT FROM HERO EMBLEM INTO THE 4 COLUMN CARD SOCKETS
     ========================================================================== */
  function initSymbolFlightToCards() {
    var stage = document.getElementById('hero-logo-3d-stage');
    var unitGlobe = document.getElementById('hero-unit-globe');
    var halo = document.getElementById('united-logo-halo');
    var coronaOcclusion = document.getElementById('corona-inner-occlusion');
    var scrollCue = document.getElementById('hero-scroll-cue');

    var items = [
      {
        key: 'cruz',
        el: document.getElementById('hero-unit-cruz'),
        sock: document.getElementById('socket-cruz'),
        card: document.getElementById('card-cruz'),
        ox: 96.66 / 180,
        oy: 69.16 / 180,
        targetScale: 0.40
      },
      {
        key: 'lavacro',
        el: document.getElementById('hero-unit-lavacro'),
        sock: document.getElementById('socket-lavacro'),
        card: document.getElementById('card-lavacro'),
        ox: 140.08 / 180,
        oy: 94.83 / 180,
        targetScale: 0.50
      },
      {
        key: 'jarra',
        el: document.getElementById('hero-unit-jarra'),
        sock: document.getElementById('socket-jarra'),
        card: document.getElementById('card-jarra'),
        ox: 50.20 / 180,
        oy: 93.34 / 180,
        targetScale: 0.50
      },
      {
        key: 'corona',
        el: document.getElementById('hero-unit-corona'),
        sock: document.getElementById('socket-corona'),
        card: document.getElementById('card-corona'),
        ox: 95.63 / 180,
        oy: 126.59 / 180,
        targetScale: 0.52
      }
    ];

    if (!stage || !items[0].el || !items[0].sock) return;

    // Cache SVG paths inside each flying piece for smooth White -> Deep Navy color morph
    items.forEach(function (item) {
      if (!item.el) return;
      item.shapePath = item.el.querySelector('.emblem-shape-path');
      item.extrudePath = item.el.querySelector('.emblem-extrude-back');
    });

    function clamp(v, min, max) {
      return Math.max(min, Math.min(max, v));
    }

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    var ticking = false;

    function updateFlight() {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      var vh = window.innerHeight || 800;
      var stageRect = stage.getBoundingClientRect();

      var maxRawP = 0;

      items.forEach(function (item) {
        if (!item.el || !item.sock) return;

        var sockRect = item.sock.getBoundingClientRect();
        var sockCx = sockRect.left + sockRect.width / 2;
        var sockCy = sockRect.top + sockRect.height / 2;

        // Exact origin of this symbol inside the untransformed stage
        var originX = stageRect.left + stageRect.width * item.ox;
        var originY = stageRect.top + stageRect.height * item.oy;

        // Total delta from united logo position to center of the card socket
        var targetTx = sockCx - originX;
        var targetTy = sockCy - originY;

        // Document Y of the socket center
        var sockDocY = sockCy + scrollY;
        var landingScroll = Math.max(240, sockDocY - vh * 0.72);

        var rawP = clamp(scrollY / landingScroll, 0, 1.0);
        if (rawP > maxRawP) maxRawP = rawP;

        var px = easeOutCubic(rawP);
        var py = easeInOutQuad(rawP);
        var ps = easeInOutQuad(rawP);

        var curTx = targetTx * px;
        var curTy = targetTy * py;
        var curScale = 1.0 + (item.targetScale - 1.0) * ps;

        item.el.style.transform =
          'translate3d(' + curTx.toFixed(2) + 'px, ' + curTy.toFixed(2) + 'px, 0px) ' +
          'scale(' + curScale.toFixed(4) + ')';

        // Color Morph: White (#ffffff) over dark navy -> Deep Navy (#131d3b) with gold edge inside white card
        var colorP = clamp((rawP - 0.54) / 0.34, 0, 1.0);
        if (item.shapePath) {
          var r = Math.round(255 + (19 - 255) * colorP);
          var g = Math.round(255 + (29 - 255) * colorP);
          var b = Math.round(255 + (59 - 255) * colorP);
          item.shapePath.style.fill = 'rgb(' + r + ',' + g + ',' + b + ')';
        }
        if (item.extrudePath) {
          item.extrudePath.style.fill = colorP > 0.5 ? '#f59e0b' : '#94a3b8';
          item.extrudePath.style.fillOpacity = colorP > 0.5 ? '0.42' : '0.32';
        }

        if (item.card) {
          if (rawP >= 0.92) {
            item.card.classList.add('is-landed');
          } else {
            item.card.classList.remove('is-landed');
          }
        }
      });

      currentProgress = maxRawP;
      window.__iacymFlightProgress = currentProgress;

      // Crown inner occlusion only active when united at the top
      if (coronaOcclusion) {
        coronaOcclusion.style.opacity = clamp(1 - maxRawP * 5.0, 0, 1).toFixed(3);
      }

      // Globe stays in the Hero backdrop
      if (unitGlobe) {
        var gScale = (1 - 0.12 * maxRawP).toFixed(3);
        var gAlpha = clamp(1 - maxRawP * 0.65, 0.28, 1).toFixed(3);
        unitGlobe.style.transform = 'translate3d(0, 0, -15px) scale(' + gScale + ')';
        unitGlobe.style.opacity = gAlpha;
      }

      if (halo) {
        halo.style.opacity = clamp(1 - maxRawP * 0.7, 0.2, 1).toFixed(3);
      }

      if (scrollCue) {
        scrollCue.style.opacity = clamp(1 - maxRawP * 3.2, 0, 1).toFixed(3);
      }

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(updateFlight);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('load', onScroll, { passive: true });
    updateFlight();
  }

  /* ==========================================================================
     2. 3D MOUSE PARALLAX TILT ON HERO
     ========================================================================== */
  function initHeroMouseParallax() {
    var heroSection = document.getElementById('home');
    var tiltRig = document.getElementById('hero-logo-tilt-rig');
    if (!heroSection || !tiltRig) return;

    var curX = 0, curY = 0;
    var targetX = 0, targetY = 0;
    var isHovering = false;
    var animFrame = null;

    function renderMouseTilt() {
      curX += (targetX - curX) * 0.1;
      curY += (targetY - curY) * 0.1;

      var p = window.__iacymFlightProgress || 0;
      var tiltFactor = Math.max(0, 1 - p * 2.2);

      var rotY = curX * 12 * tiltFactor;
      var rotX = -curY * 10 * tiltFactor;
      tiltRig.style.transform = 'rotateX(' + rotX.toFixed(2) + 'deg) rotateY(' + rotY.toFixed(2) + 'deg)';

      if (isHovering || Math.abs(targetX - curX) > 0.001 || Math.abs(targetY - curY) > 0.001) {
        animFrame = requestAnimationFrame(renderMouseTilt);
      } else {
        tiltRig.style.transform = 'rotateX(0deg) rotateY(0deg)';
        animFrame = null;
      }
    }

    heroSection.addEventListener('mousemove', function (e) {
      var rect = heroSection.getBoundingClientRect();
      var mxPct = ((e.clientX - rect.left) / rect.width) * 100;
      var myPct = ((e.clientY - rect.top) / rect.height) * 100;
      heroSection.style.setProperty('--mouse-x', mxPct.toFixed(1) + '%');
      heroSection.style.setProperty('--mouse-y', myPct.toFixed(1) + '%');

      targetX = (e.clientX - rect.left) / rect.width - 0.5;
      targetY = (e.clientY - rect.top) / rect.height - 0.5;
      isHovering = true;

      if (!animFrame) {
        animFrame = requestAnimationFrame(renderMouseTilt);
      }
    });

    heroSection.addEventListener('mouseleave', function () {
      targetX = 0;
      targetY = 0;
      isHovering = false;
      if (!animFrame) {
        animFrame = requestAnimationFrame(renderMouseTilt);
      }
    });
  }

  /* ==========================================================================
     3. HOVER SYNC BETWEEN 4 CARDS AND LANDED SYMBOLS
     ========================================================================== */
  function initCardHoverSync() {
    var pairs = [
      { card: 'card-cruz',    unit: 'hero-unit-cruz' },
      { card: 'card-lavacro', unit: 'hero-unit-lavacro' },
      { card: 'card-jarra',   unit: 'hero-unit-jarra' },
      { card: 'card-corona',  unit: 'hero-unit-corona' }
    ];

    pairs.forEach(function (pair) {
      var cardEl = document.getElementById(pair.card);
      var unitEl = document.getElementById(pair.unit);
      if (!cardEl || !unitEl) return;

      cardEl.addEventListener('mouseenter', function () {
        unitEl.classList.add('is-card-hovered');
      });

      cardEl.addEventListener('mouseleave', function () {
        unitEl.classList.remove('is-card-hovered');
      });
    });
  }
})();
