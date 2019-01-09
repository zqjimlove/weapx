import mixinsData from "./mixins-data";
import mixinsMethods from "./mixins-methods";
import mixinsLifecycle from "./mixins-lifecycle";
import mixinsStoreMapData from "./mixins-store-map-data";

const NOOP = _ => {};

export default pageConf => {
  const { mixins = [] } = pageConf;

  const onNativeLoad = pageConf.onLoad || NOOP;

  mixinsData(pageConf);
  mixinsMethods(pageConf);
  mixinsLifecycle(pageConf);
  mixinsStoreMapData(pageConf);

  // mixins.length = 0;
  
  return pageConf;
};
