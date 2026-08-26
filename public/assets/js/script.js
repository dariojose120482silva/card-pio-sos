// ==========================================
// 1. CONFIGURAÇÕES GERAIS
// ==========================================
const numeroWhatsApp = "5587981004878"; // Número da Pizzaria

// ==========================================
// 2. CONTROLES DE UI E MÁSCARAS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Máscara de Telefone
    const telInput = document.getElementById('clienteTelefone');
    if (telInput) {
        telInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            if (value.length > 6) {
                value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
            } else if (value.length > 2) {
                value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            }
            e.target.value = value;
        });
    }
});

// ==========================================
// 3. DADOS DO CARDÁPIO
// ==========================================
const cardapioTradicional = [
    { nome: "MUÇARELA", desc: "Molho, muçarela, orégano, tomate e azeitonas.", imagem: "assets/img/mussarela.webp", tamanhos: [{ tipo: "Grande", preco: 37 }, { tipo: "Média", preco: 27 }] },
    { nome: "CALABRESA", desc: "Molho, muçarela, calabresa, cebola, orégano e azeitonas.", imagem: "assets/img/calabresa.webp", tamanhos: [{ tipo: "Grande", preco: 39 }, { tipo: "Média", preco: 29 }] },
    { nome: "PORTUGUESA", desc: "Molho, muçarela, presunto, ovos, pimentão e azeitonas.", imagem: "assets/img/portuguesa.webp", tamanhos: [{ tipo: "Grande", preco: 42 }, { tipo: "Média", preco: 32 }] },
    { nome: "FRANGO", desc: "Molho, muçarela, frango desfiado, milho e azeitonas.", imagem: "assets/img/frango.webp", tamanhos: [{ tipo: "Grande", preco: 42 }, { tipo: "Média", preco: 32 }] },
    { nome: "PRESUNTO", desc: "Presunto, muçarela, orégano e azeitonas.", imagem: "assets/img/presunto.png", tamanhos: [{ tipo: "Grande", preco: 38 }, { tipo: "Média", preco: 28 }] },
    { nome: "2 - Queijo", desc: "Muçarela, orégano, requeijão e azeitonas.", imagem: "assets/img/2-queijo-tradicional.webp", tamanhos: [{ tipo: "Grande", preco: 38 }, { tipo: "Média", preco: 28 }] }
];

