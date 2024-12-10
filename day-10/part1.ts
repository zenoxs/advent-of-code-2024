import * as path from "jsr:@std/path"
import { Vector } from "vecti"

const inputPath = path.join(import.meta.dirname!, "input.txt")
const inputs = await Deno.readTextFile(inputPath)

const grid = inputs.split("\n").map((row) => row.split("").map((v) => parseInt(v, 10)))
const height = grid.length - 1
const width = grid[0].length - 1

function findPath(grid: number[][], position: Vector, endTrailPositions: Vector[] = []) {
    const currentHeight = grid[position.y][position.x]

    const localEndTrailPositions: Vector[] = []

    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) {
                continue
            }

            if (Math.abs(dx) + Math.abs(dy) >= 2) {
                continue
            }

            const delta = new Vector(dx, dy)

            const testedPosition = position.add(delta)

            if (testedPosition.x < 0 || testedPosition.x > width || testedPosition.y < 0 || testedPosition.y > height) {
                continue
            }

            const testedHeightValue = grid[testedPosition.y][testedPosition.x]

            if (testedHeightValue == null) {
                continue
            }

            if (testedHeightValue - 1 === currentHeight) {
                if (testedHeightValue === 9) {
                    // end of the trail path
                    localEndTrailPositions.push(
                        ...findPath(grid, testedPosition, [...endTrailPositions, testedPosition]),
                    )
                }

                // // OK PATH
                localEndTrailPositions.push(...findPath(grid, testedPosition, endTrailPositions))
            }
        }
    }

    return [...endTrailPositions, ...localEndTrailPositions]
}

let total = 0
grid.forEach((row, y) => {
    row.forEach((cell, x) => {
        const position = new Vector(x, y)
        if (cell === 0) {
            // Trailhead
            const results = findPath(grid, position)
            const uniqueResults = results.filter((value, index, array) =>
                array.findIndex((v) => v.x === value.x && v.y === value.y) === index
            )

            // console.log(uniqueResults.length)
            total += uniqueResults.length

            // console.log("-----------")
        }
    })
})

console.log(total)
