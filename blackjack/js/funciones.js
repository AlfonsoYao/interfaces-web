// Verifica si el navegador soporta addEventListener o attachEvent
if (document.addEventListener) {
    window.addEventListener("load", comienzo);
} else if (document.attachEvent) {
    window.attachEvent("onload", comienzo);
}

// Array de cartas
var cartas = ["1P", "2P", "3P", "4P", "5P", "6P", "7P", "8P", "9P", "XP", "JP", "QP", "KP",
    "1C", "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "XC", "JC", "QC", "KC",
    "1T", "2T", "3T", "4T", "5T", "6T", "7T", "8T", "9T", "XT", "JT", "QT", "KT",
    "1D", "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "XD", "JD", "QD", "KD"
];

// Inicialización de variables
var cont = 0;
var puntuacionJug = 0;
var puntuacionIA = 0;
var seguir = true;

// Función principal para iniciar el juego
function comienzo() {
    // Mezcla las cartas
    shuffleArray(cartas);

    // Obtiene los elementos del DOM
    /*let reglas = document.getElementById("reglas");*/
    let cerrar = document.getElementById("cerrar");
    let carta = document.getElementById("carta");
    let plantarse = document.getElementById("plantarse");
    let Njuego = document.getElementById("juego");

    // Asigna manejadores de eventos a los elementos
    if (document.addEventListener) {
       /* reglas.addEventListener("click", abrir_dialogo);
        cerrar.addEventListener("click", cerrar_dialogo);*/
        carta.addEventListener("click", jugador);
        plantarse.addEventListener("click", juegoIA);
        Njuego.addEventListener("click", nuevoJuego);
    } else if (document.attachEvent) {
        reglas.attachEvent("onclick", abrir_dialogo);
        cerrar.attachEvent("onclick", cerrar_dialogo);
        carta.attachEvent("onclick", jugador);
        plantarse.attachEvent("onclick", juegoIA);
        Njuego.attachEvent("onclick", nuevoJuego);
    }
}

// Reinicia el juego
function nuevoJuego() {
    puntuacionJug = 0;
    puntuacionIA = 0;
    cont = 0;
    seguir = true;
    shuffleArray(cartas);
    document.getElementById("carta").removeAttribute("disabled");
    document.getElementById("plantarse").removeAttribute("disabled");
    document.getElementById("juego").setAttribute("disabled", "false");
    let mazo = document.getElementById("mazo");
    while (mazo.firstChild) {
        mazo.removeChild(mazo.firstChild);
    }
    let mazoIA = document.getElementById("mazoIA");
    while (mazoIA.firstChild) {
        mazoIA.removeChild(mazoIA.firstChild);
    }
    let resultado = document.getElementById("resultado").innerHTML = '';
}

// Muestra el diálogo de reglas
function abrir_dialogo() {
    document.getElementById("dialogo").setAttribute("open", "true");
}

// Cierra el diálogo de reglas
function cerrar_dialogo() {
    document.getElementById("dialogo").removeAttribute("open");
}

// Mezcla las cartas en el array
function shuffleArray(inputArray) {
    inputArray.sort(() => Math.random() - 0.5);
}

// Manejador de evento para tomar una carta
function jugador() {
    if (puntuacionJug >= 21) {
        document.getElementById("carta").setAttribute("disabled", "true");
    } else {
        repartirCarta();
    }
}

// Reparte una carta al jugador
function repartirCarta() {
    let mazo = document.getElementById("mazo");
    let nuevo = document.createElement("img");
    nuevo.src = "img/" + cartas[cont] + ".png";
    mazo.appendChild(nuevo);
    console.log("CARTA GENERADA -> " + cartas[cont]);
    point = puntos();
    if (puntuacionJug == 0 && point == 1) {
        puntuacionJug = puntuacionJug + point + 10;
    } else {
        puntuacionJug = puntuacionJug + point;
    }
}

// Lógica de la IA para jugar
function juegoIA() {
    document.getElementById("carta").setAttribute("disabled", "true");
    document.getElementById("plantarse").setAttribute("disabled", "true");
    document.getElementById("juego").removeAttribute("disabled");
    while (seguir) {
        if ((puntuacionIA >= 18 || puntuacionIA > puntuacionJug) || (puntuacionJug > 21 && puntuacionIA > 0)) {
            seguir = false;
        } else {
            let mazo = document.getElementById("mazoIA");
            let nuevo = document.createElement("img");
            nuevo.src = "img/" + cartas[cont] + ".png";
            mazo.appendChild(nuevo);
            console.log("CARTA GENERADA -> " + cartas[cont]);
            point = puntos();
            if (puntuacionIA == 0 && point == 1) {
                puntuacionIA = puntuacionIA + point + 10;
            } else {
                puntuacionIA = puntuacionIA + point;
            }
        }
    }
    if (seguir == false) {
        resultados();
    }
}

// Determina el valor numérico de una carta
function puntos() {
    let puntuacion = cartas[cont].substring(0, 1);
    if (isNaN(puntuacion) == true) puntuacion = 10;
    cont++;
    return Number(puntuacion);
}

// Función para esperar un tiempo determinado
function esperar(tiempo) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, tiempo);
    });
}

// Muestra los resultados del juego y espera 3 segundos antes de iniciar un nuevo juego
async function resultados() {
    console.log("PUNTUACION JUG -> " + puntuacionJug + "  PUNTUACION MAQ -> " + puntuacionIA);
    let mensaje = "";
    let imagen = "";
    if ((puntuacionJug > puntuacionIA && puntuacionJug <= 21) || (puntuacionIA > 21 && puntuacionJug <= 21)) {
        // Ganó el jugador
        mensaje = "Ganaste!";
        imagen = "./img/agua.gif";
        console.log("Gana el jugador");
    } else if ((puntuacionIA > puntuacionJug && puntuacionIA <= 21) || (puntuacionJug > 21 && puntuacionIA <= 21)) {
        // Ganó la máquina
        mensaje = "Perdiste!";
        imagen = "./img/win.gif";
        console.log("Gana la Máquina");
    } else if (puntuacionIA == puntuacionJug && puntuacionIA <= 21 && puntuacionJug <= 21) {
        // Empate
        mensaje = "Empate!";
        imagen = "./img/empate.gif";
        console.log("Empate");
    }

    await Swal.fire({
        title: mensaje,
        text: mensaje === "Ganaste!" ? "A donde vas tan basado? 🥵🔥" : mensaje === "Perdiste!" ? "Aprende a jugar manco" : "Qué casualidad.",
        imageUrl: imagen,
        imageWidth: 400,
        imageHeight: 200,
        confirmButtonText: 'Cerrar'
    });

    // Espera 3 segundos antes de iniciar un nuevo juego
    await esperar(3000);

    // Inicia un nuevo juego
    nuevoJuego();
}


