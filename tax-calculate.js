/**
 * Calcula os impostos sobre operações de compra e venda de ativos financeiros.
 *
 * @param {Array} operations - Lista de operações a serem processadas.
 * @param {string} operations[].operation - Tipo da operação ("buy" ou "sell").
 * @param {number} operations[].unitCost - Preço unitário do ativo na operação.
 * @param {number} operations[].quantity - Quantidade de ativos negociados.
 * @param {Object} optionalSettings - Configurações de tributação (pode ser passada externamente).
 * @param {number} optionalSettings.taxationValue - Alíquota usada para deduzir imposto do lucro.
 * @param {number} optionalSettings.maximumSalesValueForNonTaxation - Valor máximo de venda para não tributação
 * @returns {Array} Retorna uma lista de objetos com o valor do imposto calculado para cada operação.
 * @throws {Error} Se a operação não for "buy" ou "sell".
 * @throws {Error} Se tentar vender sem ter estoque disponível.
 *
 * @description
 * - A alíquota do imposto padrão é de **20%** sobre o lucro tributável.
 * - O valor padrão de vendas de até **R$ 20.000,00** no total não são tributadas.
 * - Prejuízos acumulados podem ser usados para compensar lucros futuros e reduzir a tributação.
 *
 * @example
 * const operations = [
 *   { operation: "buy", "unit-cost": 10.00, quantity: 100 },
 *   { operation: "sell", "unit-cost": 15.00, quantity: 50 }
 * ]
 * 
 * const result = taxCalculate(operations)
 * console.log(result) // [{ tax: "0.00" }, { tax: "0.00" }]
*/
module.exports = function taxCalculate(operations, optionalSettings = {}) {
    let averagePrice = 0
    let totalQuantity = 0
    let accumulatedLoss = 0

    const settings = {
        taxationValue: optionalSettings.taxationValue || 0.20,
        supportedOperations: ["buy", "sell"],
        maximumSalesValueForNonTaxation: optionalSettings.maximumSalesValueForNonTaxation || 20_000
    }

    function processPurchase(unitCost, quantity) {
        averagePrice = Number(((totalQuantity * averagePrice) + (quantity * unitCost)) / (totalQuantity + quantity)).toFixed(2)
        totalQuantity += quantity

        return { tax: Number(0.00).toFixed(2) }
    }

    function calculateSaleTax(unitCost, quantity) {
        if (totalQuantity === 0) throw new Error("Sem estoque para venda")

        const totalSalesValue = unitCost * quantity
        const grossProfit = (unitCost - averagePrice) * quantity

        if (totalSalesValue <= settings.maximumSalesValueForNonTaxation) {
            totalQuantity -= quantity
            accumulatedLoss = Math.max(0, accumulatedLoss - grossProfit)

            return { tax: Number(0.00).toFixed(2) }
        }

        const taxableProfit = Math.max(0, grossProfit - accumulatedLoss)
        const tax = taxableProfit > 0 ? (taxableProfit * settings.taxationValue) : 0

        accumulatedLoss = Math.max(0, accumulatedLoss - grossProfit)
        totalQuantity -= quantity

        return { tax: tax.toFixed(2) }
    }

    return operations.map(({ operation, quantity, ...rest }) => {
        if (!settings.supportedOperations.includes(operation)) {
            throw new Error(`Operação não suportada: ${operation}`)
        }

        const unitCost = rest['unit-cost'] || rest.unitCost

        if (operation === "buy") return processPurchase(unitCost, quantity)

        if (operation === "sell") return calculateSaleTax(unitCost, quantity)
    })
}
