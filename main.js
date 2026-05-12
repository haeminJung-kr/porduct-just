/**
 * WebCraft Market - Main JavaScript
 */

class MarketApp extends HTMLElement {
    constructor() {
        super();
        this.requests = [
            { id: 1, title: '식당 예약 시스템 랜딩 페이지', desc: '심플하고 모던한 감성의 식당 예약 페이지가 필요합니다. 반응형은 필수입니다.', budget: 500000, bids: 3, status: 'active' },
            { id: 2, title: '포트폴리오 웹사이트 제작', desc: '디자이너를 위한 깔끔한 포트폴리오 사이트 제작을 요청합니다. 애니메이션 효과가 많았으면 좋겠어요.', budget: 800000, bids: 5, status: 'active' },
            { id: 3, title: '소규모 커뮤니티 게시판', desc: '동호회에서 사용할 간단한 게시판 기능이 있는 웹사이트가 필요합니다.', budget: 1200000, bids: 2, status: 'active' }
        ];
        this.activeModal = null; // 'request' | 'checkout' | null
        this.selectedRequest = null;
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.addEventListener('click', (e) => {
            if (e.target.closest('.btn-request')) {
                this.openModal('request');
            } else if (e.target.closest('.request-card')) {
                const id = parseInt(e.target.closest('.request-card').dataset.id);
                this.selectedRequest = this.requests.find(r => r.id === id);
                this.openModal('checkout');
            } else if (e.target.closest('.modal-overlay') && !e.target.closest('.modal-content')) {
                this.closeModal();
            } else if (e.target.closest('.btn-close-modal')) {
                this.closeModal();
            }
        });
    }

    openModal(type) {
        this.activeModal = type;
        this.render();
    }

    closeModal() {
        this.activeModal = null;
        this.selectedRequest = null;
        this.render();
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('ko-KR').format(amount);
    }

