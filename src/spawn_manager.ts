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

        const totalEnergy = this.obj_.room.energyCapacityAvailable;

        console.log(`Total energy available: ${totalEnergy}`);

        // Harvester : Builder : Upgrader = 2:1:2
        // Base num harvesters: 4

        if (numHarvesters < 4) {
            this.spawnHarvester(totalEnergy);
        }

        if (numBuilders < numHarvesters / 2) {
            this.spawnBuilder(totalEnergy);
        }

        if (numUpgraders < numHarvesters) {
            this.spawnUpgrader(totalEnergy);
        }
    }

    spawnHarvester(totalEnergy: number) {
        const newName = "Harvester" + Game.time;

        console.log(`Spawning new harvester: ${newName}`);

        const parts = this.calculateParts(totalEnergy, [CARRY, WORK, MOVE]);

        this.obj_.spawnCreep(parts, newName, {
            memory: {
                role: "harvester",
                roleFunc: RoleHarvester.run,
            },
        });
    }

    spawnBuilder(totalEnergy: number) {
        const newName = "Builder" + Game.time;

        console.log(`Spawning new builder: ${newName}`);

        const parts = this.calculateParts(totalEnergy, [CARRY, MOVE, WORK]);

        this.obj_.spawnCreep(parts, newName, {
            memory: { role: "builder", roleFunc: RoleBuilder.run },
        });
    }

    spawnUpgrader(totalEnergy: number) {
        const newName = "Upgrader" + Game.time;

        console.log(`Spawning new upgrader: ${newName}`);

        const parts = this.calculateParts(totalEnergy, [CARRY, MOVE, WORK]);

        this.obj_.spawnCreep(parts, newName, {
            memory: { role: "upgrader", roleFunc: RoleUpgrader.run },
        });
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
            for (const addPart of partsOrder) {
                const partEnergy = this.requiredEnergy([addPart]);
                leftEnergy -= partEnergy;

                if (0 <= leftEnergy) {
                    parts.push(addPart);
                } else {
                    break;
                }
            }
        }

        return parts;
    }
}
