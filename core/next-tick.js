const nextTick = (fn, ...args) => {
  fn = typeof fn === "function" ? fn.bind(null, ...args) : fn;
  const timerFunc = wx.nextTick ? wx.nextTick : setTimeout;
  timerFunc(fn);
};

nextTick.clearTick = function(id) {
  if (id) {
    clearTimeout(id);
  }
};

export default nextTick;
