import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import { Feather } from "@expo/vector-icons";

const SearchBar = ({
  term,
  termChange,
  termSubmit,
  cancelSearch,
  searchActive,
}) => {
  return (
    <View style={styles.backgroundStyle}>
      <Feather size={40} name="search" style={styles.searchIconStyle} />
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.inputStyle}
        placeholder="Buscar"
        value={term}
        onChangeText={termChange}
        onEndEditing={termSubmit}
      />
      {term ? (
        <Button
          buttonStyle={{ flexDirection: "row", alignSelf: "center" }}
          type="clear"
          icon={
            <Feather
              size={30}
              name={searchActive ? "x-circle" : "arrow-right-circle"}
              style={styles.cancelIconStyle}
            />
          }
          onPress={searchActive ? cancelSearch : termSubmit}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: "#f0f0f0",
    opacity: 0.6,
    height: 50,
    borderRadius: 20,
    marginHorizontal: 15,
    flexDirection: "row",
    marginBottom: 10,
    borderColor: "#f0f0f0",
    borderWidth: 1,
  },
  inputStyle: {
    flex: 1,
    fontSize: 18,
  },
  searchIconStyle: {
    fontSize: 35,
    alignSelf: "center",
    marginHorizontal: 15,
  },
  cancelIconStyle: {
    alignSelf: "center",
    color: "grey",
  },
});

export default SearchBar;
