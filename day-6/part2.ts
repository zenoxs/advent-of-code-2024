import * as path from "jsr:@std/path"
import { isMainThread, parentPort, Worker, workerData } from "node:worker_threads"
import { splitIntoChunks } from "../helpers.ts"
import { computeGuardPath, displayMapState, getWallsAndGuardPositionDirection } from "./common.ts"

const inputPath = path.join(import.meta.dirname!, "input.txt")
const inputs = await Deno.readTextFile(inputPath)

const rows = inputs.split("\n").map((l) => l.split(""))

// Build a matrix where walls are located and find the guard's initial position
const [walls, guardPosition, guardDirection] = getWallsAndGuardPositionDirection(rows)

displayMapState(walls, guardPosition, guardDirection, [])

// Single Thread
let totalOfLoops = 0
walls.forEach((row, y) => {
    row.forEach((_, x) => {
        if (guardPosition[0] === y && guardPosition[1] === x) {
            // don't block the initial pos
            return
        }

        const testedWalls = JSON.parse(JSON.stringify(walls)) // deep clone
        testedWalls[y][x] = true

        const [, isLoop] = computeGuardPath(testedWalls, guardPosition, guardDirection)

        if (isLoop) {
            console.log(`LOOP with wall at ${y}, ${x}`)
            totalOfLoops += 1
        }
    })
})

console.log(`TOTAL: ${totalOfLoops}`)
