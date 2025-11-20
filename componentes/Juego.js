import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Firebase
import { getAuth } from "firebase/auth";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export default function Juego() {

  // Nombre del usuario
  const [nombreUsuario, setNombreUsuario] = useState("");

  // 10 preguntas de Star Wars
  const preguntasTrivia = [
    { pregunta: "¿En qué año se estrenó 'A New Hope'?", 
      opciones: ["1977", "1983", "1999", "2005"], 
      correcta: "1977" 
    },
    { pregunta: "¿Quién dirigió 'The Empire Strikes Back'?", 
      opciones: ["Irvin Kershner", "George Lucas", "J.J. Abrams", "Rian Johnson"], 
      correcta: "Irvin Kershner" 
    },
    { pregunta: "¿Cuántas películas hay en la saga principal?", 
      opciones: ["6", "9", "11", "12"], 
      correcta: "9" 
    },
    { pregunta: "¿Cómo se llama el padre de Luke Skywalker?", 
      opciones: ["Anakin", "Obi-Wan", "Han", "Palpatine"], 
      correcta: "Anakin" 
    },
    { pregunta: "¿Cuál es el nombre del planeta natal de Leia?", 
    opciones: ["Alderaan", "Tatooine", "Naboo", "Hoth"], 
    correcta: "Alderaan" 
    },
    { pregunta: "¿Quién creó a C-3PO?", 
      opciones: ["Anakin", "Luke", "Obi-Wan", "Nadie sabe"], 
      correcta: "Anakin" 
    },
    { pregunta: "¿Qué especie es Chewbacca?", 
      opciones: ["Wookiee", "Ewok", "Rodiano", "Humano"], 
      correcta: "Wookiee" 
    },
    { pregunta: "¿Qué color es el sable de Mace Windu?", 
      opciones: ["Verde", "Rojo", "Morado", "Azul"], 
      correcta: "Morado" 
    },
    { pregunta: "¿Quién dijo la frase: “I am your father”?", 
      opciones: ["Darth Vader", "Yoda", "Luke", "Obi-Wan"], 
      correcta: "Darth Vader" 
    },
    { pregunta: "¿Qué personaje aparece primero en pantalla en 'A New Hope'?", 
      opciones: ["Leia", "C-3PO", "Luke", "Darth Vader"], 
      correcta: "C-3PO"
     },
    { pregunta: "¿Cuál es el número de episodio de la primera película de Star Wars?", 
      opciones: ["III", "I", "IV", "VI"], 
      correcta: "IV"
    },
    { pregunta: "¿Cuál era el nombre Sith de Conde Dooku?", 
      opciones: ["Dark Maul", "Darth Sidious", "Darth Revan", "Darth Tyranus"], 
      correcta: "Darth Tyranus" 
    },
    { pregunta: "¿Cuál iba a ser el apellido original de Luke Skywalker?", 
      opciones: ["Starkiller", "Morningstar", "Hamil", "Starseeker"], 
      correcta: "Starkiller" 
    },
    { pregunta: "¿Quién mató a Jabba el Hutt?", 
      opciones: ["Han solo", "Luke Skywalker", "Princesa Leia", "Boba Fett"], 
      correcta: "Princesa Leia" 
    },
    { pregunta: "¿Quién dijo la famosa frase “Estos no son los droides que están buscando”?", 
      opciones: ["Luke", "Han", "Anakin", "Obi-Wan"], 
      correcta: "Obi-Wan" 
    },
  ];

  const [preguntas, setPreguntas] = useState([]);
  const [actual, setActual] = useState(0);
  const [correctas, setCorrectas] = useState(0);
  const [incorrectas, setIncorrectas] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  // 🔁 Mezclar arrays
  const shuffle = (array) => {
    return array
      .map((a) => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map((a) => a[1]);
  };

  // Cargar nombre de usuario desde Firebase
  useEffect(() => {
    const cargarNombre = async () => {
      try {
        const user = getAuth().currentUser;
        if (!user) return;

        const ref = doc(db, "usuarios", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setNombreUsuario(snap.data().nombre);
        } else {
          setNombreUsuario("Invitado");
        }
      } catch (e) {
        console.log("Error cargando nombre:", e);
      }
    };

    cargarNombre();
  }, []);

  // 🔥 Mezclar preguntas al iniciar
  useEffect(() => {
    const mezcladas = shuffle(preguntasTrivia).map((p) => ({
      ...p,
      opciones: shuffle(p.opciones),
    }));
    setPreguntas(mezcladas);
  }, []);

  // Guardar resultados en Firebase al terminar
  const guardarResultados = async () => {
    try {
      await addDoc(collection(db, "triviaResultados"), {
        uid: getAuth().currentUser.uid,
        nombre: nombreUsuario,
        correctas,
        incorrectas,
        total: preguntas.length,
        fecha: serverTimestamp(),
      });
      console.log("Resultados guardados");
    } catch (e) {
      console.log("Error al guardar:", e);
    }
  };

  // Cuando el usuario responde
  const manejarRespuesta = (opcion) => {
    const esCorrecta = opcion === preguntas[actual].correcta;

    if (esCorrecta) setCorrectas(correctas + 1);
    else setIncorrectas(incorrectas + 1);

    if (actual + 1 < preguntas.length) {
      setActual(actual + 1);
    } else {
      setFinalizado(true);
      guardarResultados();
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Mostrar nombre del usuario */}
        <Text style={styles.nombre}>Jugador: {nombreUsuario}</Text>

        {/* Pantalla final */}
        {finalizado ? (
          <View style={styles.resultadoContainer}>
            <Text style={styles.titulo}>Resultados</Text>

            <Text style={styles.puntaje}>
              Puntuación: {correctas} / {preguntas.length}
            </Text>

            <Text style={styles.correctas}>Correctas: {correctas}</Text>
            <Text style={styles.incorrectas}>Incorrectas: {incorrectas}</Text>

            <TouchableOpacity
              style={styles.botonReiniciar}
              onPress={() => {
                const nuevamente = shuffle(preguntasTrivia).map((p) => ({
                  ...p,
                  opciones: shuffle(p.opciones),
                }));
                setPreguntas(nuevamente);
                setActual(0);
                setCorrectas(0);
                setIncorrectas(0);
                setFinalizado(false);
              }}
            >
              <Text style={styles.textoBoton}>Reiniciar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.contador}>
              Pregunta {actual + 1} / {preguntas.length}
            </Text>

            {preguntas[actual] && (
              <>
                <Text style={styles.pregunta}>{preguntas[actual].pregunta}</Text>

                {preguntas[actual].opciones.map((op, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.boton}
                    onPress={() => manejarRespuesta(op)}
                  >
                    <Text style={styles.textoBoton}>{op}</Text>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: "#0d1117" 
  },
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: "center" 
  },

  nombre: { 
    color: "#fff", 
    fontSize: 20, 
    marginBottom: 10, 
    textAlign: "center" 
  },

  contador: { 
    color: "white", 
    fontSize: 18, 
    marginBottom: 10 
  },
  pregunta: { 
    color: "white", 
    fontSize: 22, 
    marginBottom: 20 
  },

  boton: {
    backgroundColor: "#FFE81F",
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
  },
  textoBoton: { 
    textAlign: "center", 
    fontWeight: "bold" 
  },

  resultadoContainer: { 
    alignItems: "center" 
  },
  titulo: { 
    fontSize: 30, 
    color: "white", 
    marginBottom: 20 
  },
  puntaje: { 
    fontSize: 22, 
    color: "#fff", 
    marginBottom: 10 
  },
  correctas: { 
    color: "lightgreen", 
    fontSize: 18 
  },
  incorrectas: { 
    color: "red", 
    fontSize: 18 
  },
  botonReiniciar: {
    marginTop: 25,
    backgroundColor: "#FFE81F",
    padding: 12,
    borderRadius: 8,
  }
});
