// ============================================
// CONFIGURAÇÕES
// ============================================
const mp = new MercadoPago('APP_USR-73f91a63-8283-4cab-8f18-87d6cb488d11');
const numeroWhatsApp = "5587981004878";

// CARDÁPIO TRADICIONAL
const cardapioTradicional = [
    { nome: "MUÇARELA", desc: "Molho, muçarela, orégano, tomate e azeitonas.", imagem: "assets/img/mussarela.webp", tamanhos: [{ tipo: "Grande", preco: 37 }, { tipo: "Média", preco: 27 }] },
    { nome: "CALABRESA", desc: "Molho, muçarela, calabresa, cebola, orégano e azeitonas.", imagem: "assets/img/calabresa.webp", tamanhos: [{ tipo: "Grande", preco: 39 }, { tipo: "Média", preco: 29 }] },
    { nome: "PORTUGUESA", desc: "Molho, muçarela, presunto, ovos, pimentão e azeitonas.", imagem: "assets/img/portuguesa.webp", tamanhos: [{ tipo: "Grande", preco: 42 }, { tipo: "Média", preco: 32 }] },
    { nome: "FRANGO", desc: "Molho, muçarela, frango desfiado, milho e azeitonas.", imagem: "assets/img/frango.webp", tamanhos: [{ tipo: "Grande", preco: 42 }, { tipo: "Média", preco: 32 }] },
    { nome: "PRESUNTO", desc: "Presunto, muçarela, orégano e azeitonas.", imagem: "assets/img/presunto.png", tamanhos: [{ tipo: "Grande", preco: 38 }, { tipo: "Média", preco: 28 }] },
    { nome: "2 - Queijo", desc: "Muçarela, orégano, requeijão e azeitonas.", imagem: "assets/img/2-queijo-tradicional.webp", tamanhos: [{ tipo: "Grande", preco: 38 }, { tipo: "Média", preco: 28 }] }
];

