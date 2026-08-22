// ==========================================
// 1. CONFIGURAÇÃO DO MERCADO PAGO (FRONTEND)
// ==========================================
const PUBLIC_KEY = 'APP_USR-73f91a63-8283-4cab-8f18-87d6cb488d11'; 
mp = new MercadoPago(PUBLIC_KEY, { locale: 'pt-BR' });
const numeroWhatsApp = "5587981004878";

// ==========================================
// 2. CONTROLES DE UI E MÁSCARAS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const pagamentoSelect = document.getElementById('pagamentoSelect');
    const secaoCartao = document.getElementById('secaoCartaoMercadoPago');
    const payerDocInput = document.getElementById('payerDoc');

    // Mostrar/Esconder formulário de cartão
    if (pagamentoSelect && secaoCartao) {
        pagamentoSelect.addEventListener('change', function() {
            secaoCartao.style.display = this.value === 'cartao' ? 'block' : 'none';
        });
    }

    // Máscara de CPF
    if (payerDocInput) {
        payerDocInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d)/, '$1.$2')
                             .replace(/(\d{3})(\d)/, '$1.$2')
                             .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                e.target.value = value;
            }
        });
    }
});

// ==========================================
// 3. LÓGICA UNIFICADA DE FINALIZAR PEDIDO
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
    
    // Validação básica obrigatória
    if (!nome || !telefone || !endereco) {
        alert('⚠️ Por favor, preencha Nome, Telefone e Endereço.');
        return;
    }

    const subtotal = calcularSubtotal();
    const taxa = getTaxaEntrega();
    const total = subtotal + taxa;

    // --- CAMINHO A: WHATSAPP / PIX ---
    if (formaPagamento === 'whatsapp') {
        const select = document.getElementById('bairroSelect');
        const localizacao = select.options[select.selectedIndex].text;
        const referencia = document.getElementById('clienteReferencia').value.trim();

        const dadosPedido = {
            cliente: { nome, telefone, endereco: `${endereco}${referencia ? ' (Ref: ' + referencia + ')' : ''}`, bairro: localizacao },
            itens: carrinho.map(i => ({ nome: i.pizza, quantidade: 1, preco: i.preco })),
            subtotal, taxa_entrega: taxa, total,
            forma_pagamento: 'Dinheiro/Pix na Entrega', status: 'Pendente'
        };

        // Salva no banco silenciosamente
        fetch('/api/pedidos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadosPedido) })
            .catch(err => console.error("Erro ao salvar no banco:", err));

        // Monta mensagem WhatsApp
        let msg = `🍕 *S.O.S PIZZA - NOVO PEDIDO*\n\n👤 *CLIENTE:* ${nome}\n *TELEFONE:* ${telefone}\n *ENDEREÇO:* ${endereco}\n`;
        if (referencia) msg += ` *REFERÊNCIA:* ${referencia}\n`;
        msg += `🗺️ *BAIRRO:* ${localizacao}\n\n*🛒 ITENS:*\n`;
        
        carrinho.forEach((item, idx) => msg += `${idx + 1}️⃣ ${item.pizza} - R$ ${item.preco.toFixed(2).replace('.', ',')}\n`);
        msg += `\n💵 *SUBTOTAL:* R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        msg += `\n🛵 *TAXA:* R$ ${taxa.toFixed(2).replace('.', ',')}`;
        msg += `\n💰 *TOTAL:* R$ ${total.toFixed(2).replace('.', ',')}`;
        msg += `\n *PAGAMENTO:* Dinheiro/PIX na entrega`;

        window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(msg)}`, '_blank');
        
        // Limpa tudo após enviar
        setTimeout(() => {
            carrinho = []; salvarCarrinho(); atualizarInterface();
            document.getElementById('cartSidebar').classList.remove('open');
            ['clienteNome','clienteTelefone','clienteEndereco','clienteReferencia'].forEach(id => document.getElementById(id).value = '');
        }, 500);
    } 

    // --- CAMINHO B: CARTÃO DE CRÉDITO ---
    else if (formaPagamento === 'cartao') {
        const btn = document.getElementById('finalizarPedido');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
        btn.disabled = true;

        try {
            // Gera token seguro no frontend
            const cardToken = await mp.createCardToken({
                cardNumber: document.getElementById('cardNumber').value.replace(/\s/g, ''),
                cardExpirationMonth: document.getElementById('cardExpiry').value.split('/')[0],
                cardExpirationYear: "20" + document.getElementById('cardExpiry').value.split('/')[1],
                securityCode: document.getElementById('cvv').value,
                cardholderName: document.getElementById('cardholderName').value.toUpperCase(),
                identificationType: "CPF",
                identificationNumber: document.getElementById('payerDoc').value.replace(/\D/g, '')
            });

            // Envia para o SEU backend
            const response = await fetch('/api/pagamento', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: cardToken.id,
                    transaction_amount: total,
                    email: "cliente@sospizza.com", // Adicione campo de email no HTML futuramente
                    payment_method_id: "master",
                    installments: parseInt(document.getElementById('installments').value) || 1,
                    payer_doc: cardToken.cardholder.identification.number
                })
            });

            const resultado = await response.json();

            if (response.ok && (resultado.status === 'approved' || resultado.status === 'pending')) {
                alert('✅ Pagamento Aprovado! ID: ' + resultado.paymentId);
                
                // Salva pedido como PAGO no banco
                fetch('/api/pedidos', { 
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify({
                        cliente: { nome, telefone, endereco, bairro: document.getElementById('bairroSelect').value },
                        itens: carrinho.map(i => ({ nome: i.pizza, quantidade: 1, preco: i.preco })),
                        subtotal, taxa_entrega: taxa, total,
                        forma_pagamento: 'Cartão de Crédito (MP)', status: 'Pago'
                    }) 
                });

                carrinho = []; salvarCarrinho(); atualizarInterface();
                document.getElementById('cartSidebar').classList.remove('open');
            } else {
                alert('❌ Pagamento Recusado: ' + (resultado.error || 'Verifique os dados.'));
            }
        } catch (error) {
            console.error(error);
            alert('❌ Erro ao processar cartão. Tente novamente.');
        } finally {
            btn.innerHTML = '<i class="fab fa-whatsapp"></i> Finalizar Pedido';
            btn.disabled = false;
        }
    } else {
        alert('Selecione uma forma de pagamento!');
    }
};

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

