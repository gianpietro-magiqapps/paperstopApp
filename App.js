import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5, Feather } from "@expo/vector-icons";
import { Text, View, TouchableOpacity } from "react-native";
import {
  Provider as ProductsProvider,
  Context as ProductsContext,
} from "./src/context/ProductsContext";
import {
  Provider as CartProvider,
  Context as CartContext,
} from "./src/context/CartContext";
import ProductListScreen from "./src/screens/ProductListScreen";
import ProductShowScreen from "./src/screens/ProductShowScreen";
import ProductEditScreen from "./src/screens/ProductEditScreen";
import CartScreen from "./src/screens/CartScreen";
import Header from "./src/components/Header";

const StoreStack = createStackNavigator();
const OrderStack = createStackNavigator();

const Tab = createBottomTabNavigator();

const StoreStackScreen = () => {
  const {
    state: { currentProduct },
  } = useContext(ProductsContext);

  return (
    <StoreStack.Navigator>
      <StoreStack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{
          headerTitle: ({ title = "Productos" }) => <Header title={title} />,
        }}
      />
      <StoreStack.Screen
        name="ProductShow"
        component={ProductShowScreen}
        options={({ navigation, route }) => ({
          headerTitle: ({ title = "Detalle de Producto" }) => (
            <Header title={title} />
          ),
          headerBackTitle: "Productos",
          headerRight: () =>
            route.params.editable ? (
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => {
                  navigation.navigate("ProductEdit", {
                    product: route.params.product.variations.length
                      ? currentProduct
                      : route.params.product,
                  });
                }}
              >
                <Feather name="edit" size={22} />
              </TouchableOpacity>
            ) : null,
        })}
      />
      <StoreStack.Screen
        name="ProductEdit"
        component={ProductEditScreen}
        options={{
          headerTitle: ({ title = "Editar Producto" }) => (
            <Header title={title} />
          ),
          headerBackTitle: "Producto",
        }}
      />
    </StoreStack.Navigator>
  );
};

function OrderStackScreen() {
  return (
    <OrderStack.Navigator>
      <OrderStack.Screen
        name="Carrito de Compras"
        component={CartScreen}
        options={{
          tabBarLabel: "Carrito",
          headerTitle: ({ title = "Detalle de Producto" }) => (
            <Header title={title} />
          ),
        }}
      />
    </OrderStack.Navigator>
  );
}

export default function App() {
  const renderItemsIcon = (items) => {
    return (
      <View
        style={{
          width: 18,
          height: 18,
          borderRadius: 9, //half radius will make it cirlce,
          backgroundColor: "red",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 10,
            color: "white",
          }}
        >
          {items}
        </Text>
      </View>
    );
  };
  return (
    <ProductsProvider>
      <CartProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                const { state } = useContext(CartContext);

                if (route.name === "Productos") {
                  iconName = focused ? "store" : "store";
                } else if (route.name === "Carrito") {
                  iconName = focused ? "shopping-cart" : "shopping-cart";
                  var items = state.items;
                }

                // You can return any component that you like here!
                return (
                  <View style={{ flexDirection: "row" }}>
                    <FontAwesome5 name={iconName} size={size} color={color} />
                    {items !== undefined
                      ? items !== 0
                        ? renderItemsIcon(items)
                        : null
                      : null}
                  </View>
                );
              },
            })}
          >
            <Tab.Screen name="Productos" component={StoreStackScreen} />
            <Tab.Screen name="Carrito" component={OrderStackScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </CartProvider>
    </ProductsProvider>
  );
}