// CARDÁPIO MISTO (Meio a Meio)
const cardapioMisto = {
    "Mix Mussarela": [
        { nome: "MUSSARELA / CALABRESA", precoG: 38, precoM: 28, imagem: "assets/img/mussarela-x-calabresa.webp" },
        { nome: "MUSSARELA / PORTUGUESA", imagem: "assets/img/mussarela-x-portuguesa.webp", precoG: 39.50, precoM: 29.50 },
        { nome: "MUSSARELA / FRANGO", imagem: "assets/img/mussarela-x-frango.webp", precoG: 39.50, precoM: 29.50 },
        { nome: "MUSSARELA / BOLONHESA", imagem: "assets/img/mussarela-x-bolonhesa.webp", precoG: 41, precoM: 31 },
        { nome: "MUSSARELA / PRESUNTO", imagem: "assets/img/mussarela-x-presunto.webp", precoG: 37.50, precoM: 27.50 },
        { nome: "MUSSARELA / 2 - QUEIJO", imagem: "assets/img/2-queijo-x-mussarela.webp", precoG: 38.00, precoM: 28.00 }
    ],
    "Mix Calabresa": [
        { nome: "CALABRESA / MUSSARELA", imagem: "assets/img/calabresa-x-mussarela.webp", precoG: 38, precoM: 28 },
        { nome: "CALABRESA / PORTUGUESA", imagem: "assets/img/calabresa-x-portuguesa.webp", precoG: 40.50, precoM: 30.50 },
        { nome: "CALABRESA / FRANGO", imagem: "assets/img/calabresa-x-frango.webp", precoG: 40.50, precoM: 30.50 },
        { nome: "CALABRESA / BOLONHESA", imagem: "assets/img/calabresa-x-bolonhesa.webp", precoG: 42, precoM: 32 },
        { nome: "CALABRESA / PRESUNTO", imagem: "assets/img/calabresa-x-presunto.webp", precoG: 38.50, precoM: 28.50 },
        { nome: "CALABRESA / 2 - QUEIJO", imagem: "assets/img/2-queijo-x-calabresa.webp", precoG: 38.00, precoM: 28.00 }
    ],
    "Mix Portuguesa": [
        { nome: "PORTUGUESA / MUSSARELA", imagem: "assets/img/portuguesa-x-mussarela.webp", precoG: 39.50, precoM: 29.50 },
        { nome: "PORTUGUESA / CALABRESA", imagem: "assets/img/portuguesa-x-calabresa.webp", precoG: 40.50, precoM: 30.50 },
        { nome: "PORTUGUESA / FRANGO", imagem: "assets/img/portuguesa-x-frango.webp", precoG: 42, precoM: 32 },
        { nome: "PORTUGUESA / BOLONHESA", imagem: "assets/img/portuguesa-x-bolonhesa.webp", precoG: 43.50, precoM: 33.50 },
        { nome: "PORTUGUESA / PRESUNTO", imagem: "assets/img/portuguesa-x-presunto.webp", precoG: 40, precoM: 30 },
        { nome: "PORTUGUESA / 2 - QUEIJO", imagem: "assets/img/2-queijo-x-portuguesa.webp", precoG: 40.00, precoM: 30.00 }
    ],
    "Mix Frango": [
        { nome: "FRANGO / MUSSARELA", imagem: "assets/img/frango-x-mussarela.webp", precoG: 39.50, precoM: 29.50 },
        { nome: "FRANGO / CALABRESA", imagem: "assets/img/frango-x-calabresa.webp", precoG: 40.50, precoM: 30.50 },
        { nome: "FRANGO / PORTUGUESA", imagem: "assets/img/frango-x-portuguesa.webp", precoG: 42, precoM: 32 },
        { nome: "FRANGO / BOLONHESA", imagem: "assets/img/frango-x-bolonhesa.webp", precoG: 43.50, precoM: 33.50 },
        { nome: "FRANGO / PRESUNTO", imagem: "assets/img/frango-x-presunto.webp", precoG: 40, precoM: 30 },
        { nome: "FRANGO / 2 - QUEIJO", imagem: "assets/img/2-queijo-x-frango.webp", precoG: 40.00, precoM: 30.00 }
    ],
    "Mix Presunto": [
        { nome: "PRESUNTO / MUSSARELA", imagem: "assets/img/presunto-x-mussarela.webp", precoG: 37.50, precoM: 27.50 },
        { nome: "PRESUNTO / CALABRESA", imagem: "assets/img/presunto-x-calabresa.webp", precoG: 38.50, precoM: 28.50 },
        { nome: "PRESUNTO / PORTUGUESA", imagem: "assets/img/presunto-x-portuguesa.webp", precoG: 40, precoM: 30 },
        { nome: "PRESUNTO / FRANGO", imagem: "assets/img/presunto-x-frango.webp", precoG: 40, precoM: 30 },
        { nome: "PRESUNTO / BOLONHESA", imagem: "assets/img/presunto-x-bolonhesa.webp", precoG: 41.50, precoM: 31.50 },
        { nome: "PRESUNTO / 2 - QUEIJO", imagem: "assets/img/2-queijo-x-presunto.webp", precoG: 38.50, precoM: 28.50 }
    ],
    "Mix 2 - Queijo": [
        { nome: "2 - QUEIJO / MUSSARELA", imagem: "assets/img/2-queijo-x-mussarela.webp", precoG: 37.00, precoM: 27.00 },
        { nome: "2 - QUEIJO / CALABRESA", imagem: "assets/img/2-queijo-x-calabresa.webp", precoG: 38.00, precoM: 28.00 },
        { nome: "2 - QUEIJO / PORTUGUESA", imagem: "assets/img/2-queijo-x-portuguesa.webp", precoG: 40.00, precoM: 30.00 },
        { nome: "2 - QUEIJO / FRANGO", imagem: "assets/img/2-queijo-x-frango.webp", precoG: 40.00, precoM: 30.00 },
        { nome: "2 - QUEIJO / BOLONHESA", imagem: "assets/img/2-queijo-x-bolonhesa.webp", precoG: 42.00, precoM: 32.00 },
        { nome: "2 - QUEIJO / PRESUNTO", imagem: "assets/img/2-queijo-x-presunto.webp", precoG: 38.00, precoM: 28.00 }
    ]
};

