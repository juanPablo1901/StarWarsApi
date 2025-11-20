import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

// Importa tus imágenes
import ANewHopeImg from '../assets/StarWars-A-new-Hope.png';
import TheEmpireStrikesBack from '../assets/StarWars-The-Empire-Strikes-Back.png';
import ReturnOfTheJedi from '../assets/StarWars-Return-Of-The-Jedi.png';
import ThePhantomMenace from '../assets/StarWars-The-Phantom-Menace.png';
import AttackOfTheClones from '../assets/StarWars-Attack-Of-The-Clones.png';
import RevengeOfRheSith from '../assets/StarWars-Revenge-Of-The-Sith.png';

// Mapa id → imagen
const filmImages = {
  "1": ANewHopeImg,
  "2": TheEmpireStrikesBack,
  "3": ReturnOfTheJedi,
  "4": ThePhantomMenace,
  "5": AttackOfTheClones,
  "6": RevengeOfRheSith,
};

export default function Original({ route }) {
  const navigation = useNavigation();

  const { id, type } = route.params || {};

  const [data, setData] = useState(null);

  // 🔥 VALIDACIÓN CORRECTA
  useEffect(() => {
    if (!id || !type) {
      Alert.alert(
        "Error",
        "No se encontraron datos válidos. Te regresamos al inicio.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Home"),
          },
        ]
      );
    }
  }, []);

  // URL dinámica según tipo
  const apiURL = {
    pelicula: `https://www.swapi.tech/api/films/${id}`,
    personaje: `https://www.swapi.tech/api/people/${id}`,
    vehiculo: `https://www.swapi.tech/api/vehicles/${id}`,
  };

  useEffect(() => {
    if (!id || !type) return;

    const getData = async () => {
      try {
        const res = await fetch(apiURL[type]);
        const json = await res.json();

        if (!json?.result?.properties) {
          Alert.alert(
            "Error",
            "No se encontró información. Volvemos al inicio.",
            [{ 
              text: "OK", 
              onPress: () => navigation.navigate("Home") 
            }]
          );
          return;
        }

        setData(json.result.properties);
      } catch (error) {
        console.log("Error cargando datos:", error);
        Alert.alert(
          "Error",
          "Hubo un problema cargando los datos.",
          [{ text: "OK", onPress: () => navigation.navigate("Home") }]
        );
      }
    };

    getData();
  }, [id, type]);

  if (!data) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#27F5F1" />
        <Text style={styles.loadingText}>Cargando información...</Text>
      </SafeAreaView>
    );
  }

  // Imagen solo para películas
  const imageSource = type === "pelicula" ? filmImages[String(id)] : null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Imagen */}
        {imageSource && <Image source={imageSource} style={styles.imagen} />}

        {/* Título */}
        <Text style={styles.titulo}>{data.title || data.name}</Text>

        {/* --- Películas --- */}
        {type === "pelicula" && (
          <>
            <View style={styles.card}>
              <Text style={styles.item}>📆 <Text style={styles.bold}>Fecha:</Text> {data.release_date}</Text>
              <Text style={styles.item}>🎬 <Text style={styles.bold}>Director:</Text> {data.director}</Text>
              <Text style={styles.item}>🎥 <Text style={styles.bold}>Productor:</Text> {data.producer}</Text>
            </View>

            <Text style={styles.subtitulo}>Sinopsis</Text>
            <Text style={styles.descripcion}>{data.opening_crawl}</Text>
          </>
        )}

        {/* --- Personaje --- */}
        {type === "personaje" && (
          <View style={styles.card}>
            <Text style={styles.item}>📏 Altura: {data.height}</Text>
            <Text style={styles.item}>⚖️ Peso: {data.mass}</Text>
            <Text style={styles.item}>🚻 Género: {data.gender}</Text>
            <Text style={styles.item}>👁️ Ojos: {data.eye_color}</Text>
            <Text style={styles.item}>🎂 Nacimiento: {data.birth_year}</Text>
          </View>
        )}

        {/* --- Vehículo --- */}
        {type === "vehiculo" && (
          <View style={styles.card}>
            <Text style={styles.item}>🚘 Modelo: {data.model}</Text>
            <Text style={styles.item}>🏭 Fabricante: {data.manufacturer}</Text>
            <Text style={styles.item}>💰 Costo: {data.cost_in_credits}</Text>
            <Text style={styles.item}>⚡ Velocidad: {data.max_atmosphering_speed}</Text>
            <Text style={styles.item}>🧍 Pasajeros: {data.passengers}</Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0d0f16", // Oscuro elegante
  },
  scroll: {
    padding: 15,
    paddingBottom: 60,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0d0f16",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    marginTop: 15,
    fontSize: 16,
  },
  imagen: {
    width: "100%",
    height: 550,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FFE81F",
  },
  titulo: {
    fontSize: 28,
    color: "#FFE81F",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#1d2437",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FFE81F",
  },
  item: {
    color: "#eee",
    fontSize: 16,
    marginBottom: 8,
  },
  bold: {
    fontWeight: "bold",
    color: "#27F5F1",
  },
  subtitulo: {
    fontSize: 20,
    color: "#27F5F1",
    fontWeight: "bold",
    marginBottom: 10,
  },
  descripcion: {
    color: "#ccc",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 40,
  },
});
