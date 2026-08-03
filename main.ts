// Configuramos los puertos 2 y 4 para que MakeCode trate a los sensores como IR nativo de LEGOooo
sensors.infrared2.setMode(InfraredSensorMode.Proximity);
sensors.infrared4.setMode(InfraredSensorMode.Proximity);

forever(function () {
    // --- Sensor puerto 245 ---
    let direccionBalon2 = sensors.infrared2.proximity();
    console.log("Lectura IR (puerto 2): " + direccionBalon2);

    if (direccionBalon2 == 0) {
        console.log("Puerto 2 - Estado: No detectado");
    } else if (direccionBalon2 > 45 && direccionBalon2 < 55) {
        console.log("Puerto 2 - Estado: Al frente");
    } else if (direccionBalon2 <= 45) {
        console.log("Puerto 2 - Estado: Izquierda");
    } else if (direccionBalon2 >= 55) {
        console.log("Puerto 2 - Estado: Derecha");
    }

    // --- Sensor puerto 4 ---
    let direccionBalon4 = sensors.infrared4.proximity();
    console.log("Lectura IR (puerto 4): " + direccionBalon4);

    if (direccionBalon4 == 0) {
        console.log("Puerto 4 - Estado: No detectado");
    } else if (direccionBalon4 > 45 && direccionBalon4 < 55) {
        console.log("Puerto 4 - Estado: Al frente");
    } else if (direccionBalon4 <= 45) {
        console.log("Puerto 4 - Estado: Izquierda");
    } else if (direccionBalon4 >= 55) {
        console.log("Puerto 4 - Estado: Derecha");
    }

    pause(100);
});
