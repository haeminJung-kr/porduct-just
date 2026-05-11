/**
 * ONYX Church Youth Group Ledger - Web Component Implementation
 * Handles monthly data management and spreadsheet-like interaction.
 */

class LedgerSheet extends HTMLElement {
  constructor() {
    super();
    const now = new Date();
    this.currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    // Initialize data with current month
    this.ledgerData = {
      [this.currentMonth]: [
        { id: Date.now(), date: this.getTodayStr(), description: '이월 잔액', income: 0, expense: 0, balance: 0 }
      ]
    };
    
    this.render();
  }

  getTodayStr() {
    return new Date().toISOString().split('T')[0];
  }

  connectedCallback() {
    this.addEventListener('input', (e) => {
      if (e.target.classList.contains('cell-input')) {
        const rowId = parseInt(e.target.dataset.rowId);
        const field = e.target.dataset.field;
        this.updateRowData(rowId, field, e.target.value);
      } else if (e.target.classList.contains('month-input')) {
        this.switchMonth(e.target.value);
      }
    });

    this.addEventListener('click', (e) => {
      if (e.target.closest('.add-row-btn')) {
        this.addRow();
      } else if (e.target.closest('.reset-btn')) {
        this.resetLedger();
      } else if (e.target.closest('.copy-report-btn')) {
        this.copyToClipboard(e.target.closest('.copy-report-btn'));
      }
    });
  }

  switchMonth(monthStr) {
    this.currentMonth = monthStr;
    if (!this.ledgerData[this.currentMonth]) {
      // Find previous month's final balance
      const months = Object.keys(this.ledgerData).sort();
      const currentIndex = months.indexOf(this.currentMonth);
      let prevBalance = 0;
      
      // Simpler: find the latest month before this one
      const prevMonths = months.filter(m => m < this.currentMonth);
      if (prevMonths.length > 0) {
        const lastMonth = prevMonths[prevMonths.length - 1];
        const lastMonthRows = this.ledgerData[lastMonth];
        prevBalance = lastMonthRows.length > 0 ? lastMonthRows[lastMonthRows.length - 1].balance : 0;
      }

      this.ledgerData[this.currentMonth] = [
        { id: Date.now(), date: `${this.currentMonth}-01`, description: '전월 이월', income: prevBalance, expense: 0, balance: prevBalance }
      ];
    }
    this.render();
  }

  updateRowData(id, field, value) {
    const rows = this.ledgerData[this.currentMonth];
    const row = rows.find(r => r.id === id);
    if (!row) return;

    if (field === 'income' || field === 'expense') {
      row[field] = parseFloat(value) || 0;
      this.calculateBalances();
    } else {
      row[field] = value;
    }
    
    this.updateBalanceDisplays();
  }

  calculateBalances() {
    const rows = this.ledgerData[this.currentMonth];
    let currentBalance = 0;
    rows.forEach(row => {
      currentBalance += (row.income - row.expense);
      row.balance = currentBalance;
    });
  }

  updateBalanceDisplays() {
    const rows = this.ledgerData[this.currentMonth];
    rows.forEach(row => {
      const balanceCell = this.querySelector(`.balance-cell[data-row-id="${row.id}"]`);
      if (balanceCell) {
        balanceCell.textContent = this.formatCurrency(row.balance);
      }
    });

    // Update totals
    const totalIncome = rows.reduce((sum, row) => sum + row.income, 0);
    const totalExpense = rows.reduce((sum, row) => sum + row.expense, 0);
    const finalBalance = rows.length > 0 ? rows[rows.length - 1].balance : 0;

    const totalIncomeEl = this.querySelector('#total-income');
    const totalExpenseEl = this.querySelector('#total-expense');
    const finalBalanceEl = this.querySelector('#final-balance');

    if (totalIncomeEl) totalIncomeEl.textContent = this.formatCurrency(totalIncome);
    if (totalExpenseEl) totalExpenseEl.textContent = this.formatCurrency(totalExpense);
    if (finalBalanceEl) finalBalanceEl.textContent = this.formatCurrency(finalBalance);
  }

