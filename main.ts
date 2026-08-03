console.log("=== TEST 1: PISO/CÉSPED ===")
for (let i = 0; i < 3; i++) {
    let bytes = sensors.infrared3.getBytes()
    let texto = ""
    for (let j = 0; j < bytes.length; j++) {
        texto += bytes.getUint8(j) + " "
    }
    console.log("Piso byte por byte: [" + texto + "]")
    pause(300)
}

console.log("=== TEST 2: PARED ===")
pause(3000)
for (let i = 0; i < 3; i++) {
    let bytes = sensors.infrared3.getBytes()
    let texto = ""
    for (let j = 0; j < bytes.length; j++) {
        texto += bytes.getUint8(j) + " "
    }
    console.log("Pared byte por byte: [" + texto + "]")
    pause(300)
}

console.log("=== TEST 3: BALÓN ===")
pause(3000)
for (let i = 0; i < 3; i++) {
    let bytes = sensors.infrared3.getBytes()
    let texto = ""
    for (let j = 0; j < bytes.length; j++) {
        texto += bytes.getUint8(j) + " "
    }
    console.log("Balón byte por byte: [" + texto + "]")
    pause(300)
}

console.log("=== TEST TERMINADO ===")
