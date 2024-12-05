import * as path from "jsr:@std/path"

const inputPath = path.join(import.meta.dirname!, "input.txt")
const inputs = await Deno.readTextFile(inputPath)

const rows = inputs.split("\n").map((l) => l)

function countXMAS() {
    let total = 0
    rows.forEach((row, index) => {
        let i = 0

        //  Horizontal
        while (i < row.length) {
            const slice = row.slice(i, i + 4)
            if (slice === "XMAS" || slice === "SAMX") {
                total += 1
                i = i + 3
            } else {
                i++
            }
        }

        if (index + 3 < rows.length) {
            // Vertical
            for (i = 0; i < row.length; i++) {
                const slice = rows[index][i] + rows[index + 1][i] + rows[index + 2][i] + rows[index + 3][i]
                if (slice === "XMAS" || slice === "SAMX") {
                    total += 1
                    // console.log("found vertical " + slice)
                }
            }

            // Diagonal Right
            for (i = 0; i < row.length; i++) {
                const slice = rows[index][i] + rows[index + 1][i + 1] + rows[index + 2][i + 2] + rows[index + 3][i + 3]
                if (slice === "XMAS" || slice === "SAMX") {
                    total += 1
                    // console.log("found diagonal " + slice)
                }
            }

            // Diagonal Left
            for (i = 3; i < row.length; i++) {
                const slice = rows[index][i] + rows[index + 1][i - 1] + rows[index + 2][i - 2] + rows[index + 3][i - 3]
                if (slice === "XMAS" || slice === "SAMX") {
                    total += 1
                    // console.log("found diagonal left " + slice)
                }
            }
        }
    })

    return total
}

// console.log(countXMAS())

function countXMASCross() {
    let total = 0
    rows.forEach((row, index) => {
        let i = 0

        if (index + 2 < rows.length) {
            for (i = 0; i < row.length - 2; i++) {
                const diagonalRightSlice = rows[index][i] + rows[index + 1][i + 1] + rows[index + 2][i + 2]
                const diagonalLeftSlice = rows[index][i + 2] + rows[index + 1][i + 1] + rows[index + 2][i]

                if (
                    (diagonalRightSlice === "MAS" || diagonalRightSlice === "SAM") &&
                    (diagonalLeftSlice === "MAS" || diagonalLeftSlice === "SAM")
                ) {
                    total += 1
                }
            }
        }
    })

    return total
}

console.log(countXMASCross())