const cardapioMisto = {
    "Mix Mussarela": [
        { nome: "MUSSARELA / CALABRESA", precoG: 38.00, precoM: 28.00, imagem: "assets/img/mussarela-x-calabresa.webp" },
        { nome: "MUSSARELA / PORTUGUESA", imagem: "assets/img/mussarela-x-portuguesa.webp", precoG: 40.00, precoM: 30.00 },
        { nome: "MUSSARELA / FRANGO", imagem: "assets/img/mussarela-x-frango.webp", precoG: 40.00, precoM: 30.00 },
        { nome: "MUSSARELA / PRESUNTO", imagem: "assets/img/mussarela-x-presunto.webp", precoG: 38.00, precoM: 28.00 },
        { nome: "MUSSARELA / 2 - QUEIJO", imagem: "assets/img/2-queijo-x-mussarela.webp", precoG: 38.00, precoM: 28.00 }
    ],
    "Mix Calabresa": [
        { nome: "CALABRESA / MUSSARELA", imagem: "assets/img/calabresa-x-mussarela.webp", precoG: 38.00, precoM: 28.00 },
        { nome: "CALABRESA / PORTUGUESA", imagem: "assets/img/calabresa-x-portuguesa.webp", precoG: 41.00, precoM: 31.00 },
        { nome: "CALABRESA / FRANGO", imagem: "assets/img/calabresa-x-frango.webp", precoG: 41.00, precoM: 31.00 },
        { nome: "CALABRESA / PRESUNTO", imagem: "assets/img/calabresa-x-presunto.webp", precoG: 39.00, precoM: 29.00 },
        { nome: "CALABRESA / 2 - QUEIJO", imagem: "assets/img/2-queijo-x-calabresa.webp", precoG: 38.00, precoM: 28.00 }
    ],
    "Mix Portuguesa": [
        { nome: "PORTUGUESA / MUSSARELA", imagem: "assets/img/portuguesa-x-mussarela.webp", precoG: 40.00, precoM: 30.00 },
        { nome: "PORTUGUESA / CALABRESA", imagem: "assets/img/portuguesa-x-calabresa.webp", precoG: 41.00, precoM: 31.00 },
        { nome: "PORTUGUESA / FRANGO", imagem: "assets/img/portuguesa-x-frango.webp", precoG: 42.00, precoM: 32.00 },
        { nome: "PORTUGUESA / PRESUNTO", imagem: "assets/img/portuguesa-x-presunto.webp", precoG: 40.00, precoM: 30.00 },
        { nome: "PORTUGUESA / 2 - QUEIJO", imagem: "assets/img/2-queijo-x-portuguesa.webp", precoG: 40.00, precoM: 30.00 }
    ],
    "Mix Frango": [
        { nome: "FRANGO / MUSSARELA", imagem: "assets/img/frango-x-mussarela.webp", precoG: 40.00, precoM: 30.00 },
        { nome: "FRANGO / CALABRESA", imagem: "assets/img/frango-x-calabresa.webp", precoG: 41.00, precoM: 31.00 },
        { nome: "FRANGO / PORTUGUESA", imagem: "assets/img/frango-x-portuguesa.webp", precoG: 42.00, precoM: 32.00 },
        { nome: "FRANGO / PRESUNTO", imagem: "assets/img/frango-x-presunto.webp", precoG: 40.00, precoM: 30.00 },
        { nome: "FRANGO / 2 - QUEIJO", imagem: "assets/img/2-queijo-x-frango.webp", precoG: 40.00, precoM: 30.00 }
    ],
    "Mix Presunto": [
        { nome: "PRESUNTO / MUSSARELA", imagem: "assets/img/presunto-x-mussarela.webp", precoG: 38.00, precoM: 28.00 },
        { nome: "PRESUNTO / CALABRESA", imagem: "assets/img/presunto-x-calabresa.webp", precoG: 39.00, precoM: 29.00 },
        { nome: "PRESUNTO / PORTUGUESA", imagem: "assets/img/presunto-x-portuguesa.webp", precoG: 40.00, precoM: 30.00 },
        { nome: "PRESUNTO / FRANGO", imagem: "assets/img/presunto-x-frango.webp", precoG: 40.00, precoM: 30.00 },
        { nome: "PRESUNTO / 2 - QUEIJO", imagem: "assets/img/2-queijo-x-presunto.webp", precoG: 39.00, precoM: 29.00 }
    ],
    "Mix 2 - Queijo": [
        { nome: "2 - QUEIJO / MUSSARELA", imagem: "assets/img/2-queijo-x-mussarela.webp", precoG: 37.00, precoM: 27.00 },
        { nome: "2 - QUEIJO / CALABRESA", imagem: "assets/img/2-queijo-x-calabresa.webp", precoG: 38.00, precoM: 28.00 },
        { nome: "2 - QUEIJO / PORTUGUESA", imagem: "assets/img/2-queijo-x-portuguesa.webp", precoG: 40.00, precoM: 30.00 },
        { nome: "2 - QUEIJO / FRANGO", imagem: "assets/img/2-queijo-x-frango.webp", precoG: 40.00, precoM: 30.00 },
        { nome: "2 - QUEIJO / PRESUNTO", imagem: "assets/img/2-queijo-x-presunto.webp", precoG: 38.00, precoM: 28.00 }
    ]
};

const cardapioBebidas = [
    { nome: "COCA-COLA", desc: "Gelada", imagem: "./assets/img/imagem-coca-cola.webp", tamanhos: [{ tipo: "2L", preco: 13.50 }, { tipo: "1L", preco: 7.00 }] },
    { nome: "GUARANÁ-ANTARCTICA", desc: "Gelada", imagem: "./assets/img/imagem-guarana-antartica.webp", tamanhos: [{ tipo: "2L", preco: 12.00 }, { tipo: "1L", preco: 6.00 }] },
    { nome: "CAJUINA", desc: "Gelada", imagem: "./assets/img/imagem-cajuina.webp", tamanhos: [{ tipo: "2L", preco: 12.50 }, { tipo: "1L", preco: 6.00 }] },
    { nome: "IT-COLA", desc: "Gelada", imagem: "./assets/img/imagem-it-cola.webp", tamanhos: [{ tipo: "2L", preco: 8.00 }, { tipo: "1L", preco: 4.00 }] },
    { nome: "PEPSI", desc: "Gelada", imagem: "./assets/img/imagem-pepis.webp", tamanhos: [{ tipo: "2L", preco: 11.00 }, { tipo: "1L", preco: 6.00 }] },
];

// ==========================================
// 4. LÓGICA DO CARRINHO
// ==========================================
let carrinho = [];

