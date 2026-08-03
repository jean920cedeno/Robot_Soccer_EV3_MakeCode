// --- TEST: explorar modos del sensor (puerto 3) ---
console.log("=== EXPLORANDO MODOS - PUERTO 3 ===")

for (let modo = 0; modo <= 5; modo++) {
    sensors.infrared3.setMode(modo)
    pause(200)
    let numero = sensors.infrared3.getNumber(NumberFormat.UInt8LE, 0)
    console.log("Modo " + modo + " → getNumber(): [" + numero + "]")
    pause(500)
}

console.log("=== TEST TERMINADO ===")
