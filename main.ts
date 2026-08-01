//5_275eedAAq
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

// --- Retroceder hasta alejarse del obstáculo ---
function marchaAtras() {
    console.log("→ Iniciando marcha atrás")
    motors.largeBC.tank(0 - VELOCIDAD_AVANCE, 0 - VELOCIDAD_AVANCE)

    let distanciaActual = sensors.infrared1.proximity()
    while (distanciaActual <= 30) {
        distanciaActual = sensors.infrared1.proximity()
        console.log("Proximity retrocediendo: [" + distanciaActual + "]")
        loops.pause(50)
    }

    motors.largeBC.stop()
    console.log("→ Marcha atrás terminada. Proximity final: [" + distanciaActual + "]")
}

// --- FASE 4: Empujar el balón hacia el arco ---
function empujarHaciaArco() {
    motors.largeBC.tank(VELOCIDAD_AVANCE, VELOCIDAD_AVANCE)
    pause(3000)
    motors.largeBC.stop()
}
// --- FASE 3: Buscar el arco (sensor de color puerto 2) ---
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
// --- FASE 1: Buscar el balón blanco girando 360° (color + infrarrojo combinados) ---
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

        let obstaculoDetectado = false

        while (tiempoGiro < 3000 && !(balonEncontrado) && !(obstaculoDetectado)) {
            distancia = sensors.infrared1.proximity()
            let colorDetectado = sensors.color3.color()
            console.log("Proximity: [" + distancia + "] | Color: [" + colorDetectado + "]")

            // --- BALÓN: cerca (menos de 15) Y blanco ---
            if (distancia < 15 && colorDetectado == ColorSensorColor.White) {
                balonEncontrado = true
                motors.largeBC.stop()
                console.log("✅ BALÓN detectado (Proximity<15 Y Color=White)")
            }
            // --- OBSTÁCULO: cerca (menos de 20) Y (negro O azul) ---
            else if (distancia < 20 && (colorDetectado == ColorSensorColor.Black || colorDetectado == ColorSensorColor.Blue)) {
                obstaculoDetectado = true
                console.log("⚠️ Obstáculo detectado. Color: [" + colorDetectado + "] Proximity: " + distancia)
            }

            loops.pause(50)
            tiempoGiro += 50
        }

        console.log("→ Salió del while interno. balonEncontrado=" + balonEncontrado + " obstaculoDetectado=" + obstaculoDetectado)

        if (obstaculoDetectado) {
            marchaAtras()

            console.log("→ Ejecutando giro de 180° para esquivar")
            motors.largeBC.stop()
            motors.largeBC.tank(VELOCIDAD_GIRO, 0 - VELOCIDAD_GIRO)
            pause(2292)
            motors.largeBC.stop()

            console.log("→ Avanzando después del giro de 180°")
            motors.largeBC.tank(VELOCIDAD_AVANCE, VELOCIDAD_AVANCE)
            pause(6000)
            motors.largeBC.stop()

            console.log("→ Volviendo a estado de búsqueda por giros")
        } else if (!(balonEncontrado)) {
            console.log("→ No encontrado, avanzando un poco...")
            motors.largeBC.stop()
            motors.largeBC.tank(VELOCIDAD_AVANCE, VELOCIDAD_AVANCE)
            pause(6000)
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
VELOCIDAD_GIRO = 20
VELOCIDAD_AVANCE = 75
console.log("IR proximity: " + sensors.infrared1.proximity())
pause(3000)
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
