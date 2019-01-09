import types from "../utils/types";

import EventEmitter from "../libs/EventEmitter";

const PAGE_LIFE_CYCLE = [
  "onLoad",
  "onReady",
  "onShow",
  "onHide",
  "onUnload",
  "onPageWillUpdate",
  "onPageDidUpdate"
];

export const EVENT_BUS_KEY = Symbol();

const getLifeCycleExtendKyes = key => {
  return [`${key}Before`, key, `${key}After`];
};

//获取混入的生命周期handler
export const getMixinLifeCycle = mixins => {
  const ret = {};

  mixins.forEach(mixin => {
    const { lifecycle = {} } = mixin;

    // 提取lifecycle
    Object.keys(lifecycle).forEach(key => {
      if (types.isFunction(lifecycle[key])) {
        (ret[key] = ret[key] || []).push(lifecycle[key]);
      }
    });
  });

  return ret;
};

export const mixinLifeCycle = (mixinsLifeCycles, pageConf) => {
  PAGE_LIFE_CYCLE.forEach(lifecycleKey => {
    const nativeFn = pageConf[lifecycleKey];

    if (nativeFn) {
      (mixinsLifeCycles[lifecycleKey] =
        mixinsLifeCycles[lifecycleKey] || []).push(nativeFn);
    }

    const eventBus = pageConf[EVENT_BUS_KEY];
    const extendKeys = getLifeCycleExtendKyes(lifecycleKey);

    extendKeys.forEach(extendKey => {
      eventBus.addListeners(extendKey, mixinsLifeCycles[extendKey] || []);
    });

    pageConf[lifecycleKey] = function(...args) {
      extendKeys.forEach(key => {
        try {
          eventBus.trigger(key, args, this);
        } catch (e) {
          console.error(e);
        }
      });
    };
  });
};

// class LifeCycleEventBus {
//   constructor() {
//     this.bus = {};
//   }
//   register(lifeName, events = []) {
//     this.bus[lifeName] = events;
//   }
//   trigger(ctx, lifeName, ...args) {
//     this.bus[lifeName].forEach(f => {
//       try {
//         f.apply(ctx, args);
//       } catch (e) {
//         console.error(e);
//       }
//     });
//   }
// }

export default function(pageConf) {
  const { mixins = [] } = pageConf;
  const eventBus = (pageConf[EVENT_BUS_KEY] = new EventEmitter());

  // 由于pageConf参数使用Symbol无法被继承到this
  // 所以直接利用onLoadBefore插入到this
  mixins.unshift({
    lifecycle: {
      onLoadBefore() {
        this[EVENT_BUS_KEY] = eventBus;
      }
    }
  });

  const mixinsLifeCycles = getMixinLifeCycle(mixins);
  mixinLifeCycle(mixinsLifeCycles, pageConf);
  return pageConf;
}
