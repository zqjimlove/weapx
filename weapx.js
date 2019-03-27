import "./core/ow-page";
import StoreCore from "./core/store.core";
import config from './config';
import { autorun, reaction } from "./libs/mobx";



export default function weapx(_config = {}) {
  const mixins = (DEFAULT_CONFIG.mixins || []).concat(_config.mixins || []);
  Object.assign(config, DEFAULT_CONFIG, _config);
  config.mixins = mixins;
}

export const createStore = StoreCore.createStore;
export const runStore = autorun;
export const watchStore = reaction;
