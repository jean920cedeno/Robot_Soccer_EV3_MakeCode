console.log("=== TEST Infrared Sensor (Puerto 2 - Proximidad) ===")
for (let i = 0; i < 10; i++) {
    // .proximity() devuelve un valor entre 0 y 100 (0 = muy cerca, 100 = lejos)
    let proximidad2 = sensors.infrared2.proximity()
    console.log("Puerto 2 - proximity(): [" + proximidad2 + "%]  (i=" + i + ")")
    pause(300)
}
console.log("=== TEST PROXIMIDAD PUERTO 2 TERMINADO ===")

console.log("=== TEST EV3 Infrared Sensor (Puerto 1) ===")
for (let i = 0; i < 10; i++) {
    let proximidad1 = sensors.infrared1.proximity()
    console.log("Puerto 1 - proximity(): [" + proximidad1 + "%]  (i=" + i + ")")
    pause(300)
}
console.log("=== TEST 2 TERMINADO ===")

console.log("=== TEST EV3 Color Sensor (Puerto 3) ===")
for (let i = 0; i < 10; i++) {
    let color = sensors.color3.color()
    let luzReflejada = sensors.color3.reflectedLight(LightIntensityMode.Reflected)
    let luzAmbiente = sensors.color3.ambientLight()
    console.log("Puerto 3 - color(): [" + color + "%]  ambientLight(): [" + luzAmbiente + "%]  (i=" + i + ")")
    pause(300)
}
console.log("=== TEST 3 TERMINADO ===")
