const balanceAmount = document.querySelector('#balance-amount')
const incomeAmount = document.querySelector('#income-amount')
const expensesAmount = document.querySelector('#expenses-amount')
const savingsPercentage = document.querySelector('#savings-percentage')
const transactionsList = document.querySelector('#transactions-list')

const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
})

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
    if (getTotalIncome() === 0) {
        return 0
    }
    return Math.round((getTotalIncome() - getTotalExpenses()) / getTotalIncome() * 100)
}

function updateDashboard() {
    balanceAmount.textContent = formatter.format(getBalance())
    incomeAmount.textContent = formatter.format(getTotalIncome())
    expensesAmount.textContent = formatter.format(getTotalExpenses())
    savingsPercentage.textContent = getSavingsPercentage() + '%'
}

function renderTransactions() {
    const transactions = getTransactions()
    transactionsList.innerHTML = ''

    transactions.forEach(transaction => {
        const item = document.createElement('li')

        item.innerHTML = `
        <div class="transaction-description">
            <h3>${transaction.description}</h3>
        </div>
        <div class="transaction-info">
            <p class="transaction-category">${transaction.category} 
            <span class="transaction-date">${transaction.date}</span>
            </p>
        </div>
        <div class="transaction-value">
            <p class="transaction-amount ${transaction.type === 'income' ? 'amount-income' : 'amount-expense'}">
            ${formatter.format(transaction.amount)}
            </p>
        </div>
        <div class="remove-btn">
            <button class="btn-delete" data-id="${transaction.id}">✕</button>
        </div>
        `
    
        transactionsList.appendChild(item)
    })
}

transactionsList.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-delete')) {
        deleteTransaction(event.target.dataset.id)
        updateDashboard()
        renderTransactions()
    }
})

updateDashboard()
renderTransactions()