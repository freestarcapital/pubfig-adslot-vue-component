class FreestarWrapper {

  init (publisher) {
    window.freestarVueCompontentLoaded = window.freestarVueCompontentLoaded || false
    this.loaded = window.freestarVueCompontentLoaded
    this.logEnabled = window.location.search.indexOf('fslog') > -1 ? true
      : window.freestarVueCompontentLogEnabled ? window.freestarVueCompontentLogEnabled : false
    if (!this.loaded) {
      this.loaded = window.freestarVueCompontentLoaded = true
      const qa = window.location.search.indexOf('fsdebug') > -1 ? '/qa' : ''
      const url = `https://a.pub.network/${publisher}${qa}/pubfig.min.js`

      window.freestar = window.freestar || {}
      window.freestar.hitTime = Date.now()
      window.freestar.queue = window.freestar.queue || []
      window.freestar.config = window.freestar.config || {}
      window.freestar.config.enabled_slots = window.freestar.config.enabled_slots || []

      const script = document.createElement('script')
      script.src = url
      script.async = true
      this.log(0, '========== LOADING Pubfig ==========')
      document.body.appendChild(script)
    }
  }

  log (level, ...msg) {
    const title = 'Pubfig Vue Plugin '
    const styles = 'background: #00C389; color: #fff; border-radius: 3px; padding: 3px'
    if (this.logEnabled) {
      console.info(`%c${title}`, styles, ...msg) // eslint-disable-line no-console
    }
  }

  newAdSlot (placementName, channel, targeting) {
    window.freestar.queue.push(() => {
      window.freestar.newAdSlots({
        slotId: placementName,
        placementName,
        targeting
      }, channel)
    })
  }

  deleteAdSlot (placementName, adSlot) {
    window.freestar.queue.push(() => {
      if (!adSlot) {
        window.freestar.deleteAdSlots({ placementName })
      }
      else {
        window.googletag.destroySlots([adSlot])
      }
    })
  }

  refreshAdSlot (placementName, adSlot) {
    window.freestar.queue.push(() => {
      if (!adSlot) {
        window.freestar.freestarReloadAdSlot(placementName)
      }
      else {
        window.googletag.pubads().refresh([adSlot])
      }
    })
  }

  setPageTargeting (key, value) {
    window.freestar = window.freestar || {}
    window.freestar.queue = window.freestar.queue || []
    window.freestar.queue.push(() => {
      window.googletag.pubads().setTargeting(key, value)
    })
  }

  clearPageTargeting (key) {
    window.freestar = window.freestar || {}
    window.freestar.queue = window.freestar.queue || []
    window.freestar.queue.push(() => {
      if (key) {
        window.googletag.pubads().clearTargeting(key)
      } else {
        window.googletag.pubads().clearTargeting()
      }
    })
  }
}

const Freestar = new FreestarWrapper()

export default Freestar
