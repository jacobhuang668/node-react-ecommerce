//index.js：是应用的入口文件，负责渲染根组件 App 到页面上。
import React from "react";
import { Provider } from "react-redux"; //react-redux 是 React 与 Redux 结合使用的官方库，Provider 是一个高阶组件，它使得 Redux 存储（store）能够在 React 组件树中进行共享。将 store 提供给所有子组件，这样它们就可以访问 Redux 中的状态（state）了。
import ReactDOM from "react-dom"; //ReactDOM 是 React 的一个核心库，用于将 React 组件渲染到浏览器的 DOM 中。它提供了 render 方法，让你可以将 React 组件挂载到指定的 DOM 节点上。
import "./index.css";
import App from "./App"; // 导入根组件
import store from "./store";
/***
  8. <Provider store={store}>
    作用：将 store 提供给 React 组件树。
    解析：Provider 是 react-redux 提供的高阶组件，它接受一个 store 属性，将 Redux store 作为上下文传递给组件树的每个子组件。任何嵌套的组件都可以通过 connect 或 useSelector 等方法访问 store 中的状态。
    例如，store 中的状态可以在任何子组件中使用 useSelector 来访问，或者通过 connect 将状态传递给组件。

    ReactDOM.render 的第二个参数是一个 DOM 元素，用于指定将 React 组件渲染到页面中的哪个地方。在这个例子中，React 会将整个应用渲染到 index.html 文件中的 div 元素上，通常是这样的结构：
*/
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
