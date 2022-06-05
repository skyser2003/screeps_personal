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
            if (creep.memory.roleFunc !== undefined) {
                creep.memory.roleFunc(creep);
            } else {
                if (creep.memory.role === "harvester") {
                    RoleHarvester.run(creep);
                } else if (creep.memory.role === "upgrader") {
                    RoleUpgrader.run(creep);
                } else if (creep.memory.role === "builder") {
                    RoleBuilder.run(creep);
                }
            }
        }
    }
}
