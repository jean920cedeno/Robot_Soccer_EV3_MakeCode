brick.showPorts()
console.log("=== TEST HiTechnic IRSeeker (puerto 2) ===")
for (let i = 0; i < 10; i++) {
    sensors.infrared2.setMode(0)
    let numero = sensors.infrared2.getNumber(NumberFormat.UInt8LE, 0)
    console.log("Puerto 2 - getNumber(): [" + numero + "]  (i=" + i + ")")
    pause(300)
}
console.log("=== TEST 1 TERMINADO ===")

console.log("=== TEST EV3 Infrared Sensor (puerto 1) ===")
for (let i = 0; i < 10; i++) {
    let proximidad = sensors.infrared1.proximity()
    console.log("Puerto 1 - proximity(): [" + proximidad + "]  (i=" + i + ")")
    pause(300)
}
console.log("=== TEST 2 TERMINADO ===")

console.log("=== TEST EV3 Color Sensor (puerto 3) ===")
for (let i = 0; i < 10; i++) {
    let color = sensors.color3.color()
    let luzReflejada = sensors.color3.reflectedLight(LightIntensityMode.Reflected)
    let luzAmbiente = sensors.color3.ambientLight()
    console.log("Puerto 3 - color(): [" + color + "]  reflectedLight(): [" + luzReflejada + "]  ambientLight(): [" + luzAmbiente + "]  (i=" + i + ")")
    pause(300)
}
console.log("=== TEST 3 TERMINADO ===")
