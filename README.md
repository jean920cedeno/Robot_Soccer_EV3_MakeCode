# Robot Soccer EV3 MakeCode

Runtime para Microsoft MakeCode EV3 del robot de fútbol autónomo. El comportamiento de búsqueda, aproximación, ataque, defensa y recuperación se mantiene separado de la plataforma física. El proyecto declara la dependencia oficial `ev3` de MakeCode, que proporciona las APIs de motores, sensores y botones del ladrillo.

## Arquitectura

`config.ts` es la única fuente de verdad para la configuración física y operativa del robot. `hardware.ts` contiene la interfaz `RobotHardware` y su implementación `EV3RobotHardware`, la única frontera que llama a las APIs de MakeCode EV3.

Las estrategias, la máquina de estados, el movimiento y los sensores dependen de `RobotHardware`; no conocen puertos ni objetos de MakeCode. Esta separación permite sustituir el adaptador EV3 por uno de simulación o de otra plataforma sin modificar la lógica del robot.

## Configuración oficial

| Componente | Configuración |
| --- | --- |
| Motor izquierdo | Puerto B, motor grande |
| Motor derecho | Puerto C, motor grande |
| Motor auxiliar | Puerto A, motor mediano |
| Sensor infrarrojo | Puerto 1 |

Los enlaces concretos se definen como `Config.LEFT_MOTOR`, `Config.RIGHT_MOTOR`, `Config.AUXILIARY_MOTOR` y `Config.INFRARED_SENSOR` en `config.ts`.

## Parámetros físicos y de navegación

| Parámetro | Valor |
| --- | ---: |
| Diámetro de rueda | 56 mm |
| Radio de rueda | 28 mm |
| Circunferencia de rueda | Derivada del diámetro |
| Distancia entre ruedas | 120 mm |
| Velocidad nominal | 35 % |
| Velocidad de giro | 25 % |
| Umbral IR de detección | 65 |
| Umbral IR de ataque | 25 |

Las velocidades, temporizaciones de búsqueda/recuperación y umbrales también viven exclusivamente en `config.ts`.

## Personalización

Para adaptar el proyecto a otro robot, modifique únicamente `config.ts`: puertos, tipos de actuador/sensor, sentido de giro, dimensiones, velocidades y constantes de navegación.

No modifique `hardware.ts`, `movement.ts`, `sensors.ts`, `stateMachine.ts`, `strategy.ts`, `attack.ts`, `defense.ts`, `search.ts` ni `recovery.ts` para cambiar la configuración física.

## Filosofía

La configuración oficial está centralizada y la lógica se programa contra la abstracción `RobotHardware`. Así se evitan puertos, dimensiones y valores físicos repetidos, y se facilita la prueba, la simulación y una futura migración de plataforma.

## Importar y compilar

1. Publique este directorio como un repositorio GitHub.
2. Abra [Microsoft MakeCode EV3](https://makecode.mindstorms.com/).
3. Seleccione **Import Project** → **Import URL** e introduzca la URL del repositorio.
4. Compile y descargue el archivo `.uf2` para el EV3 o Virtual Robot Toolkit.

## Controles

- Botón **Up**: inicia o reanuda `SEARCH`.
- Botón **Enter**: detiene los motores y pasa a `STOP`.
