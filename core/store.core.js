import mobx, {
  observable,
  computed,
  action,
  decorate,
  configure
} from "../libs/mobx";

import types from "../utils/types";

configure({
  enforceActions: true
});

export const StoreBucket = {};


function createMobxClass(config) {
  const _store = {};
  const mobxConfig = {};

  Object.keys(config.state || {}).forEach(key => {
    const stateValue = config.state[key];
    _store[key] = stateValue;
  });

  Object.keys(config.getter || {}).forEach(getterKey => {
    Object.defineProperty(_store, getterKey, {
      configurable: true,
      enumerable: true,
      set: undefined,
      get: config.getter[getterKey]
    });
  });

  Object.keys(config.actions || {}).forEach(actionKey => {
    _store[actionKey] = config.actions[actionKey];
    mobxConfig[actionKey] = action;
  });

  Object.keys(config.methods || {}).forEach(methodKey => {
    _store[methodKey] = config.methods[methodKey];
    mobxConfig[methodKey] = action.bound;
  });

  return observable(_store, mobxConfig);
}

export default {
  mixinsPageStore(pageConfig) {
    pageConfig.mixins.unshift({
      lifecycle: {
        onLoadBefore() {
          this.$store = StoreBucket;
        }
      }
    });
    // pageConfig.$store = StoreBucket;
  },
  createStore(config) {
    if (!config.name) {
      throw new Error("createStore config.name must not to be undefined");
    }
    // const MobxClass = createMobxClass(config);
    // const mobxClassInstance = (StoreBucket[config.name] = new MobxClass());
    const instance = (StoreBucket[config.name] = createMobxClass(config));

    instance.id = "1";
    return instance;
  }
};
