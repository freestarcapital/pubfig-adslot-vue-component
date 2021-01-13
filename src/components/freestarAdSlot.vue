<template>
  <div>
    <div v-bind:class='this.classes()' v-bind:id='adUnit.placementName'></div>
  </div>
</template>
<script>
import { Promise } from 'q'

const getFreestar = () => {
  return new Promise((resolve, reject) => {
    const maxTries = 10
    let retryCount = 0
    const waitForFreestarReady = setInterval(() => {
      if (window.freestar && window.googletag && window.googletag.apiReady) {
        clearInterval(waitForFreestarReady)
        resolve(window.freestar)
      } else if (retryCount === maxTries) {
        clearInterval(waitForFreestarReady)
        reject('Failed to find freestar object')
      } else {
        retryCount++
      }
    }, 10)
  })
}

export default {
  name: 'FreestarAdSlot',
  props: {
    adUnit: {
      default: function () {
        return {}
      },
      type: Object,
      validator (x) {
        return x.placementName && x.slotId
      },
      required: true
    },
    channel: {
      default: function () {
        return null
      },
      type: String
    },
    classList: {
      default: function () {
        return []
      },
      type: Array
    },
    adRefresh: {
      default: 0,
      required: false,
      type: Number,
    }
  },
  methods: {
    adSlotIsReady: function ({ placementName, slotId }) {
      return placementName && slotId && document.getElementById(placementName)
    },
    classes: function () {
      return this.classList.join(' ')
    },
    newAdSlots: function () {
      getFreestar().then(freestar => {
        if (this.adSlotIsReady(this.adUnit)) {
          freestar.newAdSlots(this.adUnit, this.channel)
          this.$emit('new-ad-slots', this.adUnit.placementName)
        }
      })
    },
    deleteAdSlots: function () {
      getFreestar().then(freestar => {
        if (this.adSlotIsReady(this.adUnit)) {
          freestar.deleteAdSlots(this.adUnit)
          this.$emit('delete-ad-slots', this.adUnit.placementName)
        }
      })
    }
  },
  mounted: function () {
    this.$nextTick(this.newAdSlots)
  },
  destroyed: function () {
    this.deleteAdSlots()
  },
  watch: {
    adRefresh() {
      this.$emit('ad-refresh', this.adUnit.placementName)
      this.newAdSlots()
    }
  }
}
</script>
