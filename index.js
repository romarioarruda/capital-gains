const readline = require("readline")
const taxCalculate = require('./tax-calculate')

console.log("\x1b[35m%s\x1b[0m", "Entre com uma lista de operações (ou digite 1 para sair):")

const stream = readline.createInterface({
    input: process.stdin
})

let buffer = ""
const quit = 1

stream.on("line", (line) => {
    line = line.trim()
    
    if (line == quit) {
        closeConnection()
        return
    }

    buffer += line

    if (!buffer.endsWith(']')) return

    try {
        const result = taxCalculate(JSON.parse(buffer))

        console.log('\x1b[32m%s\x1b[0m', JSON.stringify(result))
    } catch (error) {
        console.error("\x1b[31m%s\x1b[0m", String(error))
    } finally {
        buffer = ""
    }
})


process.on('SIGINT', () => {
    closeConnection()
})

function closeConnection() {
    console.log("\x1b[34m%s\x1b[0m", "Broker finalizado!")
    stream.close()
}
