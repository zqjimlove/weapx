import "./core/ow-page";
import StoreCore from "./core/store.core";

import queueUpdateMixin from "./core/mixins/queue-update-mixin";
import storeMapDataMixin from "./core/mixins/store-map-data-mixin";

const DEFAULT_CONFIG = {
  mixins: [storeMapDataMixin, queueUpdateMixin]
};

export const config = {};

export default function weapx(_config = {}) {
  const mixins = (DEFAULT_CONFIG.mixins || []).concat(_config.mixins || []);
  Object.assign(config, DEFAULT_CONFIG, _config);
  config.mixins = mixins;
}

export const createStore = StoreCore.createStore;
