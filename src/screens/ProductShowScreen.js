import React, { useContext, useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { ButtonGroup } from "react-native-elements";
import HTMLView from "react-native-htmlview";
import { Context as CartContext } from "../context/CartContext";
import { Context as ProductsContext } from "../context/ProductsContext";

const ProductScreen = ({ route }) => {
  const {
    state: { cart },
    addToCart,
    updateItemInCart,
  } = useContext(CartContext);
  const {
    state: { currentProduct: productFromNetwork, productVariations },
    fetchProduct,
    fetchProductVariations,
    clearProductVariations,
  } = useContext(ProductsContext);

  const productFromState = route.params.product;
  const productVariationsLocal = productFromState.variations.length
    ? productFromState.variations
    : [];

  const [quantity, setQuantity] = useState(0);

  const [loading, setLoading] = useState(false);

  const [buttonIndex, setButtonIndex] = useState(0);

  const updateProduct = async (index) => {
    setLoading(true);
    setButtonIndex(index);
    if (productVariations.length) {
      await fetchProduct(productVariations[index].id);
    }
    const isInCart = cart.find(
      (item) => item.id === productVariations[index].id
    );
    isInCart ? setQuantity(isInCart.quantity) : null;
    setLoading(false);
  };

  useEffect(() => {
    if (productVariationsLocal.length) {
      if (!productVariations.length) {
        fetchProductVariations(productFromState.id);
      }
      updateProduct(buttonIndex);
    } else {
      const isInCart = cart.find((item) => item.id === productFromState.id);
      isInCart ? setQuantity(isInCart.quantity) : null;
    }
  }, [productVariations]);

  const renderProductVariations = () => {
    let buttons = [];
    productVariations.map((variation) => {
      buttons.push(variation.attributes[0].option);
    });
    return (
      <ButtonGroup
        onPress={updateProduct}
        selectedIndex={buttonIndex}
        buttons={buttons}
        textStyle={{ fontWeight: "normal", fontSize: 12 }}
      />
    );
  };

  const renderProduct = (product) => {
    return (
      <>
        {product.images[0] ? (
          <Image style={styles.image} source={{ uri: product.images[0].src }} />
        ) : null}
        <Text style={styles.text}>
          {product.name} S/.{product.price}
        </Text>
        {!loading ? (
          <>
            {productVariationsLocal.length && productVariations.length
              ? renderProductVariations()
              : null}
            <View style={styles.quantityCart}>
              <View style={styles.quantity}>
                <TouchableOpacity
                  style={styles.decreaseButton}
                  onPress={() => {
                    quantity !== 0 ? setQuantity(quantity - 1) : null;
                  }}
                >
                  <Text> - </Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.increaseButton}
                  onPress={() => {
                    quantity < product.stock_quantity
                      ? setQuantity(quantity + 1)
                      : null;
                  }}
                >
                  <Text> + </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  !cart.find((item) => item.id === product.id)
                    ? addToCart({
                        ...product,
                        quantity: parseInt(quantity),
                      })
                    : updateItemInCart({
                        ...product,
                        quantity: parseInt(quantity),
                      });
                }}
              >
                <Text style={{ color: "#fff" }}> AÑADIR A CARRITO </Text>
              </TouchableOpacity>
            </View>
            <HTMLView style={styles.html} value={product.description} />
          </>
        ) : (
          renderLoader()
        )}
      </>
    );
  };

  const renderLoader = () => {
    return (
      <View style={styles.loaderContainer}>
        <Image
          source={require("../../assets/cart-loading.gif")}
          style={styles.loaderImage}
        />
      </View>
    );
  };

  const selectProductRender = () => {
    if (productVariationsLocal.length) {
      if (productFromNetwork) {
        return renderProduct(productFromNetwork);
      }
    } else {
      return renderProduct(productFromState);
    }
  };

  return (
    <ScrollView style={styles.container}>{selectProductRender()}</ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  loaderContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  loaderImage: {
    width: 200,
    height: 200,
  },
  image: {
    width: 360,
    height: 360,
  },
  text: {
    fontSize: 20,
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 10,
    textAlign: "center",
  },
  quantityCart: {
    flexDirection: "row",
    padding: 10,
    marginLeft: 20,
    marginBottom: 20,
  },
  quantity: {
    flexDirection: "row",
    justifyContent: "center",
  },
  quantityText: {
    height: 40,
    width: 50,
    borderWidth: 1,
    borderColor: "rgba(27,31,35,0.05)",
    padding: 10,
    backgroundColor: "white",
    textAlign: "center",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#05a5d1",
    padding: 10,
    width: 150,
    height: 40,
    marginLeft: 20,
    borderBottomLeftRadius: 17,
    borderBottomRightRadius: 17,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
  },
  decreaseButton: {
    height: 40,
    width: 30,
    padding: 10,
    backgroundColor: "rgba(27,31,35,0.05)",
    borderBottomLeftRadius: 17,
    borderTopLeftRadius: 17,
  },
  increaseButton: {
    height: 40,
    width: 30,
    padding: 8,
    backgroundColor: "rgba(27,31,35,0.05)",
    borderBottomRightRadius: 17,
    borderTopRightRadius: 17,
  },
  description: {
    fontSize: 14,
    padding: 15,
  },
  html: {
    paddingLeft: 20,
    paddingRight: 20,
  },
});
export default ProductScreen;
