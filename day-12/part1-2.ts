import * as path from "jsr:@std/path"
const inputPath = path.join(import.meta.dirname!, "input.txt")
const inputs = await Deno.readTextFile(inputPath)

const grid = inputs.split("\n").map((v) => v.split(""))

// non recursive optimize version
function calculateFencingCost(grid: string[][]): number {
    const rows = grid.length
    const cols = grid[0].length

    // Directions for moving: [row, col]
    const directions = [
        [-1, 0], // Up
        [1, 0], // Down
        [0, -1], // Left
        [0, 1], // Right
    ]

    const visited = Array.from({ length: rows }, () => Array(cols).fill(false))

    function floodFill(x: number, y: number, char: string): { area: number; perimeter: number } {
        const stack: [number, number][] = [[x, y]]
        visited[x][y] = true

        let area = 0
        let perimeter = 0

        while (stack.length > 0) {
            const [curX, curY] = stack.pop()!
            area++

            for (const [dx, dy] of directions) {
                const newX = curX + dx
                const newY = curY + dy

                if (newX < 0 || newX >= rows || newY < 0 || newY >= cols || grid[newX][newY] !== char) {
                    // If out of bounds or not the same char, it's part of the perimeter
                    perimeter++
                } else if (!visited[newX][newY]) {
                    // If valid and not visited, mark it and add to the stack
                    visited[newX][newY] = true
                    stack.push([newX, newY])
                }
            }
        }

        return { area, perimeter }
    }

    let totalPrice = 0

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (!visited[i][j]) {
                const char = grid[i][j]
                const { area, perimeter } = floodFill(i, j, char)
                totalPrice += area * perimeter
            }
        }
    }

    return totalPrice
}

console.log(calculateFencingCost(grid))
