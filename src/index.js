import FreestarAdSlot from './FreestarAdSlot.vue';
import Freestar from './freestarWrapper';

const PubfigAdSlotPlugin = {
  install(Vue, { publisher, keyValueConfigMappingURL }) {
    if (!publisher) {
      throw new Error('[pubfig-adslot-vue-component] publisher is required.');
    }
    // eslint-disable-next-line no-param-reassign
    Vue.prototype.$freestar = Freestar;
    Freestar.publisher = publisher;
    if (keyValueConfigMappingURL) {
      Freestar.keyValueConfigMappingLocation = keyValueConfigMappingURL;
    }

    Vue.component('FreestarAdSlot', FreestarAdSlot);
  },
};

export default PubfigAdSlotPlugin;
