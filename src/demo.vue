<template>
  <div>
    <freestar-ad-slot
      :ad-refresh="adRefreshCount"
      :placement-name="adUnit.placementName"
      :targeting="adUnit.targeting"
      :channel="channel"
      :class-list="classList"
      @new-ad-slots="onNewAdSlotsHook"
      @delete-ad-slots="onDeleteAdSlotsHook"
      @ad-refresh="onAdRefreshHook"
    />
    <button @click="onAdRefresh">
      Trigger Refresh
    </button>
  </div>
</template>

<script>
/* eslint no-console: off */
export default {
  name: 'Demo',
  data() {
    return {
      adUnit: {
        placementName: 'div-gpt-ad-leaderboard-multi',
        slotId: 'div-gpt-ad-leaderboard-multi',
        targeting: { key1: 'value1', key2: 'value2' },
      },
      channel: 'custom_channel',
      classList: ['m-30', 'p-15', 'b-thin-red'],
      adRefreshCount: 0,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.createAdRefreshExample();
    });
  },
  methods: {
    onNewAdSlotsHook(placementName) {
      console.log('freestar.newAdSlots() was called', { placementName });
    },
    onDeleteAdSlotsHook(placementName) {
      console.log('freestar.deleteAdSlots() was called', { placementName });
    },
    onAdRefreshHook(placementName) {
      console.log('adRefresh was called', { placementName });
    },
    // example of manually refreshing an ad
    onAdRefresh() {
      this.adRefreshCount += 1;
    },
    createAdRefreshExample() {
      // example of automatically refreshing an ad every 5 seconds a total of 5 times
      const interval = setInterval(() => {
        const maxRefreshes = 5;
        this.adRefreshCount += 1;
        if (this.adRefreshCount === maxRefreshes) {
          clearInterval(interval);
        }
      }, 5000);
    },
  },
};

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
