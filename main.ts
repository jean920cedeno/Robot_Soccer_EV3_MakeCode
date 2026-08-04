console.log("=== INICIANDO TEST DUAL: INFRARED (PUERTO 3) + INFRARED (PUERTO 1) ===")

let INTERVALO_MS = 300
let TOTAL_ITERACIONES = 400 // 2 minutos

for (let i = 1; i <= TOTAL_ITERACIONES; i++) {
    let proximidad3 = sensors.infrared3.proximity()
    let proximidad1 = sensors.infrared1.proximity()
    let segundos = Math.floor((i * INTERVALO_MS) / 1000)

    if (proximidad3 < 100) {
        console.log("[" + segundos + "s / 120s] ¡P3 DETECTA ALGO! Proximidad P3: " + proximidad3 + "% | Proximidad P1: " + proximidad1 + "%")
    } else {
        console.log("[" + segundos + "s / 120s] P3 en el vacío (100%) | Proximidad P1: " + proximidad1 + "%")
    }

    pause(INTERVALO_MS)
}

console.log("=== TEST DUAL FINALIZADO ===")
