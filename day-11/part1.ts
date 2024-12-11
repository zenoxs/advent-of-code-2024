import * as path from "jsr:@std/path"

const inputPath = path.join(import.meta.dirname!, "input.txt")
const inputs = await Deno.readTextFile(inputPath)

const stones = inputs.split(" ").map((v) => parseInt(v, 10))

function transformStone(stone: number) {
    if (stone === 0) {
        return [1]
    }

    const stoneStr = stone.toString()
    if (stoneStr.length % 2 === 0) {
        const mid = Math.ceil(stoneStr.length / 2)
        const newStoneLeft = parseInt(stoneStr.slice(0, mid), 10)
        const newStoneRight = parseInt(stoneStr.slice(mid), 10)

        return [newStoneLeft, newStoneRight]
    }

    return [stone * 2024]
}

function applyBlinkToStones(stones: number[], blinkTime: number) {
    let newStones = [...stones]
    for (let i = 0; i < blinkTime; i++) {
        newStones = newStones.flatMap((s) => transformStone(s))
        console.log(newStones)
        console.log("Blink time " + i + " length " + newStones.length)
    }

    return newStones
}

console.log(stones)
console.log(applyBlinkToStones(stones, 25).length)
