console.log("=== INICIANDO TEST COMBINADO: COLOR AZUL (P3) + DISTANCIA IR (P1) ===")

let INTERVALO_MS = 300
let TOTAL_ITERACIONES = 400 // 2 minutos

for (let i = 1; i <= TOTAL_ITERACIONES; i++) {
    let colorDetectado = sensors.color3.color()
    let proximidad = sensors.infrared1.proximity()
    let segundos = Math.floor((i * INTERVALO_MS) / 1000)

    // Evaluamos si el sensor de color ve AZUL (ColorSensorColor.Blue equivale a 2)
    let esAzul = (colorDetectado == ColorSensorColor.Blue)

    if (esAzul) {
        console.log("[" + segundos + "s / 120s] ¡AZUL DETECTADO! - Distancia/Proximidad (Puerto 1): " + proximidad + "%")
    } else {
        console.log("[" + segundos + "s / 120s] Sin Azul (Color ID: " + colorDetectado + ") - Distancia (Puerto 1): " + proximidad + "%")
    }

    pause(INTERVALO_MS)
}

console.log("=== TEST COMBINADO FINALIZADO ===")
