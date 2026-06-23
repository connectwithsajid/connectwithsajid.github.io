/**
* Template Name: iPortfolio
* Updated: Jul 27 2023 with Bootstrap v5.3.1
* Template URL: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos,
      behavior: 'smooth'
    })
  }

/**
 * Back to top button
 */
let backtotop = select('.back-to-top')
let downloadResume = select('.download-resume-btn')

if (backtotop) {
  const toggleFloatingButtons = () => {
    if (window.scrollY > 100) {
      if (backtotop) backtotop.classList.add('active')
      if (downloadResume) downloadResume.classList.add('active')
    } else {
      if (backtotop) backtotop.classList.remove('active')
      if (downloadResume) downloadResume.classList.remove('active')
    }
  }
  window.addEventListener('load', toggleFloatingButtons)
  onscroll(document, toggleFloatingButtons)
}

  /**
   * Auto-collapse profile console after first landing view
   */
  const stackConsole = select('.hero-terminal')
  if (stackConsole && stackConsole.classList.contains('is-open')) {
    window.setTimeout(() => {
      stackConsole.classList.remove('is-open')
    }, 150)
  }

  /**
   * GitHub contribution-style skill explorer
   */
  const githubLab = select('.github-lab')
  if (githubLab) {
    const heatmap = select('.github-heatmap')
    const skillTitle = select('[data-skill-title]')
    const skillBody = select('[data-skill-body]')
    const skillTags = select('[data-skill-tags]')
    const skillTabs = select('.skill-tabs button', true)
    const arcadeToggle = select('[data-github-action="toggle"]')
    const skillProfiles = {
      data: {
        title: 'AI Data Platforms',
        body: 'Production pipelines, validation, observability, and analytics-ready datasets for systems where downstream decisions need trustworthy data.',
        tags: ['AWS Glue', 'PySpark', 'Databricks', 'Data quality', '500K+ records']
      },
      ai: {
        title: 'AI, RAG, and Multimodal Systems',
        body: 'NLP text mining, RAG context optimization, image captioning, model evaluation, and vision-language workflows that turn unstructured data into usable signals.',
        tags: ['RAG', 'BLIP-2', 'LLaVA', 'VizWiz', 'Model evals']
      },
      backend: {
        title: 'Backend and Distributed Systems',
        body: 'REST APIs, Java actor systems, graph query engines, schema design, authentication, and production interfaces around messy data.',
        tags: ['Flask APIs', 'Java actors', 'PostgreSQL', 'Graph analytics', 'Auth']
      },
      devops: {
        title: 'DevOps and Release Discipline',
        body: 'CI/CD guardrails, Docker builds, type checks, linting, tests, and deployment workflows that keep fast AI-assisted development reliable.',
        tags: ['CI/CD', 'Docker', 'Unit tests', 'Type checks', 'Zero downtime']
      },
      research: {
        title: 'Applied Research and Experimentation',
        body: 'Research-minded engineering across document corpora, text mining, benchmark design, caption metrics, and dataset preparation for AI systems.',
        tags: ['NLP', 'PDF mining', 'BLEU', 'ROUGE', 'METEOR']
      }
    }
    const skillKeys = Object.keys(skillProfiles)
    const cells = []
    let selectedCell = null
    let snakeIndex = 24
    let isPlaying = true

    const updateSkill = (key, cell) => {
      const profile = skillProfiles[key] || skillProfiles.data
      if (skillTitle) skillTitle.textContent = profile.title
      if (skillBody) skillBody.textContent = profile.body
      if (skillTags) {
        skillTags.innerHTML = ''
        profile.tags.forEach((tag) => {
          const tagEl = document.createElement('span')
          tagEl.textContent = tag
          skillTags.appendChild(tagEl)
        })
      }
      skillTabs.forEach((tab) => {
        tab.classList.toggle('active', tab.dataset.skill === key)
      })
      if (selectedCell) selectedCell.classList.remove('is-selected')
      if (cell) {
        selectedCell = cell
        selectedCell.classList.add('is-selected')
      }
    }

    if (heatmap) {
      for (let week = 0; week < 52; week++) {
        for (let day = 0; day < 7; day++) {
          const index = week * 7 + day
          const key = skillKeys[(week + day) % skillKeys.length]
          const level = ((week * 3 + day * 5 + index) % 9) > 6 ? 4 : (week + day) % 5
          const cell = document.createElement('button')
          cell.type = 'button'
          cell.className = `contribution-cell level-${level}`
          cell.dataset.skill = key
          cell.setAttribute('role', 'gridcell')
          cell.setAttribute('aria-label', `Contribution signal ${index + 1}: ${skillProfiles[key].title}`)
          cell.addEventListener('mouseenter', () => updateSkill(key, cell))
          cell.addEventListener('focus', () => updateSkill(key, cell))
          cell.addEventListener('click', () => {
            updateSkill(key, cell)
            isPlaying = false
            if (arcadeToggle) {
              arcadeToggle.setAttribute('aria-label', 'Play contribution snake')
              arcadeToggle.innerHTML = '<i class="bi bi-play-fill"></i>'
            }
          })
          heatmap.appendChild(cell)
          cells.push(cell)
        }
      }
    }

    const renderSnake = () => {
      if (!cells.length) return
      cells.forEach((cell) => {
        cell.classList.remove('is-snake-head', 'is-snake-trail')
      })
      for (let trail = 0; trail < 9; trail++) {
        const cell = cells[(snakeIndex - trail + cells.length) % cells.length]
        cell.classList.add(trail === 0 ? 'is-snake-head' : 'is-snake-trail')
      }
      const head = cells[snakeIndex]
      if (head) updateSkill(head.dataset.skill, head)
      snakeIndex = (snakeIndex + 5) % cells.length
    }

    skillTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = cells.find((cell) => cell.dataset.skill === tab.dataset.skill)
        updateSkill(tab.dataset.skill, target)
        isPlaying = false
        if (arcadeToggle) {
          arcadeToggle.setAttribute('aria-label', 'Play contribution snake')
          arcadeToggle.innerHTML = '<i class="bi bi-play-fill"></i>'
        }
      })
    })

    if (arcadeToggle) {
      arcadeToggle.addEventListener('click', () => {
        isPlaying = !isPlaying
        arcadeToggle.setAttribute('aria-label', `${isPlaying ? 'Pause' : 'Play'} contribution snake`)
        arcadeToggle.innerHTML = `<i class="bi bi-${isPlaying ? 'pause' : 'play'}-fill"></i>`
        if (isPlaying) selectedCell = null
      })
    }

    renderSnake()
    window.setInterval(() => {
      if (isPlaying) renderSnake()
    }, 620)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('body').classList.toggle('mobile-nav-active')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let body = select('body')
      if (body.classList.contains('mobile-nav-active')) {
        body.classList.remove('mobile-nav-active')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Hero type effect
   */
  const typed = select('.typed')
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items')
    typed_strings = typed_strings.split(',')
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          AOS.refresh()
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },

      1200: {
        slidesPerView: 3,
        spaceBetween: 20
      }
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

})()
