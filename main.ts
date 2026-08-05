sensors.infrared3.setMode(1) // Puerto 3: Pelota - Modo IR-SEEK (1): direccion + intensidad de una senal IR activa
sensors.infrared2.setMode(1) // Puerto 2: Banner/Arco - Modo IR-SEEK (1): direccion + intensidad de una senal IR activa
// NOTA IMPORTANTE: el sensor IR solo tiene 3 modos reales (0=Proximity, 1=Seek, 2=Remote).
// Antes el sensor 3 estaba en modo 0 (Proximity), pero pelotaDetectadaPorSensor() ya leia
// dirBalon/fuerzaBalon como si estuviera en modo Seek -> esos valores nunca eran validos.
// Se corrige a modo 1 para que coincida con lo que la funcion realmente lee.
// OJO: Seek detecta una señal IR ACTIVA (como el beacon), no una pelota pasiva por si sola.
// Hay que probar en el simulador si la pelota "cuenta" como emisor para este sensor;
// si no, la deteccion real de la pelota seguira dependiendo del proximity de IR1.

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

// Umbral de intensidad para considerar el arco "cerca" (sin usar IR1 en absoluto)
// AJUSTAR probando en el simulador: mientras mas cerca del arco, mas alta deberia ser fuerzaBanner
let INTENSIDAD_ARCO_CERCA = 15

// Umbral de intensidad para considerar la pelota "cerca" (sin usar IR1 en absoluto)
// AJUSTAR probando en el simulador: mientras mas cerca de la pelota, mas alta deberia ser fuerzaBalon
let INTENSIDAD_BALON_CERCA = 15

// Variables de lectura de los sensores IR seeker
let dirBalon = 0
let fuerzaBalon = 0
let dirBanner = 0
let fuerzaBanner = 0

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
// IMPORTANTE: requiere que IR3 este en modo Seek (setMode(1)); si el offset 6 no da
// lecturas estables en el simulador, hay que loguear el byte crudo y reajustar el offset.
function pelotaDetectadaPorSensor() {
    dirBalon = sensors.infrared3.getNumber(NumberFormat.UInt8LE, 0)
    fuerzaBalon = sensors.infrared3.getNumber(NumberFormat.UInt8LE, 6)

    return dirBalon > 0 && fuerzaBalon >= INTENSIDAD_MINIMA
}

// Detecta el arco (banner) usando el sensor IR2 en modo seeker (antes: color2/color3 == Blue)
// Lee direccion (offset 0) e intensidad (offset 6), igual que con la pelota.
function arcoDetectadoPorSensor() {
    dirBanner = sensors.infrared2.getNumber(NumberFormat.UInt8LE, 0)
    fuerzaBanner = sensors.infrared2.getNumber(NumberFormat.UInt8LE, 6)

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

// Busca la pelota usando UNICAMENTE el sensor IR3 en modo Seek (direccion + intensidad).
// Ya no usa IR1 (proximity) ni ataca/explora con esos sensores: solo gira y avanza
// guiandose por la senal de la pelota hasta que la intensidad indica que esta cerca.
// sensors.infrared3.setMode(1) // Puerto 3: Pelota - Modo IR-SEEK (1): direccion + intensidad de una senal IR activa
function buscarBalon() {
    console.log("[BUSQUEDA] Iniciando busqueda de la pelota - solo sensor Seek IR3")

    balonEncontrado = false

    while (!balonEncontrado) {
        pelotaDetectadaPorSensor()

        console.log(
            "[BUSQUEDA] direccion: " +
            dirBalon +
            " | intensidad: " +
            fuerzaBalon
        )

        if (dirBalon <= 0 || fuerzaBalon < INTENSIDAD_MINIMA) {
            // Sin senal valida de la pelota todavia: gira sobre su eje buscandola
            girar(1)
            avanzar(VELOCIDAD_AVANCE)
        } else if (fuerzaBalon >= INTENSIDAD_BALON_CERCA) {
            // Senal fuerte: consideramos la pelota localizada y alcanzada
            detener()
            balonEncontrado = true

            console.log("[BUSQUEDA] Pelota localizada (senal fuerte), contacto")
            break
        } else {
            // Hay senal pero todavia lejos: avanza hacia la pelota
            avanzar(VELOCIDAD_APROXIMACION)
        }

        loops.pause(50)
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

// Busca el arco usando UNICAMENTE el sensor IR2 en modo Seek (direccion + intensidad).
// Ya no usa IR1 (proximity) ni ataca objetos en el camino: solo gira y avanza
// guiandose por la senal del arco hasta que la intensidad indica que esta cerca.
// sensors.infrared2.setMode(1) // Puerto 2: Banner/Arco - Modo IR-SEEK (1): direccion + intensidad de una senal IR activa
function buscarArco() {
    console.log("[ARCO] Iniciando busqueda del arco (banner) - solo sensor Seek IR2")

    arcoEncontrado = false

    while (!arcoEncontrado) {
        arcoDetectadoPorSensor()

        console.log(
            "[ARCO] direccion: " +
            dirBanner +
            " | intensidad: " +
            fuerzaBanner
        )

        if (dirBanner <= 0) {
            // Sin senal del arco todavia: gira sobre su eje para buscarla
            girar(1)
            avanzar(VELOCIDAD_VELOCIDAD_AVANCE)
        } else if (fuerzaBanner >= INTENSIDAD_ARCO_CERCA) {
            // Senal fuerte: consideramos el arco localizado, listo para el empuje final
            detener()
            arcoEncontrado = true

            console.log("[ARCO] Arco localizado (senal fuerte), listo para el empuje final")
            break
        } else {
            // Hay senal pero todavia lejos: avanza hacia el arco
            avanzar(VELOCIDAD_APROXIMACION)
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
