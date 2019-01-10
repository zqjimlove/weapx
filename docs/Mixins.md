# Mixins

小程序初始化的时候支持`Mixins`参数进行混入操作。

## Mixins对象说明

#### data

data对象的混入。

混入数组中重复的key会被覆盖，覆盖规则为后混入覆盖先混入。`Page`初始化对象参数与minxis含有相同key时，不被覆盖。

#### methods

页面对象方法的混入，所有非生命周期的方法都需要在该空间下。

混入数组中重复的key会被覆盖，覆盖规则为后混入覆盖先混入。`Page`初始化对象参数与minxis含有相同key时，不被覆盖。

#### lifecycle

生命周期回调方法混入，多个mixins混入时不被覆盖，会按顺序同步执行。

#### storeMapData

store的值自动映射到Page#data上，当store改变的时候data会随着改变并重新渲染页面。

## Example

```js
import mixinTest from "./test.mixins";

Page({
  mixins: [mixinTest],
  onLoad(query) {

    console.log(this.todos);
    // print [{name:'测试1',time:'2018-09-28'}]

    this.login().then(() => {
      //...
    });
  }
});
```

**test.mixins.js**

```js
export default {
  /**
   * 混入data
   */
  data: {
    todos:[]
  },
  /**
   * 混入方法
   */

  methods: {
    login(){
      return new Promise(...);
    }
  },
  /**
   * 混入生命周期回调函数
   */
  lifecycle: {
    onLoadBefore(){
      this.todos.push({
        name:'测试1',
        time:'2018-09-28'
      })
    }
  },
  /**
   * Store 映射 Data 配置
   **/
  storeMapData: {}
};
```
