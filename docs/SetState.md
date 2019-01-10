# setState

`setState(Object data,Function callback)` 是对小程序 `setData(Object data,Function callback)` 的优化。

## 优化点

* 多次setState调用将会合并成一次的setData调用。
* 进行比较重复值进行过滤，避免无数据变更情况下的刷新。
* 增加两个生命周期`onPageWillUpdate`、`onPageDidUpdate`。
* 增加是否阻止渲染方法`shouldPageUpdate(Object nextData)`。

## shouldPageUpdate(Object nextData)

当改回调方法返回`false`时页面会被阻止刷新，但是data对象的值会被改变，并且setState的回调函数都会被执行。

