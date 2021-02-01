<template>
  <div>
    <div v-bind:class='this.classes()' v-bind:id='adUnit.placementName'></div>
  </div>
</template>
<script>
import Freestar from '../freestarWrapper'

export default {
  name: 'FreestarAdSlot',
  props: {
    publisher: {
      default: function () {
        return ''
      },
      type: String
    },
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
      if (this.adSlotIsReady(this.adUnit)) {
        this.adSlot = Freestar.newAdSlot(this.adUnit.placementName, this.channel)
        this.$emit('new-ad-slots', this.adUnit.placementName)
      }
    },
    deleteAdSlots: function () {
      if (this.adSlotIsReady(this.adUnit)) {
        Freestar.deleteAdSlot(this.adUnit.placementName, this.adSlot)
        this.$emit('delete-ad-slots', this.adUnit.placementName)
      }
    },
    setPageTargeting: function (key, value) {
      Freestar.setPageTargeting(key, value)
    },
    clearPageTargeting: function (key) {
      Freestar.clearPageTargeting(key)
    },
    loadPubfig: function () {
      Freestar.init(this.publisher)
      this.newAdSlots()
    }
  },
  mounted: function () {
    this.loadPubfig()
    this.$nextTick(this.newAdSlots)
  },
  destroyed: function () {
    Freestar.deleteAdSlot(this.adUnit.placementName, this.adSlot)
  },
  watch: {
    adRefresh() {
      Freestar.refreshAdSlot(this.adUnit.placementName, this.adSlot)
      this.$emit('ad-refresh', this.adUnit.placementName)
    }
  }
}
</script>
