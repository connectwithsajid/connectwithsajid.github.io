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
   * Dock VISIC flagship spotlight after first hero reveal
   */
  const flagshipSpotlight = select('.flagship-spotlight')
  if (flagshipSpotlight) {
    const dockLauncher = flagshipSpotlight.querySelector('.flagship-dock-launcher')
    const canHoverFlagship = () => window.matchMedia('(min-width: 992px)').matches

    const closeFlagshipPreview = () => {
      flagshipSpotlight.classList.remove('is-open')
    }

    const openFlagshipPreview = () => {
      if (!flagshipSpotlight.classList.contains('is-docked')) return
      flagshipSpotlight.classList.toggle('is-open')
    }

    const syncFlagshipDock = () => {
      if (!canHoverFlagship() && !flagshipSpotlight.dataset.docked) {
        flagshipSpotlight.classList.add('is-docked')
        flagshipSpotlight.classList.remove('is-open')
        flagshipSpotlight.dataset.docked = 'true'
      }

      if (flagshipSpotlight.dataset.docked) {
        flagshipSpotlight.classList.add('is-docked')
        flagshipSpotlight.classList.remove('is-hidden')
        return
      }

      if (!flagshipSpotlight.dataset.docked && !flagshipSpotlight.dataset.dockPending) {
        flagshipSpotlight.dataset.dockPending = 'true'
        window.setTimeout(() => {
          flagshipSpotlight.classList.add('is-docked')
          flagshipSpotlight.classList.remove('is-open')
          flagshipSpotlight.dataset.docked = 'true'
          delete flagshipSpotlight.dataset.dockPending
        }, 3000)
      }
    }

    if (dockLauncher) {
      dockLauncher.addEventListener('click', openFlagshipPreview)
    }

    flagshipSpotlight.addEventListener('mouseleave', () => {
      if (canHoverFlagship()) closeFlagshipPreview()
    })

    document.addEventListener('click', (event) => {
      if (!flagshipSpotlight.classList.contains('is-docked')) return
      if (flagshipSpotlight.contains(event.target)) return
      closeFlagshipPreview()
    })

    syncFlagshipDock()
    window.addEventListener('load', syncFlagshipDock)
    window.addEventListener('resize', syncFlagshipDock)
    window.addEventListener('scroll', syncFlagshipDock)
    onscroll(document, syncFlagshipDock)
  }

  /**
   * Scroll-triggered Ask Sajid assistant
   */
  const askSajidChats = select('.ask-sajid-chat', true)
  if (askSajidChats.length) {
    const assistantRailThreshold = 420
    const projectSection = select('#projects')
    const profileSummary = 'Sajid Shaikh engineers the infrastructure behind modern AI products. Combining expertise in data engineering, backend systems, and machine learning, he designs scalable platforms that convert massive volumes of raw data into intelligent, production-ready systems used for analytics, automation, and decision-making.'
    const brokenMessage = "The live assistant is temporarily unavailable, please refer to a quick portfolio summary instead. For deeper discussion, continue on Topmate."
    const isProjectShowcaseActive = () => {
      if (!projectSection) return false
      const rect = projectSection.getBoundingClientRect()
      const viewportHeight = window.innerHeight || 1
      return rect.top < viewportHeight * 0.78 && rect.bottom > viewportHeight * 0.16
    }

    askSajidChats.forEach((askSajidChat) => {
      const chatLauncher = askSajidChat.querySelector('.ask-chat-launcher')
      const chatClose = askSajidChat.querySelector('.ask-chat-close')
      const chatForm = askSajidChat.querySelector('.ask-chat-form')
      const chatInput = askSajidChat.querySelector('.ask-chat-form input')
      const chatSubmit = askSajidChat.querySelector('.ask-chat-form button')
      const chatLog = askSajidChat.querySelector('.ask-chat-log')
      const botIcon = askSajidChat.querySelector('.ask-chat-message-bot img')
      const botIconSrc = botIcon ? botIcon.getAttribute('src') : ''
      const chatEndpoint = askSajidChat.dataset.chatEndpoint || ''
      let chatDismissed = false

      const openAskChat = () => {
        chatDismissed = false
        askSajidChat.dataset.userOpened = 'true'
        askSajidChat.classList.add('is-visible', 'is-open')
      }

      const closeAskChat = () => {
        askSajidChat.classList.add('is-visible')
        askSajidChat.classList.remove('is-open')
        delete askSajidChat.dataset.userOpened
        chatDismissed = true
      }

      const appendChatMessage = (messageText, messageType, pending = false) => {
        if (!chatLog || !messageText) return

        const message = document.createElement('div')
        message.className = `ask-chat-message ask-chat-message-${messageType}`
        if (pending) message.classList.add('ask-chat-message-pending')

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
        return message
      }

      const setChatPending = (pending) => {
        if (!chatInput || !chatSubmit) return
        chatInput.disabled = pending
        chatSubmit.disabled = pending
      }

      const requestPortfolioChat = async (question) => {
        if (!chatEndpoint) return null

        const response = await fetch(chatEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: question,
            source: 'portfolio',
            locale: document.documentElement.lang || 'en'
          })
        })

        if (!response.ok) {
          throw new Error(`Chat request failed with status ${response.status}`)
        }

        const contentType = response.headers.get('content-type') || ''
        if (contentType.includes('application/json')) {
          const data = await response.json()
          return data.answer || data.message || null
        }

        return (await response.text()).trim() || null
      }

      const updateAssistantRail = () => {
        const chatPhase = window.scrollY > assistantRailThreshold
        const projectShowcaseActive = isProjectShowcaseActive()
        const userOpenedChat = askSajidChat.dataset.userOpened === 'true'

        if (chatPhase) {
          askSajidChat.classList.add('is-visible')
          if (!chatDismissed && !projectShowcaseActive) askSajidChat.classList.add('is-open')
          if (projectShowcaseActive && !userOpenedChat) askSajidChat.classList.remove('is-open')
        } else {
          askSajidChat.classList.remove('is-visible', 'is-open')
          delete askSajidChat.dataset.userOpened
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
        chatForm.addEventListener('submit', async (event) => {
          event.preventDefault()
          const question = chatInput ? chatInput.value.trim() : ''
          if (!question) return

          appendChatMessage(question, 'user')
          const pendingMessage = appendChatMessage('Thinking', 'bot', true)
          setChatPending(true)

          try {
            const answer = await requestPortfolioChat(question)
            if (pendingMessage) pendingMessage.remove()
            appendChatMessage(answer || profileSummary, 'bot')
          } catch (error) {
            if (pendingMessage) pendingMessage.remove()
            appendChatMessage(profileSummary, 'bot')

           setTimeout(function() {
            appendChatMessage(brokenMessage, 'bot')
            }, 8500);
          } finally {
            setChatPending(false)
            if (chatInput) {
              chatInput.value = ''
              chatInput.focus()
            }
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
    const cubeletCloud = projectCube.querySelector('[data-cubelet-cloud]')
    const projectCards = select('.project-card-grid .project-card', true)
    const reduceCubeMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max)
    const lerp = (from, to, amount) => from + (to - from) * amount
    const ease = (value) => {
      const x = clamp(value)
      return x * x * (3 - 2 * x)
    }
    const cubeSize = 3
    const defaultCubeTargets = [
      [-250, -150], [-84, -150], [84, -150], [250, -150],
      [-250, 0], [-84, 0], [84, 0], [250, 0],
      [-250, 150], [-84, 150], [84, 150], [250, 150],
      [-168, 232], [0, 232], [168, 232]
    ]
    let cubeTargets = defaultCubeTargets.slice()
    const cubelets = []

    const measureCubeTargets = () => {
      if (!cubeletCloud || !projectGrid || !projectCards.length) {
        cubeTargets = defaultCubeTargets.slice()
        return
      }

      const gridRect = projectGrid.getBoundingClientRect()
      const widthSpan = Math.max(gridRect.width, 1)
      const heightSpan = Math.max(gridRect.height, 1)
      const horizontalSpread = Math.min(widthSpan * 0.34, 280)
      const verticalSpread = Math.min(heightSpan * 0.22, 220)

      cubeTargets = projectCards.map((card) => {
        const cardRect = card.getBoundingClientRect()
        const centerX = cardRect.left + cardRect.width / 2
        const centerY = cardRect.top + cardRect.height / 2
        const relativeX = ((centerX - (gridRect.left + gridRect.width / 2)) / (widthSpan / 2 || 1)) * horizontalSpread
        const relativeY = ((centerY - (gridRect.top + gridRect.height / 2)) / (heightSpan / 2 || 1)) * verticalSpread
        return [relativeX, relativeY]
      })

      if (!cubeTargets.length) cubeTargets = defaultCubeTargets.slice()
    }

    if (cubeletCloud) {
      cubeletCloud.innerHTML = ''
      const fragment = document.createDocumentFragment()
      const coords = []
      const isoStep = 48

      for (let z = 0; z < cubeSize; z++) {
        for (let y = 0; y < cubeSize; y++) {
          for (let x = 0; x < cubeSize; x++) {
            const cx = x - 1
            const cy = y - 1
            const cz = z - 1
            const isoX = (cx - cz) * isoStep
            const isoY = (cx + cz) * (isoStep * 0.5) - cy * isoStep
            const distance = Math.abs(cx) + Math.abs(cy) + Math.abs(cz)
            const order = (z * 9) + ((2 - y) * 3) + x
            coords.push({ x: isoX, y: isoY, z: cz, distance, order })
          }
        }
      }

      coords.sort((a, b) => a.order - b.order)
      coords.forEach((coord, index) => {
        const cube = document.createElement('span')
        const topFace = document.createElement('span')
        const leftFace = document.createElement('span')
        const rightFace = document.createElement('span')
        const ringAngle = index * 2.3999632297

        cube.className = 'iso-cubie'
        cube.setAttribute('aria-hidden', 'true')
        topFace.className = 'iso-cubie-face top'
        leftFace.className = 'iso-cubie-face left'
        rightFace.className = 'iso-cubie-face right'
        cube.append(topFace, leftFace, rightFace)
        fragment.appendChild(cube)

        cubelets.push({
          el: cube,
          order: index,
          distance: coord.distance,
          isCore: coord.distance === 0,
          startX: coord.x,
          startY: coord.y,
          startZ: coord.z,
          joinFromX: Math.cos(ringAngle) * (160 + coord.distance * 16),
          joinFromY: Math.sin(ringAngle) * (106 + coord.distance * 12),
          joinDelay: Math.max(0, coord.distance - 1) * 0.055 + index * 0.004,
          ringAngle
        })
      })
      cubeletCloud.appendChild(fragment)
    }

    let projectCubeFrame = null
    const setProjectGridReveal = (amount) => {
      if (!projectGrid) return
      projectGrid.style.setProperty('--project-reveal', amount.toFixed(3))
      projectGrid.style.setProperty('--project-opacity', amount.toFixed(3))
      projectGrid.style.setProperty('--project-offset', `${((1 - amount) * 58).toFixed(1)}px`)
      projectGrid.style.setProperty('--project-scale', (0.96 + amount * 0.04).toFixed(3))
      projectGrid.classList.toggle('is-revealed', amount > 0.04)
    }

    const readProjectProgress = () => {
      const rect = projectCube.getBoundingClientRect()
      const viewportHeight = window.innerHeight || 1
      const scrollSpan = Math.max((projectCube.offsetHeight - viewportHeight)*2, 1)
      return clamp((0 - rect.top) / scrollSpan)
    }

    let cubeCurrentProgress = 0
    let cubeTargetProgress = 0
    let cubeHasRendered = false

    const renderProjectCube = (progress) => {
      const enterPhase = ease(progress / 0.16)
      const bouncePhase = clamp((progress - 0.2) / 0.55)
      const explodePhase = ease((progress - 0.75) / 0.25)
      const gridRevealPhase = ease((progress - 0.75) / 0.1)
      const bounceWave = Math.sin(bouncePhase * Math.PI * 4)
      const bounceFalloff = Math.max(0, 1 - bouncePhase)
      const bounceY = -Math.abs(bounceWave) * bounceFalloff * 24
      const cloudX = lerp(-28, 0, enterPhase)
      const cloudY = lerp(24, 0, enterPhase) + bounceY
      const cloudScale = 0.88 + enterPhase * 0.12 + Math.abs(bounceWave) * bounceFalloff * 0.06
      const cloudOpacity = lerp(0.9, 1, enterPhase) * lerp(1, 0, ease((explodePhase - 0.18) / 0.82))
      const cloudRotate = lerp(-4, 0, enterPhase) + bounceWave * bounceFalloff * 1.4

      projectCube.style.setProperty('--cube-progress', progress.toFixed(3))
      projectCube.classList.toggle('is-sliding', progress < 0.2)
      projectCube.classList.toggle('is-bouncing', progress >= 0.2 && progress < 0.62)
      projectCube.classList.toggle('is-assembled', progress >= 0.24 && progress < 0.62)
      projectCube.classList.toggle('is-bursting', explodePhase > 0.01)

      if (cubeletCloud) {
        cubeletCloud.style.opacity = cloudOpacity.toFixed(3)
        cubeletCloud.style.transform = `translate3d(${cloudX.toFixed(1)}px, ${cloudY.toFixed(1)}px, 0) scale(${cloudScale.toFixed(3)}) rotate(${cloudRotate.toFixed(2)}deg)`
      }

      setProjectGridReveal(gridRevealPhase)

      cubelets.forEach((cubelet) => {
        const stagger = cubelet.order / Math.max(cubelets.length - 1, 1)
        const cubeAssemble = cubelet.isCore ? 1 : ease((progress - cubelet.joinDelay) / 0.28)
        const cubeExplode = ease((explodePhase - stagger * 0.1) / 0.9)
        const target = cubeTargets[cubelet.order % cubeTargets.length] || defaultCubeTargets[cubelet.order % defaultCubeTargets.length]
        const targetX = target[0] + Math.cos(cubelet.ringAngle) * 24
        const targetY = target[1] + Math.sin(cubelet.ringAngle) * 18
        const assembledX = lerp(cubelet.joinFromX, cubelet.startX, cubeAssemble)
        const assembledY = lerp(cubelet.joinFromY, cubelet.startY, cubeAssemble)
        const x = lerp(assembledX, targetX, cubeExplode)
        const y = lerp(assembledY, targetY, cubeExplode)
        const depth = 1 + cubelet.startZ * 0.04
        const scale = depth * lerp(1, 0.62, cubeExplode)
        const assembleOpacity = cubelet.isCore ? 1 : clamp((progress - cubelet.joinDelay + 0.04) / 0.16)
        const opacity = assembleOpacity * lerp(1, 0, ease((cubeExplode - 0.36) / 0.64))

        cubelet.el.style.opacity = opacity.toFixed(3)
        cubelet.el.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`
      })
    }

    const updateProjectCube = () => {
      projectCubeFrame = null

      if (reduceCubeMotion) {
        projectCube.classList.add('is-bursting')
        setProjectGridReveal(1)
        return
      }

      if (!cubeHasRendered) {
        cubeCurrentProgress = cubeTargetProgress
        cubeHasRendered = true
      } else {
        const progressDelta = cubeTargetProgress - cubeCurrentProgress
        cubeCurrentProgress += progressDelta * 0.18
        if (Math.abs(progressDelta) < 0.002) cubeCurrentProgress = cubeTargetProgress
      }

      renderProjectCube(cubeCurrentProgress)

      if (Math.abs(cubeTargetProgress - cubeCurrentProgress) > 0.002) {
        projectCubeFrame = window.requestAnimationFrame(updateProjectCube)
      }
    }

    const requestProjectCubeUpdate = () => {
      cubeTargetProgress = readProjectProgress()
      if (projectCubeFrame) return
      projectCubeFrame = window.requestAnimationFrame(updateProjectCube)
    }

    const updateProjectCubeLayout = () => {
      measureCubeTargets()
      requestProjectCubeUpdate()
    }

    window.addEventListener('load', updateProjectCubeLayout)
    window.addEventListener('resize', updateProjectCubeLayout)
    onscroll(document, requestProjectCubeUpdate)
    measureCubeTargets()
    requestProjectCubeUpdate()
  }

  /**
   * GitHub stats and languages explorer
   */
  const githubLab = select('.github-lab')
  if (githubLab) {
    const heatmap = select('.github-heatmap')
    const summaryRoot = select('[data-github-summary]')
    const chartRoot = select('[data-github-activity-chart]')
    const generatedRoot = select('[data-github-generated]')
    const noteRoot = select('[data-github-note]')
    const languageList = select('[data-github-language-list]')

    const defaultData = {
      username: 'connectwithsajid',
      generated_at: null,
      summary: {
        public_repo_count: 0,
        total_contributions_30d: 0,
        total_contributions_365d: 0,
        longest_streak: 0
      },
      contribution_days: [],
      top_languages: []
    }

    const numberFormat = new Intl.NumberFormat('en-US')
    const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

    const renderSummary = (data) => {
      if (!summaryRoot) return
      const summary = data.summary || defaultData.summary
      const items = [
        { label: '30d Contributions', value: summary.total_contributions_30d || 0 },
        { label: '365d Contributions', value: summary.total_contributions_365d || 0 },
        { label: 'Longest Streak', value: `${summary.longest_streak || 0}d` },
        { label: 'Public Repos', value: summary.public_repo_count || 0 }
      ]

      summaryRoot.innerHTML = ''
      items.forEach((item) => {
        const pill = document.createElement('div')
        pill.className = 'github-stat-pill'
        pill.innerHTML = `<span>${item.label}</span><strong>${item.value}</strong>`
        summaryRoot.appendChild(pill)
      })
    }

    const renderActivityChart = (days) => {
      if (!chartRoot) return
      if (!days.length) {
        chartRoot.innerHTML = '<div class="github-chart-empty">GitHub activity will render here after the first Actions sync.</div>'
        return
      }

      const recent = days.slice(-30)
      const width = 720
      const height = 240
      const padding = { top: 18, right: 16, bottom: 34, left: 34 }
      const innerWidth = width - padding.left - padding.right
      const innerHeight = height - padding.top - padding.bottom
      const maxCount = Math.max(...recent.map((day) => day.count), 1)
      const ticks = [0, Math.ceil(maxCount / 3), Math.ceil((2 * maxCount) / 3), maxCount]
      const points = recent.map((day, index) => {
        const x = padding.left + (innerWidth * index) / Math.max(recent.length - 1, 1)
        const y = padding.top + innerHeight - (day.count / maxCount) * innerHeight
        return { ...day, x, y }
      })
      const polyline = points.map((point) => `${point.x},${point.y}`).join(' ')

      const yLabels = ticks.map((tick) => {
        const y = padding.top + innerHeight - (tick / maxCount) * innerHeight
        return `
          <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="rgba(238,243,239,0.08)" stroke-dasharray="4 6" />
          <text x="${padding.left - 10}" y="${y + 4}" fill="rgba(238,243,239,0.48)" font-size="10" font-family="'IBM Plex Mono', monospace" text-anchor="end">${tick}</text>
        `
      }).join('')

      const xLabels = points.filter((_, index) => index % 5 === 0 || index === points.length - 1).map((point) => {
        const dayLabel = new Date(point.date).getDate()
        return `<text x="${point.x}" y="${height - 10}" fill="rgba(238,243,239,0.48)" font-size="10" font-family="'IBM Plex Mono', monospace" text-anchor="middle">${dayLabel}</text>`
      }).join('')

      const circles = points.map((point) => `
        <circle cx="${point.x}" cy="${point.y}" r="3.5" fill="#9bc8bd">
          <title>${point.date}: ${point.count} contributions</title>
        </circle>
      `).join('')

      chartRoot.innerHTML = `
        <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="GitHub contributions for the last 30 days">
          <rect x="0" y="0" width="${width}" height="${height}" rx="12" fill="rgba(17, 22, 33, 0.72)"></rect>
          ${yLabels}
          <polyline fill="none" stroke="#7aa8ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${polyline}"></polyline>
          ${circles}
          ${xLabels}
        </svg>
      `
    }

    const contributionLevel = (count, maxCount) => {
      if (count <= 0) return 0
      if (maxCount <= 1) return 4
      const ratio = count / maxCount
      if (ratio < 0.25) return 1
      if (ratio < 0.5) return 2
      if (ratio < 0.75) return 3
      return 4
    }

    const renderHeatmap = (days) => {
      if (!heatmap) return
      heatmap.innerHTML = ''
      if (!days.length) return

      const maxCount = Math.max(...days.map((day) => day.count), 1)
      days.forEach((day) => {
        const cell = document.createElement('button')
        cell.type = 'button'
        cell.className = `contribution-cell level-${contributionLevel(day.count, maxCount)}`
        cell.setAttribute('role', 'gridcell')
        cell.setAttribute('aria-label', `${day.date}: ${day.count} contributions`)
        cell.title = `${day.date}: ${day.count} contributions`
        heatmap.appendChild(cell)
      })
    }

    const renderLanguages = (languages) => {
      if (!languageList) return
      languageList.innerHTML = ''

      if (!languages.length) {
        languageList.innerHTML = '<div class="github-language-row is-empty"><span>Top languages will appear after the first GitHub Actions export.</span></div>'
        return
      }

      languages.slice(0, 6).forEach((language) => {
        const row = document.createElement('div')
        row.className = 'github-language-row'
        const percent = typeof language.percentage === 'number' ? language.percentage : 0
        const color = language.color || '#9bc8bd'
        row.innerHTML = `
          <div class="github-language-header">
            <strong>${language.name}</strong>
            <span>${percent.toFixed(1)}%</span>
          </div>
          <div class="github-language-track">
            <div class="github-language-bar" style="width:${Math.max(percent, 2)}%; background:${color};"></div>
          </div>
          <div class="github-language-meta">${numberFormat.format(language.bytes || 0)} bytes across public repos</div>
        `
        languageList.appendChild(row)
      })
    }

    const applyGitHubData = (data) => {
      renderSummary(data)
      renderActivityChart(data.contribution_days || [])
      renderHeatmap(data.contribution_days || [])
      renderLanguages(data.top_languages || [])

      if (generatedRoot) {
        generatedRoot.textContent = data.generated_at
          ? `Synced ${dateFormatter.format(new Date(data.generated_at))}`
          : 'Awaiting GitHub sync'
      }

      if (noteRoot && data.generated_at) {
        noteRoot.textContent = `Hydrated from GitHub on ${dateFormatter.format(new Date(data.generated_at))} using a scheduled Actions export of contribution and language data.`
      }
    }

    fetch('assets/data/github-insights.json', { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error(`GitHub insights request failed: ${response.status}`)
        return response.json()
      })
      .then((data) => applyGitHubData({ ...defaultData, ...data }))
      .catch(() => applyGitHubData(defaultData))
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