// CARDÁPIO DE BEBIDAS
const cardapioBebidas = [
    { nome: "COCA-COLA", desc: "Gelada", imagem: "./assets/img/imagem-coca-cola.webp", tamanhos: [{ tipo: "2L", preco: 12.00 }, { tipo: "1L", preco: 7.00 }] },
    { nome: "GUARANÁ-ANTARCTICA", desc: "Gelada", imagem: "./assets/img/imagem-guarana-antartica.webp", tamanhos: [{ tipo: "2L", preco: 12.00 }, { tipo: "1L", preco: 7.00 }] },
    { nome: "CAJUINA", desc: "Gelada", imagem: "./assets/img/imagem-cajuina.webp", tamanhos: [{ tipo: "2L", preco: 12.00 }, { tipo: "1L", preco: 7.00 }] },
    { nome: "IT-COLA", desc: "Gelada", imagem: "./assets/img/imagem-it-cola.webp", tamanhos: [{ tipo: "2L", preco: 7.00 }, { tipo: "1L", preco: 4.00 }] },
    { nome: "IT-LIMÃO", desc: "Gelada", imagem: "./assets/img/imagem-it-limao.webp", tamanhos: [{ tipo: "2L", preco: 7.00 }, { tipo: "1L", preco: 4.00 }] },
    { nome: "PEPSI", desc: "Gelada", imagem: "./assets/img/imagem-pepis.webp", tamanhos: [{ tipo: "2L", preco: 10.00 }, { tipo: "1L", preco: 6.00 }] },
];

// CARRINHO
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
    const option = select.options[select.selectedIndex];
    return parseFloat(option.getAttribute('data-taxa')) || 0;
}

function calcularSubtotal() {
    return carrinho.reduce((total, item) => total + item.preco, 0);
}

function calcularTotal() {
    return calcularSubtotal() + getTaxaEntrega();
}

// Atualiza a interface do carrinho
window.atualizarInterface = function () {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCountElement = document.getElementById('cartCount');

    if (cartCountElement) {
        cartCountElement.innerText = carrinho.length;
        cartCountElement.style.display = carrinho.length > 0 ? 'flex' : 'none';
    }

    if (!cartItemsContainer) {
        console.error("❌ ERRO: Elemento #cartItems não encontrado no HTML!");
        return;
    }

    cartItemsContainer.innerHTML = '';

    if (carrinho.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: #888; padding: 2rem 0;">Seu carrinho está vazio </p>';
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

// ============================================
// FUNÇÃO ÚNICA E CORRIGIDA DE FINALIZAR PEDIDO
// ============================================
window.finalizarPedido = function () {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    const formaPagamento = document.getElementById('pagamentoSelect').value;

    // CAMINHO A: WHATSAPP (Dinheiro/PIX)
    if (formaPagamento === 'whatsapp') {
        // 1. Capturar dados do cliente
        const nome = document.getElementById('clienteNome').value.trim();
        const telefone = document.getElementById('clienteTelefone').value.trim();
        const endereco = document.getElementById('clienteEndereco').value.trim();
        const referencia = document.getElementById('clienteReferencia').value.trim();
        const select = document.getElementById('bairroSelect');
        const localizacao = select.options[select.selectedIndex].text;
        const taxa = getTaxaEntrega();
        const subtotal = calcularSubtotal();
        const total = subtotal + taxa;

        // 2. Validação: Impedir envio se faltar dados cruciais
        if (!nome || !telefone || !endereco) {
            alert('⚠️ Por favor, preencha seu Nome, Telefone e Endereço para que possamos entregar seu pedido!');
            return; // PARA A EXECUÇÃO AQUI
        }

        // 3. Montar o objeto EXATO que o banco de dados (MongoDB) espera
        const dadosPedido = {
            cliente: {
                nome: nome,
                telefone: telefone,
                endereco: `${endereco}${referencia ? ' (Ref: ' + referencia + ')' : ''}`,
                bairro: localizacao
            },
            itens: carrinho.map(i => ({ nome: i.pizza, quantidade: 1, preco: i.preco })),
            subtotal: subtotal,
            taxa_entrega: taxa,
            total: total,
            forma_pagamento: 'Dinheiro/Pix na Entrega',
            status: 'Pendente'
        };

        // 4. Enviar silenciosamente para o Banco de Dados
        fetch('/api/pedidos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosPedido)
        }).catch(err => console.error("Erro ao salvar no banco:", err));

        // 5. Montar a mensagem do WhatsApp já com TUDO preenchido
        let mensagem = "🍕 *S.O.S PIZZA - NOVO PEDIDO* 🍕\n\n";
        mensagem += `👤 *CLIENTE:* ${nome}\n`;
        mensagem += `📱 *TELEFONE:* ${telefone}\n`;
        mensagem += `📍 *ENDEREÇO:* ${endereco}\n`;
        if (referencia) mensagem += `🏠 *REFERÊNCIA:* ${referencia}\n`;
        mensagem += `🗺️ *BAIRRO:* ${localizacao}\n\n`;

        mensagem += "*🛒 ITENS DO PEDIDO:*\n";
        carrinho.forEach((item, idx) => {
            mensagem += `${idx + 1}️⃣ ${item.pizza} - R$ ${item.preco.toFixed(2).replace('.', ',')}\n`;
        });

        mensagem += `\n💵 *SUBTOTAL:* R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        mensagem += `\n🛵 *TAXA DE ENTREGA:* R$ ${taxa.toFixed(2).replace('.', ',')}`;
        mensagem += `\n💰 *TOTAL A PAGAR:* R$ ${total.toFixed(2).replace('.', ',')}`;
        mensagem += `\n💳 *FORMA DE PAGAMENTO:* Dinheiro/PIX na entrega`;

        // 6. Abrir o WhatsApp e limpar o carrinho
        setTimeout(() => {
            window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`, '_blank');
            carrinho = [];
            salvarCarrinho();
            atualizarInterface();
            document.getElementById('cartSidebar').classList.remove('open');

            // Opcional: Limpar os campos do formulário após o envio
            document.getElementById('clienteNome').value = '';
            document.getElementById('clienteTelefone').value = '';
            document.getElementById('clienteEndereco').value = '';
            document.getElementById('clienteReferencia').value = '';
        }, 500);
    }

    // CAMINHO B: CARTÃO (Abre formulário MP)
    else if (formaPagamento === 'cartao') {
        const formCartao = document.getElementById('secaoCartaoMercadoPago');
        if (formCartao) {
            formCartao.style.display = 'block';
            document.getElementById('valorTotalCartao').innerText = calcularTotal().toFixed(2).replace('.', ',');
            formCartao.scrollIntoView({ behavior: 'smooth' });
            alert('Formulário de cartão aberto! Preencha os dados e clique em "Pagar".');
        }
    }

    else {
        alert('Selecione uma forma de pagamento!');
    }
}

