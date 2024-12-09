import * as path from "jsr:@std/path"
import { Vector } from "vecti"
import chalk from "chalk"
import process from "node:process"

const inputPath = path.join(import.meta.dirname!, "input.txt")
const inputs = await Deno.readTextFile(inputPath)

const rows = inputs.split("\n").map((row) => row.split(""))

function displayMap(rows: string[][], antinodes: Vector[]) {
    rows.forEach((row, y) => {
        row.forEach((cell, x) => {
            const isAntenna = cell !== "."
            const isAntinode = antinodes.some((a) => a.x === x && a.y === y)

            if (isAntenna && isAntinode) {
                process.stdout.write(chalk.bgBlue(cell))
            } else if (isAntenna) {
                process.stdout.write(cell)
            } else if (isAntinode) {
                process.stdout.write("#")
            } else {
                process.stdout.write(cell)
            }
        })
        process.stdout.write("\n")
    })
}

// antennas vector position by frequency types
const antennaDict: Record<string, Vector[]> = {}

rows.forEach((row, y) => {
    row.forEach((cell, x) => {
        if (cell !== ".") {
            if (antennaDict[cell]) {
                antennaDict[cell].push(new Vector(x, y))
            } else {
                antennaDict[cell] = [new Vector(x, y)]
            }
        }
    })
})

displayMap(rows, [])

const antinodes: Vector[] = []

const height = rows.length - 1
const width = rows[0].length - 1

for (const [, antennas] of Object.entries(antennaDict)) {
    for (const antenna of antennas) {
        for (const antennaComp of antennas) {
            if (antennaComp.x === antenna.x && antennaComp.y === antenna.y) {
                // same vect
                continue
            }

            const delta = antenna.subtract(antennaComp)

            const maxAxis = Math.max(width, height)
            for (let k = -maxAxis; k <= maxAxis; k++) {
                const antinode = antenna.add(delta.multiply(k))

                if (antinode.x >= 0 && antinode.x <= width && antinode.y >= 0 && antinode.y <= height) {
                    antinodes.push(antinode)
                }
            }
        }
    }
}

console.log("-----------------")
displayMap(rows, antinodes)

console.log(
    antinodes.filter((value, index, array) => array.findIndex((v) => v.x === value.x && v.y === value.y) === index)
        .length,
)
