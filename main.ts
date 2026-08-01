//5_30
brick.showPorts()
console.log("Ambient: " + sensors.color3.light(LightIntensityMode.Ambient))
console.log("Color: " + sensors.color3.color())
console.log("Ambient: " + sensors.color2.light(LightIntensityMode.Ambient))
console.log("Color: " + sensors.color2.color())
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
    console.log("→ Entrando a buscarArco()")
    motors.largeBC.tank(VELOCIDAD_GIRO, 0 - VELOCIDAD_GIRO)
    console.log("→ Motores girando para buscar arco")
    
    sensors.color2.onColorDetected(ColorSensorColor.Blue, function () {
        arcoEncontrado = true
        motors.largeBC.stop()
        console.log("✅ ARCO DETECTADO (azul)")
    })
    
    while (!(arcoEncontrado)) {
        loops.pause(50)
    }
    console.log("→ Saliendo de buscarArco()")
}
// --- FASE 1: Buscar el balón blanco girando 360° ---
function buscarBalon() {
    console.log("→ Entrando a buscarBalon()")
    let intentos = 0

    while (!(balonEncontrado)) {
        intentos += 1
        console.log("→ Intento #" + intentos + " del loop externo")

        tiempoGiro = 0
        let direccion = Math.random() < 0.5 ? 1 : -1
        console.log("→ Dirección elegida: " + direccion)

        motors.largeBC.tank(VELOCIDAD_GIRO * direccion, 0 - VELOCIDAD_GIRO * direccion)
        console.log("→ Girando...")

        let confirmaciones = 0
        let obstaculoDetectado = false

        while (tiempoGiro < 3000 && !(balonEncontrado) && !(obstaculoDetectado)) {
            distancia = sensors.infrared1.proximity()
            console.log("Proximity: [" + distancia + "]")

            if (distancia < 10) {
                confirmaciones += 1
                console.log("   Confirmación " + confirmaciones + "/2")
                if (confirmaciones >= 2) {
                    balonEncontrado = true
                    motors.largeBC.stop()
                    console.log("✅ BALÓN detectado. Proximity: " + distancia)
                }
            } else if (distancia < 20) {
                obstaculoDetectado = true
                console.log("⚠️ Obstáculo detectado (no confirmado como balón). Proximity: " + distancia)
            } else {
                confirmaciones = 0
            }

            loops.pause(50)
            tiempoGiro += 50
        }

        console.log("→ Salió del while interno. balonEncontrado=" + balonEncontrado + " obstaculoDetectado=" + obstaculoDetectado)

        if (obstaculoDetectado) {
            // --- Maniobra de esquive: giro de 180° + avance ---
            console.log("→ Ejecutando giro de 180° para esquivar")
            motors.largeBC.stop()
            motors.largeBC.tank(VELOCIDAD_GIRO, 0 - VELOCIDAD_GIRO)
            pause(1500)   // ajusta este tiempo para que sea aprox. 180° con tu VELOCIDAD_GIRO
            motors.largeBC.stop()

            console.log("→ Avanzando después del giro de 180°")
            motors.largeBC.tank(VELOCIDAD_AVANCE, VELOCIDAD_AVANCE)
            pause(800)
            motors.largeBC.stop()

            console.log("→ Volviendo a estado de búsqueda por giros")
        } else if (!(balonEncontrado)) {
            console.log("→ No encontrado, avanzando un poco...")
            motors.largeBC.stop()
            motors.largeBC.tank(VELOCIDAD_AVANCE, VELOCIDAD_AVANCE)
            pause(10)
            motors.largeBC.stop()
        }
    }
    console.log("→ Saliendo de buscarBalon(). balonEncontrado=" + balonEncontrado)
}
// --- FASE 2: Acercarse al balón ---
function acercarseAlBalon() {
    console.log("→ Entrando a acercarseAlBalon()")
    motors.largeBC.tank(VELOCIDAD_AVANCE, VELOCIDAD_AVANCE)
    distancia = sensors.infrared1.proximity()
    console.log("→ Distancia inicial: " + distancia)

    while (distancia > 10) {
        distancia = sensors.infrared1.proximity()
        console.log("   Distancia actual: " + distancia)
        loops.pause(50)
    }
    motors.largeBC.stop()
    console.log("→ Saliendo de acercarseAlBalon(). Distancia final: " + distancia)
}
let arcoEncontrado = false
// Configuración de umbrales (ajusta según pruebas en
// tu simulador)
VELOCIDAD_GIRO = 20
VELOCIDAD_AVANCE = 75
// --- TEST TEMPORAL DEL INFRARROJO ---
console.log("IR proximity: " + sensors.infrared1.proximity())
pause(3000)
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
