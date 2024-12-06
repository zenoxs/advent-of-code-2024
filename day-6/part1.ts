import * as path from "jsr:@std/path"
import { computeGuardPath, displayMapState, getWallsAndGuardPositionDirection } from "./common.ts"

const inputPath = path.join(import.meta.dirname!, "input.txt")
const inputs = await Deno.readTextFile(inputPath)

const rows = inputs.split("\n").map((l) => l.split(""))

// Build a matrix where walls are located and find the guard's initial position
const [walls, guardPosition, guardDirection] = getWallsAndGuardPositionDirection(rows)

displayMapState(walls, guardPosition, guardDirection, [])

const [traversedCells] = computeGuardPath(walls, guardPosition, guardDirection)

console.log(traversedCells.length)