function carregarCarrinho() {
    const salvo = localStorage.getItem('carrinho_sos_pizza');
    if (salvo) carrinho = JSON.parse(salvo);
    atualizarInterface();
}

function salvarCarrinho() {
    localStorage.setItem('carrinho_sos_pizza', JSON.stringify(carrinho));
}

window.adicionarAoCarrinho = function (pizzaNome, tamanho, preco) {
    const nomeAjustado = pizzaNome.includes('(') ? pizzaNome : `${pizzaNome} (${tamanho})`;
    carrinho.push({
        id: Date.now() + Math.random(),
        pizza: nomeAjustado,
        tamanho: tamanho,
        preco: parseFloat(preco)
    });
    salvarCarrinho();
    atualizarInterface();
    
    // Feedback visual
    const btn = event.target.closest('button');
    if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Adicionado!';
        setTimeout(() => { btn.innerHTML = originalText; }, 800);
    }
    
    const sidebar = document.getElementById('cartSidebar');
    if (sidebar) sidebar.classList.add('open');
}

window.removerDoCarrinho = function (id) {
    carrinho = carrinho.filter(item => item.id !== id);
    salvarCarrinho();
    atualizarInterface();
}

function getTaxaEntrega() {
    const select = document.getElementById('bairroSelect');
    if (!select) return 0;
    const option = select.options[select.selectedIndex];
    return parseFloat(option.getAttribute('data-taxa')) || 0;
}

function calcularSubtotal() {
    return carrinho.reduce((total, item) => total + item.preco, 0);
}

function calcularTotal() {
    return calcularSubtotal() + getTaxaEntrega();
}

