console.log("=== SISTEMA CON GIRO LENTO Y NAVEGACIÓN DE BÚSQUEDA ===")

sensors.infrared3.setMode(0) // Puerto 3: Pelota (Modo AC)
sensors.infrared2.setMode(1) // Puerto 2: Banner (Modo DC)

const INTENSIDAD_MINIMA = 8 

// Variables para controlar las vueltas y tiempo de búsqueda
let ciclosBusqueda = 0
// Un giro completo a velocidad 15 toma ~25 ciclos (a 100ms por ciclo). 
// 3 a 4 vueltas equivalen a unos 80-100 ciclos.
const MAX_CICLOS_GIRO = 80 

basic.forever(function () {
    let dirBalon = sensors.infrared3.getNumber(NumberFormat.UInt8LE, 0)
    let fuerzaBalon = sensors.infrared3.getNumber(NumberFormat.UInt8LE, 6)
    let dirBanner = sensors.infrared2.getNumber(NumberFormat.UInt8LE, 0)

    let hayPelota = (dirBalon >= 1 && dirBalon <= 9) && (fuerzaBalon >= INTENSIDAD_MINIMA)

    // --- FASE 1: BUSCANDO LA PELOTA ---
    if (!hayPelota) {
        ciclosBusqueda++

        // ¿Ya dio entre 3 y 4 vueltas completas sin encontrar nada?
        if (ciclosBusqueda >= MAX_CICLOS_GIRO) {
            console.log("¡Varias vueltas sin ver el balón! Avanzando unos centímetros para cambiar de zona...")
            // Avanza recto a velocidad moderada durante 1 segundo
            motors.largeBC.tank(40, 40)
            pause(1000) 
            
            // Reiniciamos el contador para volver a intentar buscar desde la nueva posición
            ciclosBusqueda = 0
        } else {
            console.log("Giro de búsqueda lento (" + ciclosBusqueda + "/" + MAX_CICLOS_GIRO + ")...")
            // Giro mucho más lento en su eje para mayor precisión de lectura
            motors.largeBC.tank(15, -15) 
        }
    } 
    
    // --- FASE 2: PELOTA ENCONTRADA ---
    else {
        // En cuanto detecta el balón real, reseteamos el contador de búsqueda
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
