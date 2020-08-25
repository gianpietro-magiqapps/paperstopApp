import React, { useContext, useEffect } from "react";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { Context as ProductsContext } from "../context/ProductsContext";
import ProductEditForm from "../components/ProductEditForm";

const ProductEditScreen = ({ route, navigation }) => {
  const { editProduct } = useContext(ProductsContext);
  const { product } = route.params;

  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  useEffect(() => {
    getPermissionAsync();
  }, []);

  return (
    <ProductEditForm
      initialValues={{
        name: product.name,
        description: product.description,
        regular_price: product.regular_price,
        sale_price: product.sale_price,
        stock_quantity: product.stock_quantity
          ? product.stock_quantity.toString()
          : null,
        categories: product.categories,
        image: product.images[0].src,
      }}
      cancel={() => navigation.pop()}
      submit={(productObject) =>
        editProduct(product.id, productObject, () => {
          navigation.pop();
        })
      }
    />
  );
};

export default ProductEditScreen;
