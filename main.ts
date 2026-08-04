console.log("=== SISTEMA CON FILTRO DE FALSOS POSITIVOS ===")

sensors.infrared3.setMode(0) // Puerto 3: Pelota (Modo AC)
sensors.infrared2.setMode(1) // Puerto 2: Banner (Modo DC para no interferir)

// Umbral de fuerza: la dirección debe ser clara y no ruido residual
basic.forever(function () {
    let dirBalon = sensors.infrared3.getNumber(NumberFormat.UInt8LE, 0)
    let dirBanner = sensors.infrared2.getNumber(NumberFormat.UInt8LE, 0)

    // Validamos si realmente hay pelota
    let hayPelota = (dirBalon >= 1 && dirBalon <= 9)

    if (!hayPelota) {
        // Realmente NO hay pelota a la vista
        console.log("Buscando balón... (Sin señal IR válida)")
        motors.largeBC.tank(30, -30)
    } 
    else if (dirBalon !== 5) {
        // Hay pelota pero no está al centro
        console.log("Pelota detectada en dirección: " + dirBalon + ". Ajustando...")
        if (dirBalon < 5) {
            motors.largeBC.tank(15, 40)
        } else {
            motors.largeBC.tank(40, 15)
        }
    } 
    else {
        // Balón verificado en el CENTRO (Dirección 5)
        console.log("¡BALÓN CONFIRMADO AL CENTRO! Apuntando al Banner...")
        
        if (dirBanner === 5) {
            motors.largeBC.tank(80, 80) // Avanza a gol
        } else if (dirBanner < 5 || dirBanner === 0) {
            motors.largeBC.tank(20, 50)
        } else {
            motors.largeBC.tank(50, 20)
        }
    }

    pause(100)
})