window.atualizarInterface = function () {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCountElement = document.getElementById('cartCount');
    
    if (cartCountElement) {
        cartCountElement.innerText = carrinho.length;
        cartCountElement.style.display = carrinho.length > 0 ? 'flex' : 'none';
    }
    
    if (!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = '';
    
    if (carrinho.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: #888; padding: 2rem 0;">Seu carrinho está vazio</p>';
        document.getElementById('cartSubtotal').innerText = '0,00';
        document.getElementById('cartTaxa').innerText = '0,00';
        document.getElementById('cartTotal').innerText = '0,00';
        return;
    }
    
    let subtotal = 0;
    carrinho.forEach(item => {
        subtotal += item.preco;
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div style="flex: 1; padding-right: 10px;">
                <strong style="color: white; display: block;">${item.pizza}</strong>
                <small style="color: #aaa; display: block;">R$ ${item.preco.toFixed(2).replace('.', ',')}</small>
            </div>
            <button onclick="removerDoCarrinho(${item.id})" title="Remover" style="display: flex; align-items: center; justify-content: center; background: #ff4444; color: white; border: none; width: 32px; height: 32px; border-radius: 6px; cursor: pointer; font-size: 18px; font-weight: bold; margin-left: 10px; padding: 0;">
                ✕
            </button>
        `;
        cartItemsContainer.appendChild(itemDiv);
    });
    
    const selectBairro = document.getElementById('bairroSelect');
    const taxa = selectBairro ? (parseFloat(selectBairro.options[selectBairro.selectedIndex].dataset.taxa) || 0) : 0;
    const total = subtotal + taxa;
    
    document.getElementById('cartSubtotal').innerText = subtotal.toFixed(2).replace('.', ',');
    document.getElementById('cartTaxa').innerText = taxa.toFixed(2).replace('.', ',');
    document.getElementById('cartTotal').innerText = total.toFixed(2).replace('.', ',');
}

// ==========================================
// 5. FUNÇÃO FINALIZAR PEDIDO (ATUALIZADA)
// ==========================================
window.finalizarPedido = async function () {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    const formaPagamento = document.getElementById('pagamentoSelect').value;
    const nome = document.getElementById('clienteNome').value.trim();
    const telefone = document.getElementById('clienteTelefone').value.trim();
    const endereco = document.getElementById('clienteEndereco').value.trim();
    const referencia = document.getElementById('clienteReferencia').value.trim();
    
    const selectBairro = document.getElementById('bairroSelect');
    const bairroNome = selectBairro.options[selectBairro.selectedIndex].value;
    const taxaEntrega = getTaxaEntrega();
    const subtotal = calcularSubtotal();
    const total = subtotal + taxaEntrega;

    // Validação básica
    if (!nome || !telefone || !endereco || !formaPagamento) {
        alert('⚠️ Por favor, preencha todos os dados de entrega e escolha a forma de pagamento!');
        return;
    }

    const btn = document.getElementById('finalizarPedido');

    // ==========================================
    // CENÁRIO 1: PAGAMENTO VIA WHATSAPP (DINHEIRO/PIX MANUAL)
    // ==========================================
    if (formaPagamento === 'whatsapp') {
        let mensagem = `🍕 *NOVO PEDIDO - S.O.S PIZZA*\n\n`;
        mensagem += ` *Cliente:* ${nome}\n`;
        mensagem += `📱 *Telefone:* ${telefone}\n`;
        mensagem += `📍 *Endereço:* ${endereco}, ${bairroNome}\n`;
        if (referencia) mensagem += `🏠 *Referência:* ${referencia}\n`;
        mensagem += `\n📋 *Itens do Pedido:*\n`;
        
        carrinho.forEach(item => {
            mensagem += `• 1x ${item.pizza} - R$ ${item.preco.toFixed(2)}\n`;
        });
        
        mensagem += `\n💰 *Subtotal:* R$ ${subtotal.toFixed(2)}`;
        mensagem += `\n🛵 *Taxa de Entrega:* R$ ${taxaEntrega.toFixed(2)}`;
        mensagem += `\n✅ *TOTAL:* R$ ${total.toFixed(2)}`;
        mensagem += `\n💵 *Forma de Pagamento:* Dinheiro/PIX na Entrega`;

        window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`, '_blank');
        
        // Limpar carrinho após enviar
        carrinho = [];
        salvarCarrinho();
        atualizarInterface();
        document.getElementById('cartSidebar').classList.remove('open');
        return;
    }

    // ==========================================
    // CENÁRIO 2: PAGAMENTO ONLINE (MERCADO PAGO - CHECKOUT PRO)
    // ==========================================
    if (formaPagamento === 'mercadopago') {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando link seguro...';
        btn.disabled = true;

        // Prepara os dados no formato exato que o backend (pagamento.js) espera
        const dadosPagamento = {
            items: carrinho.map(item => ({
                nome: item.pizza,
                quantidade: 1,
                preco: item.preco
            })),
            payer: { 
                nome: nome, 
                telefone: telefone, 
                endereco: endereco, 
                bairro: bairroNome,
                email: 'cliente@sospizza.com'
            },
            subtotal: subtotal,
            taxaEntrega: taxaEntrega,
            total: total
        };

        try {
            const response = await fetch('/api/pagamento', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosPagamento)
            });

            const data = await response.json();

            if (data.init_point) {
                // REDIRECIONA PARA O MODAL DO MERCADO PAGO
                window.location.href = data.init_point;
            } else {
                alert(' Erro ao gerar pagamento: ' + (data.error || 'Tente novamente.'));
                btn.innerHTML = '<i class="fas fa-lock"></i> Finalizar e Pagar com Segurança';
                btn.disabled = false;
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('❌ Erro de conexão com o servidor.');
            btn.innerHTML = '<i class="fas fa-lock"></i> Finalizar e Pagar com Segurança';
            btn.disabled = false;
        }
    } else {
        alert('Selecione uma forma de pagamento!');
    }
}

// ==========================================
// 6. RENDERIZAÇÃO DO CARDÁPIO
// ==========================================
function renderizarTradicional() {
    const container = document.getElementById('tradicionalGrid');
    if (!container) return;
    container.innerHTML = cardapioTradicional.map(pizza => `
        <div class="menu-item"> 
            <div class="menu-item-image"><img src="${pizza.imagem}" alt="${pizza.nome}" loading="lazy"></div> 
            <div class="menu-item-content"> 
                <h3 class="menu-item-name">🍕 ${pizza.nome}</h3> 
                <p class="menu-item-desc">${pizza.desc}</p> 
                <div> 
                    ${pizza.tamanhos.map(t => `
                        <button class="btn-add" onclick="adicionarAoCarrinho('${pizza.nome}', '${t.tipo}', ${t.preco})">
                            ${t.tipo} R$ ${t.preco.toFixed(2).replace('.', ',')}
                        </button>
                    `).join('')} 
                </div> 
            </div> 
        </div>
    `).join('');
}

