// Muestra los puertos conectados simplemnete validacion
brick.showPorts()
console.log("[SETUP] Verificando puertos conectados...")

// === CONFIGURACION DE SENSORES INFRARROJOS (SEEKER) ===
// Reemplazamos los sensores de color por sensores IR en modo Seeker
sensors.infrared3.setMode(0) // Puerto 3: Pelota (Modo AC) -> antes color2
sensors.infrared2.setMode(1) // Puerto 2: Banner/Arco (Modo DC) -> antes color3

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

// Distancias de deteccion, se fueron modificando en pruebas y estas fueron las que generaban el comportamiento que mas nos agradaba
let DISTANCIA_DETECCION = 30
let DISTANCIA_CONTACTO = 8

// Umbral de intensidad para confirmar que la pelota es real y no ruido del sensor IR
let INTENSIDAD_MINIMA = 8

// Variables de lectura de los sensores IR seeker
let dirBalon = 0
let fuerzaBalon = 0
let dirBanner = 0

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

// Detecta una posible pelota usando el sensor IR3 en modo seeker (antes: color2/color3)
// Solo se confirma si hay direccion valida (1-9) Y la fuerza de senal es suficiente
function pelotaDetectadaPorSensor() {
    dirBalon = sensors.infrared3.getNumber(NumberFormat.UInt8LE, 0)
    fuerzaBalon = sensors.infrared3.getNumber(NumberFormat.UInt8LE, 6)

    return dirBalon > 0 && fuerzaBalon >= INTENSIDAD_MINIMA
}

// Detecta el arco (banner) usando el sensor IR2 en modo seeker (antes: color2/color3 == Blue)
function arcoDetectadoPorSensor() {
    dirBanner = sensors.infrared2.getNumber(NumberFormat.UInt8LE, 0)

    return dirBanner > 0
}

// Detecta cualquier posible objetivo.
function objetivoDetectado() {
    distancia = sensors.infrared1.proximity()

    return distancia < DISTANCIA_DETECCION ||
        pelotaDetectadaPorSensor()
}

// Ejecuta el ataque inicial agresivo 
function ataqueInicial() {
    console.log("[INICIO] Arrancando con embestida inicial a velocidad maxima")

    let tiempo = 0
    avanzar(VELOCIDAD_MAXIMA)

    while (tiempo < TIEMPO_ATAQUE_INICIAL) {
        distancia = sensors.infrared1.proximity()

        console.log(
            "[INICIO] Avanzando... obstaculo a " +
            distancia +
            "% | segundo " +
            (tiempo / 1000)
        )

        loops.pause(50)
        tiempo += 50
    }

    detener()
    console.log("[INICIO] Embestida inicial completada, robot detenido")
}

// Ataca cualquier objeto detectado es decir somos salvajes
function atacarObjetivo() {
    console.log("[ATAQUE] Objetivo detectado, cargando a velocidad maxima")

    let tiempo = 0
    avanzar(VELOCIDAD_MAXIMA)

    while (tiempo < TIEMPO_ATAQUE) {
        distancia = sensors.infrared1.proximity()

        console.log(
            "[ATAQUE] Acercandome... distancia restante: " +
            distancia +
            "%"
        )

        // El objetivo está muy cerca.
        if (distancia <= DISTANCIA_CONTACTO) {
            console.log("[ATAQUE] Contacto! El objetivo esta al alcance")
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

    console.log("[ATAQUE] Empuje completado, pelota encontrada y golpeada")
}

// Avanzamos mientras buscamos
function avanzarBuscando(tiempoMaximo: number, velocidad: number) {
    let tiempo = 0
    avanzar(velocidad)

    while (tiempo < tiempoMaximo) {
        distancia = sensors.infrared1.proximity()

        if (objetivoDetectado()) {
            detener()
            console.log("[EXPLORACION] Objetivo detectado mientras avanzaba, cambiando a modo ataque")

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
    console.log("[BUSQUEDA] Iniciando busqueda de la pelota")

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
                "[BUSQUEDA] Girando... obstaculo: " +
                distancia +
                "% | pelota en direccion " +
                dirBalon +
                " con senal " +
                fuerzaBalon
            )

            if (objetivoDetectado()) {
                encontrado = true
                console.log("[BUSQUEDA] Pelota localizada, preparando ataque")
            }

            loops.pause(50)
            tiempoGiro += 50
        }

        detener()

        if (encontrado) {
            atacarObjetivo()
        } else {
            console.log("[BUSQUEDA] Nada por aqui, avanzando para explorar otra zona")

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
    console.log("[ARCO] Objeto en el camino mientras busco el arco, embistiendo")

    let tiempo = 0
    avanzar(VELOCIDAD_MAXIMA)

    while (tiempo < TIEMPO_ATAQUE) {
        distancia = sensors.infrared1.proximity()

        console.log(
            "[ARCO] Empujando obstaculo... distancia restante: " +
            distancia +
            "%"
        )

        if (distancia <= DISTANCIA_CONTACTO) {
            console.log("[ARCO] Contacto con el obstaculo")
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

// Usamos un while de toda la vida para buscar el arco mientras seguimos atacando
function buscarArco() {
    console.log("[ARCO] Iniciando busqueda del arco (banner)")

    arcoEncontrado = false

    while (!arcoEncontrado) {
        distancia = sensors.infrared1.proximity()

        console.log(
            "[ARCO] Girando... obstaculo: " +
            distancia +
            "% | arco en direccion " +
            dirBanner
        )

        // El arco tiene prioridad es nuestro destino
        if (arcoDetectadoPorSensor()) {
            detener()
            arcoEncontrado = true

            console.log("[ARCO] Arco localizado, listo para el empuje final")
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
    console.log("[GOL] Empuje final: llevando la pelota hacia el arco")

    let tiempo = 0
    avanzar(VELOCIDAD_MAXIMA)

    while (tiempo < 3000) {
        distancia = sensors.infrared1.proximity()

        console.log(
            "[GOL] Empujando... obstaculo delante: " +
            distancia +
            "%"
        )

        loops.pause(50)
        tiempo += 50
    }

    detener()
    console.log("[GOL] Empuje final completado, robot detenido")
}

// Lecturas iniciales para entender que esta haciendo nuestro robot
console.log("[SETUP] Sensor de obstaculos (IR1): " + sensors.infrared1.proximity() + "%")
console.log("[SETUP] Sensor de pelota (IR3), direccion inicial: " + sensors.infrared3.getNumber(NumberFormat.UInt8LE, 0))
console.log("[SETUP] Sensor de arco (IR2), direccion inicial: " + sensors.infrared2.getNumber(NumberFormat.UInt8LE, 0))

pause(1000)

// Ejecutamos nuestra estrategia salvaje
ataqueInicial()
buscarBalon()

console.log("=== ETAPA 1 COMPLETADA: Pelota encontrada y golpeada ===")

buscarArco()

console.log("=== ETAPA 2 COMPLETADA: Arco localizado ===")

pause(100)

empujarHaciaArco()

console.log("=== MISION CUMPLIDA: Tarea completada con exito ===")
brick.showString("Tarea completada", 1)
//FIN JEAN CEDEÑO, MELANIE TOMALÁ, JESÚS TORRES.
