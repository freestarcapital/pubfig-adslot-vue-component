# Freestar Pubfig Ad Slot Vue Component

## NOTE: As of v2.0, the plugin must be installed using Vue.use()

### Install

```sh
npm install --save @freestar/pubfig-adslot-vue-component
```

In your Vue app entry point add the following:
```js
import FreestarAdSlot from '@freestar/pubfig-adslot-vue-component';

Vue.use(FreestarAdSlot, { publisher: 'publisherString' });
```

**Options**
- **publisher** A *required* string of the publisher, which will be provided by Freestar.

### Usage

```html
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

### Props

**placementName**
A *required* string of the ad unit placement, which will be provided by Freestar.

**targeting**
An *optional* object of key/value pairs for targeting.

**channel**
An *optional* string of a custom channel to use.

**classList**
An *optional* array of strings representing any additional classes that should be applied to the wrapper dom element of the ad slot.

**adRefresh**
An *optional* number bound to the ad refresh. You can increment this value to trigger a refresh of the ad slot.

### Events

**new-ad-slots**
returns the `placementName` when the component **mounts** and an ad is requested.

**delete-ad-slots**
returns 

**ad-refresh**
returns the `placementName` when the component refreshes an ad.

### API Methods

**this.$freestar.setPageTargeting(key, value)**
Proxy for the GPT setTargeting call to set page level targeting. See [GPT documentation](https://developers.google.com/doubleclick-gpt/reference#googletag.PubAdsService_setTargeting) for more details

**this.$freestar.clearPageTargeting(key)**
Proxy for the GPT clearTargeting call to clear page level targeting. See [GPT documentation](https://developers.google.com/doubleclick-gpt/reference#googletag.PubAdsService_clearTargeting) for more details

**this.$freestar.trackPageView()**
Proxy for the freestar.trackPageview() method.

Freestar collects data values such as url location which is then used in various tables. In order to properly track data sites that are using Single Page Applications (SPAs), or sites with slideshows/carousels that change urls/url parameters these new actions must be taken by the publisher to assure accuracy of the collected data. When the location and/or url is updated the lifecycle of the DOM and/or Window does not reload the pubfig.js script. In order to address this the publisher must invoke the freestar.trackPageview() method. This will ensure that the new url is stored and used throughout the data collection for that page or view.

### Glossary

**placementName**
A value acquired from Google Ad Manager (previously known as DFP/Adx), which will be provided by Freestar.

**targeting**
A set of targeting values for the ad unit placement.

### Bypassing Freestar Ad Placements
If you would like to bypass Freestar Ad placements and render GAM ad units yourself directly please follow the instructions [here](README-BYPASS.md)
