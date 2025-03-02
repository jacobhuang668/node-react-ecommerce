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
    dispatch(listProducts(category)); //发送action，会更新redux store信息对吗？不对，如下解释：
    /*为什么没有直接传入 action 参数：因为 listProducts 是一个 Thunk action creator（异步函数），它返回一个函数，而不是一个动作对象。
    这个函数通过 dispatch 在内部分发多个带 type 的动作（如 'PRODUCT_LIST_REQUEST'、'PRODUCT_LIST_SUCCESS'、'PRODUCT_LIST_FAIL'），
    因此表面上看没有直接传入 action，但实际上动作是通过异步逻辑生成的。*/

    return () => {
      //
    };
  }, [category]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(listProducts(category, searchKeyword, sortOrder));
  };
  const sortHandler = (e) => {
    setSortOrder(e.target.value);
    dispatch(listProducts(category, searchKeyword, sortOrder));
  };

  return (
    <>
      {category && <h2>{category}</h2>}

      <ul className="filter">
        <li>
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
          <select name="sortOrder" onChange={sortHandler}>
            <option value="">Newest</option>
            <option value="lowest">Lowest</option>
            <option value="highest">Highest</option>
          </select>
        </li>
      </ul>
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
