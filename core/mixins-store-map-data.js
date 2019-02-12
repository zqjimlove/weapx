//获取所有mixins的Data
export const getMixinStoreMapData = mixins => {
  const ret = {};

  mixins.forEach(mixin => {
    const { storeMapData = {} } = mixin;
    Object.assign(ret, storeMapData);
  });

  return ret;
};

//混入Data
export const mixStoreMapData = (minxinStoreMapData, nativeStoreMapData) => {
  Object.keys(minxinStoreMapData).forEach(key => {
    if (nativeStoreMapData[key] === undefined) {
      nativeStoreMapData[key] = minxinStoreMapData[key];
    }
  });
  return nativeStoreMapData;
};

export default function(pageConf) {
  const { mixins = [] } = pageConf;
  const nativeStoreMapData = pageConf.storeMapData || {};
  const minxinStoreMapData = getMixinStoreMapData(mixins);
  pageConf.storeMapData = mixStoreMapData(
    minxinStoreMapData,
    nativeStoreMapData
  );
  return pageConf;
}
