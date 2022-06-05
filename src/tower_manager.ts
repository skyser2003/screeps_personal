export class TowerManager {
    constructor(private id_: string) {}

    run() {
        const tower = Game.getObjectById(
            "67f5883e6ce7cf2afaad546e" as Id<StructureTower>
        );
        if (tower) {
            const closestDamagedStructure = tower.pos.findClosestByRange(
                FIND_STRUCTURES,
                {
                    filter: (structure) => structure.hits < structure.hitsMax,
                }
            );
            if (closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }

            const closestHostile =
                tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                tower.attack(closestHostile);
            }
        }
    }
}
