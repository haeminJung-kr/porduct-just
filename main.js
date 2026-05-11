/**
 * Church Youth Group Ledger - Web Component Implementation
 * Handles spreadsheet-like interaction and automatic balance calculation.
 */

class LedgerSheet extends HTMLElement {
  constructor() {
    super();
    this.rows = [
      { id: Date.now(), date: new Date().toISOString().split('T')[0], description: '초기 잔액', income: 0, expense: 0, balance: 0 }
    ];
    this.render();
  }

  connectedCallback() {
    this.addEventListener('input', (e) => {
      if (e.target.classList.contains('cell-input')) {
        const rowId = parseInt(e.target.dataset.rowId);
        const field = e.target.dataset.field;
        this.updateRowData(rowId, field, e.target.value);
      }
    });

    this.addEventListener('click', (e) => {
      if (e.target.closest('.add-row-btn')) {
        this.addRow();
      } else if (e.target.closest('.reset-btn')) {
        this.resetLedger();
      }
    });
  }

  updateRowData(id, field, value) {
    const row = this.rows.find(r => r.id === id);
    if (!row) return;

    if (field === 'income' || field === 'expense') {
      row[field] = parseFloat(value) || 0;
      this.calculateBalances();
    } else {
      row[field] = value;
    }
    
    // Partially update balance cells without full re-render for performance
    this.updateBalanceDisplays();
  }

  calculateBalances() {
    let currentBalance = 0;
    this.rows.forEach(row => {
      currentBalance += (row.income - row.expense);
      row.balance = currentBalance;
    });
  }

  updateBalanceDisplays() {
    this.rows.forEach(row => {
      const balanceCell = this.querySelector(`.balance-cell[data-row-id="${row.id}"]`);
      if (balanceCell) {
        balanceCell.textContent = this.formatCurrency(row.balance);
      }
    });

    // Update totals
    const totalIncome = this.rows.reduce((sum, row) => sum + row.income, 0);
    const totalExpense = this.rows.reduce((sum, row) => sum + row.expense, 0);
    const finalBalance = this.rows.length > 0 ? this.rows[this.rows.length - 1].balance : 0;

    const totalIncomeEl = this.querySelector('#total-income');
    const totalExpenseEl = this.querySelector('#total-expense');
    const finalBalanceEl = this.querySelector('#final-balance');

    if (totalIncomeEl) totalIncomeEl.textContent = this.formatCurrency(totalIncome);
    if (totalExpenseEl) totalExpenseEl.textContent = this.formatCurrency(totalExpense);
    if (finalBalanceEl) finalBalanceEl.textContent = this.formatCurrency(finalBalance);
  }

  addRow() {
    const lastRow = this.rows[this.rows.length - 1];
    const newRow = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      description: '',
      income: 0,
      expense: 0,
      balance: lastRow ? lastRow.balance : 0
    };
    this.rows.push(newRow);
    this.render();
  }

  resetLedger() {
    if (confirm('정말로 모든 내용을 초기화할까요?')) {
      this.rows = [
        { id: Date.now(), date: new Date().toISOString().split('T')[0], description: '초기 잔액', income: 0, expense: 0, balance: 0 }
      ];
      this.render();
    }
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('ko-KR').format(amount);
  }

  render() {
    this.calculateBalances();
    const totalIncome = this.rows.reduce((sum, row) => sum + row.income, 0);
    const totalExpense = this.rows.reduce((sum, row) => sum + row.expense, 0);
    const finalBalance = this.rows.length > 0 ? this.rows[this.rows.length - 1].balance : 0;
    
    this.innerHTML = `
      <div class="sheet-container">
        <table>
          <thead>
            <tr>
              <th style="width: 15%;">날짜</th>
              <th style="width: 35%;">적요 (내용)</th>
              <th style="width: 15%;">수입 (₩)</th>
              <th style="width: 15%;">지출 (₩)</th>
              <th style="width: 20%;">잔액 (₩)</th>
            </tr>
          </thead>
          <tbody>
            ${this.rows.map(row => `
              <tr data-row-id="${row.id}">
                <td>
                  <input type="date" class="cell-input" 
                    data-row-id="${row.id}" data-field="date" value="${row.date}">
                </td>
                <td>
                  <input type="text" class="cell-input" 
                    data-row-id="${row.id}" data-field="description" value="${row.description}" placeholder="내용 입력...">
                </td>
                <td>
                  <input type="number" class="cell-input number-input income-text" 
                    data-row-id="${row.id}" data-field="income" value="${row.income}" placeholder="0">
                </td>
                <td>
                  <input type="number" class="cell-input number-input expense-text" 
                    data-row-id="${row.id}" data-field="expense" value="${row.expense}" placeholder="0">
                </td>
                <td class="balance-cell" data-row-id="${row.id}">
                  ${this.formatCurrency(row.balance)}
                </td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr class="summary-row">
              <td colspan="2" style="text-align: right; padding: 12px 16px; font-weight: 700;">합계</td>
              <td class="number-input income-text" style="padding: 12px 16px; font-weight: 700;" id="total-income">${this.formatCurrency(totalIncome)}</td>
              <td class="number-input expense-text" style="padding: 12px 16px; font-weight: 700;" id="total-expense">${this.formatCurrency(totalExpense)}</td>
              <td class="balance-cell" style="background: var(--primary-color); color: white;" id="final-balance">${this.formatCurrency(finalBalance)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div class="controls">
        <button class="btn btn-primary add-row-btn">
          <span>+</span> 내역 추가하기
        </button>
        <button class="btn btn-secondary reset-btn">
          초기화
        </button>
      </div>
    `;
  }
}

customElements.define('ledger-sheet', LedgerSheet);
