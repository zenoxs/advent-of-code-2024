import * as path from "jsr:@std/path"
import { computeGuardPath, displayMapState, getWallsAndGuardPositionDirection } from "./common.ts"

const inputPath = path.join(import.meta.dirname!, "input.txt")
const inputs = await Deno.readTextFile(inputPath)

const rows = inputs.split("\n").map((l) => l.split(""))

// Build a matrix where walls are located and find the guard's initial position
const [walls, guardPosition, guardDirection] = getWallsAndGuardPositionDirection(rows)

displayMapState(walls, guardPosition, guardDirection, [])

// Find the initial path of the guard
const [traversedCells] = computeGuardPath(walls, guardPosition, guardDirection)

// We are going to try to block every cell of the guard path
const totalOfLoops = traversedCells.reduce<number>((acc, [y, x]) => {
    if (guardPosition[0] === y && guardPosition[1] === x) {
        // don't block the initial pos
        return acc
    }

    const testedWalls = JSON.parse(JSON.stringify(walls)) // deep clone
    testedWalls[y][x] = true

    const [, isLoop] = computeGuardPath(testedWalls, guardPosition, guardDirection)

    if (isLoop) {
        console.log(`LOOP with wall at ${y}, ${x}`)
        return acc + 1
    }
    return acc
}, 0)

console.log(`TOTAL: ${totalOfLoops}`)
