<template>
  <div>
    <FreestarAdSlot
      :adRefresh=adRefreshCount
      :adUnit=adUnit
      :channel=channel
      :classList=classList
      v-on:new-ad-slots='onNewAdSlotsHook'
      v-on:delete-ad-slots='onDeleteAdSlotsHook'
      v-on:ad-refresh='onAdRefreshHook'
    />
    <button v-on:click='onAdRefresh'>Trigger Refresh</button>
  </div>
</template>

<script>
/* eslint no-console: off */
import FreestarAdSlot from './components/freestarAdSlot.vue'

export default {
  name: 'Demo',
  data: function () {
    return {
      adUnit: {
        placementName: 'div-gpt-ad-leaderboard-multi',
        slotId: 'div-gpt-ad-leaderboard-multi'
      },
      channel: 'custom_channel',
      classList: ['m-30', 'p-15', 'b-thin-red'],
      adRefreshCount: 0
    }
  },
  components: {
    FreestarAdSlot
  },
  methods: {
    onNewAdSlotsHook: function (placementName) {
      console.log('freestar.newAdSlots() was called', {placementName})
    },
    onDeleteAdSlotsHook: function (placementName) {
      console.log('freestar.deleteAdSlots() was called', {placementName})
    },
    onAdRefreshHook: function (placementName) {
      console.log('adRefresh was called', {placementName})
    },
    // example of manually refreshing an ad
    onAdRefresh: function () {
      this.adRefreshCount++
    }
  },
  mounted: function () {
    this.$nextTick(() => {
      // example of automatically refreshing an ad every 5 seconds a total of 5 times
      const interval = setInterval(() => {
        const maxRefreshes = 5
        this.adRefreshCount++
        if (this.adRefreshCount === maxRefreshes) {
          clearInterval(interval)
        }
      }, 5000)
    })
  }
}
</script>

<style>
  .m-30 {
    margin: 30px;
  }

  .p-15 {
    padding: 15px;
  }

  .b-thin-red {
    border: 1px solid red;
  }
</style>