// RENDERIZAR CARDÁPIO TRADICIONAL
function renderizarTradicional() {
    const container = document.getElementById('tradicionalGrid');
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

// Monitora mudança de localização
document.addEventListener("DOMContentLoaded", () => {
    const bairroSelect = document.getElementById('bairroSelect');
    if (bairroSelect) {
        bairroSelect.addEventListener('change', () => {
            atualizarInterface();
        });
    }
});

// RENDERIZAR CARDÁPIO MISTO
function renderizarMisto() {
    const tabsContainer = document.getElementById('mistoTabs');
    const categorias = Object.keys(cardapioMisto);
    tabsContainer.innerHTML = categorias.map((cat, idx) => `
        <button class="tab-btn ${idx === 0 ? 'active' : ''}" data-tab="${cat.replace(/ /g, '_')}">
            <i class="fas fa-utensils"></i> ${cat}
        </button>
    `).join('');

    const contentContainer = document.getElementById('mistoContent');
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

// Renderiza seção de bebidas
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

// SWITCH ENTRE CARDÁPIOS
function initSwitch() {
    const btnTrad = document.getElementById('btnTradicional');
    const btnMisto = document.getElementById('btnMisto');
    const btnBebidas = document.getElementById('btnBebidas');

    const tradSection = document.getElementById('tradicionalSection');
    const mistoSection = document.getElementById('mistoSection');
    const bebidasSection = document.getElementById('bebidasSection');

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

// CONTROLE DO CARRINHO LATERAL
function initCartControls() {
    const cartToggle = document.getElementById('cartToggle');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');

    if (cartToggle) cartToggle.addEventListener('click', () => cartSidebar.classList.toggle('open'));
    if (closeCart) closeCart.addEventListener('click', () => cartSidebar.classList.remove('open'));

    const btnFinalizar = document.getElementById('finalizarPedido');
    if (btnFinalizar) btnFinalizar.addEventListener('click', finalizarPedido);

    const bairroSelect = document.getElementById('bairroSelect');
    if (bairroSelect) bairroSelect.addEventListener('change', atualizarInterface);
}

// ============================================
// CONTROLE DE EXIBIÇÃO DO FORMULÁRIO DE CARTÃO
// ============================================
function initPagamentoControls() {
    const pagamentoSelect = document.getElementById('pagamentoSelect');
    const formCartao = document.getElementById('secaoCartaoMercadoPago');
    const btnWhatsApp = document.getElementById('btnFinalizarWhatsApp'); // Botão que você moveu para sidebar

    if (pagamentoSelect && formCartao) {
        pagamentoSelect.addEventListener('change', function () {
            if (this.value === 'cartao') {
                // Mostra formulário de cartão
                formCartao.style.display = 'block';

                // Esconde botão WhatsApp (se existir)
                if (btnWhatsApp) {
                    btnWhatsApp.style.display = 'none';
                }

                // Atualiza valor total
                const totalFormatado = calcularTotal().toFixed(2).replace('.', ',');
                const spanValor = document.getElementById('valorTotalCartao');
                if (spanValor) spanValor.innerText = totalFormatado;

                // Rola até o formulário
                formCartao.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                // Esconde formulário de cartão
                formCartao.style.display = 'none';

                // Mostra botão WhatsApp (se existir)
                if (btnWhatsApp) {
                    btnWhatsApp.style.display = 'block';
                }
            }
        });
    }
}

// ============================================
// PAGAMENTO COM CARTÃO (MERCADO PAGO)
// ============================================
function initPagamentoCartao() {
    const btnPagarCartao = document.getElementById('btnPagarCartao');

    if (btnPagarCartao) {
        btnPagarCartao.addEventListener('click', function () {
            const num = document.getElementById('cardNumber').value.replace(/\s/g, '');
            const nome = document.getElementById('cardholderName').value.trim();
            const val = document.getElementById('cardExpiry').value;
            const cvv = document.getElementById('cvv').value.replace(/\D/g, '');
            const cpf = document.getElementById('payerDoc').value.replace(/\D/g, '');
            const parc = document.getElementById('installments').value;

            if (!num || !nome || !val || !cvv || !cpf) {
                alert('⚠️ Preencha todos os campos do cartão e CPF!');
                return;
            }
            if (cpf.length !== 11) {
                alert('⚠️ CPF inválido!');
                return;
            }

            const partes = val.split('/');
            if (partes.length !== 2) {
                alert('⚠️ Data inválida (MM/AA)!');
                return;
            }

            mp.createCardToken({
                cardNumber: num,
                cardholderName: nome,
                cardExpirationMonth: partes[0],
                cardExpirationYear: "20" + partes[1],
                securityCode: cvv
            }).then(resposta => {
                fetch('/api/pagamento', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        token: resposta.id,
                        transaction_amount: calcularTotal(),
                        payer_doc: cpf,
                        installments: parseInt(parc),
                        payment_method_id: 'visa',
                        email: 'cliente@sospizza.com'
                    })
                })
                    .then(r => r.json())
                    .then(data => {
                        if (data.error) {
                            alert('❌ Erro: ' + data.error);
                        } else {
                            alert(' Pagamento aprovado! Pedido enviado.');
                            carrinho = [];
                            salvarCarrinho();
                            atualizarInterface();
                            document.getElementById('cartSidebar').classList.remove('open');
                        }
                    })
                    .catch(err => alert('Erro de conexão'));
            }).catch(erro => {
                alert('Cartão recusado: ' + (erro.cause?.[0]?.description || erro.message));
            });
        });
    }
}

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    try { renderizarTradicional(); } catch (e) { console.error("Erro na Tradicional:", e); }
    try { renderizarMisto(); } catch (e) { console.error("Erro no Misto:", e); }
    try { renderizarBebidas(); } catch (e) { console.error("Erro nas Bebidas:", e); }

    if (typeof initSwitch === 'function') initSwitch();
    if (typeof carregarCarrinho === 'function') carregarCarrinho();
    if (typeof initCartControls === 'function') initCartControls();
    if (typeof initPagamentoControls === 'function') initPagamentoControls(); // NOVO: Controle de exibição
    if (typeof initPagamentoCartao === 'function') initPagamentoCartao(); // Processamento do cartão
});