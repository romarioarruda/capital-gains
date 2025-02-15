const assert = require('assert')
const taxCalculate = require('./tax-calculate')

console.log("\x1b[34m%s\x1b[0m", "Executando testes...")

function test(description, fn) {
    try {
        fn()
        console.log(`✅ ${description}`)
    } catch (error) {
        console.error("\x1b[31m%s\x1b[0m", `❌ ${description}`)
        console.error(String(error))
    }
}

test('Caso #1', () => {
    const operations = [
        { operation: "buy", "unit-cost": 10.00, quantity: 100 },
        { operation: "sell", "unit-cost": 15.00, quantity: 50 },
        { operation: "sell", "unit-cost": 15.00, quantity: 50 }
    ]
    assert.deepStrictEqual(
        taxCalculate(operations),
        [ { tax: "0.00" }, { tax: "0.00" }, { tax: "0.00" } ]
    )
})

test('Caso #2', () => {
    const operations = [
        { operation: "buy", "unit-cost": 10.00, quantity: 10000 },
        { operation: "sell", "unit-cost": 20.00, quantity: 5000 },
        { operation: "sell", "unit-cost": 5.00, quantity: 5000 }
    ]
    assert.deepStrictEqual(
        taxCalculate(operations),
        [ { tax: "0.00" }, { tax: "10000.00" }, { tax: "0.00" } ]
    )
})

test('Caso #3', () => {
    const operations = [
        { operation: "buy", "unit-cost": 10.00, quantity: 10000 },
        { operation: "sell", "unit-cost": 5.00, quantity: 5000 },
        { operation: "sell", "unit-cost": 20.00, quantity: 3000 }
    ]
    assert.deepStrictEqual(
        taxCalculate(operations),
        [ { tax: "0.00" }, { tax: "0.00" }, { tax: "1000.00" } ]
    )
})

test('Caso #4', () => {
    const operations = [
        { operation: "buy", "unit-cost": 10.00, quantity: 10000 },
        { operation: "buy", "unit-cost": 25.00, quantity: 5000 },
        { operation: "sell", "unit-cost": 15.00, quantity: 10000 }
    ]
    assert.deepStrictEqual(
        taxCalculate(operations),
        [ { tax: "0.00" }, { tax: "0.00" }, { tax: "0.00" } ]
    )
})

test('Caso #5', () => {
    const operations = [
        { operation: "buy", "unitCost": 10.00, quantity: 10000 },
        { operation: "buy", "unitCost": 25.00, quantity: 5000 },
        { operation: "sell", "unit-cost": 15.00, quantity: 10000 },
        { operation: "sell", "unit-cost": 25.00, quantity: 5000 }
    ]
    assert.deepStrictEqual(
        taxCalculate(operations),
        [ { tax: "0.00" }, { tax: "0.00" }, { tax: "0.00" }, { tax: "10000.00" } ]
    )
})

test('Caso #6', () => {
    const operations = [
        { operation: "buy", "unit-cost": 10.00, quantity: 10000 },
        { operation: "sell", "unit-cost": 2.00, quantity: 5000 },
        { operation: "sell", "unit-cost": 20.00, quantity: 2000 },
        { operation: "sell", "unit-cost": 20.00, quantity: 2000 },
        { operation: "sell", "unit-cost": 25.00, quantity: 1000 }
    ]
    assert.deepStrictEqual(
        taxCalculate(operations),
        [ { tax: "0.00" }, { tax: "0.00" }, { tax: "0.00" }, { tax: "0.00" }, { tax: "3000.00" } ]
    )
})

test('Caso #7', () => {
    const operations = [
        { operation: "buy", "unit-cost": 10.00, quantity: 10000 },
        { operation: "sell", "unit-cost": 2.00, quantity: 5000 },
        { operation: "sell", "unit-cost": 20.00, quantity: 2000 },
        { operation: "sell", "unit-cost": 20.00, quantity: 2000 },
        { operation: "sell", "unit-cost": 25.00, quantity: 1000 },
        { operation: "buy", "unit-cost": 20.00, quantity: 10000 },
        { operation: "sell", "unit-cost": 15.00, quantity: 5000 },
        { operation: "sell", "unit-cost": 30.00, quantity: 4350 },
        { operation: "sell", "unit-cost": 30.00, quantity: 650 }
    ]
    assert.deepStrictEqual(
        taxCalculate(operations),
        [ 
            { tax: "0.00" }, { tax: "0.00" }, { tax: "0.00" }, { tax: "0.00" },
            { tax: "3000.00" }, { tax: "0.00" }, { tax: "0.00" }, { tax: "3700.00" }, { tax: "0.00" }
        ]
    )
})

test('Caso #8', () => {
    const operations = [
        { operation: "buy", "unit-cost": 10.00, quantity: 10000 },
        { operation: "sell", "unit-cost": 50.00, quantity: 10000 },
        { operation: "buy", "unit-cost": 20.00, quantity: 10000 },
        { operation: "sell", "unit-cost": 50.00, quantity: 10000 }
    ]
    assert.deepStrictEqual(
        taxCalculate(operations),
        [ { tax: "0.00" }, { tax: "80000.00" }, { tax: "0.00" }, { tax: "60000.00" } ]
    )
})

console.log("\x1b[34m%s\x1b[0m", "Testes finalizados!")
