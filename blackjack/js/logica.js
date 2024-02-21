if (document.addEventListener) {
    window.addEventListener("load", comienzo);
} else if (document.attachEvent) {
    window.attachEvent("onload", comienzo);
}

var cartas = ["1P", "2P", "3P", "4P", "5P", "6P", "7P", "8P", "9P", "XP", "JP", "QP", "KP",
    "1C", "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "XC", "JC", "QC", "KC",
    "1T", "2T", "3T", "4T", "5T", "6T", "7T", "8T", "9T", "XT", "JT", "QT", "KT",
    "1D", "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "XD", "JD", "QD", "KD"
];
var cont = 0;
var puntuacionJug = 0;
var puntuacionIA = 0;
var seguir = true;

function comienzo() {
    shuffleArray(cartas);
    let reglas = document.getElementById("reglas");
    let cerrar = document.getElementById("cerrar");
    let carta = document.getElementById("carta");
    let plantarse = document.getElementById("plantarse");
    let Njuego = document.getElementById("juego");

    reglas.addEventListener("click", abrir_dialogo);
    cerrar.addEventListener("click", cerrar_dialogo);
    carta.addEventListener("click", jugador);
    plantarse.addEventListener("click", juegoIA);
    Njuego.addEventListener("click", nuevoJuego);
}

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
    let mazoIA = document.getElementById("mazoIA");
    removeAllChildNodes(mazo);
    removeAllChildNodes(mazoIA);
}

function abrir_dialogo() {
    document.getElementById("dialogo").setAttribute("open", "true");
}

function cerrar_dialogo() {
    document.getElementById("dialogo").removeAttribute("open");
}

function shuffleArray(inputArray) {
    inputArray.sort(() => Math.random() - 0.5);
}

function jugador() {
    if (puntuacionJug >= 21) {
        document.getElementById("carta").setAttribute("disabled", "true");
    } else {
        repartirCarta()
            .then(() => {
                if (puntuacionJug >= 21) {
                    document.getElementById("carta").setAttribute("disabled", "true");
                }
            })
            .catch(error => console.error(error));
    }
}

function repartirCarta() {
    return new Promise((resolve, reject) => {
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
        resolve();
    });
}

function juegoIA() {
    document.getElementById("carta").setAttribute("disabled", "true");
    document.getElementById("plantarse").setAttribute("disabled", "true");
    document.getElementById("juego").removeAttribute("disabled");
    (function loop() {
        if (seguir) {
            if ((puntuacionIA >= 18 || puntuacionIA > puntuacionJug) || (puntuacionJug > 21 && puntuacionIA > 0)) {
                seguir = false;
                resultados();
            } else {
                repartirCarta()
                    .then(() => {
                        if ((puntuacionIA >= 18 || puntuacionIA > puntuacionJug) || (puntuacionJug > 21 && puntuacionIA > 0)) {
                            seguir = false;
                            resultados();
                        } else {
                            setTimeout(loop, 1000);
                        }
                    })
                    .catch(error => console.error(error));
            }
        }
    })();
}

function puntos() {
    let puntuacion = cartas[cont].substring(0, 1);
    if (isNaN(puntuacion) == true) puntuacion = 10;
    cont++;
    return Number(puntuacion);
}

function resultados() {
    console.log("PUNTUACION JUG -> " + puntuacionJug + "  PUNTUACION MAQ -> " + puntuacionIA);
    let mensaje = "";
    if ((puntuacionJug > puntuacionIA && puntuacionJug <= 21) || (puntuacionIA > 21 && puntuacionJug <= 21)) {
        mensaje = "Ganaste! Tu sí que sabes.";
    } else if ((puntuacionIA > puntuacionJug && puntuacionIA <= 21) || (puntuacionJug > 21 && puntuacionIA <= 21)) {
        mensaje = "Pierdes! Inténtalo otra vez.";
    } else if (puntuacionIA == puntuacionJug && puntuacionIA <= 21 && puntuacionJug <= 21) {
        mensaje = "Empate! Qué casualidad.";
    }
    Swal.fire({
        title: mensaje,
        text: "",
        imageUrl: "",
        imageWidth: 400,
        imageHeight: 200,
        confirmButtonText: 'Cerrar'
    });
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
