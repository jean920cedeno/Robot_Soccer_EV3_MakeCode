// --- TEST AISLADO: ¿gira el robot? ¿el gyro lo detecta? ---
console.log("=== TEST GYRO ===")
sensors.gyro4.reset()
console.log("Ángulo inicial: [" + sensors.gyro4.angle() + "]")

motors.largeBC.tank(20, -20)

for (let i = 0; i < 20; i++) {
    console.log("Ángulo: [" + sensors.gyro4.angle() + "]  (i=" + i + ")")
    pause(200)
}

motors.largeBC.stop()
console.log("=== TEST TERMINADO ===")
