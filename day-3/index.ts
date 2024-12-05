import * as path from "jsr:@std/path"

const inputPath = path.join(import.meta.dirname!, "input.txt")
const inputs = await Deno.readTextFile(inputPath)

function sumValidMultiplications(memory: string) {
    let i = 0
    let total = 0

    while (i < memory.length) {
        if (i + 4 < memory.length && memory.slice(i, i + 4) === "mul(") {
            let j = i + 4 // Start after the mul

            let numLeft = ""
            let numRight = ""
            let commaFound = false

            while (j < memory.length && memory[j] !== ")") {
                const char = memory[j]

                if (char === ",") {
                    if (!commaFound && numLeft.length > 0) {
                        commaFound = true
                    } else {
                        // Invalid if there's a second comma or it's misplaced
                        break
                    }
                } else if (char >= "0" && char <= "9") {
                    if (!commaFound) {
                        numLeft += char
                    } else {
                        numRight += char
                    }
                } else {
                    // Invalid character in mul()
                    break
                }
                j++
            }

            if (commaFound && numLeft.length > 0 && numRight.length > 0 && j < memory.length && memory[j] === ")") {
                console.log(memory.slice(i, j + 1))
                const nLeft = parseInt(numLeft, 10)
                const nRight = parseInt(numRight, 10)

                total += nLeft * nRight
            }

            // Move the cursor
            i = j
        }
        i++
    }

    return total
}

// 183669043
console.log(sumValidMultiplications(inputs))

function sumValidMultiplicationsWithDoDont(memory: string) {
    let i = 0
    let total = 0
    let enabled = true

    while (i < memory.length) {
        if (i + 4 < memory.length && memory.slice(i, i + 4) === "do()") {
            console.log("do enable")
            enabled = true
            i = i + 3
        } else if (i + 7 < memory.length && memory.slice(i, i + 7) === "don't()") {
            console.log("don't() enable")
            enabled = false
            i = i + 6
        } else if (i + 4 < memory.length && memory.slice(i, i + 4) === "mul(") {
            let j = i + 4 // Start after the mul

            let numLeft = ""
            let numRight = ""
            let commaFound = false

            while (j < memory.length && memory[j] !== ")") {
                const char = memory[j]

                if (char === ",") {
                    if (!commaFound && numLeft.length > 0) {
                        commaFound = true
                    } else {
                        // Invalid if there's a second comma or it's misplaced
                        break
                    }
                } else if (char >= "0" && char <= "9") {
                    if (!commaFound) {
                        numLeft += char
                    } else {
                        numRight += char
                    }
                } else {
                    // Invalid character in mul()
                    break
                }
                j++
            }

            if (
                enabled && commaFound && numLeft.length > 0 && numRight.length > 0 && j < memory.length &&
                memory[j] === ")"
            ) {
                console.log(memory.slice(i, j + 1))
                const nLeft = parseInt(numLeft, 10)
                const nRight = parseInt(numRight, 10)

                total += nLeft * nRight
            }

            // Move the cursor
            i = j
        }
        i++
    }

    return total
}

console.log(sumValidMultiplicationsWithDoDont(inputs))
