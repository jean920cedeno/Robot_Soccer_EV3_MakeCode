console.log("=== INICIANDO TEST PUERTO 4 (DURACIÓN: 2 MINUTOS) ===")

let INTERVALO_MS = 300
// 2 minutos = 120,000 ms. Con pausas de 300ms = 400 iteraciones
let TOTAL_ITERACIONES = 400 

for (let i = 1; i <= TOTAL_ITERACIONES; i++) {
    let proximidad4 = sensors.infrared4.proximity()
    
    // Cálculo simple del tiempo transcurrido para mostrar en consola
    let segundosTranscurridos = Math.floor((i * INTERVALO_MS) / 1000)
    
    console.log("[" + segundosTranscurridos + "s / 120s] Puerto 4 - Proximidad: " + proximidad4 + "%")
    
    pause(INTERVALO_MS)
}

console.log("=== TEST DE 2 MINUTOS COMPLETADO EN PUERTO 4 ===")
