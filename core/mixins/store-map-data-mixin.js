import { autorun } from "../../libs/mobx";
import { StoreBucket } from "../store.core";

const MOBX_AUTORUN_KEY = Symbol();

function mapToData(context, mapFns) {
  const keys = (context[MOBX_AUTORUN_KEY] = []);
  Object.keys(mapFns).forEach(mapKey => {
    const getStoreValueFn = mapFns[mapKey];
    keys.push(
      autorun(() => {
        const value = getStoreValueFn(StoreBucket);
        if (value === undefined) return;
        context.setData({
          [mapKey]: value
        });
      })
    );
  });
}

export default {
  lifecycle: {
    onLoadBefore() {
      if (this.storeMapData && Object.keys(this.storeMapData).length) {
        mapToData(this, this.storeMapData);
      }
    },
    onUnloadBefore() {
      this[MOBX_AUTORUN_KEY].forEach(unAutoRun => {
        unAutoRun();
      });
    }
  }
};
