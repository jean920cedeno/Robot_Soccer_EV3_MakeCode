// ============================================================
// TEST AISLADO: solo prueba si el robot encuentra el arco
// No incluye ataque inicial, busqueda de pelota ni empuje final.
// Sube ESTE archivo solo (o pegalo en un proyecto nuevo) para probar
// unicamente buscarArco() sin que el resto del programa interfiera.
// ============================================================

sensors.infrared2.setMode(1) // Puerto 2: Banner/Arco - Modo IR-SEEK (1): direccion + intensidad de una senal IR activa

// --- Variables minimas que necesita buscarArco() ---
let arcoEncontrado = false
let dirBanner = 0
let fuerzaBanner = 0

let VELOCIDAD_GIRO = 25
let VELOCIDAD_APROXIMACION = 40
let INTENSIDAD_ARCO_CERCA = 15

// Limite de seguridad para que el test no se quede girando para siempre
// si el sensor no detecta nada (ajustable segun el tamaño de tu cancha)
let TIEMPO_MAXIMO_TEST = 15000

// --- Funciones minimas que necesita buscarArco() ---
function detener() {
    motors.largeBC.stop()
}

function avanzar(velocidad: number) {
    motors.largeBC.tank(velocidad, velocidad)
}

function girar(direccion: number) {
    motors.largeBC.tank(
        VELOCIDAD_GIRO * direccion,
        (0 - VELOCIDAD_GIRO) * direccion
    )
}

function arcoDetectadoPorSensor() {
    dirBanner = sensors.infrared2.getNumber(NumberFormat.UInt8LE, 0)
    fuerzaBanner = sensors.infrared2.getNumber(NumberFormat.UInt8LE, 6)

    return dirBanner > 0
}

// Tiempo que tardo el ultimo intento (se llena al llamar buscarArcoTest)
let tiempoTranscurrido = 0

// --- Version de prueba de buscarArco(), igual a la real pero con limite de tiempo ---
function buscarArcoTest(): boolean {
    console.log("[TEST] Iniciando busqueda del arco - solo sensor Seek IR2")

    arcoEncontrado = false
    let tiempo = 0

    while (!arcoEncontrado && tiempo < TIEMPO_MAXIMO_TEST) {
        arcoDetectadoPorSensor()

        console.log(
            "[TEST] t=" + tiempo +
            "ms | direccion: " + dirBanner +
            " | intensidad: " + fuerzaBanner
        )

        if (dirBanner <= 0) {
            girar(1)
        } else if (fuerzaBanner >= INTENSIDAD_ARCO_CERCA) {
            detener()
            arcoEncontrado = true
            console.log("[TEST] Arco localizado (senal fuerte)")
            break
        } else {
            avanzar(VELOCIDAD_APROXIMACION)
        }

        loops.pause(50)
        tiempo += 50
    }

    detener()
    tiempoTranscurrido = tiempo
    return arcoEncontrado
}

// --- Ejecucion del test ---
brick.clearScreen()
brick.showString("Test: buscar arco", 1)
console.log("=== TEST buscarArco() ===")

pause(1000)

let exito = buscarArcoTest()

if (exito) {
    console.log("[TEST] RESULTADO: EXITO - arco encontrado en " + tiempoTranscurrido + " ms")
    brick.showString("EXITO", 3)
    brick.showString("t=" + tiempoTranscurrido + "ms", 4)
    brick.showString("dir=" + dirBanner + " f=" + fuerzaBanner, 5)
} else {
    console.log("[TEST] RESULTADO: FALLO - no se encontro el arco en " + TIEMPO_MAXIMO_TEST + " ms")
    brick.showString("FALLO (timeout)", 3)
    brick.showString("dir=" + dirBanner + " f=" + fuerzaBanner, 4)
}
