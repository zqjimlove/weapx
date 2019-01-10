# Store

Store 借助了开源库 (Mobx)[https://mobx.js.org/] 实现。

## 创建 Store

```js
import { createStore } from "../weapx";
createStore({
  /**
   * Store 的命名空间
   **/
  name: "todo",
  /**
   * 数据源，该数据源下的数据对象才是响应式的。
   **/
  state: {
    todos: []
  },
  /**
   * getter下的返回对象是会被缓存的。
   * 只有当getter方法内的数据源被改变后才会重新计算，否则将会从缓存取值。
   **/
  getter: {
    count() {
      return this.todos.length;
    }
  },
  /**
   * Action 是对数据源进行更改的唯一方法
   **/

  actions: {
    appendTodos() {
      return fetch({
        /* ... */
      }).then(this.pushTodo);
    }
  },
  /**
   * methods下的方法都默认执行了bind(this)处理。
   *
   * fetch({…}).then(this.pushTodo);
   *
   * 仍可保证this的
   **/
  methods: {
    pushTodo() {
      this.todos.push({
        id: this.count + 1
      });
    }
  }
});
```

## 使用 Store

```js
Page({
  onLoad() {
    console.log(this.$store.todo.count);
    // Print 0

    this.$store.todo.appendTodos().then(() => {
      console.log(this.$store.todo.count);
      // Print 1
    });
  },
  todosUpdate() {
    // ……
  }
});
```

## 映射到 Data

```js
Page({
  onLoad() {
    console.log(this.data.todosCount);
    //print 0
  },
  storeMapData: {
    todosCount: store => store.todo.count
  }
});
```

## 监听 Store 数据变化

`runStore` = (Mobx#autorun)[https://mobx.js.org/refguide/autorun.html]

`watchStore` = (Mobx#reaction)[https://mobx.js.org/refguide/reaction.html]

`runStore` 和 `watchStore` 都是监听响应式数据的方法，他们之间不同于 `watchStore` 的是当创建时效果函数不会直接运行，只有在数据表达式首次返回一个新值后才会运行。

`runStore`,`watchStore` 都会返回一个结束监听的函数，在页面 onLoad 的时候我们应当调用结束函数。

```js
import { runStore, watchStore } from "./weapx";

Page({
  onLoad() {
    this.runner=runStore(() => {
      console.log(`runStore:${this.$store.todo.count}`);
    });
    this.watcher=watchStore(
      () => {
        console.log(`watchStore:${this.$store.todo.count}`);
      },
      () => {
        console.log(`watchStoreSetData:${this.$store.todo.count}`);
      }
    );

    this.$store.todo.appendTodos();
    // 系统输出
    // runStore:0
    // watchStore:0
    // runStore:1
    // watchStore:1
    // watchStoreSetData:1
  }
  onUnload(){
    this.runner();
    this.watcher();
  }
});
```
