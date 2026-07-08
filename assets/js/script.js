const balanceAmount = document.querySelector('#balance-amount')
const incomeAmount = document.querySelector('#income-amount')
const expensesAmount = document.querySelector('#expenses-amount')
const savingsPercentage = document.querySelector('#savings-percentage')
const transactionsList = document.querySelector('#transactions-list')
const modalContainer = document.querySelector('.modal-container')
const newTransaction = document.querySelector('#new-transaction')
const closeModal = document.querySelector('#close-modal')
const form = document.querySelector('form')
const descriptionInput = document.querySelector('#description')
const amountInput = document.querySelector('#amount')
const categoryInput = document.querySelector('#category')
const dateInput = document.querySelector('#date')
const typeButtons = document.querySelectorAll('.type-btn')
const updatedExpenses = document.querySelector('#updated-expenses')
const categoriesChart = document.querySelector('#categories-chart')
const categoriesList = document.querySelector('#categories-list')
const categoriesEmpty = document.querySelector('.categories-empty')
const footerText = document.querySelector('#footer-text')
const updatedBalance = document.querySelector('.updated-balance')
const categoryLabels = {
    food: 'Alimentação',
    transport: 'Transporte',
    leisure: 'Lazer',
    health: 'Saúde',
    education: 'Educação',
    other: 'Outros'
}
const categoryIcons = {
    food: '🍔',
    transport: '🚗',
    leisure: '🍿',
    health: '🩺',
    education: '📖',
    other: '⭐'
}

const categoryColors = {
    food: '#2D5A2D',
    transport: '#22C55E',
    leisure: '#EF4444',
    health: '#3B82F6',
    education: '#FF1EA8',
    other: '#FFBF00'
}

let selectedType = null
const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
})
const categories = getExpensesByCategories()
const chart = new Chart(categoriesChart, {
    type: 'doughnut',
    data: {
        labels: ['Alimentação', 'Transporte', 'Lazer', 'Saúde', 'Educação', 'Outros'],
        datasets: [{
            data: [categories.food, categories.transport, categories.leisure, categories.health, categories.education, categories.other],
            borderWidth: 0,
            backgroundColor: ['#2D5A2D', '#22C55E', '#EF4444', '#3B82F6', '#FF1EA8', '#FFBF00']
        }]
    },
    options: {
        plugins: {
            legend: {
                display: false,
            }
        }
    }
})

function getTransactions() {
    return JSON.parse(localStorage.getItem('transactions')) || []
}

function saveTransactions(transactions) {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

function addTransaction(description, amount, type, category, date) {
    const transactions = getTransactions()

    transactions.unshift({
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
    const updatedTransactions = transactions.filter(transaction => transaction.id !== parseInt(id))
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

function getExpensesCount() {
    const transactions = getTransactions()
    const expenses = transactions.filter(transaction => transaction.type === "expense")
    return expenses.length
}

function getExpensesByCategories() {
    const transactions = getTransactions()
    const expenses = transactions.filter(transaction => transaction.type === "expense")
    const categories = {
        food: 0,
        transport: 0,
        leisure: 0,
        health: 0,
        education: 0,
        other: 0
    }
    expenses.forEach(expense => {
        categories[expense.category] += expense.amount
    })
    return categories
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
    if (getExpensesCount() === 0) {
        categoriesEmpty.classList.remove('hidden')
        categoriesChart.classList.add('hidden')
    } else {
        categoriesEmpty.classList.add('hidden')
        categoriesChart.classList.remove('hidden')
    }

    renderCategories()

    const updatedCategories = getExpensesByCategories()
    chart.data.datasets[0].data = [updatedCategories.food, updatedCategories.transport, updatedCategories.leisure, updatedCategories.health, updatedCategories.education, updatedCategories.other]
    chart.update()

    const count = getExpensesCount()
    updatedExpenses.textContent = count + (count === 1 ? " transação" : " transações")
    
    const now = new Date()
    updatedBalance.textContent = 'Atualizado às ' + now.toLocaleString('pt-BR', {hour: '2-digit', minute: '2-digit'})
}

function renderCategories() {
    const categories = getExpensesByCategories()
    categoriesList.innerHTML = ''

    Object.keys(categories).forEach(category => {
        const item = document.createElement('li')
        item.innerHTML = `
        <div class="categories-description">
        <p><span style="background-color: ${categoryColors[category]}"></span> ${categoryLabels[category]}</p>
        </div>
        <div class="categories-value">
        <p class="categories-amount">${formatter.format(categories[category])}</p>
        </div>
        `

        categoriesList.appendChild(item)
    })
}

function renderTransactions() {
    const transactions = getTransactions()
    transactionsList.innerHTML = ''

    transactions.forEach(transaction => {
        const item = document.createElement('li')

        item.innerHTML = `
       <div class="transaction-icon">
            ${categoryIcons[transaction.category]}
        </div>
        <div class="transaction-details">
            <div class="transaction-description">
                <p class="transaction-title">${transaction.description}</p>
            </div>
        <div class="transaction-info">
            <p class="transaction-category">${categoryLabels[transaction.category]} · 
            <span class="transaction-date">${new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
            </p>
        </div>
        </div>
        <div class="transaction-value">
            <p class="transaction-amount ${transaction.type === 'income' ? 'amount-income' : 'amount-expense'}">
            ${transaction.type === 'income' ? '+ ' : '- '}${formatter.format(transaction.amount)}
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

newTransaction.addEventListener('click', () => {
    modalContainer.classList.remove('hidden')
})

closeModal.addEventListener('click', (event) => {
    event.stopPropagation()
    modalContainer.classList.add('hidden')
})

form.addEventListener('submit', (event) => {
    event.preventDefault()
    const description = descriptionInput.value.trim()
    const amount = parseFloat(amountInput.value)
    const category = categoryInput.value.trim()
    const date = dateInput.value.trim()
    addTransaction(description, amount, selectedType, category, date)

    modalContainer.classList.add('hidden')
    updateDashboard()
    renderTransactions()
})

typeButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectedType = button.dataset.type

        typeButtons.forEach(btn => btn.classList.remove('active'))

        button.classList.add('active')
    })
})

updateDashboard()
renderTransactions()

const now = new Date()
footerText.textContent = now.toLocaleString('pt-BR', {month: 'long'}) + ' · ' + now.getFullYear()