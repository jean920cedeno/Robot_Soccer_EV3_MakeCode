console.log("=== SISTEMA CON BÚSQUEDA RÁPIDA (15 CICLOS) Y DESPLAZAMIENTO DOBLE ===")

sensors.infrared3.setMode(0) // Puerto 3: Pelota (Modo AC)
sensors.infrared2.setMode(1) // Puerto 2: Banner (Modo DC)

const INTENSIDAD_MINIMA = 8 

// Variables para controlar las vueltas y tiempo de búsqueda
let ciclosBusqueda = 0
// Reducido a 15 ciclos por petición
const MAX_CICLOS_GIRO = 15 

basic.forever(function () {
    let dirBalon = sensors.infrared3.getNumber(NumberFormat.UInt8LE, 0)
    let fuerzaBalon = sensors.infrared3.getNumber(NumberFormat.UInt8LE, 6)
    let dirBanner = sensors.infrared2.getNumber(NumberFormat.UInt8LE, 0)

    let hayPelota = (dirBalon >= 1 && dirBalon <= 9) && (fuerzaBalon >= INTENSIDAD_MINIMA)

    // --- FASE 1: BUSCANDO LA PELOTA ---
    if (!hayPelota) {
        ciclosBusqueda++

        // Si llega a los 15 ciclos sin ver el balón, avanza el doble de distancia
        if (ciclosBusqueda >= MAX_CICLOS_GIRO) {
            console.log("¡Alcanzado límite de " + MAX_CICLOS_GIRO + " ciclos! Avanzando el doble de distancia...")
            
            // Avanza recto a velocidad moderada durante 2000 ms (el doble de tiempo)
            motors.largeBC.tank(40, 40)
            pause(2000) 
            
            // Reiniciamos el contador para buscar desde la nueva posición
            ciclosBusqueda = 0
        } else {
            console.log("Giro de búsqueda lento (" + ciclosBusqueda + "/" + MAX_CICLOS_GIRO + ")...")
            // Giro lento sobre su propio eje
            motors.largeBC.tank(15, -15) 
        }
    } 
    
    // --- FASE 2: PELOTA ENCONTRADA ---
    else {
        // En cuanto detecta el balón real, reseteamos el contador
        ciclosBusqueda = 0 

        if (dirBalon !== 5) {
            console.log("¡Pelota detectada! Ajustando rumbo (Dir: " + dirBalon + ")")
            if (dirBalon < 5) {
                motors.largeBC.tank(12, 30) // Ajuste suave a la izquierda
            } else {
                motors.largeBC.tank(30, 12) // Ajuste suave a la derecha
            }
        } 
        else {
            console.log("¡Pelota centrada! Apuntando al Blue Banner...")
            if (dirBanner === 5) {
                motors.largeBC.tank(80, 80) // Ataque directo a gol
            } else if (dirBanner < 5 || dirBanner === 0) {
                motors.largeBC.tank(20, 50)
            } else {
                motors.largeBC.tank(50, 20)
            }
        }
    }

    pause(100)
})
