const balanceAmount = document.querySelector('#balance-amount')
const incomeAmount = document.querySelector('#income-amount')
const expensesAmount = document.querySelector('#expenses-amount')
const savingsPercentage = document.querySelector('#savings-percentage')

function getTransactions() {
    return JSON.parse(localStorage.getItem('transactions')) || []
}

function saveTransactions(transactions) {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

function addTransaction(description, amount, type, category, date) {
    const transactions = getTransactions()

    transactions.push({
        id: Date.now(),
        description,
        amount,
        type,
        category,
        date
    })
    saveTransactions(transactions)
}

function deleteTransaction(id) {
    const transactions = getTransactions()
    const updatedTransactions = transactions.filter(transaction => transaction.id !== id)
    saveTransactions(updatedTransactions)
}

function getTotalIncome() {
    const transactions = getTransactions()

    const incomes = transactions.filter(transaction => transaction.type === "income")
    
    const total = incomes.reduce((accumulator, current) => {
        return accumulator + current.amount
    }, 0)

    return total
}

function getTotalExpenses() {
    const transactions = getTransactions()

    const expenses = transactions.filter(transaction => transaction.type === "expense")

    const total = expenses.reduce((accumulator, current) => {
        return accumulator + current.amount
    }, 0)
    return total
}

function getBalance() {
    return getTotalIncome() - getTotalExpenses()
}

function getSavingsPercentage() {
    return (getTotalIncome() - getTotalExpenses()) / getTotalIncome() * 100
}

function updateDashboard() {
    balanceAmount.textContent = getBalance()
    incomeAmount.textContent = getTotalIncome()
    expensesAmount.textContent = getTotalExpenses()
    savingsPercentage.textContent = getSavingsPercentage()
}

updateDashboard()