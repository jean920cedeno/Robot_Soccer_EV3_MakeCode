let hardware = new RobotSoccer.EV3Runtime()
let movement = new RobotSoccer.Movement(hardware)
let sensorsRuntime = new RobotSoccer.Sensors(hardware)
let stateMachine = new RobotSoccer.StateMachine(hardware)
let searchStrategy = new RobotSoccer.SearchStrategy()
let attackStrategy = new RobotSoccer.AttackStrategy()
let defenseStrategy = new RobotSoccer.DefenseStrategy()
let recoveryStrategy = new RobotSoccer.RecoveryStrategy()

forever(function () {
    if (hardware.enterPressed()) {
        stateMachine.transition(RobotSoccer.RobotState.STOP)
        hardware.stopAll()
    } else if (hardware.upPressed()) {
        stateMachine.transition(RobotSoccer.RobotState.SEARCH)
    }

    let snapshot = sensorsRuntime.read()
    stateMachine.update(snapshot, sensorsRuntime, movement)

    if (stateMachine.current() == RobotSoccer.RobotState.SEARCH) {
        searchStrategy.run(snapshot, movement)
    } else if (stateMachine.current() == RobotSoccer.RobotState.APPROACH || stateMachine.current() == RobotSoccer.RobotState.ATTACK) {
        attackStrategy.run(snapshot, movement)
    } else if (stateMachine.current() == RobotSoccer.RobotState.DEFEND) {
        defenseStrategy.run(snapshot, movement)
    } else if (stateMachine.current() == RobotSoccer.RobotState.RECOVER) {
        recoveryStrategy.run(snapshot, movement)
    }
    pause(RobotSoccer.Config.LOOP_INTERVAL_MS)
})
