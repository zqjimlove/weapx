import { config } from "../weapx";
import pageMixins from "./page-mixins";
import StoreCore from "./store.core";

const _Page = Page;

/**
 * 重写Page，为了支持扩张更多的功能
 */
Page = function(pageConf) {
  const app = getApp();

  pageConf.mixins = (config.mixins || []).concat(pageConf.mixins || []);

  StoreCore.mixinsPageStore(pageConf);
  pageMixins(pageConf);

  console.log(pageConf);
  _Page(pageConf);
};
