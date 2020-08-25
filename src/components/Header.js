import React from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import logo from "../../assets/paperstopLogo.png";

const SCREEN_WIDTH = Dimensions.get("window").width;

const Header = ({ title }) => {
  return (
    <View style={styles.headerView}>
      <Image source={logo} style={styles.headerImage} />
      {/* <Text style={styles.headerText}>{title}</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  headerView: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    justifyContent: "center",
    zIndex: -1000,
  },
  headerImage: {
    resizeMode: "contain",
    width: SCREEN_WIDTH / 3,
    maxHeight: 100,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#3f3f3f",
  },
});

export default Header;
