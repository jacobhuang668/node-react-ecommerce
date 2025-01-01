import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
//useSelector 和 useDispatch 是 React Redux 提供的两个 Hook，用于在函数组件中访问 Redux store 和派发 actions。
/**
 * 这行代码从 react-redux 库中导入了两个 React Hook：useSelector 和 useDispatch。
  useSelector：用于从 Redux store 中选择状态。它使你能够访问存储在 Redux store 中的状态。
  useDispatch：用于派发 (dispatch) Redux actions。它提供了 dispatch 函数，通过这个函数你可以发送 action，触发状态更新。
 */
import { useSelector, useDispatch } from "react-redux";
import { signin } from "../actions/userActions";

function SigninScreen(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  /**
     useSelector 是 Redux 的一个 Hook，用于访问 Redux 全局状态。
     它接收一个函数作为参数，该函数的参数是 Redux 的完整状态对象 state。
     state 是 Redux 中的整个状态对象（一个全局 JavaScript 对象）。
     state.userSignin 是 Redux 状态中的某个特定部分，通常与登录状态或用户信息有关。

   */
  const userSignin = useSelector((state) => state.userSignin);
  /**
   * 假设你的 Redux 状态对象是这样的：
   * const state = {
        userSignin: { userInfo: { name: "John", email: "john@example.com" }, loading: false, error: null },
        cart: { items: [], totalPrice: 0 },
     };
   * 
   * 
   */
  const { loading, userInfo, error } = userSignin;
  //这是通过 useDispatch 获取的函数。你可以通过 dispatch 函数将 actions 派发给 Redux store，以改变状态。
  const dispatch = useDispatch();
  /**
 * props.location.search 是当前 URL 中的查询字符串（即 ?key=value 部分）。
  这行代码的目的是从查询字符串中提取出 key=value 的值部分。
  如果查询字符串存在，它会将字符串按 = 拆分，获取 = 后面的值（即 split("=")[1]）。
  如果查询字符串不存在，即 props.location.search 为空，默认值是 "/"，也就是说，如果没有指定重定向地址，用户会被重定向到主页。
  假设 URL 为 http://example.com?redirect=/dashboard，那么 redirect 变量的值将会是 "/dashboard"。如果没有查询参数，那么 redirect 将是 "/"。
 */
  const redirect = props.location.search
    ? props.location.search.split("=")[1]
    : "/";
  useEffect(() => {
    //通过检查 userInfo，确保只有已登录的用户才能访问特定页面。
    if (userInfo) {
      /**
       * props.history.push(redirect)：这是一个使用 React Router 的方法，用来将用户重定向到新的路径。history.push 方法会将新的路由添加到浏览器的历史记录中，并触发页面导航。
        这里的 redirect 是之前解析的值，如果 URL 查询字符串中指定了 redirect，则会重定向到该路径（例如 "/dashboard"），如果没有指定，默认为 "/"（即首页）。
        所以，props.history.push(redirect) 实际上是用来在 userInfo 存在时将用户重定向到一个指定的页面。如果用户已经登录（即 userInfo 存在），那么应用会自动将他们引导到之前想去的页面（如 /dashboard），而不是让他们停留在当前页面。
       * 
       */
      props.history.push(redirect);
    }
    return () => {
      //
    };
  }, [userInfo]);

  const submitHandler = (e) => {
    //这个方法阻止了表单的默认行为。默认情况下，表单提交时页面会刷新。通过 preventDefault()，我们避免页面刷新，从而在单页应用（SPA）中保持无刷新体验。
    e.preventDefault();
    /**
     * 
     * signin(email, password) 是一个 action 创建函数（action creator），它通常会返回一个 action 对象，可能包含 type（action 类型）以及 payload（载荷，比如 email 和 password）。
       dispatch 会将该 action 发送给 Redux store，Redux store 会根据 action 更新应用的状态。
       例如，signin action 的实现可能如下所示：
     * 
     */
    dispatch(signin(email, password));
  };
  return (
    <div className="form">
      <form onSubmit={submitHandler}>
        <ul className="form-container">
          <li>
            <h2>Sign-In</h2>
          </li>
          <li>
            {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}
          </li>
          <li>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </li>
          <li>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </li>
          <li>
            <button type="submit" className="button primary">
              Signin
            </button>
          </li>
          <li>New to amazona?</li>
          <li>
            <Link
              to={
                redirect === "/" ? "register" : "register?redirect=" + redirect
              }
              className="button secondary text-center"
            >
              Create your amazona account
            </Link>
          </li>
        </ul>
      </form>
    </div>
  );
}
export default SigninScreen;
