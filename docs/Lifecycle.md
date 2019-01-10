# 扩展生命周期

对原本小程序的原有生命周期回调函数进行了扩展处理，增加了`Before`和`Load`

|生命周期方法 | 说明|
------------|------------------|
|onLoadBefore |传入参数与小程序[onLoad](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/page.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%9B%9E%E8%B0%83%E5%87%BD%E6%95%B0)一致|
|onLoadAfter|传入参数与小程序[onLoad](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/page.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%9B%9E%E8%B0%83%E5%87%BD%E6%95%B0)一致|
|onShowBefore||
|onShowAfter||
|onReadyBefore||
|onReadyAfter||
|onHideBefore||
|onHideAfter||
|onUnloadBefore||
|onUnloadAfter||
|[onPageWillUpdate](#onpagewillupdateobject-dataobject-nextdata)|页面在重新渲染之前执行|
|[onPageDidUpdate](#onpagedidupdateobject-prevdata)|页面在重新渲染成功后之后执行|


### `onPageWillUpdate(Object data,Object nextData)`

调用setState对页面进行修改数据，页面在准备刷新渲染的时候触发。

|名称|类型|说明|
--|--|-----|
data|Object|当前页面的Data数据
nextData|Object|页面准备刷新的数据

### `onPageDidUpdate(Object prevData)`

调用setState对页面进行修改数据，页面刷新渲染完成后触发。

|名称|类型|说明|
--|--|-----|
prevData|Object|此次刷新渲染的上一次数据