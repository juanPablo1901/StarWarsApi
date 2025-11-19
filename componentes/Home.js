import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ANewHopeImg from '../assets/StarWars-A-new-Hope.png';
import TheEmpireStrikesBack from '../assets/StarWars-The-Empire-Strikes-Back.png'
import ReturnOfTheJedi from '../assets/StarWars-Return-Of-The-Jedi.png'
import ThePhantomMenace from '../assets/StarWars-The-Phantom-Menace.png'
import AttackOfTheClones from '../assets/StarWars-Attack-Of-The-Clones.png'
import RevengeOfRheSith from '../assets/StarWars-Revenge-Of-The-Sith.png'



export default function Home({ navigation }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getFilms = async () => {
      const res = await fetch("https://www.swapi.tech/api/films");
      const json = await res.json();
      setData(json.result);
    };
    getFilms();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>

      <ScrollView>
        <View style={styles.lista}>
          {data.map((film) => {
            const id = film.uid;

            const imageSource =
            
                id === "1"
                ? ANewHopeImg : { uri: ''};

                id === "2"
                ? TheEmpireStrikesBack : { uri: ""};

                id === "3"
                ? ReturnOfTheJedi : { uri: ""};

                id === "4"
                ? ThePhantomMenace : { uri: ""};

                id === "5"
                ? AttackOfTheClones : {uri: ""};

                id === "6"
                ? RevengeOfRheSith : {uri: ""};


            return (
              <TouchableOpacity
                key={id}
                style={styles.item}
                onPress={() => navigation.navigate("Original", { id })}
              >
                <Text style={styles.titulo}>{film.properties.title}</Text>

                <Image source={imageSource} style={styles.imagen}/>
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
    backgroundColor: "black", // Para unir con tus tarjetas
    paddingHorizontal: 0,
  },
  lista: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
    padding: 10,
  },
  item: {
    backgroundColor: '#1d2437',
    width: '48%',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#27F5F1'
  },
  imagen: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 10,
  },
  titulo: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 5,
  }
});


