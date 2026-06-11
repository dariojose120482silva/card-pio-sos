// ============================================
// CONFIGURAÇÕES
// ============================================
const numeroWhatsApp = "5587981004878";

// CARDÁPIO TRADICIONAL
const cardapioTradicional = [
    { nome: "MUÇARELA", desc: "Molho, muçarela, orégano, tomate e azeitonas.", imagem: "assets/img/mussarela.webp", tamanhos: [{ tipo: "Grande", preco: 37 }, { tipo: "Média", preco: 27 }] },
    { nome: "CALABRESA", desc: "Molho, muçarela, calabresa, cebola, orégano e azeitonas.", imagem: "assets/img/calabresa.webp", tamanhos: [{ tipo: "Grande", preco: 39 }, { tipo: "Média", preco: 29 }] },
    { nome: "PORTUGUESA", desc: "Molho, muçarela, presunto, ovos, pimentão e azeitonas.", imagem: "assets/img/portuguesa.webp", tamanhos: [{ tipo: "Grande", preco: 42 }, { tipo: "Média", preco: 32 }] },
    { nome: "FRANGO", desc: "Molho, muçarela, frango desfiado, milho e azeitonas.", imagem: "assets/img/frango.webp", tamanhos: [{ tipo: "Grande", preco: 42 }, { tipo: "Média", preco: 32 }] },
    { nome: "BOLONHESA", desc: "Molho, carne moída, muçarela, cebola e azeitonas.", imagem: "assets/img/bolonhesa.webp", tamanhos: [{ tipo: "Grande", preco: 45 }, { tipo: "Média", preco: 35 }] },
    { nome: "PRESUNTO", desc: "Presunto, muçarela, orégano e azeitonas.", imagem: "assets/img/presunto.png", tamanhos: [{ tipo: "Grande", preco: 38 }, { tipo: "Média", preco: 28 }] }
];

// CARDÁPIO MISTO (Meio a Meio)
const cardapioMisto = {
    "Mix Mussarela": [
        { nome: "MUSSARELA / CALABRESA", precoG: 38, precoM: 28, imagem: "assets/img/mussarela-x-calabresa.webp" },
        { nome: "MUSSARELA / PORTUGUESA", imagem: "assets/img/mussarela-x-portuguesa.webp", precoG: 39.50, precoM: 29.50 },
        { nome: "MUSSARELA / FRANGO", imagem: "assets/img/mussarela-x-frango.webp", precoG: 39.50, precoM: 29.50 },
        { nome: "MUSSARELA / BOLONHESA", imagem: "assets/img/mussarela-x-bolonhesa.webp", precoG: 41, precoM: 31 },
        { nome: "MUSSARELA / PRESUNTO", imagem: "assets/img/mussarela-x-presunto.webp", precoG: 37.50, precoM: 27.50 }
    ],
    "Mix Calabresa": [
        { nome: "CALABRESA / MUSSARELA", imagem: "assets/img/calabresa-x-mussarela.webp", precoG: 38, precoM: 28 },
        { nome: "CALABRESA / PORTUGUESA", imagem: "assets/img/calabresa-x-portuguesa.webp", precoG: 40.50, precoM: 30.50 },
        { nome: "CALABRESA / FRANGO", imagem: "assets/img/calabresa-x-frango.webp", precoG: 40.50, precoM: 30.50 },
        { nome: "CALABRESA / BOLONHESA", imagem: "assets/img/calabresa-x-bolonhesa.webp", precoG: 42, precoM: 32 },
        { nome: "CALABRESA / PRESUNTO", imagem: "assets/img/calabresa-x-presunto.webp", precoG: 38.50, precoM: 28.50 }
    ],
    "Mix Portuguesa": [
        { nome: "PORTUGUESA / MUSSARELA", imagem: "assets/img/portuguesa-x-mussarela.webp", precoG: 39.50, precoM: 29.50 },
        { nome: "PORTUGUESA / CALABRESA", imagem: "assets/img/portuguesa-x-calabresa.webp", precoG: 40.50, precoM: 30.50 },
        { nome: "PORTUGUESA / FRANGO", imagem: "assets/img/portuguesa-x-frango.webp", precoG: 42, precoM: 32 },
        { nome: "PORTUGUESA / BOLONHESA", imagem: "assets/img/portuguesa-x-bolonhesa.webp", precoG: 43.50, precoM: 33.50 },
        { nome: "PORTUGUESA / PRESUNTO", imagem: "assets/img/portuguesa-x-presunto.webp", precoG: 40, precoM: 30 }
    ],
    "Mix Frango": [
        { nome: "FRANGO / MUSSARELA", imagem: "assets/img/frango-x-mussarela.webp", precoG: 39.50, precoM: 29.50 },
        { nome: "FRANGO / CALABRESA", imagem: "assets/img/frango-x-calabresa.webp", precoG: 40.50, precoM: 30.50 },
        { nome: "FRANGO / PORTUGUESA", imagem: "assets/img/frango-x-portuguesa.webp", precoG: 42, precoM: 32 },
        { nome: "FRANGO / BOLONHESA", imagem: "assets/img/frango-x-bolonhesa.webp", precoG: 43.50, precoM: 33.50 },
        { nome: "FRANGO / PRESUNTO", imagem: "assets/img/frango-x-presunto.webp", precoG: 40, precoM: 30 }
    ],
    "Mix Presunto": [
        { nome: "PRESUNTO / MUSSARELA", imagem: "assets/img/presunto-x-mussarela.webp", precoG: 37.50, precoM: 27.50 },
        { nome: "PRESUNTO / CALABRESA", imagem: "assets/img/presunto-x-calabresa.webp", precoG: 38.50, precoM: 28.50 },
        { nome: "PRESUNTO / PORTUGUESA", imagem: "assets/img/presunto-x-portuguesa.webp", precoG: 40, precoM: 30 },
        { nome: "PRESUNTO / FRANGO", imagem: "assets/img/presunto-x-frango.webp", precoG: 40, precoM: 30 },
        { nome: "PRESUNTO / BOLONHESA", imagem: "assets/img/presunto-x-bolonhesa.webp", precoG: 41.50, precoM: 31.50 }
    ]
};