    render() {
        const commissionRate = 0.15;
        const commission = this.selectedRequest ? Math.round(this.selectedRequest.budget * commissionRate) : 0;
        const total = this.selectedRequest ? this.selectedRequest.budget + commission : 0;

        this.innerHTML = `
            <header class="main-header">
                <div class="container header-content">
                    <a href="#" class="logo">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        WebCraft
                    </a>
                    <nav class="nav-links">
                        <a href="#" class="nav-link">의뢰 둘러보기</a>
                        <a href="#" class="nav-link">전문가 찾기</a>
                        <button class="btn btn-primary btn-request">의뢰하기</button>
                    </nav>
                </div>
            </header>

            <main>
                <section class="hero">
                    <div class="container">
                        <h1 class="hero-title">당신의 아이디어를<br>웹으로 실현하세요</h1>
                        <p class="hero-subtitle">필요한 웹페이지를 요청하면 검증된 전문가들이 합리적인 가격에 제작해 드립니다. 안전한 결제 시스템으로 걱정 없이 거래하세요.</p>
                        <div class="hero-actions">
                            <button class="btn btn-primary btn-request">지금 바로 의뢰하기</button>
                            <button class="btn btn-outline">포트폴리오 구경하기</button>
                        </div>
                    </div>
                </section>

                <section class="container" style="padding: 60px 24px;">
                    <div class="section-title">
                        <h2>최근 올라온 의뢰</h2>
                        <a href="#" class="nav-link" style="font-size: 1rem;">전체 보기 &rarr;</a>
                    </div>
                    <div class="board-grid">
                        ${this.requests.map(req => `
                            <div class="request-card" data-id="${req.id}">
                                <div class="card-header">
                                    <span class="status-badge ${req.status === 'active' ? 'status-active' : ''}">
                                        ${req.status === 'active' ? '지원 가능' : '마감'}
                                    </span>
                                </div>
                                <h3 class="request-title">${req.title}</h3>
                                <p class="request-desc">${req.desc}</p>
                                <div class="card-footer">
                                    <span class="budget">₩${this.formatCurrency(req.budget)}</span>
                                    <span class="bid-count">${req.bids}명의 전문가 지원 중</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </section>
                <section style="background-color: white; padding: 80px 0; border-top: 1px solid var(--border);">
                    <div class="container">
                        <div class="section-title" style="justify-content: center; margin-bottom: 48px;">
                            <h2 style="font-size: 2.25rem;">이용 방법</h2>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 40px; text-align: center;">
                            <div>
                                <div style="width: 64px; height: 64px; background: #eff6ff; color: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-size: 1.5rem; font-weight: 700;">1</div>
                                <h3 style="margin-bottom: 12px;">무료 의뢰 등록</h3>
                                <p style="color: var(--secondary);">필요한 웹사이트의 내용을 상세히 적어 의뢰를 올리세요.</p>
                            </div>
                            <div>
                                <div style="width: 64px; height: 64px; background: #eff6ff; color: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-size: 1.5rem; font-weight: 700;">2</div>
                                <h3 style="margin-bottom: 12px;">전문가 매칭</h3>
                                <p style="color: var(--secondary);">검증된 웹 개발자들이 제안서와 견적을 보냅니다.</p>
                            </div>
                            <div>
                                <div style="width: 64px; height: 64px; background: #eff6ff; color: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-size: 1.5rem; font-weight: 700;">3</div>
                                <h3 style="margin-bottom: 12px;">안전한 에스크로 결제</h3>
                                <p style="color: var(--secondary);">대금은 플랫폼이 안전하게 보관하며 작업 완료 후 지급됩니다.</p>
                            </div>
                            <div>
                                <div style="width: 64px; height: 64px; background: #eff6ff; color: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-size: 1.5rem; font-weight: 700;">4</div>
                                <h3 style="margin-bottom: 12px;">작물 완료 및 수령</h3>
                                <p style="color: var(--secondary);">완성된 결과물을 확인하고 최종 승인하면 거래가 종료됩니다.</p>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            <footer class="main-footer">
                <div class="container">
                    <p>&copy; 2024 WebCraft Market. All rights reserved.</p>
                    <p style="margin-top: 8px; opacity: 0.7;">안전한 거래와 업계 표준 수수료(15%)를 보장합니다.</p>
                </div>
            </footer>

            <!-- Request Modal -->
            <div class="modal-overlay ${this.activeModal === 'request' ? 'active' : ''}">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">웹사이트 제작 의뢰</h2>
                        <button class="btn btn-outline btn-close-modal" style="padding: 4px 8px;">&times;</button>
                    </div>
                    <div class="form-group">
                        <label class="form-label">의뢰 제목</label>
                        <input type="text" class="form-input" placeholder="예: 화장품 브랜드 랜딩 페이지 제작">
                    </div>
                    <div class="form-group">
                        <label class="form-label">상세 설명</label>
                        <textarea class="form-input form-textarea" placeholder="필요한 기능이나 디자인 스타일을 자세히 적어주세요."></textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">희망 예산 (₩)</label>
                        <input type="number" class="form-input" placeholder="500,000">
                    </div>
                    <button class="btn btn-primary" style="width: 100%; margin-top: 12px;">의뢰 등록하기</button>
                </div>
            </div>

            <!-- Checkout Modal -->
            <div class="modal-overlay ${this.activeModal === 'checkout' ? 'active' : ''}">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">결제 및 에스크로</h2>
                        <button class="btn btn-outline btn-close-modal" style="padding: 4px 8px;">&times;</button>
                    </div>
                    <p style="margin-bottom: 20px; color: var(--secondary); font-size: 0.95rem;">
                        선택하신 전문가와 안전하게 거래를 시작합니다. 대금은 에스크로에 보관되며, 작업 완료 승인 후 전문가에게 지급됩니다.
                    </p>
                    <div class="price-summary">
                        <div class="price-row">
                            <span>프로젝트 비용</span>
                            <span>₩${this.selectedRequest ? this.formatCurrency(this.selectedRequest.budget) : 0}</span>
                        </div>
                        <div class="price-row">
                            <span>플랫폼 이용료 <span class="commission-tag">(15%)</span></span>
                            <span>₩${this.formatCurrency(commission)}</span>
                        </div>
                        <div class="price-row total">
                            <span>최종 결제 금액</span>
                            <span>₩${this.formatCurrency(total)}</span>
                        </div>
                    </div>
                    <button class="btn btn-primary" style="width: 100%;">안전 결제하기</button>
                    <p style="text-align: center; font-size: 0.8rem; color: var(--secondary); margin-top: 16px;">
                        결제 시 서비스 이용약관에 동의하게 됩니다.
                    </p>
                </div>
            </div>
        `;
    }
}

customElements.define('market-app', MarketApp);

// Initialize app
document.getElementById('app').innerHTML = '<market-app></market-app>';