// CARDÁPIO DE BEBIDAS
const cardapioBebidas = [
    { nome: "COCA-COLA", desc: "Gelada", imagem: "./assets/img/imagem-coca-cola.webp", tamanhos: [{ tipo: "2L", preco: 13.50 }, { tipo: "1L", preco: 7.00 }] },
    { nome: "GUARANÁ-ANTARCTICA", desc: "Gelada", imagem: "./assets/img/imagem-guarana-antartica.webp", tamanhos: [{ tipo: "2L", preco: 12.00 }, { tipo: "1L", preco: 6.00 }] },
    { nome: "CAJUINA", desc: "Gelada", imagem: "./assets/img/imagem-cajuina.webp", tamanhos: [{ tipo: "2L", preco: 12.50 }, { tipo: "1L", preco: 6.00 }] },
    { nome: "IT-COLA", desc: "Gelada", imagem: "./assets/img/imagem-it-cola.webp", tamanhos: [{ tipo: "2L", preco: 8.00 }, { tipo: "1L", preco: 4.00 }] },
    { nome: "PEPSI", desc: "Gelada", imagem: "./assets/img/imagem-pepis.webp", tamanhos: [{ tipo: "2L", preco: 11.00 }, { tipo: "1L", preco: 6.00 }] },
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
window.finalizarPedido = async function () {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    const formaPagamento = document.getElementById('pagamentoSelect').value;
    const nome = document.getElementById('clienteNome').value.trim();
    const telefone = document.getElementById('clienteTelefone').value.trim();
    const endereco = document.getElementById('clienteEndereco').value.trim();
    
    if (!nome || !telefone || !endereco) {
        alert('️ Por favor, preencha Nome, Telefone e Endereço.');
        return;
    }

    const subtotal = calcularSubtotal();
    const taxa = getTaxaEntrega();
    const total = subtotal + taxa;

    // --- CARTÃO DE CRÉDITO ---
    if (formaPagamento === 'cartao') {
        const formCartao = document.getElementById('secaoCartaoMercadoPago');
        
        // Se o formulário de cartão ESTÁ FECHADO, abre ele
        if (!formCartao || formCartao.style.display === 'none') {
            if (formCartao) {
                formCartao.style.display = 'block';
                formCartao.scrollIntoView({ behavior: 'smooth' });
            }
            return; // PARA AQUI e espera o usuário preencher
        }
        
        // Se o formulário JÁ ESTÁ ABERTO, processa o pagamento!
        const btn = document.getElementById('finalizarPedido');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
        btn.disabled = true;

        try {
            // Gerar token do cartão
            const cardToken = await mp.createCardToken({
                cardNumber: document.getElementById('cardNumber').value.replace(/\s/g, ''),
                cardExpirationMonth: document.getElementById('cardExpiry').value.split('/')[0],
                cardExpirationYear: "20" + document.getElementById('cardExpiry').value.split('/')[1],
                securityCode: document.getElementById('cvv').value,
                cardholderName: document.getElementById('cardholderName').value.toUpperCase(),
                identificationType: "CPF",
                identificationNumber: document.getElementById('payerDoc').value.replace(/\D/g, '')
            });

            // Enviar para backend
            const response = await fetch('/api/pagamento', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: cardToken.id,
                    transaction_amount: total,
                    email: "cliente@sospizza.com",
                    payment_method_id: "master",
                    installments: parseInt(document.getElementById('installments').value) || 1,
                    payer_doc: cardToken.cardholder.identification.number
                })
            });

            const resultado = await response.json();

            if (response.ok && (resultado.status === 'approved' || resultado.status === 'pending')) {
                alert('✅ Pagamento Aprovado! ID: ' + resultado.paymentId);
                
                // Salvar pedido como PAGO
                fetch('/api/pedidos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cliente: { nome, telefone, endereco, bairro: 'Cartão' },
                        itens: carrinho.map(i => ({ nome: i.pizza, quantidade: 1, preco: i.preco })),
                        subtotal, taxa_entrega: taxa, total,
                        forma_pagamento: 'Cartão de Crédito (MP)',
                        status: 'Pago'
                    })
                });

                carrinho = [];
                salvarCarrinho();
                atualizarInterface();
                document.getElementById('cartSidebar').classList.remove('open');
                formCartao.style.display = 'none';
            } else {
                alert('❌ Pagamento Recusado: ' + (resultado.error || 'Verifique os dados.'));
            }
        } catch (error) {
            console.error(error);
            alert('❌ Erro ao processar cartão.');
        } finally {
            btn.innerHTML = '<i class="fab fa-whatsapp"></i> Finalizar Pedido';
            btn.disabled = false;
        }
    } 
    
    // --- WHATSAPP / PIX ---
    else {
        // ... (mantém sua lógica atual do WhatsApp)
        const select = document.getElementById('bairroSelect');
        const localizacao = select.options[select.selectedIndex].text;
        const referencia = document.getElementById('clienteReferencia').value.trim();

        const dadosPedido = {
            cliente: { nome, telefone, endereco: `${endereco}${referencia ? ' (Ref: ' + referencia + ')' : ''}`, bairro: localizacao },
            itens: carrinho.map(i => ({ nome: i.pizza, quantidade: 1, preco: i.preco })),
            subtotal, taxa_entrega: taxa, total,
            forma_pagamento: 'Dinheiro/Pix na Entrega',
            status: 'Pendente'
        };

        fetch('/api/pedidos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadosPedido) })
            .catch(err => console.error("Erro ao salvar:", err));

        let msg = `🍕 *S.O.S PIZZA*\n\n👤 *Cliente:* ${nome}\n📱 *Tel:* ${telefone}\n📍 *End:* ${endereco}\n`;
        if (referencia) msg += `🏠 *Ref:* ${referencia}\n`;
        msg += `🗺️ *Bairro:* ${localizacao}\n\n*🛒 ITENS:*\n`;
        
        carrinho.forEach((item, idx) => msg += `${idx + 1}️⃣ ${item.pizza} - R$ ${item.preco.toFixed(2).replace('.', ',')}\n`);
        msg += `\n💵 *SUBTOTAL:* R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        msg += `\n🛵 *TAXA:* R$ ${taxa.toFixed(2).replace('.', ',')}`;
        msg += `\n💰 *TOTAL:* R$ ${total.toFixed(2).replace('.', ',')}`;
        msg += `\n *PAGAMENTO:* Dinheiro/PIX na entrega`;

        window.open(`https://wa.me/5587981004878?text=${encodeURIComponent(msg)}`, '_blank');
        
        setTimeout(() => {
            carrinho = []; salvarCarrinho(); atualizarInterface();
            document.getElementById('cartSidebar').classList.remove('open');
        }, 500);
    }
}
// =====FIM DA FUNÇÃO FINALIZAR PEDIDO=====

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