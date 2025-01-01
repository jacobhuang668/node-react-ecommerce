/**
 * createStore：创建 Redux store 的方法。
  combineReducers：合并多个 reducer 函数为一个 reducer。
  applyMiddleware：应用中间件（比如 redux-thunk）来增强 store 的功能。
  compose：用于组合多个高阶函数，通常用于 Redux DevTools 的配置。
  thunk：redux-thunk 中间件允许你 dispatch 异步操作（如 API 请求）。
  Cookie：用于读取浏览器中的 cookies（用于存储用户信息和购物车内容等）。
 * 
 * 
 */
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import Cookie from "js-cookie";
//这些是从各个 reducers 文件导入的 reducer 函数，它们负责处理不同部分的状态（例如产品列表、购物车、用户、订单等）。
import {
  productListReducer,
  productDetailsReducer,
  productSaveReducer,
  productDeleteReducer,
  productReviewSaveReducer,
} from "./reducers/productReducers";
import { cartReducer } from "./reducers/cartReducers";
import {
  userSigninReducer,
  userRegisterReducer,
  userUpdateReducer,
} from "./reducers/userReducers";
import {
  orderCreateReducer,
  orderDetailsReducer,
  orderPayReducer,
  myOrderListReducer,
  orderListReducer,
  orderDeleteReducer,
} from "./reducers/orderReducers";
//从浏览器 cookies 中读取 cartItems 和 userInfo，用于在刷新页面时恢复用户购物车和用户信息。若 cookies 中没有数据，则使用默认值（空数组或 null）。
const cartItems = Cookie.getJSON("cartItems") || [];
const userInfo = Cookie.getJSON("userInfo") || null;
/**
 * 
  定义 Redux store 的初始状态。包含两个主要部分：
  cart：包含购物车中的商品、配送信息和支付信息。
  userSignin：包含用户登录信息。
 */
const initialState = {
  cart: { cartItems, shipping: {}, payment: {} },
  userSignin: { userInfo },
};

//使用 combineReducers 将多个 reducer 合并成一个总的 reducer，这样每个 reducer 负责管理其对应的 state 部分
const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  cart: cartReducer,
  userSignin: userSigninReducer,
  userRegister: userRegisterReducer,
  productSave: productSaveReducer,
  productDelete: productDeleteReducer,
  productReviewSave: productReviewSaveReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  userUpdate: userUpdateReducer,
  myOrderList: myOrderListReducer,
  orderList: orderListReducer,
  orderDelete: orderDeleteReducer,
});
//composeEnhancer 用于连接 Redux DevTools（如果存在）。如果没有 DevTools，它将使用默认的 compose。
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/**
 * 
 * createStore 用来创建 Redux store。它接受三个参数：
   reducer：合并后的 reducer。
   initialState：初始状态。
   applyMiddleware(thunk)：应用中间件，这里使用 redux-thunk，允许异步操作。
   composeEnhancer：用于启用 Redux DevTools。
 * 
 * 
 */
const store = createStore(
  reducer,
  initialState,
  composeEnhancer(applyMiddleware(thunk))
);
//导出创建的 Redux store，以便在应用的其他部分使用
export default store;
