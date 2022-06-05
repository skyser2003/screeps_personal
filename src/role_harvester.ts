import * as _ from "lodash";
import { RoleUpgrader } from "./role_upgrader";

declare global {
    interface CreepMemory {
        energySourceId?: string;
        energyTargetId?: string;
    }
}

export class RoleHarvester {
    static run(creep: Creep) {
        const hasCapacity = creep.store.getFreeCapacity() > 0;

        let energySourceId = creep.memory.energySourceId;

        if (energySourceId === undefined) {
            if (hasCapacity) {
                const sources = creep.room.find(FIND_SOURCES);

                const sampled = _.sample(sources);
                if (sampled !== undefined) {
                    energySourceId = creep.memory.energySourceId = sampled.id;
                }
            }
        }

        if (hasCapacity && energySourceId !== undefined) {
            const energySource = Game.getObjectById(
                energySourceId as Id<Source>
            )!;

            if (creep.harvest(energySource) === ERR_NOT_IN_RANGE) {
                creep.moveTo(energySource, {
                    visualizePathStyle: { stroke: "#ffaa00" },
                });
            }
        } else {
            creep.memory.energySourceId = undefined;

            let energyTargetId = creep.memory.energyTargetId;

            if (energyTargetId === undefined) {
                const targets: (
                    | StructureExtension
                    | StructureSpawn
                    | StructureTower
                )[] = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            (structure.structureType === STRUCTURE_EXTENSION ||
                                structure.structureType === STRUCTURE_SPAWN ||
                                structure.structureType === STRUCTURE_TOWER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                        );
                    },
                });

                const sampled = _.sample(targets);

                if (sampled !== undefined) {
                    energyTargetId = creep.memory.energyTargetId = sampled.id;
                }
            }

            if (energyTargetId !== undefined) {
                const energyTarget = Game.getObjectById(
                    energyTargetId as Id<
                        StructureExtension | StructureSpawn | StructureTower
                    >
                )!;
                if (
                    creep.transfer(energyTarget, RESOURCE_ENERGY) ==
                    ERR_NOT_IN_RANGE
                ) {
                    creep.moveTo(energyTarget, {
                        visualizePathStyle: { stroke: "#ffffff" },
                    });
                }

                if (energyTarget.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
                    creep.memory.energyTargetId = undefined;
                }
            } else {
                return RoleUpgrader.run(creep);
            }
        }
    }
}
