console.log("=== SISTEMA CON FILTRO DE INTENSIDAD RECORREGIDO ===")

// Forzamos Modo AC (Modo 0) en Puerto 3 (Pelota) y Modo DC en Puerto 2 (Banner)
sensors.infrared3.setMode(0)
sensors.infrared2.setMode(1)

// Umbral mínimo de fuerza para considerar que la pelota existe (ajustable si está lejos)
const INTENSIDAD_MINIMA = 8 

basic.forever(function () {
    // Lecturas del Puerto 3 (Balón)
    let dirBalon = sensors.infrared3.getNumber(NumberFormat.UInt8LE, 0)
    let fuerzaBalon = sensors.infrared3.getNumber(NumberFormat.UInt8LE, 6) // Byte 6: Intensidad general

    // Lectura del Puerto 2 (Banner)
    let dirBanner = sensors.infrared2.getNumber(NumberFormat.UInt8LE, 0)

    // Solo consideramos que HAY PELOTA si la dirección es 1-9 Y la intensidad supera el umbral
    let hayPelota = (dirBalon >= 1 && dirBalon <= 9) && (fuerzaBalon >= INTENSIDAD_MINIMA)

    if (!hayPelota) {
        // Ignora falsos positivos / ruidos y realmente BUSCA el balón
        console.log("Buscando balón real... (Dirección leída: " + dirBalon + " | Fuerza: " + fuerzaBalon + ")")
        motors.largeBC.tank(25, -25)
    } 
    else if (dirBalon !== 5) {
        // Pelota real detectada, pero descentrada
        console.log("¡Pelota confirmada! Dir: " + dirBalon + " | Fuerza: " + fuerzaBalon)
        if (dirBalon < 5) {
            motors.largeBC.tank(15, 35) // Girar a la izquierda
        } else {
            motors.largeBC.tank(35, 15) // Girar a la derecha
        }
    } 
    else {
        // Pelota alineada en el centro (Dirección 5)
        console.log("¡Pelota centrada! Apuntando al Blue Banner...")

        if (dirBanner === 5) {
            motors.largeBC.tank(80, 80) // Ir de frente a gol
        } else if (dirBanner < 5 || dirBanner === 0) {
            motors.largeBC.tank(20, 50)
        } else {
            motors.largeBC.tank(50, 20)
        }
    }

    pause(100)
})
