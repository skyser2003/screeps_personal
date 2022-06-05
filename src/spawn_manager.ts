import _ from "lodash";

import { RoleBuilder, RoleHarvester, RoleUpgrader } from "./roles";

export class SpawnManager {
    harvesters: Creep[] = [];
    upgraders: Creep[] = [];
    builders: Creep[] = [];

    constructor(private id_: string, private obj_: StructureSpawn) {
        this.refresh();
    }

    get id() {
        return this.id_;
    }

    get obj() {
        return this.obj_;
    }

    refresh() {
        for (const name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log("Clearing non-existing creep memory:", name);
            }
        }

        this.harvesters = _.filter(
            Game.creeps,
            (creep: Creep) => creep.memory.role === "harvester"
        );

        this.builders = _.filter(
            Game.creeps,
            (creep: Creep) => creep.memory.role === "builder"
        );

        this.upgraders = _.filter(
            Game.creeps,
            (creep: Creep) => creep.memory.role === "upgrader"
        );
    }

    run() {
        this.refresh();

        const numHarvesters = this.harvesters.length;
        const numBuilders = this.builders.length;
        const numUpgraders = this.upgraders.length;

        console.log(`Harvesters: ${numHarvesters}`);
        console.log(`Builders: ${numBuilders}`);
        console.log(`Upgraders: ${numUpgraders}`);

        const maxEnergy = this.obj_.room.energyCapacityAvailable;
        const currentEnergy = this.obj_.room.energyAvailable;

        console.log(
            `Room ${this.id} max energy: ${maxEnergy}, current energy: ${currentEnergy}`
        );

        // Harvester : Builder : Upgrader = 2:1:2
        // Base num harvesters: 4

        if (numHarvesters === 0) {
            this.spawnHarvester(currentEnergy);
        } else {
            if (numHarvesters < 4) {
                this.spawnHarvester(currentEnergy);
            }

            if (numBuilders < numHarvesters / 2) {
                this.spawnBuilder(currentEnergy);
            }

            if (numUpgraders < numHarvesters) {
                this.spawnUpgrader(currentEnergy);
            }
        }
    }

    spawnHarvester(totalEnergy: number) {
        const newName = "Harvester" + Game.time;
        const parts = this.calculateParts(totalEnergy, [CARRY, WORK, MOVE]);

        const result = this.obj_.spawnCreep(parts, newName, {
            memory: {
                role: "harvester",
                roleFunc: RoleHarvester.run,
            },
        });

        if (result === OK) {
            console.log(`Spawning new harvester: ${newName}`);

            console.log(
                `Harvester parts: [${parts}], total energy: ${this.requiredEnergy(
                    parts
                )}`
            );
        }
    }

    spawnBuilder(totalEnergy: number) {
        const newName = "Builder" + Game.time;
        const parts = this.calculateParts(totalEnergy, [CARRY, MOVE, WORK]);

        const result = this.obj_.spawnCreep(parts, newName, {
            memory: { role: "builder", roleFunc: RoleBuilder.run },
        });

        if (result === OK) {
            console.log(`Spawning new builder: ${newName}`);
            console.log(
                `Builder parts: [${parts}], total energy: ${this.requiredEnergy(
                    parts
                )}`
            );
        }
    }

    spawnUpgrader(totalEnergy: number) {
        const newName = "Upgrader" + Game.time;
        const parts = this.calculateParts(totalEnergy, [CARRY, MOVE, WORK]);

        const result = this.obj_.spawnCreep(parts, newName, {
            memory: { role: "upgrader", roleFunc: RoleUpgrader.run },
        });

        if (result === OK) {
            console.log(`Spawning new upgrader: ${newName}`);

            console.log(
                `Upgrader parts: [${parts}], total energy: ${this.requiredEnergy(
                    parts
                )}`
            );
        }
    }

    requiredEnergy(parts: BodyPartConstant[]) {
        let sum = 0;

        for (const part of parts) {
            sum += BODYPART_COST[part];
        }

        return sum;
    }

    get defaultParts() {
        return [CARRY, MOVE, WORK] as BodyPartConstant[];
    }

    calculateParts(currentEnergy: number, partsOrder: BodyPartConstant[]) {
        const parts = this.defaultParts;

        let leftEnergy = currentEnergy - this.requiredEnergy(parts);

        while (0 < leftEnergy) {
            let partAdded = false;

            for (const addPart of partsOrder) {
                const partEnergy = this.requiredEnergy([addPart]);

                if (0 <= leftEnergy - partEnergy) {
                    leftEnergy -= partEnergy;
                    parts.push(addPart);

                    partAdded = true;
                }
            }

            if (partAdded === false) {
                break;
            }
        }

        return parts;
    }
}
