console.log("=== FILTRO ESTRICTO: 9 DIRECCIONES VÁLIDAS CON INTENSIDAD MINIMA = 8 ===")

sensors.infrared3.setMode(0) // Puerto 3: Pelota (Modo AC)
sensors.infrared2.setMode(1) // Puerto 2: Banner (Modo DC)

const INTENSIDAD_MINIMA = 8 
const UMBRAL_OBSTACULO = 10 

let ciclosBusqueda = 0
const MAX_CICLOS_GIRO = 15 

basic.forever(function () {
    let proximidadObstaculo = sensors.infrared1.proximity()
    let dirBalon = sensors.infrared3.getNumber(NumberFormat.UInt8LE, 0)
    let fuerzaBalon = sensors.infrared3.getNumber(NumberFormat.UInt8LE, 6)
    let dirBanner = sensors.infrared2.getNumber(NumberFormat.UInt8LE, 0)

    // Acepta cualquier dirección (1 a 9), PERO exige sí o sí fuerza >= 8
    let hayPelota = (dirBalon > 0) && (fuerzaBalon >= INTENSIDAD_MINIMA)

    // --- PRIORIDAD 1: OBSTÁCULO REAL ---
    if (!hayPelota && proximidadObstaculo < UMBRAL_OBSTACULO) {
        console.log("¡OBSTÁCULO DETECTADO! (Prox: " + proximidadObstaculo + "%). Marcha atrás 5s...")
        motors.largeBC.tank(-50, -50)
        pause(500)
        ciclosBusqueda = 0
    } 

    // --- PRIORIDAD 2: BUSCAR PELOTA ---
    else if (!hayPelota) {
        ciclosBusqueda++

        if (ciclosBusqueda >= MAX_CICLOS_GIRO) {
            console.log("Reubicando robot tras 15 ciclos...")
            motors.largeBC.tank(40, 40)
            pause(2000)
            ciclosBusqueda = 0
        } else {
            motors.largeBC.tank(15, -15) // Giro lento
        }
    } 

    // --- PRIORIDAD 3: PELOTA CONFIRMADA (FUERZA >= 8) ---
    else {
        ciclosBusqueda = 0 

        if (dirBalon !== 5) {
            console.log("Pelota confirmada (Fuerza: " + fuerzaBalon + "). Reorientando (Dir: " + dirBalon + ")...")
            if (dirBalon < 5) {
                motors.largeBC.tank(12, 30) // Izquierda (direcciones 1, 2, 3, 4)
            } else {
                motors.largeBC.tank(30, 12) // Derecha (direcciones 6, 7, 8, 9)
            }
        } 
        else {
            console.log("¡Pelota al centro (Dir 5)! Fuerza: " + fuerzaBalon + ". Atacando al Banner...")
            if (dirBanner === 5) {
                motors.largeBC.tank(80, 80)
            } else if (dirBanner < 5 || dirBanner === 0) {
                motors.largeBC.tank(20, 50)
            } else {
                motors.largeBC.tank(50, 20)
            }
        }
    }

    pause(100)
})
