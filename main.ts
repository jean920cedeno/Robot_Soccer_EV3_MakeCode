//5_2
let tiempoGiro = 0
let reflejo = 0
let balonEncontrado = false
let distancia = 0
let UMBRAL_BLANCO = 0
let VELOCIDAD_GIRO = 0
let VELOCIDAD_AVANCE = 0
// --- FASE 4: Empujar el balón hacia el arco ---
function empujarHaciaArco() {
    motors.largeBC.tank(VELOCIDAD_AVANCE, VELOCIDAD_AVANCE)
    pause(3000)
    motors.largeBC.stop()
}
// --- FASE 3: Buscar el arco (sensor de color puerto
// 2) ---
function buscarArco() {
    motors.largeBC.tank(VELOCIDAD_GIRO, 0 - VELOCIDAD_GIRO)
    sensors.color2.onColorDetected(ColorSensorColor.Blue, function () {
        arcoEncontrado = true
        motors.largeBC.stop()
        console.log("✅ ARCO detectado (azul)")
    })
    while (!(arcoEncontrado)) {
        loops.pause(50)
    }
}
// --- FASE 1: Buscar el balón blanco girando 360° ---
function buscarBalon() {
    while (!(balonEncontrado)) {
        // --- Girar (aprox. 360°, revisando el sensor
        // mientras gira) ---
        tiempoGiro = 0 
        let direccion = Math.random() < 0.5 ? 1 : -1
        motors.largeBC.tank(VELOCIDAD_GIRO * direccion, 0 - VELOCIDAD_GIRO * direccion)
        while (tiempoGiro < 3000 && !(balonEncontrado)) {
            reflejo = sensors.color3.light(LightIntensityMode.Reflected)
            if (reflejo >= UMBRAL_BLANCO) {
                balonEncontrado = true
                motors.largeBC.stop()
                console.log("✅ BALÓN detectado. Reflejo: " + reflejo)
            }
            loops.pause(50)
            tiempoGiro += 50
        }
        // --- Si no lo encontró, avanza un poco y repite ---
        if (!(balonEncontrado)) {
            motors.largeBC.stop()
            motors.largeBC.tank(VELOCIDAD_AVANCE, VELOCIDAD_AVANCE)
            pause(10)
            motors.largeBC.stop()
        }
    }
}
// --- FASE 2: Acercarse al balón ---
function acercarseAlBalon() {
    motors.largeBC.tank(VELOCIDAD_AVANCE, VELOCIDAD_AVANCE)
    distancia = sensors.infrared1.proximity()
    while (distancia > 10) {
        distancia = sensors.infrared1.proximity()
        loops.pause(50)
    }
    motors.largeBC.stop()
}
let arcoEncontrado = false
// Configuración de umbrales (ajusta según pruebas en
// tu simulador)
UMBRAL_BLANCO = 70
VELOCIDAD_GIRO = 20
VELOCIDAD_AVANCE = 75

motors.largeB.setInverted(true)   // ← LÍNEA AGREGADA: corrige la dirección del motor invertido
motors.largeC.setInverted(true)

// --- SECUENCIA PRINCIPAL ---
console.log("Iniciando búsqueda de balón...")
buscarBalon()
console.log("Balón encontrado. balonEncontrado = " + balonEncontrado)

pause(100)

console.log("Acercándose al balón...")
acercarseAlBalon()
console.log("Ya cerca del balón.")

console.log("Buscando arco...")
buscarArco()
console.log("Arco encontrado. arcoEncontrado = " + arcoEncontrado)

pause(100)

console.log("Empujando hacia el arco...")
empujarHaciaArco()
console.log("Tarea completada.")

brick.showString("Tarea completada", 1)

