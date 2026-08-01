// --- TEST COMBINADO: showPorts() + console.log del color ---
console.log("=== INICIANDO TEST COMBINADO ===")

for (let i = 0; i < 10; i++) {
    brick.showPorts()
    let colorLeido = sensors.color3.color()
    console.log("Color (puerto 3): [" + colorLeido + "]  (i=" + i + ")")
    pause(500)
}

console.log("=== TEST TERMINADO ===")
