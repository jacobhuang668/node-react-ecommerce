import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { listProducts } from "../actions/productActions";
import Rating from "../components/Rating";
//这样你就能理解 props 是 React Router 自动传递的，不是你手动传递的。
function HomeScreen(props) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const category = props.match.params.id ? props.match.params.id : "";
  //useSelector 是 react-redux 提供的一个 Hook，专门用于从 Redux store 里获取状态（state）。
  //state 参数是什么？
  //state 是 Redux store 中的 整个全局状态（即 store 里的所有数据）。
  //这个 state 参数是由 useSelector 自动传递 的，你不需要手动传递它。
  //你可以把 state 理解成 Redux store 里面的数据结构。
  const productList = useSelector((state) => state.productList);
  const { products, loading, error } = productList;
  const dispatch = useDispatch();
  useEffect(() => {
    //在 Redux 中，dispatch(action) 会将一个动作（action）分发到 Redux 存储（store）的所有 Reducer。
    //每个 Reducer 是一个纯函数，接收当前状态（state）和动作（action），并根据 action.type 决定是否更新状态。
    //action.type 决定了哪个 Reducer 会处理这个动作，并更新对应的状态部分（例如 state.productList 或 state.productReview）。
    dispatch(listProducts(category, "", sortOrder)); //发送action，会更新redux store信息对吗？不对，如下解释：
    /*为什么没有直接传入 action 参数：因为 listProducts 是一个 Thunk action creator（异步函数），它返回一个函数，而不是一个动作对象。
    这个函数通过 dispatch 在内部分发多个带 type 的动作（如 'PRODUCT_LIST_REQUEST'、'PRODUCT_LIST_SUCCESS'、'PRODUCT_LIST_FAIL'），
    因此表面上看没有直接传入 action，但实际上动作是通过异步逻辑生成的。*/

    return () => {
      //你可能认为 sortOrder 始终是旧值，但实际上 useEffect 回调中使用的是最新值。
      //清理函数的打印只是反映了上一次的状态。
    };
  }, [category, sortOrder]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(listProducts(category, searchKeyword, sortOrder));
  };
  /*
    下面方法有问题：
    一言以蔽之，<select> 的 onChange：无法通过useState获取最新的值！对吗？

    一言以蔽之：是的，<select> 的 onChange 中无法通过 useState 直接获取最新的值，因为 setState 是异步的，状态更新未完成。
    但更准确地说：onChange 中调用 setSortOrder 后，sortOrder 的值不会立即更新，需通过 e.target.value 或 useEffect 获取最新值。
  */
  const sortHandler = (e) => {
    setSortOrder(e.target.value);
    //更改源代码中的错误
    //dispatch(listProducts(category, searchKeyword, sortOrder));
  };

  return (
    <>
      {category && <h2>{category}</h2>}
      <ul className="filter">
        <li>
          {/*<form> 监听 onSubmit 事件，调用 submitHandler。 */}
          <form onSubmit={submitHandler}>
            <input
              name="searchKeyword"
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </li>
        <li>
          Sort By{" "}
          <select value={sortOrder} onChange={sortHandler}>
            <option value="">Newest</option>
            <option value="lowest">Lowest</option>
            <option value="highest">Highest</option>
          </select>
        </li>
      </ul>
      {/*
      第一层条件：loading
        如果 loading 为 true：渲染 <div>Loading</div>。
        如果 loading 为 false：进入第二层条件。
      第二层条件：error
        如果 error 为真值（如字符串、对象）：渲染 <div>{error}</div>。
        如果 error 为假值（如 null、undefined、false）：渲染 <ul></ul>。
      */}
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <ul className="products">
          {products.map((product) => (
            <li key={product._id}>
              <div className="product">
                <Link to={"/product/" + product._id}>
                  <img
                    className="product-image"
                    src={product.image}
                    alt="product"
                  />
                </Link>
                <div className="product-name">
                  <Link to={"/product/" + product._id}>{product.name}</Link>
                </div>
                <div className="product-brand">{product.brand}</div>
                <div className="product-price">${product.price}</div>
                <div className="product-rating">
                  <Rating
                    value={product.rating}
                    text={product.numReviews + " reviews"}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
export default HomeScreen;
