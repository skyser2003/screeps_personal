import { RoleBuilder, RoleHarvester, RoleUpgrader } from "./roles";

export class CreepManager {
    constructor(private id_: string, private obj_: Room) {}

    run() {
        const creeps = this.obj_.find(FIND_MY_CREEPS);

        for (const creep of creeps) {
            if (creep.memory.roleFunc !== undefined) {
                creep.memory.roleFunc(creep);
            } else {
                if (creep.memory.role === "harvester") {
                    RoleHarvester.run(creep);
                }

                if (creep.memory.role === "upgrader") {
                    RoleUpgrader.run(creep);
                }

                if (creep.memory.role === "builder") {
                    RoleBuilder.run(creep);
                }
            }
        }
    }
}
