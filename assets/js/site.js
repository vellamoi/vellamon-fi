(function () {
  'use strict';

  function setupAccordions() {
    var accordions = document.querySelectorAll('.accordion');
    accordions.forEach(function (accordion) {
      var trigger = accordion.querySelector('.accordion-trigger');
      if (!trigger) {
        return;
      }
      var contentId = trigger.getAttribute('aria-controls');
      if (!contentId) {
        return;
      }
      var content = document.getElementById(contentId);
      if (!content) {
        return;
      }

      var expanded = trigger.getAttribute('aria-expanded') === 'true';
      content.hidden = !expanded;
      content.setAttribute('aria-hidden', expanded ? 'false' : 'true');
      content.style.display = expanded ? '' : 'none';

      trigger.addEventListener('click', function () {
        var isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', String(!isExpanded));
        content.hidden = isExpanded;
        content.setAttribute('aria-hidden', isExpanded ? 'true' : 'false');
        content.style.display = isExpanded ? 'none' : '';
      });
    });
  }

  function resolveContentElement(selector) {
    if (!selector) {
      return null;
    }
    if (selector[0] === '#') {
      return document.getElementById(selector.slice(1));
    }
    if (selector[0] === '.') {
      return document.querySelector(selector);
    }
    return document.querySelector('.' + selector) || document.getElementById(selector);
  }

  function setupReadingProgress() {
    var bars = document.querySelectorAll('.v-post-reading-progress-bar');
    if (!bars.length) {
      return;
    }

    var items = [];
    bars.forEach(function (bar) {
      var selector = bar.getAttribute('data-content-selector');
      var content = resolveContentElement(selector);
      if (!content) {
        return;
      }
      items.push({ bar: bar, content: content });
    });

    if (!items.length) {
      return;
    }

    var ticking = false;

    function update() {
      ticking = false;
      var scrollY = window.scrollY || window.pageYOffset;
      var viewport = window.innerHeight || document.documentElement.clientHeight;

      items.forEach(function (item) {
        var rect = item.content.getBoundingClientRect();
        var start = rect.top + scrollY;
        var height = item.content.scrollHeight;
        var end = start + Math.max(0, height - viewport);
        var value = 0;

        if (end <= start) {
          value = 100;
        } else {
          value = ((scrollY - start) / (end - start)) * 100;
          if (value < 0) {
            value = 0;
          }
          if (value > 100) {
            value = 100;
          }
        }

        item.bar.value = value;
      });
    }

    function requestUpdate() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    window.addEventListener('load', requestUpdate);
    update();
  }

  function applyProjectAccents() {
    var body = document.body;
    if (!body) {
      return;
    }
    var accent = body.getAttribute('data-project-accent');
    if (accent) {
      body.style.setProperty('--project-accent', accent);
    }
  }

  function init() {
    setupAccordions();
    setupReadingProgress();
    applyProjectAccents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
