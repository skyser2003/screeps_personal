import { SpawnManager } from "./spawn_manager";
import { RoleBuilder, RoleHarvester, RoleUpgrader } from "./roles";
import { CreepManager } from "./creep_manager";
import { TowerManager } from "./tower_manager";

export class GameManager {
    spawnManagers: Map<string, SpawnManager> = new Map();
    creepManagers: Map<string, CreepManager> = new Map();
    towerManagers: Map<string, TowerManager> = new Map();

    constructor() {
        this.refresh();
    }

    refresh() {
        for (const id in Game.spawns) {
            console.log(`Spawn exists: ${id}`);

            const spawn = Game.spawns[id];

            if (this.spawnManagers.get(id) === undefined) {
                const manager = new SpawnManager(id, spawn);
                this.spawnManagers.set(id, manager);
            }
        }

        for (const id in Game.rooms) {
            console.log(`Room exists: ${id}`);

            const room = Game.rooms[id];

            if (this.creepManagers.get(id) === undefined) {
                const cm = new CreepManager(id, room);
                this.creepManagers.set(id, cm);
            }

            if (this.towerManagers.get(id) === undefined) {
                const tm = new TowerManager(id, room);
                this.towerManagers.set(id, tm);
            }
        }
    }

    run() {
        for (const spawnManager of this.spawnManagers.values()) {
            spawnManager.run();
        }

        for (const creepManager of this.creepManagers.values()) {
            creepManager.run();
        }

        for (const towerManager of this.towerManagers.values()) {
            towerManager.run();
        }
    }
}