  addRow() {
    const rows = this.ledgerData[this.currentMonth];
    const lastRow = rows[rows.length - 1];
    const newRow = {
      id: Date.now(),
      date: `${this.currentMonth}-${String(new Date().getDate()).padStart(2, '0')}`,
      description: '',
      income: 0,
      expense: 0,
      balance: lastRow ? lastRow.balance : 0
    };
    rows.push(newRow);
    this.render();
  }

  resetLedger() {
    if (confirm('현재 월의 모든 내용을 초기화할까요?')) {
      this.ledgerData[this.currentMonth] = [
        { id: Date.now(), date: `${this.currentMonth}-01`, description: '초기화됨', income: 0, expense: 0, balance: 0 }
      ];
      this.render();
    }
  }

  async copyToClipboard(btn) {
    const report = this.generateReport();
    try {
      await navigator.clipboard.writeText(report);
      const originalText = btn.textContent;
      btn.textContent = '✅ 복사 완료!';
      btn.classList.add('btn-success');
      setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('btn-success');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('복사에 실패했습니다.');
    }
  }

  generateReport() {
    const rows = this.ledgerData[this.currentMonth];
    const totalIncome = rows.reduce((sum, row) => sum + row.income, 0);
    const totalExpense = rows.reduce((sum, row) => sum + row.expense, 0);
    const finalBalance = rows.length > 0 ? rows[rows.length - 1].balance : 0;

    let text = `[ONYX 청년부 ${this.currentMonth} 재정 보고]\n\n`;
    text += `💰 총 수입: ${this.formatCurrency(totalIncome)}원\n`;
    text += `💸 총 지출: ${this.formatCurrency(totalExpense)}원\n`;
    text += `📊 최종 잔액: ${this.formatCurrency(finalBalance)}원\n`;
    text += `--------------------\n\n`;
    text += `[상세 내역]\n`;

    rows.forEach(row => {
      const type = row.income > 0 ? '➕' : (row.expense > 0 ? '➖' : '🔹');
      const amount = row.income > 0 ? row.income : (row.expense > 0 ? row.expense : 0);
      text += `- ${row.date.slice(5)} ${row.description}: ${type}${this.formatCurrency(amount)}\n`;
    });

    return text;
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('ko-KR').format(amount);
  }

  render() {
    this.calculateBalances();
    const rows = this.ledgerData[this.currentMonth];
    const totalIncome = rows.reduce((sum, row) => sum + row.income, 0);
    const totalExpense = rows.reduce((sum, row) => sum + row.expense, 0);
    const finalBalance = rows.length > 0 ? rows[rows.length - 1].balance : 0;
    
    this.innerHTML = `
      <div class="month-selector-bar">
        <label for="month-picker">조회 월 선택:</label>
        <input type="month" id="month-picker" class="month-input" value="${this.currentMonth}">
      </div>

      <div class="sheet-container">
        <table>
          <thead>
            <tr>
              <th style="width: 120px;">날짜</th>
              <th>적요 (내용)</th>
              <th style="width: 150px;">수입 (₩)</th>
              <th style="width: 150px;">지출 (₩)</th>
              <th style="width: 180px;">잔액 (₩)</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => `
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
              <td colspan="2" style="text-align: right; padding: 6px 12px; font-weight: 700;">월 합계</td>
              <td class="number-input income-text" style="padding: 6px 12px; font-weight: 700;" id="total-income">${this.formatCurrency(totalIncome)}</td>
              <td class="number-input expense-text" style="padding: 6px 12px; font-weight: 700;" id="total-expense">${this.formatCurrency(totalExpense)}</td>
              <td class="balance-cell final-balance-total" id="final-balance">${this.formatCurrency(finalBalance)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div class="controls">
        <button class="btn btn-primary add-row-btn">
          + 행 추가
        </button>
        <button class="btn btn-secondary copy-report-btn">
          💬 보고서 복사 (메신저용)
        </button>
        <button class="btn reset-btn">
          현재 월 초기화
        </button>
      </div>
    `;
  }
}

customElements.define('ledger-sheet', LedgerSheet);
