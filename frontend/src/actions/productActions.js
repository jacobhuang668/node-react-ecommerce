import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_SAVE_REQUEST,
  PRODUCT_SAVE_SUCCESS,
  PRODUCT_SAVE_FAIL,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_REVIEW_SAVE_REQUEST,
  PRODUCT_REVIEW_SAVE_FAIL,
  PRODUCT_REVIEW_SAVE_SUCCESS,
} from "../constants/productConstants";
import axios from "axios";
import Axios from "axios";

const listProducts =
  (category = "", searchKeyword = "", sortOrder = "") =>
  //让 listProducts 可以执行异步逻辑（如 await axios.get(...)）。让你在异步代码中可以多次调用 dispatch()。async (dispatch) => {} 是 Redux Thunk 允许 action creator 处理异步逻辑的方式。
  async (dispatch) => {
    //dispatch 是 Redux 用来触发 action 的函数，它的作用是通知 reducer 更新 state。
    try {
      dispatch({ type: PRODUCT_LIST_REQUEST });
      //await axios.get(...) 会 暂停函数执行，直到 axios.get 返回的 Promise 完成（请求成功或失败）。
      /* 
      axios.get(url) 的返回值是一个 response 对象，通常包含多个属性，如：
      {
        data: { products: [...] }, // 这是我们需要的 API 返回数据
        status: 200,
        statusText: "OK",
        headers: { ... },
        config: { ... },
        request: { ... }
      }
      const { data } 这行代码使用了解构赋值, 不能直接改成 const data，否则 data 会变成整个 response 对象，而不是 response.data。
      */
      const { data } = await axios.get(
        "/api/products?category=" +
          category +
          "&searchKeyword=" +
          searchKeyword +
          "&sortOrder=" +
          sortOrder
      );
      /**
       * dispatch(listProducts(category)) 触发的 action 会更新 Redux store 中的信息（通常是通过 reducer 根据 action 类型来处理更新），并且该更新通常会影响组件的渲染（如果你使用了 useSelector 来获取 store 中的数据）。
       */
      dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: PRODUCT_LIST_FAIL, payload: error.message });
    }
  };

const saveProduct = (product) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_SAVE_REQUEST, payload: product });
    const {
      userSignin: { userInfo },
    } = getState();
    if (!product._id) {
      const { data } = await Axios.post("/api/products", product, {
        headers: {
          Authorization: "Bearer " + userInfo.token,
        },
      });
      dispatch({ type: PRODUCT_SAVE_SUCCESS, payload: data });
    } else {
      const { data } = await Axios.put(
        "/api/products/" + product._id,
        product,
        {
          headers: {
            Authorization: "Bearer " + userInfo.token,
          },
        }
      );
      dispatch({ type: PRODUCT_SAVE_SUCCESS, payload: data });
    }
  } catch (error) {
    dispatch({ type: PRODUCT_SAVE_FAIL, payload: error.message });
  }
};

const detailsProduct = (productId) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST, payload: productId });
    const { data } = await axios.get("/api/products/" + productId);
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: PRODUCT_DETAILS_FAIL, payload: error.message });
  }
};

const deleteProdcut = (productId) => async (dispatch, getState) => {
  try {
    const {
      userSignin: { userInfo },
    } = getState();
    dispatch({ type: PRODUCT_DELETE_REQUEST, payload: productId });
    const { data } = await axios.delete("/api/products/" + productId, {
      headers: {
        Authorization: "Bearer " + userInfo.token,
      },
    });
    dispatch({ type: PRODUCT_DELETE_SUCCESS, payload: data, success: true });
  } catch (error) {
    dispatch({ type: PRODUCT_DELETE_FAIL, payload: error.message });
  }
};

const saveProductReview = (productId, review) => async (dispatch, getState) => {
  try {
    const {
      userSignin: {
        userInfo: { token },
      },
    } = getState();
    dispatch({ type: PRODUCT_REVIEW_SAVE_REQUEST, payload: review });
    const { data } = await axios.post(
      `/api/products/${productId}/reviews`,
      review,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    dispatch({ type: PRODUCT_REVIEW_SAVE_SUCCESS, payload: data });
  } catch (error) {
    // report error
    dispatch({ type: PRODUCT_REVIEW_SAVE_FAIL, payload: error.message });
  }
};

export {
  listProducts,
  detailsProduct,
  saveProduct,
  deleteProdcut,
  saveProductReview,
};

/**
 * 
 const myDispatch = (fn) => {
  fn(myDispatch); // 这里把 `myDispatch` 作为参数传递
};

const myAsyncAction = async (dispatch) => {
  console.log("dispatch 是:", dispatch);
};

myDispatch(myAsyncAction);
执行 myDispatch(myAsyncAction) 时：

myAsyncAction(dispatch) 里的 dispatch 就是 myDispatch 传进去的 dispatch。
最终 console.log 打印的是 myDispatch，即 Redux 里的 dispatch。

async (dispatch) => { console.log("dispatch 是:", dispatch); }(myDispatch);



 */
