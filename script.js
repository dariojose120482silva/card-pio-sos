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
    { nome: "BOLONHESA", desc: "Molho, carne moída, muçarela, cebola e azeitonas.", imagem: "assets/img/bolonhesa.webp", tamanhos: [{ tipo: "Grande", preco: 45 }, { tipo: "Média", preco: 35 }] },
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
    "Mix Bolonhesa": [ // Padronizado para 'Mix Bolonhesa'
        { nome: "BOLONHESA / MUSSARELA", imagem: "assets/img/bolonhesa-x-mussarela.webp", precoG: 40.00, precoM: 30.00 }, // Corrigido precoG
        { nome: "BOLONHESA / CALABRESA", imagem: "assets/img/bolonhesa-x-calabresa.webp", precoG: 41.00, precoM: 31.00 },
        { nome: "BOLONHESA / PORTUGUESA", imagem: "assets/img/bolonhesa-x-portuguesa.webp", precoG: 42.50, precoM: 32.50 },
        { nome: "BOLONHESA / FRANGO", imagem: "assets/img/bolonhesa-x-frango.webp", precoG: 42.50, precoM: 32.50 },
        { nome: "BOLONHESA / PRESUNTO", imagem: "assets/img/bolonhesa-x-presunto.webp", precoG: 41.50, precoM: 31.50 },
        { nome: "BOLONHESA / 2 - QUEIJO", imagem: "assets/img/bolonhesa-x-2-queijo.webp", precoG: 41.00, precoM: 31.00 }
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
    {
        nome: "COCA-COLA", desc: "Gelada", imagem: "./assets/img/imagem-coca-cola.webp", tamanhos: [{ tipo: "2L", preco: 12.00 },
        { tipo: "1L", preco: 7.00 }//,
            //{ tipo: "250ml", preco: 3.50 },
            //{ tipo: "600ml", preco: 5.50 }
        ]
    },
    {
        nome: "GUARANÁ-ANTARCTICA", desc: "Gelada", imagem: "./assets/img/imagem-guarana-antartica.webp", tamanhos: [{ tipo: "2L", preco: 12.00 },
        { tipo: "1L", preco: 7.00 }//,
            //{ tipo: "250ml", preco: 3.50 }
        ]
    },
    {
        nome: "CAJUINA", desc: "Gelada", imagem: "./assets/img/imagem-cajuina.webp", tamanhos: [{ tipo: "2L", preco: 12.00 },
        { tipo: "1L", preco: 7.00 }//,
            //{ tipo: "250ml", preco: 3.50 }
        ]
    },
    {
        nome: "IT-COLA", desc: "Gelada", imagem: "./assets/img/imagem-it-cola.webp", tamanhos: [{ tipo: "2L", preco: 7.00 },
        { tipo: "1L", preco: 4.00 }//,
            //{ tipo: "250ml", preco: 2.00 }
        ]
    },
    {
        nome: "IT-LIMÃO", desc: "Gelada", imagem: "./assets/img/imagem-it-limao.webp", tamanhos: [{ tipo: "2L", preco: 7.00 },
        { tipo: "1L", preco: 4.00 }//,
            //{ tipo: "250ml", preco: 2.00 }
        ]
    },
    {
        nome: "PEPSI", desc: "Gelada", imagem: "./assets/img/imagem-pepis.webp", tamanhos: [{ tipo: "2L", preco: 10.00 },
        { tipo: "1L", preco: 6.00 }//,
        ]
    },
];


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
    // 🔥 CONSERTO AQUI: Se o nome já veio com o tamanho (bebidas), não deixa duplicar.
    // Se for pizza, ele mantém o comportamento padrão dela.
    const nomeAjustado = pizzaNome.includes('(') ? pizzaNome : `${pizzaNome} (${tamanho})`;

    carrinho.push({ id: Date.now() + Math.random(), pizza: nomeAjustado, tamanho: tamanho, preco: preco });
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

