import queueUpdateMixin from "./core/mixins/queue-update-mixin";
import storeMapDataMixin from "./core/mixins/store-map-data-mixin";

const config = {
  mixins: [storeMapDataMixin, queueUpdateMixin]
};
export default config;