// CARRINHO (localStorage)
let carrinho = [];

function carregarCarrinho() {
    const salvo = localStorage.getItem('carrinho_sos_pizza');
    if (salvo) carrinho = JSON.parse(salvo);
    atualizarInterface();
}

function salvarCarrinho() {
    localStorage.setItem('carrinho_sos_pizza', JSON.stringify(carrinho));
}

function adicionarAoCarrinho(pizzaNome, tamanho, preco) {
    carrinho.push({ id: Date.now() + Math.random(), pizza: pizzaNome, tamanho: tamanho, preco: preco });
    salvarCarrinho();
    atualizarInterface();

    // Feedback visual
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Adicionado!';
    setTimeout(() => { btn.innerHTML = originalText; }, 800);

    // Abrir carrinho automaticamente
    document.getElementById('cartSidebar').classList.add('open');
}

function removerDoCarrinho(id) {
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

function atualizarInterface() {
    // Contador
    document.getElementById('cartCount').innerText = carrinho.length;

    // Lista do carrinho
    const cartItemsDiv = document.getElementById('cartItems');
    if (carrinho.length === 0) {
        cartItemsDiv.innerHTML = '<p style="text-align:center; color:#888;">Carrinho vazio<br>Clique nas pizzas para adicionar</p>';
    } else {
        cartItemsDiv.innerHTML = carrinho.map(item => `
                <div class="cart-item">
                    <span><strong>${item.pizza}</strong> (${item.tamanho})<br><small>R$ ${item.preco.toFixed(2).replace('.', ',')}</small></span>
                    <button onclick="removerDoCarrinho(${item.id})">X</button>
                </div>
            `).join('');
    }

    // Totais
    const subtotal = calcularSubtotal();
    const taxa = getTaxaEntrega();
    const total = subtotal + taxa;

    document.getElementById('cartSubtotal').innerText = subtotal.toFixed(2).replace('.', ',');
    document.getElementById('cartTaxa').innerText = taxa.toFixed(2).replace('.', ',');
    document.getElementById('cartTotal').innerText = total.toFixed(2).replace('.', ',');
}

function finalizarPedido() {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio! Adicione algumas pizzas.');
        return;
    }

    const select = document.getElementById('bairroSelect');
    const localizacao = select.options[select.selectedIndex].text;
    const taxa = getTaxaEntrega();
    const subtotal = calcularSubtotal();
    const total = subtotal + taxa;

    let mensagem = "🍕 *S.O.S PIZZA - PEDIDO* 🍕\n\n";
    mensagem += "*ITENS DO PEDIDO:*\n";

    carrinho.forEach((item, index) => {
        mensagem += `${index + 1}️⃣ ${item.pizza} (${item.tamanho}) - R$ ${item.preco.toFixed(2).replace('.', ',')}\n`;
    });

    mensagem += `\n*SUBTOTAL:* R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
    mensagem += `*TAXA DE ENTREGA:* R$ ${taxa.toFixed(2).replace('.', ',')}\n`;
    mensagem += `*TOTAL DO PEDIDO:* R$ ${total.toFixed(2).replace('.', ',')}\n\n`;
    mensagem += `*LOCALIZAÇÃO:* ${localizacao}\n\n`;
    mensagem += "*DADOS PARA ENTREGA:*\n";
    mensagem += "Endereço completo: _Digite aqui_\n";
    mensagem += "Ponto de referência: _Digite aqui_\n";
    mensagem += "Forma de pagamento: _Digite aqui_\n\n";
    mensagem += "🔥 *Pedido via S.O.S Pizza - Delivery 18h às 21h*";

    // Modifiquei o "numeroWhatsApp" para o número direto que estava no seu HTML, 
    // caso você não tenha essa variável declarada em outro lugar do código.
    const numero = typeof numeroWhatsApp !== 'undefined' ? numeroWhatsApp : '5587981004878';
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');

    // =========================================================
    // SOLUÇÃO: LIMPAR O CARRINHO APÓS O ENVIO
    // =========================================================
    carrinho = [];          // 1. Limpa a lista no JavaScript
    salvarCarrinho();       // 2. Salva o carrinho vazio no localStorage
    atualizarInterface();   // 3. Atualiza os totais e textos na tela para R$ 0,00

    // 4. Fecha a barra lateral automaticamente substituindo 'open' por 'close' (ou removendo 'open')
    document.getElementById('cartSidebar').classList.remove('open');
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

// Monitora quando o usuário muda a localização dentro do carrinho e atualiza o preço na hora
document.addEventListener("DOMContentLoaded", () => {
    const bairroSelect = document.getElementById('bairroSelect');
    if (bairroSelect) {
        bairroSelect.addEventListener('change', () => {
            atualizarInterface(); // Recalcula os valores e atualiza o total na tela
        });
    }
});

// RENDERIZAR CARDÁPIO MISTO
function renderizarMisto() {
    // Abas
    const tabsContainer = document.getElementById('mistoTabs');
    const categorias = Object.keys(cardapioMisto);
    tabsContainer.innerHTML = categorias.map((cat, idx) => `
        <button class="tab-btn ${idx === 0 ? 'active' : ''}" data-tab="${cat.replace(/ /g, '_')}">
            <i class="fas fa-utensils"></i> ${cat}
        </button>
    `).join('');

    // Conteúdo
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
                            <h3 class="menu-item-name">🍕 ${pizza.nome}</h3>
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

    // Eventos das abas
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

// SWITCH ENTRE CARDÁPIOS
function initSwitch() {
    const btnTrad = document.getElementById('btnTradicional');
    const btnMisto = document.getElementById('btnMisto');
    const tradSection = document.getElementById('tradicionalSection');
    const mistoSection = document.getElementById('mistoSection');

    btnTrad.addEventListener('click', () => {
        btnTrad.classList.add('active');
        btnMisto.classList.remove('active');
        tradSection.classList.add('active');
        mistoSection.classList.remove('active');
    });

    btnMisto.addEventListener('click', () => {
        btnMisto.classList.add('active');
        btnTrad.classList.remove('active');
        mistoSection.classList.add('active');
        tradSection.classList.remove('active');
    });
}

// CONTROLE DO CARRINHO LATERAL
function initCartControls() {
    const cartToggle = document.getElementById('cartToggle');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');

    cartToggle.addEventListener('click', () => cartSidebar.classList.toggle('open'));
    closeCart.addEventListener('click', () => cartSidebar.classList.remove('open'));
    document.getElementById('finalizarPedido').addEventListener('click', finalizarPedido);
    document.getElementById('bairroSelect').addEventListener('change', atualizarInterface);
}

// INICIALIZAR
renderizarTradicional();
renderizarMisto();
initSwitch();
carregarCarrinho();
initCartControls();