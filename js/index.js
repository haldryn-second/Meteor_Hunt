//Recogemos en variables las etiquetas labels que serán rellenadas con los posibles errores en el formulario
label_reg = document.getElementById("label_reg");
label_ing = document.getElementById("label_ing");

//Función que, mediante el uso de 3 expresiones regulares, valida los datos introducidos en los campos del formulario de registro. En caso de validación correcta, los datos del usuario pasan a registrarse en forma de cookie y se crea una variable de sesión con su nombre
function validar() {

    label_reg.innerHTML = "";
	
	
	///////////////EXPRESIONES REGULARES///////////////

    expreg_nombre = new RegExp(/^[A-Z]{3}$/);
    nombre = document.getElementById("nom_usu").value
    expreg_contra = new RegExp(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.{6,})/);
    contra = document.getElementById("passw").value;
    expreg_correo = new RegExp(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/);
    correo = document.getElementById("correo").value;

    document.getElementById("nom_usu").style.borderColor = "";
    document.getElementById("passw").style.borderColor = "";
    document.getElementById("correo").style.borderColor = "";

    fallos = 0;

    if (!expreg_nombre.test(nombre)) {
        document.getElementById("nom_usu").value = "";
        document.getElementById("nom_usu").style.borderColor = "red";
        fallos = fallos + 1;
    }

    if (!expreg_contra.test(contra)) {
        document.getElementById("passw").value = "";
        document.getElementById("passw").style.borderColor = "red";
        fallos = fallos + 1;
    }

    if (!expreg_correo.test(correo)) {
        document.getElementById("correo").value = "";
        document.getElementById("correo").style.borderColor = "red";
        fallos = fallos + 1;
    }

    if (fallos > 0) return false;
    else {
        var usu = document.getElementById("nom_usu").value;
		///////////////USO DE COOKIES///////////////
        if (buscar_usu_simple(usu) == false) {
            createCookie(usu, usu);
            createCookie("pass_" + usu, document.getElementById("passw").value);
            createCookie("score_" + usu, 0);
            sessionStorage.setItem("usuario", usu);
            return true;
        } else {
            label_reg.innerHTML = "Usuario ya existente";
            return false;
        }
    }
}

///////////////USO DE COOKIES///////////////
//Función que añade datos al archivo cookies que expiran en varios meses
function createCookie(cookieName, cookieValue) {
    document.cookie = cookieName + "=" + cookieValue + "; expires=Mon, 1 Jun 2020 12:00:00 UTC";
}

///////////////USO DE COOKIES///////////////
//Función que busca si un usuario existe o no en el archivo cookies
function buscar_usu() {
    label_ing.innerHTML = "";

    nombre_usu = document.getElementById("nom_usu_reg").value;
    contra_usu = document.getElementById("passw_usu_reg").value;

    encontrado = false;
    cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {

        fin = cookies[i].indexOf("=");
        nombre_cookie = cookies[i].substring(0, fin);
        nombre_cookie = nombre_cookie.trim();

        if (nombre_usu == nombre_cookie) {
            if (buscar_contra(nombre_usu, contra_usu) == true) {
                return true;
            } else {
                return false;
            }
            encontrado = true;
        }
    }

    if (!encontrado) {
        label_ing.innerHTML = "El usuario no existe";
        return false
    }
}

///////////////USO DE COOKIES///////////////
//Función similar a la anterior pero en cuanto encuentra si el usuario existe o no en las cookies devuelve un true o false
function buscar_usu_simple(nombre_usu) {
    encontrado = false;
    cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {

        fin = cookies[i].indexOf("=");
        nombre_cookie = cookies[i].substring(0, fin);
        nombre_cookie = nombre_cookie.trim();

        if (nombre_usu == nombre_cookie) {
            encontrado = true
        }
    }
    if (encontrado == true) return true;
    else return false;
}

///////////////USO DE COOKIES///////////////
//Función que a partir de un nombre de usuario y una contraseña, busca en el registro de cookies si ambos coinciden, en caso afirmativo, el formulario es validado y se crea una variable de sesión con el nombre del usuario
function buscar_contra(nombre_usu, contra_usu) {
    encontrado = false;
    contra = "pass_" + nombre_usu + "=" + contra_usu;

    cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {

        if (cookies[i].trim() == contra) {
            puntuaciones = document.cookie.split(";");
            for (j = 0; j < puntuaciones.length; j++) {

                fin = cookies[j].indexOf("=");
                cookie_punt = cookies[j].substring(0, fin);
                cookie_punt = cookie_punt.trim();
                if (cookie_punt == "score_" + nombre_usu) {
                    sessionStorage.setItem("usuario", usu);
                }
            }
            encontrado = true;
            return true;
        }
    }
    if (!encontrado) {
        label_ing.innerHTML = "Contraseña incorrecta";
        return false;
    }
}


///////////////VALIDACIÓN DE TECLAS PULSADAS///////////////
//Funciones que filtran carácteres que son pasados por eventos de teclado
function letra_usu(evento) {
    evn_char = window.event.charCode || evento.charCode;
    if (((evn_char <= 90) && (evn_char >= 65))) return true;
    else return false;
}

function letra_pass(evento) {
    evn_char = window.event.charCode || evento.charCode;
    if (((evn_char <= 90) && (evn_char >= 65)) || ((evn_char <= 122) && (evn_char >= 97)) || ((evn_char <= 57) && (evn_char >= 48))) return true;
    else return false;
}


//Función que muestra el formulario deseado: registrarse o volver a jugar
function reg_ing(valor) {
    switch (valor) {
        case 1:
            document.getElementById("reg").style.display = "none";
            document.getElementById("ing").style.display = "inline";
            break;
        case 2:
            document.getElementById("reg").style.display = "inline";
            document.getElementById("ing").style.display = "none";
            break;
    }
}

///////////////USO DE COOKIES///////////////
//Función extra para comprobar que las cookies se guardaban correctamente durante las diversas fases de prueba
function mostrar_cook() {
    texto = "";
    cookies = document.cookie.split(";");
    if (cookies.length > 1) {
        for (i = 0; i < cookies.length; i++) {
            texto = texto + cookies[i].trim() + "\n";
        }
    } else texto = "No hay cookies que mostrar";
    alert(texto)
}