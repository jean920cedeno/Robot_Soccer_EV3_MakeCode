// ============================================================
// TEST SIMPLE: solo detecta si el arco es visible para el sensor IR2
// El robot NO se mueve, solo lee el sensor y reporta SI/NO.
// ============================================================

sensors.infrared2.setMode(1) // Puerto 2: Banner/Arco - Modo IR-SEEK (1): direccion + intensidad de una senal IR activa

let dirBanner = 0
let fuerzaBanner = 0

// Cuanto tiempo se queda leyendo el sensor antes de dar el resultado (ms)
let TIEMPO_LECTURA = 3000

function arcoDetectadoPorSensor() {
    dirBanner = sensors.infrared2.getNumber(NumberFormat.UInt8LE, 0)
    fuerzaBanner = sensors.infrared2.getNumber(NumberFormat.UInt8LE, 6)

    return dirBanner > 0
}

// --- Ejecucion del test ---
brick.clearScreen()
brick.showString("Test: detectar arco", 1)
console.log("=== TEST deteccion de arco (sin movimiento) ===")

let detectado = false
let tiempo = 0

while (tiempo < TIEMPO_LECTURA) {
    let hayArco = arcoDetectadoPorSensor()

    console.log(
        "[TEST] t=" + tiempo +
        "ms | direccion: " + dirBanner +
        " | intensidad: " + fuerzaBanner +
        " | detectado: " + hayArco
    )

    if (hayArco) {
        detectado = true
    }

    loops.pause(50)
    tiempo += 50
}

if (detectado) {
    console.log("[TEST] RESULTADO: SI, el arco fue detectado")
    brick.showString("ARCO: SI", 3)
} else {
    console.log("[TEST] RESULTADO: NO, el arco no fue detectado")
    brick.showString("ARCO: NO", 3)
}

brick.showString("dir=" + dirBanner + " f=" + fuerzaBanner, 4)
