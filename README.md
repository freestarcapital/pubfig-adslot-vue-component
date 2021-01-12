# Freestar Pubfig Ad Slot Vue Component

### Install

```sh
npm install --save @freestar/pubfig-adslot-vue-component
```

### Usage

```html
<template>
  <div>
    <FreestarAdSlot
      ref='freestarAdSlotRef'
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
import FreestarAdSlot from '@freestar/pubfig-adslot-vue-component'

export default {
  name: 'Demo',
  data: function () {
    return {
      adUnit: {
        placementName: 'div-gpt-ad-leaderboard-multi',
        slotId: 'div-gpt-ad-leaderboard-multi',
        targeting: ['value1', 'value2']
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
```

### Props

**adUnit**
A *required* object with *required* `placementName` & `slotId` and *optional* `targeting` properties.

**channel**
An *optional* string of a custom channel to use.

**classList**
An *optional* array of strings representing any additional classes that should be applied to the wrapper dom element of the ad slot.

**adRefresh**
An *optional* number bound to the ad refresh. You can increment this value to trigger a refresh of the ad slot.

### API Methods

**FreestarAdSlot.setPageTargeting**
Proxy for the GPT setTargeting call to set page level targeting. (use a ref, e.g. this.$refs.freestarAdSlotRef.setPageTargeting(key, value)) See [GPT documentation](https://developers.google.com/doubleclick-gpt/reference#googletag.PubAdsService_setTargeting) for more details

**FreestarAdSlot.clearPageTargeting**
Proxy for the GRP clearTargeting call to clear page level targeting. (use a ref, e.g. this.$refs.freestarAdSlotRef.clearPageTargeting()) See [GPT documentation](https://developers.google.com/doubleclick-gpt/reference#googletag.PubAdsService_clearTargeting) for more details
### Glossary

**placementName**
A value acquired from Google Ad Manager (previously known as DFP/Adx), which will be provided by Freestar.

**slotId**
A value used for the DOM `<div>` id for the ad unit to render within.

**targeting**
A set of targeting values for the ad unit placement.
