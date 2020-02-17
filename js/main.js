//Se asignan diferentes variables al inicio del juego y empiezan los intervalos
usu = sessionStorage.getItem("usuario");
puntos = 0;
tiempo = 3000;
cont = 0;
cuentatras = [];
pause = false;

document.body.addEventListener("click", function() {
    sonido('laser');
}, false);

puntuaciones = document.cookie.split(";");
puntuacion = setInterval(sumarpuntos, 500);
intervalo = setInterval(create_asteroid, tiempo);

//Se accede a las coockies guardadas para conocer la mejor puntuación del jugador (0 en caso de nuevo jugador), mostrarla por pantalla y ser usada en cuanto la partida finalice
for (j = 0; j < puntuaciones.length; j++) {

    fin = puntuaciones[j].indexOf("=");
    cookie_punt = puntuaciones[j].substring(0, fin);
    cookie_punt = cookie_punt.trim();

    if (cookie_punt == "score_" + usu) {
        puntos_base = puntuaciones[j].substring(puntuaciones[j].indexOf("=") + 1, puntuaciones[j].length);
        document.getElementById("puntuacion_previa").innerHTML = "Puntuación anterior: " + puntos_base;
    }
}

//Función que, mediante el evento onmouseover en el body, asigna un ancho y un alto a un par de divs que hacen el efecto de mirilla para apuntar
function position(x) {
    evn_web_x = window.event.clientX || x.clientX;
    evn_web_y = window.event.clientY || x.clientY;

    document.getElementById("xaxis").style.width = evn_web_x + "px";
    document.getElementById("yaxis").style.height = evn_web_y + "px";
}

//Función que crea asteroides; estos son imágenes con animación que son situados en un lugar aleatorio dentro del body. Cada asteroide tiene asignado un id y mediante variables dinámicas una cuenta atrás cuya única manera de desactivarla es pulsando sobre la imagen
function create_asteroid() {

    cont = cont + 1;
    var w = window.innerWidth;
    var h = window.innerHeight;

    var randomW = Math.floor(Math.random() * w);
    var randomH = Math.floor(Math.random() * h);

    var asteroid = document.createElement("IMG");
    asteroid.setAttribute("src", "img/asteroid.png");
    asteroid.setAttribute("id", cont);
    document.body.appendChild(asteroid);

    document.getElementById(cont).style.top = randomH + "px";
    document.getElementById(cont).style.right = randomW + "px";
    document.getElementById(cont).onclick = function() { delete_asteroid(this); };


    cuentatras[cont] = window.setTimeout(function() {
        pausar();
        setTimeout(() => {
            game_over();
        }, 100);
    }, 5000);
}

//Función que elimina el asteroide y su contador
function delete_asteroid(objeto) {
    sonido('expl');
    asteroid = document.getElementById(objeto.id);
    asteroid.parentNode.removeChild(asteroid);
    clearTimeout(cuentatras[objeto.id]);
}

//Función que espera la entrada de las letra P (para activar la función pausar) y R (para la función reanudar)
function letra(evento) {
    evn_keycode = window.event.keyCode || evento.keyCode;
    evn_code = String.fromCharCode(evn_keycode)

    if (evn_keycode == 80) {
        pausar();
    }

    if (evn_keycode == 82) {
        reanudar();
    }
}

//Función que detiene las animaciones y los intervalos, además muestra un cartel al usuario
function pausar() {
    document.getElementById("pausado").style.display = "inline";
    document.getElementById("separador").style.display = "none";
    clearInterval(puntuacion);
    clearInterval(intervalo);
    asteroids = document.getElementsByTagName("img");
    if (pause == false) {
        puntos = puntos / 2;
    }
    for (i = 0; i < asteroids.length; i++) {
        asteroid = asteroids[i];
        clearInterval(cuentatras[asteroid.id])
        asteroid.style.animationPlayState = "paused";
    }
    pause = true;
}

//Función que reanuda las animaciones y los intervalos
function reanudar() {
    if (pause == true) {
        document.getElementById("pausado").style.display = "none";
        document.getElementById("separador").style.display = "none";
        puntuacion = setInterval(sumarpuntos, 500);
        intervalo = setInterval(create_asteroid, tiempo);
        asteroids = document.getElementsByTagName("img");

        for (i = 1; i < asteroids.length; i++) {
            asteroid = asteroids[i];
            cuentatras[asteroid.id] = window.setTimeout(function() {
                pausar();
                game_over();
            }, 5000);
            asteroid.style.animationPlayState = "running";
            pause = false;
        }
    }
}

//Función que, en relación al tiempo transcurrido, va sumando puntos; cuando llega a ciertas cantidades acelera el tiempo de los intervalos de creación de asteroides para aumentar su dificultad
function sumarpuntos() {
    puntos = puntos + 1;
    document.getElementById("puntuacion_actual").innerHTML = "Puntos: " + puntos;
    if (puntos == 20) {
        tiempo = 2000;
        clearInterval(intervalo)
        intervalo = setInterval(create_asteroid, tiempo);
    }

    if (puntos == 50) {
        tiempo = 800;
        clearInterval(intervalo)
        intervalo = setInterval(create_asteroid, tiempo);
    }

    if (puntos == 70) {
        tiempo = 450;
        clearInterval(intervalo)
        intervalo = setInterval(create_asteroid, tiempo);
    }
}

//Función que detiene el conteo de puntos y comprueba la puntuación final: de ser mayor a la máxima del usuario la registra como su mejor record. Tras unos segundos vuelve a la pantalla de inicio
function game_over() {
    puntos = puntos * 2;
    document.getElementById("imagen_rota").style.display = "inline"
    clearInterval(puntuacion);
    document.getElementById("game_over").style.display = "inline";

    if (puntos_base < puntos) {
        document.cookie = "score_" + usu + "=" + puntos + "; expires=Mon, 1 Jun 2020 12:00:00 UTC";
        document.getElementById("game_over").innerHTML = "<h1>HAS PERDIDO</h1><br><h3>NUEVO RECORD REGISTRADO</h3>";
    } else {
        document.getElementById("game_over").innerHTML = "<h1>HAS PERDIDO</h1><br><h3>NO HAS SUPERADO TU MEJOR RECORD</h3>";
    }
    setTimeout(() => {
        window.location.href = "index.html";
    }, 5000);
}

function sonido(valor) {
    var audio = new Audio('./sound/laser.mp3');
    audio.play();
    if (valor == "expl") {
        audio = new Audio('./sound/explosion.wav');
        audio.play();
    }
}