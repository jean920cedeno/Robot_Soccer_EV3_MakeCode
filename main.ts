// Muestra los puertos conectados simplemnete validacion
brick.showPorts()
//Depencia: Dependemos de una posicion incial adecuada, esto se hizo por tema de precision de sensores, aun no hemos
//aprendido como usarlos correctamente, hace 4 dias descubrimos el tema de los sensores y que existen diferentes tipos
//por eso esta implementacion algo apurada, pero haciendo varios intentos, si el robot se queda entretenido en una pared, u otro 
//objeto este bucle puede ser infito por nuestra condicion de ataque repitivo la cual nos divertimos implementadola,
// pero esto tambien nos juega en contra asi que toca reiniciar,
//si las condiciones adecuadas se cumplen podemos asegurar un gol que fue el objetivo
//de nuestro grupo en este pequeño periodo de tiempo (Como justificacion a la cantidad de lineas 
//debemos decir que estas fueron escritas y probadas, bajo el efecto de la cafeina, falta de sueño, entre otros factores
//hemos atravesado estos 2 dias, incluyendo el rediseño del robot.)

//Definicion de estados, variables de velocidad y tiempo
let balonEncontrado = false
let arcoEncontrado = false
let distancia = 0
let VELOCIDAD_MAXIMA = 100
let VELOCIDAD_AVANCE = 75
let VELOCIDAD_APROXIMACION = 40
let VELOCIDAD_GIRO = 25
let TIEMPO_ATAQUE_INICIAL = 5000
let TIEMPO_BUSQUEDA_GIRO = 3000
let TIEMPO_EXPLORACION = 1500
let TIEMPO_ATAQUE = 2500
let TIEMPO_EMPUJE = 700
let TIEMPO_RETROCESO = 300

// Distancias de deteccion, se fueron modificando en pruebas y estas fueron las que generaban el comportamiento que mas no agradaba
let DISTANCIA_DETECCION = 30
let DISTANCIA_CONTACTO = 8

// Detiene el robot de golpe
function detener() {
    motors.largeBC.stop()
}

// Avanza con la velocidad indicada 
function avanzar(velocidad: number) {
    motors.largeBC.tank(velocidad, velocidad)
}

// Retrocede con la velocidad indicada 
function retroceder(velocidad: number) {
    motors.largeBC.tank(0 - velocidad, 0 - velocidad)
}

// Gira sobre su propio eje
function girar(direccion: number) {
    motors.largeBC.tank(
        VELOCIDAD_GIRO * direccion,
        (0 - VELOCIDAD_GIRO) * direccion
    )
}

// Detecta una posible pelota blanca, nos ayudamos de dos sensores para mayor "precision"
function pelotaDetectadaPorColor() {
    return sensors.color2.color() == ColorSensorColor.White ||
        sensors.color3.color() == ColorSensorColor.White
}

// Detecta el arco azul.
function arcoDetectadoPorColor() {
    return sensors.color2.color() == ColorSensorColor.Blue ||
        sensors.color3.color() == ColorSensorColor.Blue
}

// Detecta cualquier posible objetivo.
function objetivoDetectado() {
    distancia = sensors.infrared1.proximity()

    return distancia < DISTANCIA_DETECCION ||
        pelotaDetectadaPorColor()
}

// Ejecuta el ataque inicial agresivo 
function ataqueInicial() {
    console.log("Iniciando ataque inicial")

    let tiempo = 0
    avanzar(VELOCIDAD_MAXIMA)

    while (tiempo < TIEMPO_ATAQUE_INICIAL) {
        distancia = sensors.infrared1.proximity()

        console.log(
            "Ataque inicial - IR: " +
            distancia +
            " Tiempo: " +
            tiempo
        )

        loops.pause(50)
        tiempo += 50
    }

    detener()
    console.log("Ataque inicial finalizado")
}

// Ataca cualquier objeto detectado es decir somos salvajes
function atacarObjetivo() {
    console.log("Iniciando ataque al objetivo")

    let tiempo = 0
    avanzar(VELOCIDAD_MAXIMA)

    while (tiempo < TIEMPO_ATAQUE) {
        distancia = sensors.infrared1.proximity()

        console.log(
            "Ataque - IR: " +
            distancia +
            " Tiempo: " +
            tiempo
        )

        // El objetivo está muy cerca.
        if (distancia <= DISTANCIA_CONTACTO) {
            console.log("Contacto")
            break
        }

        loops.pause(50)
        tiempo += 50
    }

    // Mantenemos potencia
    avanzar(VELOCIDAD_MAXIMA)
    pause(TIEMPO_EMPUJE)

    detener()
    balonEncontrado = true

    console.log("Ataque finalizado")
}

