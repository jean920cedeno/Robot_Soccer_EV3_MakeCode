// --- TEST AISLADO DE PROXIMIDAD ---
console.log("=== INICIANDO TEST DE PROXIMIDAD ===")

for (let i = 0; i < 100; i++) {
    let p = sensors.infrared1.proximity()
    console.log("Proximity [" + i + "]: [" + p + "]")
    pause(200)
}

console.log("=== TEST TERMINADO ===")
brick.showString("Test proximidad listo", 1)
