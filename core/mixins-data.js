//获取所有mixins的Data
export const getMixinData = mixins => {
  const ret = {};

  mixins.forEach(mixin => {
    const { data = {} } = mixin;

    Object.assign(ret, data);
  });

  return ret;
};

//混入Data
export const mixData = (minxinData, nativeData) => {
  Object.keys(minxinData).forEach(key => {
    // page中定义的data不会被覆盖
    // null也是被定义的一种方式
    if (nativeData[key] === undefined) {
      nativeData[key] = minxinData[key];
    }
  });
  return nativeData;
};

export default function(pageConf) {
  const { mixins = [] } = pageConf;
  const nativeData = pageConf.data || {};
  const minxinData = getMixinData(mixins);
  pageConf.data = mixData(minxinData, nativeData);
  return pageConf;
}
