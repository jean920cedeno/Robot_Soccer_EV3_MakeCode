console.log("=== TEST HiTechnic IRSeeker (Puerto 4) ===")

let INTERVALO_MS = 500
let TOTAL_ITERACIONES = 240 // 2 minutos (240 x 500ms)

// Aseguramos el modo de lectura (Modo 0 suele ser AC para pelotas IR)
sensors.infrared4.setMode(0)

for (let i = 1; i <= TOTAL_ITERACIONES; i++) {
    // getNumber con UInt8LE en desplazamiento 0 lee la DIRECCIÓN (0 a 9)
    let direccion = sensors.infrared4.getNumber(NumberFormat.UInt8LE, 0)
    
    let segundos = Math.floor((i * INTERVALO_MS) / 1000)

    if (direccion === 0) {
        console.log("[" + segundos + "s / 120s] Puerto 4 - IRSeeker: No detecta señal IR (0)")
    } else if (direccion === 5) {
        console.log("[" + segundos + "s / 120s] Puerto 4 - IRSeeker: ¡Emisor IR AL CENTRO! (5)")
    } else {
        console.log("[" + segundos + "s / 120s] Puerto 4 - IRSeeker: Señal en Dirección [" + direccion + "]")
    }

    pause(INTERVALO_MS)
}

console.log("=== TEST COMPLETO ===")
