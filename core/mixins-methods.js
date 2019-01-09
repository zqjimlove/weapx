import types from "../utils/types";

//获取混入的方法
export const getMixinMethods = mixins => {
  const ret = {};

  mixins.forEach(mixin => {
    const { methods = {}, lifecycle = {} } = mixin;

    // 提取methods
    Object.keys(methods).forEach(key => {
      if (types.isFunction(methods[key])) {
        ret[key] = methods[key];
      }
    });
  });

  return ret;
};

//混入方法
export const mixMethods = (mixinMethods, pageConf) => {
  Object.keys(mixinMethods).forEach(key => {
    if (pageConf[key] === undefined) {
      pageConf[key] = mixinMethods[key];
    }
  });
};

export default function(pageConf) {
  const { mixins = [] } = pageConf;
  const mixinMethods = getMixinMethods(mixins);
  mixMethods(mixinMethods, pageConf);

  return pageConf;
}
