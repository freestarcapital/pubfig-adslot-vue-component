# Key Value Config Mapping

You can optionally specify a configuration file to map placements based key value pairs. Do not use this without the support of your Freestar Team 

### Usage
in your Vue app entry point (main.js)

```js
import FreestarAdSlot from '@freestar/pubfig-adslot-vue-component';

const KEY_VALUE_CONFIG_MAPPING_URL = 'https://api.jsonbin.io/b/6000f76fe31fbc3bdef3d725/1';

Vue.use(FreestarAdSlot, { publisher: 'publisherString', keyValueConfigMappingURL: KEY_VALUE_CONFIG_MAPPING_URL });
```

### Additional Options
**keyValueConfigMappingURL**
An *optional* string with the full url to the Key Value Config Mapping file. Consult with your Freestar Account Manager for more information on how to have this file setup
