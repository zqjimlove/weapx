import nextTick from "../next-tick";
import { EVENT_BUS_KEY } from "../mixins-lifecycle";
const NOOP = () => {};
const QUEUE_UPDATE_CLASS_KEY = Symbol();

/**
 * 重写setData
 */
class QueueUpdate {
  constructor(ctx) {
    this.ctx = ctx;
    this.shouldPageUpdate = ctx.shouldPageUpdate || NOOP;

    this._setData = ctx.setData.bind(ctx);
    this._pendingData = [];
    this._pendingDataCallBack = [];
    this._readyRender = false;
    this._dataHasChange = false;

    this._doUpdatePromise = Promise.resolve();
    this.init();
  }
  init() {
    this._definedSetState();
  }
  ready() {
    this._readyRender = true;
    this.doUpdate();
  }
  setReady(status) {
    this._readyRender = status;
  }
  /**
   * 重定义setData
   */
  _definedSetState() {
    // Object.defineProperty(this.ctx, "setData", {
    //   get: () => {
    //     return this.updateDate.bind(this);
    //   }
    // });

    this.ctx.setState = this.updateDate.bind(this);
  }
  updateDate(data, callback) {
    this._doUpdatePromise.then(() => {
      if (!data) return;
      this._pendingData.push(data);
      if (callback) {
        this._pendingDataCallBack.push(callback);
      }

      if (!this._readyRender) return;

      if (this._updateTickId) {
        nextTick.clearTick(this._updateTickId);
      }

      this._updateTickId = nextTick(this.doUpdate.bind(this));
    });
  }
  doUpdate() {
    if (!this._pendingData.length) return;
    let doUpdateResolve, doUpdateReject;
    this._doUpdatePromise = new Promise((resolve, reject) => {
      doUpdateResolve = resolve;
      doUpdateReject = reject;
    });
    const { ctx } = this;
    const updateDataObj = {};
    const queueData = this._pendingData.concat();
    const queueCallBacks = this._pendingDataCallBack.concat();

    queueData.forEach(data => {
      Object.assign(updateDataObj, data);
    });

    const nextData = this._getNextData(updateDataObj);
    const hasChange = this._dataHasChange;
    this._dataHasChange = false;
    if (!hasChange) {
      // 数据未改变，则清空队列并不做任何处理。
      this._applyDataCallBackQueue(queueCallBacks);
      this._clearDataQueue();
      doUpdateResolve();
      return;
    }

    if (this.shouldPageUpdate(nextData) === false) {
      Object.assign(ctx.data, nextData);
      this._applyDataCallBackQueue(queueCallBacks);
      this._clearDataCallBackQueue();
      doUpdateResolve();
      return;
    }

    this._clearDataQueue();
    this._clearDataCallBackQueue();

    const dataClone = Object.assign({}, this.ctx.data);

    ctx[EVENT_BUS_KEY].trigger("onPageWillUpdate", [dataClone, nextData], ctx);

    this._setData(updateDataObj, () => {
      this._applyDataCallBackQueue(queueCallBacks);
      ctx[EVENT_BUS_KEY].trigger(
        "onPageDidUpdate",
        [dataClone, this.ctx.data],
        ctx
      );
      doUpdateResolve();
    });
  }
  _applyDataCallBackQueue(queueCallBacks) {
    if (queueCallBacks.length) {
      queueCallBacks.forEach(cb => {
        try {
          cb();
        } catch (e) {
          console.error(e);
        }
      });
    }
  }
  _clearDataQueue() {
    this._pendingData.length = 0;
  }
  _clearDataCallBackQueue() {
    this._pendingDataCallBack.length = 0;
  }
  _getNextData(updateData) {
    const dataClone = Object.assign({}, this.ctx.data);
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) return;
      this._scheduleReplace(key, dataClone, updateData[key]);
    });
    return dataClone;
  }
  _scheduleReplace(key, dataClone, nextValue) {
    const keys = this._propKeys(key);
    let tempData = dataClone;
    for (var i = 0, j = keys.length - 1; i < j; i++) {
      tempData = tempData[keys[i]] = tempData[keys[i]] || {};
    }
    if (tempData[keys[i]] !== nextValue) {
      this._dataHasChange = true;
      tempData[keys[i]] = nextValue;
    }
  }
  _propKeys(key) {
    // 校验key是否合规范
    if (!/^([a-zA-Z_]\w*(\[\d+\])?(\.[a-zA-Z_]\w*(\[\d+\])?)*)$/.test(key)) {
      throw new Error(`setState key:'${key}' is not valid.`);
    }
    const keyPairs = key.split(".");
    const ret = [];
    keyPairs.forEach(key => {
      if (key.indexOf("[") > -1) {
        key.replace(/(\w*)?\[(\d+)\]/, (...args) => {
          ret.push(args[1]);
          ret.push(args[2]);
        });
      } else {
        ret.push(key);
      }
    });
    return ret;
  }
}

export default {
  lifecycle: {
    onLoadBefore() {
      this[QUEUE_UPDATE_CLASS_KEY] = new QueueUpdate(this);
    },
    onShowAfter() {
      this[QUEUE_UPDATE_CLASS_KEY].ready();
    },
    onHideAfter() {
      this[QUEUE_UPDATE_CLASS_KEY].setReady(false);
    }
  }
};
