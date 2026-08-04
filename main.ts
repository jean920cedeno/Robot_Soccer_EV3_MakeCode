console.log("=== INICIANDO PROGRAMA: PERSIGUE BALÓN (P3) Y ATACA BLUE BANNER (P2) ===")

// Aseguramos el modo de lectura AC (0) para la pelota en Puerto 3
sensors.infrared3.setMode(0)
// Modo para el Blue Banner en Puerto 2 (se usa modo 0 o 1 según tu prueba previa)
sensors.infrared2.setMode(0) 

basic.forever(function () {
    // 1. Lectura de ambos sensores
    let dirBalon = sensors.infrared3.getNumber(NumberFormat.UInt8LE, 0)  // Puerto 3
    let dirBanner = sensors.infrared2.getNumber(NumberFormat.UInt8LE, 0) // Puerto 2

    // --- FASE 1: BUSCAR EL BALÓN (PUERTO 3) ---
    if (dirBalon === 0) {
        // No ve el balón: Girar sobre su eje para buscarlo
        console.log("Buscando balón...")
        motors.largeBC.tank(30, -30)
    } 
    else if (dirBalon < 5) {
        // Balón a la izquierda: Ajustar dirección a la izquierda
        motors.largeBC.tank(15, 40)
    } 
    else if (dirBalon > 5) {
        // Balón a la derecha: Ajustar dirección a la derecha
        motors.largeBC.tank(40, 15)
    } 
    
    // --- FASE 2: TENEMOS EL BALÓN AL CENTRO (dirBalon === 5) -> ORIENTAR AL BANNER (PUERTO 2) ---
    else {
        console.log("¡Balón atrapado/alineado! Orientando al Blue Banner...")

        if (dirBanner === 5) {
            // Balón alineado Y mirando de frente al Banner: ¡Avanzar a máxima velocidad!
            console.log("¡Ruta libre a gol!")
            motors.largeBC.tank(80, 80)
        } 
        else if (dirBanner < 5 || dirBanner === 0) {
            // El Banner está a la izquierda (o no lo ve directo): Pivotar suavemente con el balón
            motors.largeBC.tank(20, 50)
        } 
        else if (dirBanner > 5) {
            // El Banner está a la derecha: Pivotar hacia la derecha
            motors.largeBC.tank(50, 20)
        }
    }

    pause(100) // Pausa de control de 100ms
})
