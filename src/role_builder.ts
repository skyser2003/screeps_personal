import { RoleHarvester } from "./role_harvester";

declare global {
    interface CreepMemory {
        building?: boolean;
        upgrading?: boolean;
    }
}

export class RoleBuilder {
    static run(creep: Creep) {
        if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.building = false;
            creep.say("🔄 harvest");
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() === 0) {
            creep.memory.building = true;
            creep.say("🚧 build");
        }

        if (creep.memory.building) {
            const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length !== 0) {
                if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {
                        visualizePathStyle: { stroke: "#ffffff" },
                    });
                }
            } else {
                const spawns = creep.room.find(FIND_MY_SPAWNS);

                if (spawns.length !== 0) {
                    const spawn = spawns[0];
                    const xSign = Math.random() * 2 >= 1 ? 1 : -1;
                    const ySign = Math.random() * 2 >= 1 ? 1 : -1;

                    const x =
                        spawn.pos.x + Math.ceil(Math.random() * 2) * xSign;
                    const y =
                        spawn.pos.y + Math.ceil(Math.random() * 2) * ySign;

                    const result = creep.room.createConstructionSite(
                        x,
                        y,
                        STRUCTURE_EXTENSION
                    );

                    if (result !== OK) {
                        return RoleHarvester.run(creep);
                    }

                    console.log(
                        `Creating extension construction site: (${x}, ${y}), return code: ${result}`
                    );
                }
            }
        } else {
            const sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {
                    visualizePathStyle: { stroke: "#ffaa00" },
                });
            }
        }
    }
}