// Avanzamos mientras buscamos
function avanzarBuscando(tiempoMaximo: number, velocidad: number) {
    let tiempo = 0
    avanzar(velocidad)

    while (tiempo < tiempoMaximo) {
        distancia = sensors.infrared1.proximity()

        if (objetivoDetectado()) {
            detener()
            console.log("Objetivo detectado durante el avance")

            atacarObjetivo()
            return true
        }

        loops.pause(50)
        tiempo += 50
    }

    detener()
    return false
}

// Busca una pelota o cualquier objeto (Comportamiento Salvaje)
function buscarBalon() {
    console.log("Buscando objetivo")

    balonEncontrado = false

    while (!balonEncontrado) {
        let tiempoGiro = 0
        let encontrado = false

        // Seleccionar una direccion random para darle movimiento
        let direccion = Math.random() < 0.5 ? 1 : -1

        girar(direccion)

        while (
            tiempoGiro < TIEMPO_BUSQUEDA_GIRO &&
            !encontrado
        ) {
            distancia = sensors.infrared1.proximity()

            console.log(
                "Busqueda - IR: " +
                distancia +
                " Color 2: " +
                sensors.color2.color() +
                " Color 3: " +
                sensors.color3.color()
            )

            if (objetivoDetectado()) {
                encontrado = true
                console.log("Objetivo en la mira")
            }

            loops.pause(50)
            tiempoGiro += 50
        }

        detener()

        if (encontrado) {
            atacarObjetivo()
        } else {
            console.log("Explorando otra parte")

            avanzarBuscando(
                TIEMPO_EXPLORACION,
                VELOCIDAD_AVANCE
            )
        }
    }

    detener()
}

// Atacamos de manera agresiva suponiendo que nuestra ubacion inicial siempre sera la misma
function atacarDuranteBusquedaArco() {
    console.log("Ataque durante la busqueda del arco")

    let tiempo = 0
    avanzar(VELOCIDAD_MAXIMA)

    while (tiempo < TIEMPO_ATAQUE) {
        distancia = sensors.infrared1.proximity()

        console.log(
            "Ataque al buscar arco - IR: " +
            distancia
        )

        if (distancia <= DISTANCIA_CONTACTO) {
            console.log("Contacto con el objetivo")
            break
        }

        loops.pause(50)
        tiempo += 50
    }

    // Empuja el objetivo de manera salvaje
    avanzar(VELOCIDAD_MAXIMA)
    pause(TIEMPO_EMPUJE)
    detener()

    // Recuperamos espacio para continuar girando.
    retroceder(VELOCIDAD_APROXIMACION)
    pause(TIEMPO_RETROCESO)
    detener()
}

// Usamos un while de toda la vida para buscar el arcos mientras seguimos atacando
function buscarArco() {
    console.log("Buscando arco azul")

    arcoEncontrado = false

    while (!arcoEncontrado) {
        distancia = sensors.infrared1.proximity()

        console.log(
            "Arco - IR: " +
            distancia +
            " Color 2: " +
            sensors.color2.color() +
            " Color 3: " +
            sensors.color3.color()
        )

        // El arco tiene prioridad es nuestro destinio
        if (arcoDetectadoPorColor()) {
            detener()
            arcoEncontrado = true

            console.log("Arco azul detectado")
            break
        }

        // Ataca todo lo que se mueve
        if (objetivoDetectado()) {
            detener()
            atacarDuranteBusquedaArco()
        } else {
            girar(1)
        }

        loops.pause(50)
    }

    detener()
}

// Esto es lo mas salvaje que se nos ocurrio para meter el balon con todo y arco
function empujarHaciaArco() {
    console.log("Empujando hacia el arco")

    let tiempo = 0
    avanzar(VELOCIDAD_MAXIMA)

    while (tiempo < 3000) {
        distancia = sensors.infrared1.proximity()

        console.log(
            "Empuje final - IR: " +
            distancia
        )

        loops.pause(50)
        tiempo += 50
    }

    detener()
    console.log("Empuje finalizado")
}

// Lecturas iniciales para entender que esta haciendo nuestro robot
console.log("IR: " + sensors.infrared1.proximity())
console.log("Color 2: " + sensors.color2.color())
console.log("Color 3: " + sensors.color3.color())

pause(1000)

// Ejecutamos nuestra estrategia salvaje
ataqueInicial()
buscarBalon()

console.log("Objetivo alcanzado")

buscarArco()

console.log("Arco encontrado")

pause(100)

empujarHaciaArco()

console.log("Tarea completada")
brick.showString("Tarea completada", 1)
//FIN JEAN CEDEÑO, MELANIE TOMALÁ, JESÚS TORRES.