// Atualiza a interface do carrinho
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
                    <span><strong>${item.pizza}</strong><br><small>R$ ${item.preco.toFixed(2).replace('.', ',')}</small></span>
                    <button onclick="removerDoCarrinho(${item.id})">X</button>
                </div>
            `).join('');
    }

    // Totais
    const subtotal = calcularSubtotal();
    const taxa = getTaxaEntrega();
    const total = subtotal + taxa;

    // 3. Atualiza os textos na tela limpando o valor anterior obrigatoriamente
    document.getElementById('cartSubtotal').innerText = subtotal.toFixed(2).replace('.', ',');
    document.getElementById('cartTaxa').innerText = taxa.toFixed(2).replace('.', ',');
    document.getElementById('cartTotal').innerText = total.toFixed(2).replace('.', ',');
}

// Final da interface do carrinho

// Finalizar pedido (abre WhatsApp) ou Mercado Pago

function finalizarPedido() {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio! Adicione algumas pizzas.');
        return;
    }

    const selectPagamento = document.getElementById('pagamentoSelect');
    const formaPagamento = selectPagamento ? selectPagamento.value : 'whatsapp';

    // =========================================================
    // CAMINHO A: WHATSAPP
    // =========================================================
    if (formaPagamento === 'whatsapp') {
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

        const numero = typeof numeroWhatsApp !== 'undefined' ? numeroWhatsApp : '5587981004878';
        const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');

        carrinho = [];
        salvarCarrinho();
        atualizarInterface();

        document.getElementById('cartSidebar').classList.remove('open');
    }

    // =========================================================
    // CAMINHO B: CARTÃO DE CRÉDITO (MERCADO PAGO)
    // =========================================================
    else if (formaPagamento === 'cartao') {
        const formCartao = document.getElementById('secaoCartaoMercadoPago');

        if (formCartao && formCartao.style.display !== 'block') {
            formCartao.style.display = 'block';
            alert('Por favor, preencha os dados do cartão de crédito no formulário que apareceu no carrinho.');
            return;
        }

        const numeroCartao = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const nomeCartao = document.getElementById('cardholderName').value;
        const validade = document.getElementById('cardExpiry').value;
        const cvv = document.getElementById('cvv').value;

        if (!numeroCartao || !nomeCartao || !validade || !cvv) {
            alert('Por favor, preencha todos os dados do cartão antes de finalizar!');
            return;
        }

        const partesValidade = validade.split('/');
        if (partesValidade.length !== 2) {
            alert('Por favor, digite a validade no formato MM/AA (ex: 12/30)');
            return;
        }

        const mes = partesValidade[0].trim();
        const ano = "20" + partesValidade[1].trim();

        console.log("🔄 S.O.S Pizza: Criando token de segurança no Mercado Pago...");

        // 🔴 CORRIGIDO: Agora usando o comando correto da V2 (mp.createCardToken)
        mp.createCardToken({
            cardNumber: numeroCartao,
            cardholderName: nomeCartao,
            cardExpirationMonth: mes,
            cardExpirationYear: ano,
            securityCode: cvv
        })
            .then(function (resposta) { // <--- AQUI COMEÇA A SUBSTITUIÇÃO
                console.log("✅ Token criado com sucesso!", resposta.id);

                // Agora o seu site envia o token para o seu servidor na Vercel
                fetch('https://card-pio-sos.vercel.app/api/pagamento', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        token: resposta.id,
                        transaction_amount: calcularTotal(),
                        email: 'cliente@exemplo.com',
                        payment_method_id: 'visa',
                        installments: 1
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log("Resposta do servidor:", data);
                        alert('Pagamento processado com sucesso! S.O.S Pizza agradece.');

                        carrinho = [];
                        salvarCarrinho();
                        atualizarInterface();
                        document.getElementById('cartSidebar').classList.remove('open');
                    })
                    .catch(err => {
                        console.error("Erro no processamento:", err);
                        alert('Erro ao enviar pagamento para o servidor.');
                    });
            }) // <--- AQUI TERMINA A SUBSTITUIÇÃO
            .catch(function (erro) {
                console.error("❌ Erro:", erro);

                // Descobre o motivo real que o Mercado Pago mandou
                let motivoReal = "Erro desconhecido";
                if (erro && erro.cause && erro.cause[0]) {
                    motivoReal = erro.cause[0].description; // Pega o motivo da lista do Mercado Pago
                } else if (erro && erro.message) {
                    motivoReal = erro.message;
                }

                // 🔴 AGORA APARECE NA TELA:
                alert('❌ Não foi possível validar o cartão!\n\nMotivo do Mercado Pago: ' + motivoReal);
            });
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
                </div> </div> </div> `).join('');
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

    cartToggle.addEventListener('click', () => cartSidebar.classList.toggle('open'));
    closeCart.addEventListener('click', () => cartSidebar.classList.remove('open'));
    document.getElementById('finalizarPedido').addEventListener('click', finalizarPedido);
    document.getElementById('bairroSelect').addEventListener('change', atualizarInterface);
}

/*renderizarTradicional();
renderizarMisto();
renderizarBebidas();
initSwitch();
carregarCarrinho();
initCartControls();*/

// AGRUPAMENTO SEGURO DE INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    // 1. Renderiza os cardápios isolando os erros
    try { renderizarTradicional(); } catch (e) { console.error("Erro na Tradicional:", e); }
    try { renderizarMisto(); } catch (e) { console.error("Erro no Misto:", e); }
    try { renderizarBebidas(); } catch (e) { console.error("Erro nas Bebidas:", e); }

    // 2. Inicializa os controles do sistema
    if (typeof initSwitch === 'function') initSwitch();
    if (typeof carregarCarrinho === 'function') carregarCarrinho();
    if (typeof initCartControls === 'function') initCartControls();
});


