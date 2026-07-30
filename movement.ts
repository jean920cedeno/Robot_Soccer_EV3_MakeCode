namespace RobotSoccer {
    export class Movement {
        private hardware: RobotHardware

        constructor(hardware: RobotHardware) {
            this.hardware = hardware
        }

        forward() { this.hardware.drive(Config.DRIVE_SPEED, Config.DRIVE_SPEED) }
        reverse() { this.hardware.drive(-Config.DRIVE_SPEED, -Config.DRIVE_SPEED) }
        turnLeft() { this.hardware.drive(-Config.TURN_SPEED, Config.TURN_SPEED) }
        turnRight() { this.hardware.drive(Config.TURN_SPEED, -Config.TURN_SPEED) }
        stop() { this.hardware.stopDrive() }
        kick() { this.hardware.runAuxiliary(Config.AUXILIARY_SPEED) }
    }
}
