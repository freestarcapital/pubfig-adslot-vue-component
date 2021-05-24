import sortBy from 'lodash.sortby';
import isEqual from 'lodash.isequal';

class FreestarWrapper {
  constructor() {
    this.pageKeyValuePairs = {};
    this.mappingConfig = {};
    this.keyValueConfigMappings = [];
    this.keyValueConfigMappingLocation = '';
    this.publisher = '';
    this.loaded = false;
    this.logEnabled = false;
  }

  async init() {
    window.freestarVueComponentLoaded = window.freestarVueComponentLoaded || false;
    this.loaded = window.freestarVueComponentLoaded;
    this.logEnabled = window.location.search.indexOf('fslog') > -1 || window.freestarVueComponentLogEnabled;
    if (!this.loaded) {
      this.loaded = true;
      window.freestarVueComponentLoaded = true;
      const qa = window.location.search.indexOf('fsdebug') > -1 ? '/qa' : '';
      const url = `https://a.pub.network/${this.publisher}${qa}/pubfig.min.js`;

      window.freestar = window.freestar || {};
      window.freestar.hitTime = Date.now();
      window.freestar.queue = window.freestar.queue || [];
      window.freestar.config = window.freestar.config || {};
      window.freestar.config.enabled_slots = window.freestar.config.enabled_slots || [];

      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      this.log(0, '========== LOADING Pubfig ==========');
      document.body.appendChild(script);
      if (this.keyValueConfigMappingLocation && this.keyValueConfigMappings.length === 0) {
        this.keyValueConfigMappings = await this.fetchKeyValueConfigMapping();
      }
    }
  }

  async fetchKeyValueConfigMapping() {
    const response = await fetch(this.keyValueConfigMappingLocation);

    if (response.status !== 200) {
      const message = `An error has occurred fetching keyValueConfigMapping: ${response.status}`;
      this.log(1, message);
      return [];
    }
    try {
      this.mappingConfig = await response.json();

      return this.mappingConfig.mappings;
    } catch (err) {
      const message = 'An error has occurred fetching keyValueConfigMapping';
      this.log(1, message, err);
      return [];
    }
  }

  log(level, ...msg) {
    const title = 'Pubfig Vue Plugin ';
    const styles = 'background: #00C389; color: #fff; border-radius: 3px; padding: 3px';
    if (this.logEnabled) {
      console.info(`%c${title}`, styles, ...msg); // eslint-disable-line no-console
    }
  }

  /* example mapping
    {
      mappings:
        [
          {
            "keyValuePairs" : { "site" : 'fanatics', "section": 'NBA'}
            "placementMap" : { "placement-1" : 'NBA-placement-1', "placement-2" : 'NBA-placement-2'}
          },
          {
            "keyValuePairs" : { "site" : 'fanatics', "section": 'NFL'}
            "placementMap" : { "placement-1" : 'NFL-placement-1', placement-2 : 'NFL-placement-2'}
          }
        ]
    }
   */
  /**
   *
   * @param placementName
   * @param targeting
   * @param placementMappingLocation
   * @returns {*}
   */
  async getMappedPlacementName(placementName, targeting) {
    const keyValuePairs = { ...this.pageKeyValuePairs, ...targeting };
    if (this.keyValueConfigMappingLocation && this.keyValueConfigMappings.length === 0) {
      this.keyValueConfigMappings = await this.fetchKeyValueConfigMapping(
        this.keyValueConfigMappingLocation,
      );
    }

    const matchedMappings = this.keyValueConfigMappings.filter((mapping) => {
      const mappedKeyValuePairs = mapping.keyValuePairs || {};
      // eslint-disable-next-line no-restricted-syntax
      for (const key in mappedKeyValuePairs) {
        if (Object.prototype.hasOwnProperty.call(mappedKeyValuePairs, key)) {
          // if the values are arrays we need to sort them so that they can be directly compared
          const passedValue = Array.isArray(keyValuePairs[key])
            ? sortBy(keyValuePairs[key]) : keyValuePairs[key];
          const mappedValue = Array.isArray(mappedKeyValuePairs[key])
            ? sortBy(mappedKeyValuePairs[key]) : mappedKeyValuePairs[key];
          if (!isEqual(passedValue, mappedValue)) {
            return false;
          }
        }
      }
      return true;
    });
    if (matchedMappings.length) {
      const sortedMappings = sortBy(matchedMappings, (mapping) => mapping.keyValuePairs.length);
      // lodash sorts asc by default
      sortedMappings.reverse();
      const matchedMapping = sortedMappings[0];
      const { placementMap } = matchedMapping;
      return placementMap[placementName] || placementName;
    }
    return placementName;
  }

  // calls newAdSlots on freestar object, or creates custom google ad if adUnitPath is provided
  newAdSlot(placementName, channel, targeting, adUnitPath, slotSize, sizeMappings) {
    return new Promise(((resolve) => {
      let adSlot;
      window.freestar.queue.push(async () => {
        if (!adUnitPath) {
          const mappedName = await this.getMappedPlacementName(placementName, targeting);
          window.freestar.newAdSlots({
            slotId: mappedName,
            placementName: mappedName,
            targeting,
          }, channel);
          resolve(null);
        } else {
          this.log(0, 'adUnitPath set, creating GAM ad unit');
          adSlot = window.googletag
            .defineSlot(adUnitPath, slotSize, placementName)
            .addService(window.googletag.pubads());
          if (sizeMappings) {
            const sizeMappingArray = sizeMappings
              .reduce(
                (mapping, size) => mapping.addSize(size.viewport, size.slot),
                window.googletag.sizeMapping(),
              )
              .build();
            adSlot.defineSizeMapping(sizeMappingArray);
          }
          if (targeting) {
            Object.entries(targeting).forEach((entry) => {
              const [key, value] = entry;
              adSlot.setTargeting(key, value);
            });
          }
          window.googletag.display(adSlot);
          window.googletag.pubads().refresh([adSlot]);
          resolve(adSlot);
        }
      });
    }));
  }

  deleteAdSlot(placementName, targeting, adSlot) {
    window.freestar.queue.push(async () => {
      if (!adSlot) {
        const mappedName = await this.getMappedPlacementName(placementName, targeting);
        window.freestar.deleteAdSlots({ placementName: mappedName });
      } else {
        this.log(0, 'adSlot set, destroying GAM ad unit');
        window.googletag.destroySlots([adSlot]);
      }
    });
  }

  refreshAdSlot(placementName, targeting, adSlot) {
    window.freestar.queue.push(async () => {
      if (!adSlot) {
        const mappedName = await this.getMappedPlacementName(placementName, targeting);
        window.freestar.refresh(mappedName);
      } else {
        this.log(0, 'adSlot set, refreshing GAM ad unit');
        window.googletag.pubads().refresh([adSlot]);
      }
    });
  }

  setPageTargeting(key, value) {
    this.log(0, 'setting page targeting', key, value);
    window.freestar.queue.push(() => {
      window.googletag.pubads().setTargeting(key, value);
    });
  }

  clearPageTargeting(key) {
    this.log(0, 'clearing page targeting for key', key);
    window.freestar.queue.push(() => {
      if (key) {
        window.googletag.pubads().clearTargeting(key);
      } else {
        window.googletag.pubads().clearTargeting();
      }
    });
  }

  trackPageview() {
    this.log(0, 'tracking pageview');
    window.freestar = window.freestar || {};
    window.freestar.queue = window.freestar.queue || [];
    window.freestar.queue.push(() => {
      window.freestar.trackPageview();
    });
  }
}

const Freestar = new FreestarWrapper();

export default Freestar;
