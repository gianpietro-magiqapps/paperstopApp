import * as ImageManipulator from "expo-image-manipulator";
import axios from "axios";
import base64 from "react-native-base64";
import WooApi from "../api/woocommerce";
import createDataContext from "./createDataContext";

const WOO_CREDENTIALS = `consumer_key=${WooApi.keys.consumerKey}&consumer_secret=${WooApi.keys.consumerSecret}`;

const productsReducer = (state, action) => {
  switch (action.type) {
    case "list_products":
      if (action.payload.data.length !== 0) {
        return action.payload.page === 1
          ? {
              products: action.payload.data,
              lastPage: false,
              emptySearch: false,
              productVariations: [],
            }
          : {
              products: [...state.products, ...action.payload.data],
              lastPage: false,
              emptySearch: false,
              productVariations: [],
            };
      }
      if (action.payload.term) {
        return {
          products: [],
          lastPage: state.lastPage,
          emptySearch: true,
          productVariations: [],
        };
      } else {
        return {
          products: state.products,
          lastPage: true,
          emptySearch: false,
          productVariations: [],
        };
      }
    case "fetch_product":
      return {
        products: state.products,
        lastPage: state.lastPage,
        productVariations: state.productVariations,
        currentProduct: action.payload,
      };

    case "fetch_product_variations":
      return {
        ...state,
        productVariations: action.payload,
      };
    case "clear_product_variations":
      return {
        ...state,
        productVariations: null,
      };
    case "edit_product":
      const newProductState = state.products.map((product) => {
        return product.id === action.payload.id
          ? Object.assign(product, action.payload)
          : product;
      });
      return {
        products: newProductState,
        lastPage: false,
        emptySearch: false,
        productVariations: [],
      };
    default:
      return state;
  }
};

const fetchProduct = (dispatch) => async (id) => {
  const url = `${WooApi.url.wc}products/${id}?${WOO_CREDENTIALS}`;
  const product = await axios.get(url);
  dispatch({
    type: "fetch_product",
    payload: product.data,
  });
};

const fetchProductVariations = (dispatch) => async (id) => {
  const productVariationsUrl = `${WooApi.url.wc}products/${id}/variations?${WOO_CREDENTIALS}`;
  const productVariations = await axios.get(productVariationsUrl);
  dispatch({
    type: "fetch_product_variations",
    payload: productVariations.data,
  });
};

const listProducts = (dispatch) => async (
  category,
  page,
  perPage,
  term = null
) => {
  const url = term
    ? `${WooApi.url.wc}products?search=${term}&category=${category}&page=${page}&per_page=${perPage}&${WOO_CREDENTIALS}`
    : `${WooApi.url.wc}products?category=${category}&page=${page}&per_page=${perPage}&${WOO_CREDENTIALS}`;
  const response = await axios.get(url);
  dispatch({
    type: "list_products",
    payload: { page, data: response.data, term },
  });
};

const editProduct = (dispatch) => async (id, productObject, callback) => {
  const url = `${WooApi.url.wc}products/${id}?${WOO_CREDENTIALS}`;
  const response = await axios.put(url, productObject);
  dispatch({ type: "edit_product", payload: response.data });
  callback();
};

const uploadResized = async (image) => {
  // Update Product Image in WP
  const auth = base64.encode(
    `${WooApi.keys.WP_USERNAME}:${WooApi.keys.WP_PASSWORD}`
  );

  const image500 = await ImageManipulator.manipulateAsync(
    image,
    [{ resize: { width: 500 }, format: "jpeg" }],
    {}
  );
  const responseImage500 = await fetch(image500.uri);
  const blobImage500 = await responseImage500.blob();
  const response = await fetch(WooApi.url.wp, {
    method: "POST",
    body: blobImage500,
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "image/jpeg",
    },
  });
  return response;
};

export const { Context, Provider } = createDataContext(
  productsReducer,
  {
    listProducts,
    editProduct,
    fetchProduct,
    fetchProductVariations,
  },
  {
    products: [],
    lastPage: false,
    emptySearch: false,
    productVariations: [],
    currentProduct: {},
  }
);