function renderizarMisto() {
    const tabsContainer = document.getElementById('mistoTabs');
    const contentContainer = document.getElementById('mistoContent');
    if (!tabsContainer || !contentContainer) return;

    const categorias = Object.keys(cardapioMisto);
    
    tabsContainer.innerHTML = categorias.map((cat, idx) => `
        <button class="tab-btn ${idx === 0 ? 'active' : ''}" data-tab="${cat.replace(/ /g, '_')}"> 
            <i class="fas fa-utensils"></i> ${cat} 
        </button>
    `).join('');

    contentContainer.innerHTML = categorias.map((cat, idx) => `
        <div id="tab_${cat.replace(/ /g, '_')}" class="tab-content ${idx === 0 ? 'active' : ''}">
            <div class="menu-grid">
                ${cardapioMisto[cat].map(pizza => `
                    <div class="menu-item">
                        <div class="menu-item-img">
                            <img src="${pizza.imagem}" alt="${pizza.nome}">
                        </div>
                        <div class="menu-item-content">
                            <h3 class="menu-item-name"> ${pizza.nome}</h3>
                            <div>
                                <button class="btn-add" onclick="adicionarAoCarrinho('${pizza.nome}', 'Grande', ${pizza.precoG})">
                                    Grande R$ ${pizza.precoG.toFixed(2).replace('.', ',')}
                                </button>
                                <button class="btn-add" onclick="adicionarAoCarrinho('${pizza.nome}', 'Média', ${pizza.precoM})">
                                    Média R$ ${pizza.precoM.toFixed(2).replace('.', ',')}
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            document.getElementById(`tab_${tabId}`).classList.add('active');
        });
    });
}

function renderizarBebidas() {
    const container = document.getElementById('bebidasGrid');
    if (!container) return;
    container.innerHTML = cardapioBebidas.map(bebida => `
        <div class="menu-item">
            <div class="menu-item-image">
                <img src="${bebida.imagem}" alt="${bebida.nome}" loading="lazy">
            </div>
            <div class="menu-item-content">
                <h3 class="menu-item-name">🥤 ${bebida.nome}</h3>
                <div>
                    ${bebida.tamanhos.map(t => {
                        const nomeIndividual = `${bebida.nome} (${t.tipo})`;
                        return `
                            <button class="btn-add" onclick="adicionarAoCarrinho('${nomeIndividual.replace(/'/g, "\\'")}', '${t.tipo}', ${t.preco})">
                                ${t.tipo} R$ ${t.preco.toFixed(2).replace('.', ',')}
                            </button>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// ==========================================
// 7. INICIALIZAÇÃO E EVENTOS
// ==========================================
function initSwitch() {
    const btnTrad = document.getElementById('btnTradicional');
    const btnMisto = document.getElementById('btnMisto');
    const btnBebidas = document.getElementById('btnBebidas');
    const tradSection = document.getElementById('tradicionalSection');
    const mistoSection = document.getElementById('mistoSection');
    const bebidasSection = document.getElementById('bebidasSection');

    if (!btnTrad) return;

    btnTrad.addEventListener('click', () => {
        btnTrad.classList.add('active');
        btnMisto.classList.remove('active');
        btnBebidas.classList.remove('active');
        tradSection.classList.add('active');
        mistoSection.classList.remove('active');
        if (bebidasSection) bebidasSection.classList.remove('active');
    });
    btnMisto.addEventListener('click', () => {
        btnMisto.classList.add('active');
        btnTrad.classList.remove('active');
        btnBebidas.classList.remove('active');
        mistoSection.classList.add('active');
        tradSection.classList.remove('active');
        if (bebidasSection) bebidasSection.classList.remove('active');
    });
    btnBebidas.addEventListener('click', () => {
        btnBebidas.classList.add('active');
        btnTrad.classList.remove('active');
        btnMisto.classList.remove('active');
        if (bebidasSection) bebidasSection.classList.add('active');
        tradSection.classList.remove('active');
        mistoSection.classList.remove('active');
    });
}

function initCartControls() {
    const cartToggle = document.getElementById('cartToggle');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    
    if (cartToggle) cartToggle.addEventListener('click', () => cartSidebar.classList.toggle('open'));
    if (closeCart) closeCart.addEventListener('click', () => cartSidebar.classList.remove('open'));
    
    const bairroSelect = document.getElementById('bairroSelect');
    if (bairroSelect) bairroSelect.addEventListener('change', atualizarInterface);
}

// INICIALIZAÇÃO GERAL
document.addEventListener('DOMContentLoaded', () => {
    try { renderizarTradicional(); } catch (e) { console.error("Erro na Tradicional:", e); }
    try { renderizarMisto(); } catch (e) { console.error("Erro no Misto:", e); }
    try { renderizarBebidas(); } catch (e) { console.error("Erro nas Bebidas:", e); }
    
    initSwitch();
    carregarCarrinho();
    initCartControls();
});