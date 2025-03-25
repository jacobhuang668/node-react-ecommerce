import Axios from "axios";
import Cookie from "js-cookie";
//import { configureStore } from "@reduxjs/toolkit";
import {
  USER_SIGNIN_REQUEST,
  USER_SIGNIN_SUCCESS,
  USER_SIGNIN_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_LOGOUT,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
} from "../constants/userConstants";

const update =
  ({ userId, name, email, password }) =>
  async (dispatch, getState) => {
    const {
      userSignin: { userInfo },
    } = getState();
    dispatch({
      type: USER_UPDATE_REQUEST,
      payload: { userId, name, email, password },
    });
    try {
      const { data } = await Axios.put(
        "/api/users/" + userId,
        { name, email, password },
        {
          headers: {
            Authorization: "Bearer " + userInfo.token,
          },
        }
      );
      dispatch({ type: USER_UPDATE_SUCCESS, payload: data });
      dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
      Cookie.set("userInfo", JSON.stringify(data));
    } catch (error) {
      dispatch({ type: USER_UPDATE_FAIL, payload: error.message });
    }
  };

const signin = (email, password) => async (dispatch) => {
  dispatch({ type: USER_SIGNIN_REQUEST, payload: { email, password } });
  try {
    const { data } = await Axios.post("/api/users/signin", { email, password });
    //在 Redux 中的作用是 触发一个 action，这个 action 会被传递给 Redux 的 reducer 来更新 store 中的状态。
    dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
    Cookie.set("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({ type: USER_SIGNIN_FAIL, payload: error.message });
  }
};

const register = (name, email, password) => async (dispatch) => {
  dispatch({ type: USER_REGISTER_REQUEST, payload: { name, email, password } });
  try {
    const { data } = await Axios.post("/api/users/register", {
      name,
      email,
      password,
    });
    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
    Cookie.set("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({ type: USER_REGISTER_FAIL, payload: error.message });
  }
};

const logout = () => (dispatch) => {
  Cookie.remove("userInfo");
  dispatch({ type: USER_LOGOUT });
};
export { signin, register, logout, update };

//关于payload理解
/**
 *  在 Redux 中，payload 是 action 对象中的一部分，用于存储携带的数据，这些数据将被用来更新 Redux store 中的状态。
    理解 payload 的概念
    Action 是一种描述发生了什么的普通 JavaScript 对象。每个 action 必须有一个 type 属性，type 用来表示这个 action 的类型。

    Payload 是 action 对象中的额外数据，用于携带需要更新的内容。你可以把它理解为传递给 reducer（用于更新状态的函数）的一些信息，它们是根据 action 类型来处理的。

    举个例子：
    假设我们要实现一个用户登录的功能，当用户点击登录按钮时，会发送一个 action 来处理登录操作。

    js
    复制代码
    const signin = (email, password) => {
      return {
        type: 'SIGNIN',  // 这表明这是一个 "SIGNIN" 类型的 action
        payload: {       // 这里是携带的具体数据
          email,         // 用户的 email
          password       // 用户的 password
        }
      };
    };
    在上面的代码中：

    type: 'SIGNIN'：这是必需的，它表示这个 action 的类型。通常，type 是一个字符串，标识了 action 的性质，比如 "SIGNIN"、"LOGOUT" 等。
    payload：是一个包含 email 和 password 的对象，它包含了 需要在 reducer 中使用的数据。
    Redux Action 的结构
    一个典型的 Redux action 通常是这样的结构：

    js
    复制代码
    {
      type: 'ACTION_TYPE',   // action 类型，用来指示这个 action 做了什么
      payload: {             // payload 里的数据是我们希望更新的内容
        key1: value1,
        key2: value2,
        ...
      }
    }
    例如，登录的 action 对象可能会是这样：

    js
    复制代码
    {
      type: 'SIGNIN',
      payload: {
        email: 'user@example.com',
        password: 'userPassword123'
      }
    }
    这里 payload 作为一个容器，包含了登录所需的相关数据，比如 email 和 password，它们将在后续的 reducer 中被使用来更新应用的状态。

    为什么要使用 payload？
    payload 是一种组织数据的方式，它使得我们能够把需要传递给 reducer 的所有数据放到一个统一的地方。在处理 action 时，可以方便地访问和操作这些数据。

    举个具体例子：
    假设我们有一个处理用户信息的 reducer，它会根据不同的 action 来更新用户状态：

    js
    复制代码
    const initialState = {
      user: null,
      isLoggedIn: false
    };

    const userReducer = (state = initialState, action) => {
      switch (action.type) {
        case 'SIGNIN':
          // 通过 payload 获取用户的 email 和 password
          return {
            ...state,
            user: action.payload.email,  // 假设只更新 email
            isLoggedIn: true
          };
        case 'LOGOUT':
          return {
            ...state,
            user: null,
            isLoggedIn: false
          };
        default:
          return state;
      }
    };
    在 SIGNIN 的 case 中，action.payload.email 就是我们通过 signin action 传递过来的 email，然后将其保存到 Redux store 中的 user 字段。

    总结：
    payload 是 action 中的一个字段，它携带了需要更新的具体数据。
    在 Redux 中，action 是一个普通对象，包含 type 和 payload，type 描述了要执行的操作，payload 包含了需要传递给 reducer 的数据。
    Reducer 使用 payload 来更新 Redux store 中的状态。
    例子复习：
    假设我们有一个登录的 action：

    js
    复制代码
    const signin = (email, password) => {
      return {
        type: 'SIGNIN',
        payload: { email, password }
      };
    };
    然后在 reducer 中：

    js
    复制代码
    case 'SIGNIN':
      return {
        ...state,
        user: action.payload.email, // 这里使用了 action.payload.email
        isLoggedIn: true
      };
    payload 在这里起到了携带数据的作用，它将登录所需的 email 和 password 数据传递给了 reducer，然后在 reducer 中使用这些数据来更新状态。
 */
