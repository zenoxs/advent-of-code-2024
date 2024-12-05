import * as path from "jsr:@std/path"

const inputPath = path.join(import.meta.dirname!, "input.txt")
const inputs = await Deno.readTextFile(inputPath)

const rows = inputs.split("\n").map((l) => l)

const rules: [number, number][] = []
const rowUpdates: number[][] = []

let readingRules = true

for (const row of rows) {
    if (row.trim() === "") {
        readingRules = false
        continue
    }
    if (readingRules) {
        rules.push(row.split("|").map((v) => parseInt(v, 10)) as [number, number])
    } else {
        // Updates
        rowUpdates.push(row.split(",").map((v) => parseInt(v, 10)))
    }
}

function calculateCorrectMiddlePageOneLine() {
    return rowUpdates.reduce<number>(
        (total, updates) =>
            updates.every((update, updateIndex) =>
                    rules.every((rule) =>
                        rule[0] === update
                            ? updates.every((testedUpdate, testUpdateIndex) =>
                                testedUpdate === rule[1] ? testUpdateIndex > updateIndex : true
                            )
                            : true
                    )
                )
                ? total + updates[Math.round((updates.length - 1) / 2)]
                : total,
        0,
    )
}

function isUpdatesCorrect(updates: number[]) {
    return updates.every((update, updateIndex) => {
        return rules.every((rule) => {
            if (rule[0] === update) {
                return updates.every((testedUpdate, testUpdateIndex) => {
                    if (testedUpdate === rule[1]) {
                        return testUpdateIndex > updateIndex
                    }

                    return true
                })
            }

            return true
        })
    })
}

function calculateCorrectMiddlePage() {
    let total = 0

    rowUpdates.forEach((updates, updatesIndex) => {
        const isUpdatesLineCorrect = isUpdatesCorrect(updates)

        const middle = updates[Math.round((updates.length - 1) / 2)]

        if (isUpdatesLineCorrect) {
            total += middle
        }

        console.log(`Update Row ${updatesIndex} : ${isUpdatesLineCorrect}, middle ${middle}`)
    })

    return total
}

// 4814
console.log(calculateCorrectMiddlePage())

function calculateFixMiddlePage() {
    let total = 0

    rowUpdates.forEach((updates, updatesIndex) => {
        const isUpdatesLineCorrect = isUpdatesCorrect(updates)

        if (isUpdatesLineCorrect) {
            return
        }

        // Make a copy to avoid mutating the original array
        const correctedUpdates = [...updates]
        let index = 0

        while (!isUpdatesCorrect(correctedUpdates)) {
            const update = correctedUpdates[index]

            let swapped = false
            for (const rule of rules) {
                if (rule[0] === update) {
                    // Found rule
                    for (let j = 0; j < correctedUpdates.length; j++) {
                        const comparedUpdate = correctedUpdates[j]
                        if (comparedUpdate === rule[1] && j < index) {
                            // Swap the two values if rules is not correct
                            correctedUpdates[index] = comparedUpdate
                            correctedUpdates[j] = update

                            swapped = true

                            break
                        }
                    }
                }

                if (swapped) {
                    break
                }
            }

            index = (index + 1) % correctedUpdates.length // Cycle index back to 0 if needed
        }

        const middle = correctedUpdates[Math.round((correctedUpdates.length - 1) / 2)]

        total += middle
    })

    return total
}

// 5448
console.log(calculateFixMiddlePage())
