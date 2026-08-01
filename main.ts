// --- ESTE ES EL ÚNICO CÓDIGO QUE DEBE EXISTIR EN EL PROGRAMA POR AHORA ---

console.log("TEST 1: sin inversion")
motors.largeB.setInverted(false)
motors.largeC.setInverted(false)
motors.largeBC.tank(75, 75)
pause(1500)
motors.largeBC.stop()
pause(3000)   // tiempo de sobra para que confirmes visualmente

console.log("TEST 2: solo B invertido")
motors.largeB.setInverted(true)
motors.largeC.setInverted(false)
motors.largeBC.tank(75, 75)
pause(1500)
motors.largeBC.stop()
pause(3000)

console.log("TEST 3: solo C invertido")
motors.largeB.setInverted(false)
motors.largeC.setInverted(true)
motors.largeBC.tank(75, 75)
pause(1500)
motors.largeBC.stop()
pause(3000)

console.log("TEST 4: ambos invertidos")
motors.largeB.setInverted(true)
motors.largeC.setInverted(true)
motors.largeBC.tank(75, 75)
pause(1500)
motors.largeBC.stop()

brick.showString("Tests terminados", 1)
