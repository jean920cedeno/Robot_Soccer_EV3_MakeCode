console.log("=== SISTEMA CON FILTRO DE OBSTÁCULO (EVITA CONFUNDIR LA PELOTA) ===")

sensors.infrared3.setMode(0) // Puerto 3: Pelota (Modo AC)
sensors.infrared2.setMode(1) // Puerto 2: Banner (Modo DC)

const INTENSIDAD_MINIMA = 8 
const UMBRAL_OBSTACULO = 20 

let ciclosBusqueda = 0
const MAX_CICLOS_GIRO = 15 

basic.forever(function () {
    // 1. Lecturas de sensores
    let proximidadObstaculo = sensors.infrared1.proximity()
    let dirBalon = sensors.infrared3.getNumber(NumberFormat.UInt8LE, 0)
    let fuerzaBalon = sensors.infrared3.getNumber(NumberFormat.UInt8LE, 6)
    let dirBanner = sensors.infrared2.getNumber(NumberFormat.UInt8LE, 0)

    // Comprobamos si la pelota está realmente presente
    let hayPelota = (dirBalon >= 1 && dirBalon <= 9) && (fuerzaBalon >= INTENSIDAD_MINIMA)

    // --- PRIORIDAD 1: OBSTÁCULO REAL (Solo si NO es la pelota) ---
    if (!hayPelota && proximidadObstaculo < UMBRAL_OBSTACULO) {
        console.log("¡OBSTÁCULO DETECTADO! (Proximidad P1: " + proximidadObstaculo + "% sin pelota a la vista). Retrocediendo 5s...")
        
        // Retroceder 5 segundos
        motors.largeBC.tank(-50, -50)
        pause(500)
        
        // Reiniciar ciclo de búsqueda
        ciclosBusqueda = 0
    } 

    // --- PRIORIDAD 2: BÚSQUEDA DE PELOTA ---
    else if (!hayPelota) {
        ciclosBusqueda++

        if (ciclosBusqueda >= MAX_CICLOS_GIRO) {
            console.log("Límite de giro alcanzado (" + MAX_CICLOS_GIRO + " ciclos). Avanzando en recta...")
            motors.largeBC.tank(40, 40)
            pause(2000)
            ciclosBusqueda = 0
        } else {
            console.log("Giro de búsqueda lento (" + ciclosBusqueda + "/" + MAX_CICLOS_GIRO + ")...")
            motors.largeBC.tank(15, -15) 
        }
    } 

    // --- PRIORIDAD 3: PERSEGUIR Y PATALEAR LA PELOTA ---
    else {
        ciclosBusqueda = 0 

        if (dirBalon !== 5) {
            console.log("Pelota a la vista. Ajustando rumbo (Dir: " + dirBalon + ")")
            if (dirBalon < 5) {
                motors.largeBC.tank(12, 30) // Giro suave a la izquierda
            } else {
                motors.largeBC.tank(30, 12) // Giro suave a la derecha
            }
        } 
        else {
            console.log("¡Pelota al centro! Proximidad frontal: " + proximidadObstaculo + "%. Dirigiéndose al Banner...")
            
            if (dirBanner === 5) {
                motors.largeBC.tank(80, 80) // Empujar la pelota al arco
            } else if (dirBanner < 5 || dirBanner === 0) {
                motors.largeBC.tank(20, 50)
            } else {
                motors.largeBC.tank(50, 20)
            }
        }
    }

    pause(100)
})
