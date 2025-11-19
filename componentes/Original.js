import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Original({ route }) {
  const { id } = route.params;
  const [film, setFilm] = useState(null);

  useEffect(() => {
    const getFilm = async () => {
      try {
        const res = await fetch(`https://www.swapi.tech/api/films/${id}`);
        const json = await res.json();
        setFilm(json.result.properties);
      } catch (error) {
        console.log("Error al cargar película:", error);
      }
    };

    getFilm();
  }, []);

  if (!film) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#27F5F1" />
        <Text style={styles.loadingText}>Cargando película...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* Imagen */}
        <Image
          source={{ uri: `https://starwars-visualguide.com/assets/img/films/${id}.jpg` }}
          style={styles.imagen}
        />

        {/* Título */}
        <Text style={styles.titulo}>{film.title}</Text>

        {/* Info */}
        <View style={styles.card}>
          <Text style={styles.item}>📆 <Text style={styles.bold}>Fecha:</Text> {film.release_date}</Text>
          <Text style={styles.item}>🎬 <Text style={styles.bold}>Director:</Text> {film.director}</Text>
          <Text style={styles.item}>🎥 <Text style={styles.bold}>Productor:</Text> {film.producer}</Text>
        </View>

        {/* Sinopsis */}
        <Text style={styles.subtitulo}>Sinopsis</Text>
        <Text style={styles.descripcion}>{film.opening_crawl}</Text>

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
    height: 330,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#27F5F1",
  },
  titulo: {
    fontSize: 28,
    color: "#27F5F1",
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
    borderColor: "#27F5F1",
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
