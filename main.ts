console.log("=== TEST 1: apuntando al PISO/CÉSPED (sin balón, sin pared) ===")
for (let i = 0; i < 5; i++) {
    let bytes = sensors.infrared3.getBytes()
    console.log("Piso: [" + bytes + "]")
    pause(300)
}

console.log("=== TEST 2: apuntando a una PARED cercana ===")
pause(3000)
for (let i = 0; i < 5; i++) {
    let bytes = sensors.infrared3.getBytes()
    console.log("Pared: [" + bytes + "]")
    pause(300)
}

console.log("=== TEST 3: apuntando al BALÓN ===")
pause(3000)
for (let i = 0; i < 5; i++) {
    let bytes = sensors.infrared3.getBytes()
    console.log("Balón: [" + bytes + "]")
    pause(300)
}

console.log("=== TEST TERMINADO ===")
