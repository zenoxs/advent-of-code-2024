import * as path from "jsr:@std/path"
import { Vector } from 'vecti'

const inputPath = path.join(import.meta.dirname!, "input.txt")
const inputs = await Deno.readTextFile(inputPath)

const rows = inputs.split("\n").map(row => row.split(""))

function displayMap(rows: string[][], antinodes: Vector[]) {
  rows.forEach((row, y) => {
    let line = ""
    row.forEach((cell, x) => {
      if(cell !== ".") {
        line += cell
        return;
      }
      if(antinodes.some(a => a.x === x && a.y === y)) {
        line += "#"
        return;
      }
      line += cell
    })
    console.log(line)
  })
}

// antennas vector position by frequency types
const antennaDict: Record<string, Vector[]> = {}

rows.forEach((row, y) => {
  row.forEach((cell, x) => {
    if(cell !== "."){
      if(antennaDict[cell]){
        antennaDict[cell].push(new Vector(x, y))
      }else {
        antennaDict[cell] = [new Vector(x, y)]
      }
    }
  })
})

displayMap(rows, [])

const antinodes: Vector[] = []

const maxY = rows.length - 1
const maxX = rows[0].length - 1

for(const [, antennas] of Object.entries(antennaDict)) {
  for(const antenna of antennas) {
    for(const antennaComp of antennas) {
      if(antennaComp.x === antenna.x && antennaComp.y === antenna.y) {
        // same vect
        continue
      }

      const diff = antenna.subtract(antennaComp)
      const antinode = antenna.add(diff)

      if(antinode.x >= 0 && antinode.x <= maxX && antinode.y >= 0 && antinode.y <= maxY 
       ) {
        // Sanity check to verify that the antinode is not already added 
        if(antinodes.some(a => a.x === antinode.x && a.y === antinode.y)) {
          console.log(`${antinode} already added, should not happen`)
          continue;
        }
        antinodes.push(antinode)
      }
    }
  }
}

console.log("-----------------")

displayMap(rows, antinodes)

console.log(antinodes.length)





