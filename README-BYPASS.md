# Bypassing Freestar Placements

The Freestar Vue Component allows for the ability to bypass relying on Freestar placements.

Note: Using this option will not allow Freestar to monetize the adUnit with header bidding demand nor allow Freestar to
manage the ad unit.

### Example

```vue
<template>
  <div>
    <FreestarAdSlot
      :ad-refresh="adRefreshCount"
      :placement-name="adUnit.placementName"
      :targeting="adUnit.targeting"
      :channel="channel"
      :class-list="classList"
      :slot-size="slotSize"
      :size-mapping="sizeMapping"
      :ad-unit-path="adUnitPath"
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
import FreestarAdSlot from './FreestarAdSlot.vue';

export default {
  name: 'Demo',
  components: {
    FreestarAdSlot,
  },
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
      slotSize: [[300,250], [728,90]],
      sizeMapping: [
        {viewport: [0,0], slot: [300,250]},
        {viewport: [768, 0], slot: [728,90]}
      ],
      adUnitPath: '/45796/my_adunit_name',
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
```

### Additional Props
**adUnitPath**
An *optional* string with the full GAM ad unit path. This should be used only if you are intending to bypass Freestar placements intentionally.

**slotSize**
An *optional* string or array as defined by [GPT Documentation](https://developers.google.com/publisher-tag/reference#googletag.GeneralSize). Should only be used in conjuction with `adUnitPath`

**sizeMapping**
An *optional* array of object which contains an array of viewport size and slot size. To be used in conjunction with `adUnitPath`. This needs to be set if the ad needs to serve different ad size per different view port sizes (responsive ad).
Setting the `slot` to any dimension that's not configured in DFP results in rendering an empty ad.
The ad slot size which is provided for the viewport size of [0, 0] will be used as default ad size if none of viewport size matches.

https://support.google.com/dfp_premium/answer/3423562?hl=en

    e.g.
         
    sizeMapping={[
        {viewport: [0, 0], slot: [320, 50]},
        {viewport: [768, 0], slot: [728, 90]}
    ]}
          
