console.log("=== TEST: ¿CAMBIA EL VALOR REALMENTE? ===")

console.log("--- SIN balón ---")
for (let i = 0; i < 5; i++) {
    console.log("Sin balón: [" + sensors.infrared3.getNumber(NumberFormat.UInt8LE, 0) + "]")
    pause(300)
}

console.log("--- Ahora pon el balón AL FRENTE CENTRADO ---")
pause(3000)
for (let i = 0; i < 5; i++) {
    console.log("Centrado: [" + sensors.infrared3.getNumber(NumberFormat.UInt8LE, 0) + "]")
    pause(300)
}

console.log("--- Ahora mueve el balón a la IZQUIERDA ---")
pause(3000)
for (let i = 0; i < 5; i++) {
    console.log("Izquierda: [" + sensors.infrared3.getNumber(NumberFormat.UInt8LE, 0) + "]")
    pause(300)
}

console.log("--- Ahora mueve el balón a la DERECHA ---")
pause(3000)
for (let i = 0; i < 5; i++) {
    console.log("Derecha: [" + sensors.infrared3.getNumber(NumberFormat.UInt8LE, 0) + "]")
    pause(300)
}

console.log("=== TEST TERMINADO ===")
