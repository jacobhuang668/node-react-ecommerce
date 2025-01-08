//App.js：是应用的根组件，包含应用的主要结构、路由和子组件。
import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import "./App.css";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import SigninScreen from "./screens/SigninScreen";
import { useSelector } from "react-redux";
import RegisterScreen from "./screens/RegisterScreen";
import ProductsScreen from "./screens/ProductsScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import ProfileScreen from "./screens/ProfileScreen";
import OrdersScreen from "./screens/OrdersScreen";
//export NODE_OPTIONS=--openssl-legacy-provider
function App() {
  //在传递给useSelector的函数中，你通过访问state.userSignin来选择你感兴趣的数据。这意味着你的Redux store的状态对象应该有一个userSignin属性，它可能包含了与用户登录相关的信息，比如用户的登录状态、用户信息或者登录过程中产生的任何错误信息。
  const userSignin = useSelector((state) => {
    console.log("state", state);
    return state.userSignin;
  });
  const { userInfo } = userSignin;

  const openMenu = () => {
    //classList：获取该元素的类属性（即class属性）的实时集合，这个集合以DOMTokenList对象的形式存在。
    //classList属性是HTML元素的一个非常重要的特性，它提供了一个实时、可操作的接口来访问和修改这个class属性。
    document.querySelector(".sidebar").classList.add("open");
  };
  const closeMenu = () => {
    document.querySelector(".sidebar").classList.remove("open");
  };
  return (
    <BrowserRouter>
      <div className="grid-container">
        <header className="header">
          <div className="brand">
            <button onClick={openMenu}>&#9776;</button>
            <Link to="/">amazona</Link>
          </div>
          <div className="header-links">
            <a href="cart.html">Cart</a>
            {userInfo ? (
              <Link to="/profile">{userInfo.name}</Link>
            ) : (
              <Link to="/signin">Sign In</Link>
            )}
            {userInfo && userInfo.isAdmin && (
              <div className="dropdown">
                <a href="#">Admin</a>
                <ul className="dropdown-content">
                  <li>
                    {/*Link组件用于在应用程序中进行内部导航。它类似于HTML中的<a>标签，但Link组件不会触发页面的重新加载，而是使用React Router的路由机制来实现无刷新的页面切换。*/}
                    <Link to="/orders">Orders</Link>
                    <Link to="/products">Products</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </header>
        {/*在构建网页时，合理使用<aside>元素可以为用户提供更好的阅读体验，并有助于搜索引擎优化。 */}
        <aside className="sidebar">
          <h3>Shopping Categories</h3>
          <button className="sidebar-close-button" onClick={closeMenu}>
            x
          </button>
          <ul className="categories">
            <li>
              <Link to="/category/Pants">Pants</Link>
            </li>

            <li>
              <Link to="/category/Shirts">Shirts</Link>
            </li>
          </ul>
        </aside>
        <main className="main">
          <div className="content">
            {/*
              当用户点击<Link to="/orders">Orders</Link>时，URL会更新为/orders。
              React Router检测到URL的变化，并查找与/orders路径匹配的<Route>。
             */}
            <Route path="/orders" component={OrdersScreen} />
            <Route path="/profile" component={ProfileScreen} />
            <Route path="/order/:id" component={OrderScreen} />
            <Route path="/products" component={ProductsScreen} />
            <Route path="/shipping" component={ShippingScreen} />
            <Route path="/payment" component={PaymentScreen} />
            <Route path="/placeorder" component={PlaceOrderScreen} />
            {/**
              * 浏览器访问 /signin 路径时被渲染，React Router 会自动传递 history、location 和 match 这些与路由相关的 props 给 SigninScreen 组件。
                history：用于程序化导航，跳转页面。
                location：描述当前 URL 的信息。
                match：匹配到当前路径的参数。
                history
                类型：object
                用途：history 用于管理路由历史，提供了跳转和导航的方法，例如 push、replace 和 goBack。
                常用方法：
                history.push('/path'): 导航到新的路径。
                history.replace('/path'): 用新的路径替换当前历史条目。
                history.goBack(): 返回到上一个页面。
                location
                类型：object
                用途：location 描述了当前的 URL 信息，包括路径 (pathname)、查询字符串 (search)、哈希值 (hash) 等。
                属性：
                pathname: 当前路径，例如 /signin。
                search: 查询字符串部分，例如 ?query=abc。
                hash: 哈希值，通常用于锚点导航。
                match
                类型：object
                用途：match 用于匹配当前 URL 和路由路径的匹配结果。
                属性：
                params: 路径参数（例如 /product/:id 中的 id）。
                isExact: 如果路径完全匹配，则为 true。
                path: 路由路径模板。
                url: 当前匹配的 URL。
              */}
            <Route path="/signin" component={SigninScreen} />
            <Route path="/register" component={RegisterScreen} />
            <Route path="/product/:id" component={ProductScreen} />
            <Route path="/cart/:id?" component={CartScreen} />
            {/*
                :id可以是任何字符串，比如“Pants”、“Shirts”
            */}
            <Route path="/category/:id" component={HomeScreen} />
            {/*
              exact={true}
                exact 属性表示该路由是否应该精确匹配路径。
                当 exact={true} 时，只有当 URL 完全匹配 path="/" 时，才会渲染 HomeScreen 组件。
                如果 exact 没有设置或是 false（这是默认行为），那么 / 路径就会与任何以 / 开头的路径匹配。也就是说，如果你访问 /about 或 /contact，这些路径也会匹配到该路由。
                使用 exact={true} 可以确保只有访问根路径 / 时，才渲染 HomeScreen 组件，避免更深层的路径（如 /about）也错误地匹配到这个路由。            
            */}
            <Route path="/" exact={true} component={HomeScreen} />
          </div>
        </main>
        <footer className="footer">All right reserved.</footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
