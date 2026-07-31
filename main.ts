let balonEncontrado = false
let reflejo = 0
let UMBRAL_BLANCO = 0
let distancia = 0
let VELOCIDAD_AVANCE = 0
let VELOCIDAD_GIRO = 0
// --- FASE 1: Buscar el balón blanco girando 360° ---
function buscarBalon() {
    motors.largeBC.tank(VELOCIDAD_GIRO, 0 - VELOCIDAD_GIRO)
    while (!(balonEncontrado)) {
        reflejo = sensors.color3.light(LightIntensityMode.Reflected)
        if (reflejo >= UMBRAL_BLANCO) {
            balonEncontrado = true
            motors.largeBC.stop()
        }
        loops.pause(50)
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
// --- FASE 3: Buscar el arco (sensor de color puerto
// 2) ---
function buscarArco() {
    motors.largeBC.tank(VELOCIDAD_GIRO, 0 - VELOCIDAD_GIRO)
    sensors.color3.onColorDetected(ColorSensorColor.Blue, function () {
        arcoEncontrado = true
        motors.largeBC.stop()
    })
while (!(arcoEncontrado)) {
        loops.pause(50)
    }
}
// --- FASE 4: Empujar el balón hacia el arco ---
function empujarHaciaArco() {
    motors.largeBC.tank(VELOCIDAD_AVANCE, VELOCIDAD_AVANCE)
    pause(3000)
    motors.largeBC.stop()
}
let arcoEncontrado = false
// Configuración de umbrales (ajusta según pruebas en
// tu simulador)
UMBRAL_BLANCO = 70
VELOCIDAD_GIRO = 20
VELOCIDAD_AVANCE = 75
// --- SECUENCIA PRINCIPAL ---
buscarBalon()
pause(100)
acercarseAlBalon()
buscarArco()
pause(100)
empujarHaciaArco()
brick.showString("Tarea completada", 1)
