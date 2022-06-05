import { RoleBuilder, RoleHarvester, RoleUpgrader } from "./roles";

export class CreepManager {
    private obj_: Room;

    constructor(private id_: string) {
        this.obj_ = undefined as any;

        this.refresh();
    }

    refresh() {
        this.obj_ = Game.rooms[this.id_];
    }

    run() {
        this.refresh();

        const creeps = this.obj_.find(FIND_MY_CREEPS);

        for (const creep of creeps) {
            if (creep.memory.role === "harvester") {
                creep.memory.roleFunc = RoleHarvester.run;
            } else if (creep.memory.role === "upgrader") {
                creep.memory.roleFunc = RoleUpgrader.run;
            } else if (creep.memory.role === "builder") {
                creep.memory.roleFunc = RoleBuilder.run;
            }

            if (creep.memory.roleFunc !== undefined) {
                creep.memory.roleFunc(creep);
            }
        }
    }
}
