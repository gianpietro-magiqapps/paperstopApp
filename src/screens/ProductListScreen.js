import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { ButtonGroup } from "react-native-elements";
import { Context as ProductsContext } from "../context/ProductsContext";
import SearchBar from "../components/SearchBar";
import emptyCart from "../../assets/emptyCart.png";

const PRODUCTS_PER_PAGE = 10;
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const StoreScreen = ({ navigation }) => {
  const { state, listProducts } = useContext(ProductsContext);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState(19);
  const [buttonIndex, setButtonIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [term, setTerm] = useState("");
  const [searchActive, setSearchActive] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [navigation, page]);

  const onTermChange = (term) => {
    setTerm(term);
    !term ? loadProducts() : null;
  };

  const onTermSubmit = async () => {
    if (term) {
      setSearchActive(true);
      setLoading(true);
      await listProducts(category, 1, 100, term);
      setLoading(false);
    }
  };

  // if (term.length > 2) {
  // setFilteredProducts(
  //   state.products.filter((product) => {
  //     return product.name.toLowerCase().includes(term.toLowerCase());
  //     // Object.keys(product).some((k) =>
  //     //   product[k]
  //     //     .toString()
  //     //     .toLowerCase()
  //     //     .includes(term.toLowerCase())
  //     // );
  //   })
  // );
  // } else {
  //   // setFilteredProducts(state.products);
  // }
  // // filteredProducts.length !== 0
  // //   ? setEmptySearch(false)
  // //   : setEmptySearch(true);

  const onFilterChange = async (index) => {
    setLoading(true);
    setButtonIndex(index);
    setTerm(null);
    setPage(1);
    if (index === 1) {
      setCategory(43);
      await listProducts(43, 1, PRODUCTS_PER_PAGE, null);
    } else if (index === 2) {
      setCategory(20);
      await listProducts(20, 1, PRODUCTS_PER_PAGE, null);
    } else if (index === 3) {
      setCategory(21);
      await listProducts(21, 1, PRODUCTS_PER_PAGE, null);
    } else {
      setCategory(19);
      await listProducts(19, 1, PRODUCTS_PER_PAGE, null);
    }
    setLoading(false);
  };

  const onCancelSearch = async () => {
    setLoading(true);
    setTerm(null);
    setPage(1);
    await listProducts(category, 1, PRODUCTS_PER_PAGE);
    setSearchActive(false);
    setLoading(false);
  };

  const renderButtons = () => {
    const buttons = ["Utiles", "Arte & Diseño", "Juegos", "Regalos"];
    return (
      <ButtonGroup
        onPress={onFilterChange}
        selectedIndex={buttonIndex}
        buttons={buttons}
        containerStyle={{
          height: 40,
          marginHorizontal: 15,
          marginVertical: 15,
          borderRadius: 10,
        }}
        textStyle={{ fontSize: 14, fontWeight: "normal" }}
        selectedTextStyle={{ color: "#fff" }}
      />
    );
  };

  const loadMoreProducts = () => {
    if (!state.lastPage) {
      setPage(page + 1);
      setLoadingMore(true);
      // useEffect!
    }
  };

  const loadProducts = async () => {
    !loadingMore ? setLoading(true) : setLoading(false);
    await listProducts(category, page, PRODUCTS_PER_PAGE, null);
    setLoading(false);
    setLoadingMore(false);
  };

  const renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (state.lastPage) return null;
    return <ActivityIndicator style={{ color: "#000" }} />;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() =>
        navigation.navigate("ProductShow", {
          product: item,
          editable: true,
        })
      }
    >
      <View style={styles.view}>
        {item.images.length ? (
          <Image style={styles.image} source={{ uri: item.images[0].src }} />
        ) : null}
        {item.name ? <Text style={styles.text}>{item.name}</Text> : null}
      </View>
    </TouchableOpacity>
  );

  const renderProducts = () => {
    // const productList =
    //   term && filteredProducts ? filteredProducts : state.products;
    const productList = state.products;
    return !loading && productList.length ? (
      <FlatList
        contentContainerStyle={styles.list}
        numColumns={2}
        data={productList}
        keyExtractor={(item) => (Math.random() + item.id).toString()}
        renderItem={renderItem}
        onEndReachedThreshold={0.5}
        onEndReached={!term ? loadMoreProducts : null}
        ListFooterComponent={!term ? renderFooter : null}
      />
    ) : loading ? (
      <View style={styles.loaderContainer}>
        <Image
          source={require("../../assets/cart-loading.gif")}
          style={styles.loaderImage}
        />
      </View>
    ) : (
      <View style={styles.emptySearchView}>
        <Image source={emptyCart} style={{ width: 200, height: 200 }} />
        <Text>Tu bùsqueda no arrojó resultados.</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <Image source={BackgroundImage} style={styles.backgroundImage}></Image> */}
      {renderButtons()}
      <SearchBar
        term={term}
        termChange={onTermChange}
        termSubmit={onTermSubmit}
        cancelSearch={onCancelSearch}
        searchActive={searchActive}
      />
      {renderProducts()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    flexDirection: "column",
    backgroundColor: "white",
  },
  backgroundImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: "cover",
    position: "absolute",
    top: 0,
    left: 0,
  },
  emptySearchView: {
    alignItems: "center",
  },
  list: {
    flexDirection: "column",
  },
  listItem: {
    width: "50%",
  },
  view: {
    padding: 10,
  },
  image: {
    width: 150,
    height: 150,
  },
  text: {
    textAlign: "center",
    fontSize: 16,
    padding: 5,
  },
  loaderContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  loaderImage: {
    width: 200,
    height: 200,
  },
});
export default StoreScreen;
