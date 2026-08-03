// --- TEST: IR Seeker V2 en puerto 3 y puerto 4 ---
console.log("=== INICIANDO TEST IR SEEKER ===")

for (let i = 0; i < 15; i++) {
    let direccion3 = sensors.irSeeker3.getDirection()   // ⚠️ ajustar nombre si es distinto
    let direccion4 = sensors.irSeeker4.getDirection()   // ⚠️ ajustar nombre si es distinto

    console.log("Puerto 3: [" + direccion3 + "] | Puerto 4: [" + direccion4 + "]  (i=" + i + ")")
    pause(300)
}

console.log("=== TEST TERMINADO ===")
brick.showString("Test IR Seeker listo", 1)
