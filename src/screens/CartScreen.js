import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";
import { Card, Button } from "react-native-elements";
import emptyCart from "../../assets/emptyCart.png";
import { Context as CartContext } from "../context/CartContext";

const CartScreen = ({ navigation }) => {
  const {
    state: { cart, items },
  } = useContext(CartContext);
  const [totalPriceState, setTotalPriceState] = useState(0);
  const [cartLengthState, setCartLengthState] = useState(0);

  useEffect(() => {
    calculateTotal();
    const unsubscribe = navigation.addListener("focus", () => {
      calculateTotal();
    });
    return unsubscribe;
  }, [cart.length]);

  const calculateTotal = () => {
    let totalPrice = 0;
    let cartLength = 0;
    if (cart.length) {
      cart.map((item) => {
        totalPrice += parseFloat(item.price) * parseInt(item.quantity);
        if (item.quantity !== 0) {
          cartLength += 1;
        }
      });
    }
    setTotalPriceState(totalPrice.toFixed(2));
    setCartLengthState(cartLength);
  };

  const renderCart = () => {
    return (
      <>
        <FlatList
          keyboardShouldPersistTaps="always"
          data={cart}
          renderItem={({ item }) => {
            return item.quantity !== 0 ? (
              <TouchableOpacity
                style={styles.cartView}
                onPress={() =>
                  navigation.navigate("ProductShow", {
                    product: item,
                    editable: false,
                  })
                }
              >
                <View style={{ ...styles.itemView, flex: 2 }}>
                  <Image
                    source={{ uri: item.images[0].src }}
                    style={{ width: 50, height: 50 }}
                  />
                </View>
                <View style={{ ...styles.itemView, flex: 12 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.subtitle}>Cantidad: {item.quantity}</Text>
                </View>
                <View style={{ ...styles.itemView, flex: 2 }}>
                  <Text style={styles.name}>
                    {(parseFloat(item.price) * parseInt(item.quantity)).toFixed(
                      2
                    )}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null;
          }}
          keyExtractor={(item) => item.id.toString()}
        />
        <Card containerStyle={styles.orderSummaryCard}>
          <Text style={styles.orderSummaryTitle}>Resumen de orden</Text>
          <Text style={styles.orderSummaryLine}>
            Productos: {cartLengthState} tipos, {items} en total
          </Text>
          <Text style={styles.orderSummaryLine}>Total: {totalPriceState}</Text>
          <Button
            buttonStyle={{ backgroundColor: "#28a745" }}
            title={"INICIAR COMPRA"}
          />
          <Text style={styles.disclaimer}>
            Podrá cambiar su orden después si lo desea
          </Text>
        </Card>
      </>
    );
  };

  const renderEmptyCart = () => {
    return (
      <View style={styles.emptyCartView}>
        <Image source={emptyCart} style={{ width: 200, height: 200 }} />
        <Text>Tu carrito está vacío.</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {items ? renderCart() : renderEmptyCart()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  cartView: {
    flexDirection: "row",
    height: 60,
    borderBottomColor: "#DCDCDC",
    borderBottomWidth: 1,
  },
  emptyCartView: {
    alignItems: "center",
  },
  name: {
    fontSize: 13,
  },
  itemView: {
    flexDirection: "column",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  subtitle: {
    color: "grey",
  },
  orderSummaryCard: {},
  orderSummaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
  },
  orderSummaryLine: {
    marginVertical: 5,
  },
  disclaimer: {
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 5,
  },
});
export default CartScreen;
