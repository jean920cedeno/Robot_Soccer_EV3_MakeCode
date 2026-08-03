// --- TEST BÁSICO: Proximidad sensor infrarrojo puerto 2 ---
console.log("=== INICIANDO TEST DE PROXIMIDAD (puerto 2) ===")

for (let i = 0; i < 20; i++) {
    let p = sensors.infrared2.proximity()
    console.log("Proximity: [" + p + "]  (i=" + i + ")")
    pause(300)
}

console.log("=== TEST TERMINADO ===")
brick.showString("Test proximidad listo", 1)
