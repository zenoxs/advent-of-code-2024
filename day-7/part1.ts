import * as path from "jsr:@std/path"

const inputPath = path.join(import.meta.dirname!, "input.txt")
const inputs = await Deno.readTextFile(inputPath)

interface Equation {
  result: number
  numbers: number[]
}

const equations = inputs.split("\n").map((l) => {
    const [result, numbers ]=  l.split(": ")
     return {
      result: parseInt(result, 10),
      numbers: numbers.split(" ").map(v => parseInt(v, 10)).toReversed(),
     } satisfies Equation
})

function getPotentialResults(equation: Equation,  numberIndex: number = 0): number[] {
  const currentNumber = equation.numbers[numberIndex]

  if(numberIndex === equation.numbers.length - 1){
    return [currentNumber]
  }

  const sums = getPotentialResults(equation, numberIndex + 1).map(prevValue => {
    return prevValue + currentNumber
  })

  const mults = getPotentialResults(equation, numberIndex + 1).map(prevValue => {
    return prevValue * currentNumber
  })

  return [...sums, ...mults]
}

function equationIsValid(equation: Equation) {
  const results = getPotentialResults(equation)

  return results.includes(equation.result)
}

const total = equations.reduce((acc, equation) => {
  return acc + (equationIsValid(equation) ? equation.result : 0)
}, 0)

console.log(total)
