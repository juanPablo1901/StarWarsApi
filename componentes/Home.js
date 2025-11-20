import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ANewHopeImg from '../assets/StarWars-A-new-Hope.png';
import TheEmpireStrikesBack from '../assets/StarWars-The-Empire-Strikes-Back.png';
import ReturnOfTheJedi from '../assets/StarWars-Return-Of-The-Jedi.png';
import ThePhantomMenace from '../assets/StarWars-The-Phantom-Menace.png';
import AttackOfTheClones from '../assets/StarWars-Attack-Of-The-Clones.png';
import RevengeOfRheSith from '../assets/StarWars-Revenge-Of-The-Sith.png';

const filmImages = {
  "1": ANewHopeImg,
  "2": TheEmpireStrikesBack,
  "3": ReturnOfTheJedi,
  "4": ThePhantomMenace,
  "5": AttackOfTheClones,
  "6": RevengeOfRheSith,
};

export default function Home({ navigation }) {
  const [films, setFilms] = useState([]);
  const [people, setPeople] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const urls = [
          "https://www.swapi.tech/api/films",
          "https://www.swapi.tech/api/people",
          "https://www.swapi.tech/api/vehicles"
        ];

        const responses = await Promise.all(urls.map(u => fetch(u)));
        const jsons = await Promise.all(responses.map(r => r.json()));

        setFilms(jsons[0].result || []);
        setPeople(jsons[1].results || []);
        setVehicles(jsons[2].results || []);

      } catch (e) {
        console.log("Error cargando:", e);
      } finally {
        setCargando(false);
      }
    };

    fetchAll();
  }, []);

  const buscar = (texto) => {
    setQuery(texto);

    if (texto.trim() === "") {
      setResultados([]);
      return;
    }

    const t = texto.toLowerCase();

    const resultadosFiltrados = [
      ...films
        .filter((f) => f.properties?.title?.toLowerCase().includes(t))
        .map((e) => ({ tipo: "film", ...e })),

      ...people
        .filter((p) => p.name?.toLowerCase().includes(t))
        .map((e) => ({ tipo: "person", uid: e.uid, name: e.name })),

      ...vehicles
        .filter((v) => v.name?.toLowerCase().includes(t))
        .map((e) => ({ tipo: "vehicle", uid: e.uid, name: e.name })),
    ];

    setResultados(resultadosFiltrados);
  };

  const navegar = (item) => {
    if (item.tipo === "film") {
      navigation.navigate("Original", { 
        id: item.uid,
        type: "pelicula"  
      
      });
    }
    if (item.tipo === "person") {
      navigation.navigate("Original", { 
        id: item.uid,
        type: "personaje" 
      });
    }
    if (item.tipo === "vehicle") {
      navigation.navigate("Original", { 
        id: item.uid,
        type: "vehiculo"
      });
    }
  };

  if (cargando) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator size="large" color="#FFE81F" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>

      <TextInput
        style={styles.input}
        placeholder="Buscar película, personaje o vehículo..."
        placeholderTextColor="#888"
        value={query}
        onChangeText={buscar}
      />

      {resultados.length > 0 && (
        <ScrollView style={styles.resultadosBox}>
          {resultados.map((item) => (
            <TouchableOpacity
              key={item.uid + item.tipo}
              style={styles.resultItem}
              onPress={() => navegar(item)}
            >
              <Text style={styles.resultText}>
                {item.properties?.title ?? item.name}
                {" "}
                <Text style={styles.tipo}>[{item.tipo}]</Text>
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <ScrollView>
        <View style={styles.lista}>
          {films.map((film) => {
            const id = film.uid;
            const imageSource = filmImages[id];

            return (
              <TouchableOpacity
                key={id}
                style={styles.item}
                onPress={() => navigation.navigate("Original", { 
                  id: id, 
                  type:"pelicula" 
                })}
              >
                <Text style={styles.titulo}>{film.properties.title}</Text>

                <Image source={imageSource} style={styles.imagen} />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "black",
    paddingHorizontal: 10,
  },

  input: {
    backgroundColor: "#1d2437",
    borderWidth: 1,
    borderColor: "#FFE81F",
    borderRadius: 10,
    padding: 12,
    color: "white",
    marginBottom: 10,
  },

  resultadosBox: {
    maxHeight: 250,
    marginBottom: 10,
  },
  resultItem: {
    padding: 10,
    backgroundColor: "#1d2437",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFE81F",
    marginBottom: 8,
  },
  resultText: {
    color: "white",
    fontSize: 16,
  },
  tipo: {
    color: "#27F5F1",
  },

  // Grid de películas
  lista: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  item: {
    backgroundColor: "#1d2437",
    width: "48%",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#FFE81F",
  },
  imagen: {
    width: 150,
    height: 150,
    resizeMode: "cover",
    borderRadius: 10,
    marginTop: 8,
  },
  titulo: {
    color: "#FFE81F",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
});