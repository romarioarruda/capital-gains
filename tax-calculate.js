/**
 * Calculates taxes on financial asset purchase and sale operations.
 *
 * @param {Array} operations - List of operations to be processed.
 * @param {string} operations[].operation - Type of operation ("buy" or "sell").
 * @param {number} operations[].unitCost - Unit price of the asset in the operation.
 * @param {number} operations[].quantity - Quantity of assets traded.
 * @param {Object} optionalSettings - Taxation settings (can be passed externally).
 * @param {number} optionalSettings.taxationValue - Tax rate used to deduct tax from profit.
 * @param {number} optionalSettings.maximumSalesValueForNonTaxation - Maximum sales value for tax exemption.
 * @returns {Array} Returns a list of objects with the calculated tax value for each operation.
 * @throws {Error} If the operation is not "buy" or "sell".
 * @throws {Error} If attempting to sell without available stock.
 *
 * @description
 * - The default tax rate is **20%** on taxable profit.
 * - Sales up to **R$ 20,000.00** in total are tax-exempt.
 * - Accumulated losses can be used to offset future profits and reduce taxation.
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
