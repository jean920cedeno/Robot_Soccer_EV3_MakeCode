let balonEncontrado = false
let arcoEncontrado = 0
let reflejo = 0
let UMBRAL_AZUL = 0
let VELOCIDAD_AVANCE = 0
let VELOCIDAD_GIRO = 0
let UMBRAL_BLANCO = 0
let distancia = 0
// --- FASE 3: Buscar el arco (beacon IR o color azul)
// ---
function buscarArco() {
    motors.largeBC.tank(VELOCIDAD_GIRO, 0 - VELOCIDAD_GIRO)
    control.runInParallel(function () {
        while (!(arcoEncontrado)) {
            loops.pause(50)
        }
    })
}
// --- FASE 4: Empujar el balón hacia el arco ---
function empujarHaciaArco() {
    motors.largeBC.tank(VELOCIDAD_AVANCE, VELOCIDAD_AVANCE)
    pause(3000)
    motors.largeBC.stop()
}
// --- FASE 1: Buscar el balón blanco girando 360° ---
function buscarBalon() {
    motors.largeBC.tank(VELOCIDAD_GIRO, 0 - VELOCIDAD_GIRO)
    control.runInParallel(function () {
        while (!(balonEncontrado)) {
            reflejo = sensors.color3.light(LightIntensityMode.Reflected)
            if (reflejo >= UMBRAL_BLANCO) {
                balonEncontrado = true
                motors.largeBC.stop()
            }
            loops.pause(50)
        }
    })
}
// --- FASE 2: Acercarse al balón ---
function acercarseAlBalon() {
    motors.largeBC.tank(VELOCIDAD_AVANCE, VELOCIDAD_AVANCE)
    distancia = sensors.infrared1.proximity()
    while (distancia > 10) {
        loops.pause(50)
    }
    motors.largeBC.stop()
}
distancia = 0
// Configuración de umbrales (ajusta según pruebas en
// tu simulador)
UMBRAL_BLANCO = 70
UMBRAL_AZUL = 30
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
