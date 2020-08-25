import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  Text,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { Input, Button, Image, Card, CheckBox } from "react-native-elements";
import WooApi from "../api/woocommerce";

const ProductEditForm = ({ initialValues, submit, cancel }) => {
  const [name, setName] = useState(initialValues.name || "");
  const [description, setDescription] = useState(
    initialValues.description || ""
  );
  const [regular_price, set_regular_price] = useState(
    initialValues.regular_price || ""
  );
  const [sale_price, set_sale_price] = useState(initialValues.sale_price || "");
  const [stock_quantity, set_stock_quantity] = useState(
    initialValues.stock_quantity || ""
  );
  const [currentCategories, setCurrentCategories] = useState(
    initialValues.categories || []
  );
  const [allCategories, setAllCategories] = useState([]);

  const [image, setImage] = useState(initialValues.image || "");

  const [localImage, setLocalImage] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });
      if (!result.cancelled) {
        setLocalImage(result.uri);
      }
    } catch (E) {
      console.log(E);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const getAllCategories = async () => {
    const url = `${WooApi.url.wc}products/categories?consumer_key=${WooApi.keys.consumerKey}&consumer_secret=${WooApi.keys.consumerSecret}`;
    const response = await axios.get(url);
    setAllCategories(response.data);
  };

  const updateCategory = (categoryId, newCategory, categoryArray) => {
    let newCategoryArray = [];
    if (isCategoryChecked(categoryId)) {
      // remove categoryID from categoryArray
      newCategoryArray = categoryArray.filter((category) => {
        return category.id !== categoryId;
      });
      setCurrentCategories(newCategoryArray);
    } else {
      // add categoryID in categoryArray
      newCategoryArray = [...categoryArray, newCategory];
      setCurrentCategories(newCategoryArray);
    }
  };

  const isCategoryChecked = (categoryId) => {
    return currentCategories.length
      ? currentCategories.find((c) => c.id === categoryId)
        ? true
        : false
      : false;
  };

  const renderCategories = () => {
    return allCategories.length
      ? allCategories.map((category) => {
          return (
            <CheckBox
              key={category.id}
              title={category.name}
              checked={isCategoryChecked(category.id)}
              onPress={() =>
                updateCategory(
                  category.id,
                  {
                    id: category.id,
                    name: category.name,
                    slug: category.slug,
                  },
                  currentCategories
                )
              }
            />
          );
        })
      : null;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
      behavior={Platform.OS === "ios" ? "padding" : null}
      enabled
      keyboardVerticalOffset={100}
    >
      <Card>
        <ScrollView
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ alignItems: "center" }}>
            <Image
              source={{ uri: localImage ? localImage : image }}
              style={{ width: 200, height: 200, alignSelf: "center" }}
            />
            {/* <Button
              title="Escoger Nueva Foto"
              onPress={pickImage}
              style={{ margin: 5 }}
            /> */}
          </View>
          <View style={styles.textInput}>
            <Text style={styles.textInputTitle}>Descripción</Text>
            <TextInput
              multiline={true}
              numberOfLines={2}
              label="Nombre"
              value={name}
              onChangeText={setName}
              autoCorrect={false}
              style={styles.textInputArea}
            />
          </View>
          <View style={styles.textInput}>
            <Text style={styles.textInputTitle}>Descripción</Text>
            <TextInput
              multiline={true}
              numberOfLines={4}
              label="Descripción"
              value={description}
              onChangeText={setDescription}
              autoCorrect={false}
              style={styles.textInputArea}
            />
          </View>
          <Input
            label="Precio Regular"
            value={regular_price}
            onChangeText={set_regular_price}
            autoCorrect={false}
          />
          <Input
            label="Precio Oferta"
            value={sale_price}
            onChangeText={set_sale_price}
            autoCorrect={false}
          />
          <Input
            label="Stock"
            value={stock_quantity}
            onChangeText={set_stock_quantity}
            autoCorrect={false}
          />
          <Text style={{ ...styles.textInputTitle, margin: 10 }}>
            Categorías
          </Text>

          {renderCategories()}
          <View style={styles.buttons}>
            <View style={styles.button}>
              <Button
                title="Cancelar"
                buttonStyle={styles.buttonLeft}
                onPress={cancel}
              />
            </View>
            <View style={styles.button}>
              <Button
                title="Actualizar"
                buttonStyle={styles.buttonRight}
                loading={isLoading}
                onPress={() => {
                  const productObject = {
                    name,
                    description,
                    regular_price,
                    sale_price,
                    stock_quantity,
                    categories: currentCategories,
                  };
                  localImage
                    ? submit({
                        ...productObject,
                        image: localImage,
                      })
                    : submit(productObject);
                  setIsLoading(true);
                }}
              />
            </View>
          </View>
        </ScrollView>
      </Card>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  buttons: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  button: { flex: 1 },
  buttonLeft: { margin: 2, backgroundColor: "#dc3545" },
  buttonRight: { margin: 2, backgroundColor: "#28a745" },
  textInput: {
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
    marginBottom: 20,
  },
  textInputArea: { fontSize: 18 },
  textInputTitle: { fontWeight: "bold", fontSize: 16, color: "lightslategray" },
});
export default ProductEditForm;
