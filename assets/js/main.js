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
    }, 3000)
  }

  /**
   * Scroll-triggered Ask Sajid assistant
   */
  const askSajidChats = select('.ask-sajid-chat', true)
  if (askSajidChats.length) {
    const assistantRailThreshold = 420
    const profileSummary = 'Sajid Shaikh engineers the infrastructure behind modern AI products. Combining expertise in data engineering, backend systems, and machine learning, he designs scalable platforms that convert massive volumes of raw data into intelligent, production-ready systems used for analytics, automation, and decision-making.'
    const brokenMessage =     "If this is not the response you're looking for, then system is temporarily out of reach. Please try again in a few moments while we get things back on track."

    askSajidChats.forEach((askSajidChat) => {
      const chatLauncher = askSajidChat.querySelector('.ask-chat-launcher')
      const chatClose = askSajidChat.querySelector('.ask-chat-close')
      const chatForm = askSajidChat.querySelector('.ask-chat-form')
      const chatInput = askSajidChat.querySelector('.ask-chat-form input')
      const chatLog = askSajidChat.querySelector('.ask-chat-log')
      const botIcon = askSajidChat.querySelector('.ask-chat-message-bot img')
      const botIconSrc = botIcon ? botIcon.getAttribute('src') : ''
      let chatDismissed = false

      const openAskChat = () => {
        askSajidChat.classList.add('is-visible', 'is-open')
      }

      const closeAskChat = () => {
        askSajidChat.classList.add('is-visible')
        askSajidChat.classList.remove('is-open')
        chatDismissed = true
      }

      const appendChatMessage = (messageText, messageType) => {
        if (!chatLog || !messageText) return

        const message = document.createElement('div')
        message.className = `ask-chat-message ask-chat-message-${messageType}`

        if (messageType === 'bot' && botIconSrc) {
          const icon = document.createElement('img')
          icon.src = botIconSrc
          icon.alt = ''
          icon.setAttribute('aria-hidden', 'true')
          message.appendChild(icon)
        }

        const text = document.createElement('p')
        text.textContent = messageText
        message.appendChild(text)
        chatLog.appendChild(message)
        chatLog.scrollTop = chatLog.scrollHeight
      }

      const updateAssistantRail = () => {
        const chatPhase = window.scrollY > assistantRailThreshold

        if (stackConsole) {
          stackConsole.classList.toggle('is-suppressed', chatPhase)
        }

        if (chatPhase) {
          askSajidChat.classList.add('is-visible')
          if (!chatDismissed) askSajidChat.classList.add('is-open')
        } else {
          askSajidChat.classList.remove('is-visible', 'is-open')
        }
      }

      window.addEventListener('load', updateAssistantRail)
      onscroll(document, updateAssistantRail)

      if (chatLauncher) {
        chatLauncher.addEventListener('click', openAskChat)
      }

      if (chatClose) {
        chatClose.addEventListener('click', closeAskChat)
      }

      if (chatForm) {
        chatForm.addEventListener('submit', (event) => {
          event.preventDefault()
          const question = chatInput ? chatInput.value.trim() : ''
          if (!question) return

          appendChatMessage(question, 'user')
          appendChatMessage(profileSummary, 'bot')
          setTimeout(function() {
            appendChatMessage(brokenMessage, 'bot')
            }, 8500);

         
          

          if (chatInput) {
            chatInput.value = ''
            chatInput.focus()
          }
        })
      }
    })
  }

  /**
   * Scroll-driven project cube transition
   */
  const projectCube = select('[data-project-cube]')
  if (projectCube) {
    const projectGrid = select('[data-project-grid]')
    const rubikScene = projectCube.querySelector('[data-rubik-scene]')
    const reduceCubeMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max)
    const lerp = (from, to, amount) => from + (to - from) * amount
    const ease = (value) => {
      const x = clamp(value)
      return x * x * (3 - 2 * x)
    }
    const rubikSize = 3
    const rubikHalf = Math.floor(rubikSize / 2)
    const rubikSpacing = 42
    const rubikFaces = ['front', 'back', 'right', 'left', 'top', 'bottom']
    const projectSlots = [
      [-1.5, -1.15], [-0.5, -1.15], [0.5, -1.15], [1.5, -1.15],
      [-1.5, -0.35], [-0.5, -0.35], [0.5, -0.35], [1.5, -0.35],
      [-1.5, 0.45], [-0.5, 0.45], [0.5, 0.45], [1.5, 0.45],
      [-1.0, 1.25], [0, 1.25], [1.0, 1.25]
    ]
    const cubelets = []

    if (rubikScene) {
      const fragment = document.createDocumentFragment()
      const coords = []

      for (let z = -rubikHalf; z <= rubikHalf; z++) {
        for (let y = -rubikHalf; y <= rubikHalf; y++) {
          for (let x = -rubikHalf; x <= rubikHalf; x++) {
            if (Math.abs(x) !== rubikHalf && Math.abs(y) !== rubikHalf && Math.abs(z) !== rubikHalf) continue
            const order = Math.abs(x) + Math.abs(y) + Math.abs(z) + ((x + rubikHalf) * 3) + ((y + rubikHalf) * 2) + (z + rubikHalf)
            coords.push({ x, y, z, order })
          }
        }
      }

      coords.sort((a, b) => a.order - b.order)
      coords.forEach((coord, index) => {
        const cube = document.createElement('span')
        const slot = projectSlots[index % projectSlots.length]
        const ringAngle = index * 2.3999632297
        const distance = Math.max(1, Math.abs(coord.x) + Math.abs(coord.y) + Math.abs(coord.z))
        const normalLength = Math.hypot(coord.x, coord.y, coord.z) || 1
        const normalX = coord.x / normalLength
        const normalY = coord.y / normalLength
        const normalZ = coord.z / normalLength
        cube.className = 'project-rubik-cubelet'
        cube.setAttribute('aria-hidden', 'true')
        rubikFaces.forEach((face) => {
          const faceEl = document.createElement('span')
          faceEl.className = `project-rubik-face project-rubik-face-${face}`
          cube.appendChild(faceEl)
        })
        fragment.appendChild(cube)
        cubelets.push({
          el: cube,
          order: index,
          cx: coord.x * rubikSpacing,
          cy: coord.y * rubikSpacing,
          cz: coord.z * rubikSpacing,
          ex: normalX * (360 + distance * 24) + slot[0] * 130 + Math.cos(ringAngle) * 42,
          ey: normalY * (250 + distance * 20) + slot[1] * 94 + Math.sin(ringAngle) * 34,
          ez: normalZ * (300 + distance * 30) + 170 - (index % 9) * 34
        })
      })
      rubikScene.appendChild(fragment)
    }

    let projectCubeFrame = null

    const updateProjectCube = () => {
      projectCubeFrame = null

      if (reduceCubeMotion) {
        projectCube.classList.add('is-bursting')
        if (projectGrid) {
          projectGrid.style.setProperty('--project-reveal', '1')
          projectGrid.style.setProperty('--project-opacity', '1')
          projectGrid.style.setProperty('--project-blur', '0')
          projectGrid.style.setProperty('--project-offset', '0')
          projectGrid.style.setProperty('--project-scale', '1')
          projectGrid.classList.add('is-revealed')
        }
        return
      }

      const rect = projectCube.getBoundingClientRect()
      const viewportHeight = window.innerHeight || 1
      const scrollSpan = Math.max(projectCube.offsetHeight - viewportHeight * 0.62, 1)
      const progress = clamp((viewportHeight * 0.72 - rect.top) / scrollSpan)
      const bouncePhase = clamp(progress / 0.42)
      const spinPhase = ease(progress / 0.56)
      const explodePhase = ease((progress - 0.5) / 0.26)
      const cardRevealPhase = ease((progress - 0.68) / 0.18)
      const revealCards = cardRevealPhase > 0.04
      const bounceWave = Math.sin(bouncePhase * Math.PI * 4)
      const bounceFalloff = Math.max(0, 1 - bouncePhase)
      const bounceY = -Math.abs(bounceWave) * bounceFalloff * 42
      const bounceScale = 1 + Math.abs(bounceWave) * bounceFalloff * 0.14

      projectCube.style.setProperty('--cube-progress', progress.toFixed(3))
      projectCube.classList.toggle('is-bouncing', progress > 0.02 && progress < 0.48)
      projectCube.classList.toggle('is-assembled', progress >= 0.12 && progress < 0.5)
      projectCube.classList.toggle('is-bursting', explodePhase > 0.04)
      if (projectGrid) {
        projectGrid.style.setProperty('--project-reveal', cardRevealPhase.toFixed(3))
        projectGrid.style.setProperty('--project-opacity', cardRevealPhase.toFixed(3))
        projectGrid.style.setProperty('--project-blur', `${((1 - cardRevealPhase) * 8).toFixed(2)}px`)
        projectGrid.style.setProperty('--project-offset', `${((1 - cardRevealPhase) * 58).toFixed(1)}px`)
        projectGrid.style.setProperty('--project-scale', (0.96 + cardRevealPhase * 0.04).toFixed(3))
        projectGrid.classList.toggle('is-revealed', revealCards)
      }

      const groupX = -20 + bouncePhase * 5 + spinPhase * 24
      const groupY = -38 + spinPhase * 430 + explodePhase * 120
      const groupZ = 2 + spinPhase * 34 + explodePhase * 20
      if (rubikScene) {
        rubikScene.style.transform = `rotateX(${groupX.toFixed(1)}deg) rotateY(${groupY.toFixed(1)}deg) rotateZ(${groupZ.toFixed(1)}deg)`
      }

      cubelets.forEach((cubelet) => {
        const stagger = cubelet.order / Math.max(cubelets.length - 1, 1)
        const cubeExplode = ease((explodePhase - stagger * 0.22) / 0.78)
        const x = lerp(cubelet.cx - 300, cubelet.ex, cubeExplode)
        const y = lerp(cubelet.cy + bounceY - 70, cubelet.ey, cubeExplode)
        const z = lerp(cubelet.cz, cubelet.ez, cubeExplode)
        const scale = bounceScale * lerp(1, 0.66, cubeExplode)
        const opacity = lerp(1, 0.02, ease((cubeExplode - 0.36) / 0.64))

        cubelet.el.style.opacity = opacity.toFixed(3)
        cubelet.el.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) scale(${scale.toFixed(3)})`
      })
    }

    const requestProjectCubeUpdate = () => {
      if (projectCubeFrame) return
      projectCubeFrame = window.requestAnimationFrame(updateProjectCube)
    }

    window.addEventListener('load', requestProjectCubeUpdate)
    window.addEventListener('resize', requestProjectCubeUpdate)
    onscroll(document, requestProjectCubeUpdate)
    requestProjectCubeUpdate()
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
   * Desktop hover rail navigation
   */
  const siteHeader = select('#header')
  if (siteHeader) {
    const body = select('body')
    const desktopRail = window.matchMedia('(min-width: 1200px)')
    const pageSurfaces = [select('#hero'), select('#main')].filter(Boolean)

    const openRail = () => {
      if (desktopRail.matches) body.classList.add('nav-rail-open')
    }

    const closeRail = () => {
      body.classList.remove('nav-rail-open')
    }

    siteHeader.addEventListener('mouseenter', openRail)
    siteHeader.addEventListener('focusin', openRail)
    siteHeader.addEventListener('click', openRail)
    siteHeader.addEventListener('mouseleave', closeRail)
    pageSurfaces.forEach((surface) => surface.addEventListener('click', closeRail))
    desktopRail.addEventListener('change', closeRail)
  }

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
  if (typeof GLightbox !== 'undefined') {
    GLightbox({
      selector: '.portfolio-lightbox'
    })
  }

  /**
   * Portfolio details slider
   */
  if (typeof Swiper !== 'undefined') {
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
    })
  }

  /**
   * Testimonials slider
   */
  if (typeof Swiper !== 'undefined') {
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
    })
  }

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
  if (typeof PureCounter !== 'undefined') {
    new PureCounter()
  }

})()
