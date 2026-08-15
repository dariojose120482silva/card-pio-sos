// ====== 1. VARIÁVEIS GLOBAIS (Devem estar no topo) ======
let semanaOffset = 0; // 0 = semana atual, -1 = anterior, etc.

// ====== 2. HELPERS DE DATA ======
function chaveDia(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatarDia(d) {
    const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    return `${dias[d.getDay()]}, ${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function formatarData(dataISO) {
    if (!dataISO) return 'Data não registrada';
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const hora = String(data.getHours()).padStart(2, '0');
    const min = String(data.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} às ${hora}:${min}`;
}

// ====== 3. FUNÇÕES DE INTERFACE (Modais, Abas) ======
function showTab(tabId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
    });
    document.getElementById(tabId).classList.add('active');
    const activeBtn = event.target;
    activeBtn.classList.add('active');
    activeBtn.setAttribute('aria-selected', 'true');
}

function openModal(modalId) { document.getElementById(modalId).style.display = 'block'; }
function closeModal(modalId) { document.getElementById(modalId).style.display = 'none'; }

// ====== 4. NAVEGAÇÃO DE SEMANAS (Filtro Financeiro) ======
function mudarSemana(direcao) {
    semanaOffset += direcao;
    carregarDadosReais();
}

function voltarSemanaAtual() {
    semanaOffset = 0;
    carregarDadosReais();
}

function getPeriodoTexto() {
    const hoje = new Date();
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - hoje.getDay() + (semanaOffset * 7));
    
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 6);
    
    const inicioStr = `${String(inicioSemana.getDate()).padStart(2, '0')}/${String(inicioSemana.getMonth() + 1).padStart(2, '0')}/${inicioSemana.getFullYear()}`;
    const fimStr = `${String(fimSemana.getDate()).padStart(2, '0')}/${String(fimSemana.getMonth() + 1).padStart(2, '0')}/${fimSemana.getFullYear()}`;
    
    return `Período: ${inicioStr} a ${fimStr}`;
}

function estaDentroDaSemana(dataPedido) {
    const hoje = new Date();
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - hoje.getDay() + (semanaOffset * 7));
    inicioSemana.setHours(0, 0, 0, 0);
    
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 6);
    fimSemana.setHours(23, 59, 59, 999);
    
    const data = new Date(dataPedido);
    return data >= inicioSemana && data <= fimSemana;
}

// ====== 5. RENDERIZAÇÃO DE CARDS ======
function cardPedido(p, comBotoes = false) {
    const statusClass = p.status === 'Entregue' ? 'entregue' : p.status === 'Em Preparo' ? 'preparo' : p.status === 'Cancelado' ? 'cancelado' : 'pendente';
    const botoes = comBotoes ? `
        <div style="margin-top: 10px;">
            <button class="btn-action btn-cancelar" onclick="cancelarPedido('${p._id}')">❌ Cancelar</button>
            <button class="btn-action btn-descartar" onclick="descartarPedido('${p._id}')">🗑️ Descartar</button>
        </div>` : '';
    
    const telefone = p.cliente?.telefone || 'Sem telefone';
    const itensTexto = p.itens && p.itens.length > 0 ? p.itens.map(i => i.nome).join(', ') : 'Sem descrição';
    
    return `
        <div class="card">
            <div class="pedido-data">🕐 ${formatarData(p.dataPedido)}</div>
            <strong>Pedido #${p._id.slice(-4)}</strong><br>
            👤 ${p.cliente?.nome || 'Cliente'} | 📞 ${telefone}<br>
            📍 ${p.cliente?.bairro || 'Bairro'}<br>
            🍕 ${itensTexto}<br>
            ${p.subtotal ? `Subtotal: R$ ${p.subtotal.toFixed(2)} | ` : ''}
            ${p.taxaEntrega ? `Taxa: R$ ${p.taxaEntrega.toFixed(2)} | ` : ''}
            Total: <strong style="color: #28a745; font-size: 1.2em;">R$ ${p.total.toFixed(2)}</strong><br>
            Status: <span class="status-badge status-${statusClass}">${p.status}</span>
            ${botoes}
        </div>`;
}

// ====== 6. AÇÕES DE PEDIDOS ======
async function descartarPedido(id) {
    if (!confirm('⚠️ Tem certeza que deseja DESCARTAR este pedido?\n\nEsta ação é permanente.')) return;
    try {
        const res = await fetch(`/api/pedidos/${id}`, { method: 'DELETE' });
        if (res.ok) { alert('✅ Pedido descartado!'); carregarDadosReais(); }
        else alert('❌ Erro ao descartar: ' + (await res.json()).message);
    } catch (e) { alert('❌ Erro de conexão.'); }
}

async function cancelarPedido(id) {
    if (!confirm('Marcar este pedido como CANCELADO?\n\nEle fica no histórico, mas não entra no total.')) return;
    try {
        const res = await fetch(`/api/pedidos/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Cancelado' })
        });
        if (res.ok) { alert('✅ Pedido cancelado!'); carregarDadosReais(); }
        else alert('❌ Erro ao cancelar: ' + (await res.json()).message);
    } catch (e) { alert('❌ Erro de conexão.'); }
}

// ====== 7. CARREGAMENTO DE DADOS (Função Principal) ======
async function carregarDadosReais() {
    try {
        // Atualiza o texto do período selecionado
        const periodoEl = document.getElementById('periodo-selecionado');
        if (periodoEl) {
            periodoEl.textContent = getPeriodoTexto();
        }

        const resFin = await fetch('/api/financeiro/resumo');
        const fin = await resFin.json();

        const resPed = await fetch('/api/pedidos');
        const todosPedidos = await resPed.json();

        // Filtra pedidos da semana selecionada
        const pedidosDaSemana = todosPedidos.filter(p => estaDentroDaSemana(p.dataPedido));

        const pedidosPorDia = {};
        pedidosDaSemana.forEach(p => {
            const chave = chaveDia(new Date(p.dataPedido));
            if (!pedidosPorDia[chave]) pedidosPorDia[chave] = [];
            pedidosPorDia[chave].push(p);
        });

        const hoje = new Date();
        const hojeChave = chaveDia(hoje);

        const inicioSemana = new Date(hoje);
        inicioSemana.setDate(hoje.getDate() - hoje.getDay() + (semanaOffset * 7));

        // Calcula totais da semana selecionada
        let totalEntradasSemana = 0;
        let totalSaidasSemana = 0;
        
        // Soma entradas dos pedidos da semana
        pedidosDaSemana.filter(p => p.status !== 'Cancelado').forEach(p => {
            totalEntradasSemana += p.total;
        });
        
        // Soma saídas do financeiro da semana
        const resFinLista = await fetch('/api/financeiro');
        const listaFin = await resFinLista.json();
        listaFin.filter(f => estaDentroDaSemana(f.data) && (f.tipo === 'Saida' || f.tipo === 'Saída')).forEach(f => {
            totalSaidasSemana += f.valor;
        });

        const saldoSemana = totalEntradasSemana - totalSaidasSemana;

        let html = `
            <div class="card" style="border-left: 4px solid ${semanaOffset === 0 ? '#28a745' : '#ffc107'}">
                <p style="font-size: 0.9rem; color: #aaa; margin-bottom: 10px;">${semanaOffset === 0 ? ' Resumo Total (Todo o Período)' : '📅 Resumo da Semana Selecionada'}</p>
                <p style="font-size: 1.1rem;">💵 Entradas: <span class="success">R$ ${fin.totalEntradas.toFixed(2)}</span></p>
                <p style="font-size: 1.1rem;">💸 Saídas: <span class="danger">R$ ${fin.totalSaidas.toFixed(2)}</span></p>
                <hr style="border-color: #555; margin: 15px 0;">
                <p style="font-size: 1.3rem;">Saldo Total: <strong class="${fin.saldo >= 0 ? 'success' : 'danger'}">R$ ${fin.saldo.toFixed(2)}</strong></p>
            </div>
            
            <div class="card" style="background: #2a2a2a; margin-top: 15px;">
                <p style="font-size: 1.1rem; margin-bottom: 10px;">📈 Desta Semana:</p>
                <p style="font-size: 1rem;"> Entradas: <span class="success">R$ ${totalEntradasSemana.toFixed(2)}</span></p>
                <p style="font-size: 1rem;">💸 Saídas: <span class="danger">R$ ${totalSaidasSemana.toFixed(2)}</span></p>
                <hr style="border-color: #555; margin: 10px 0;">
                <p style="font-size: 1.2rem;">Saldo da Semana: <strong class="${saldoSemana >= 0 ? 'success' : 'danger'}">R$ ${saldoSemana.toFixed(2)}</strong></p>
            </div>
            
            <h2 style="margin-top: 25px;">📅 Esta Semana</h2>`;

        for (let i = 0; i < 7; i++) {
            const dia = new Date(inicioSemana);
            dia.setDate(inicioSemana.getDate() + i);
            const chave = chaveDia(dia);
            const pedidosDoDia = pedidosPorDia[chave] || [];
            const validos = pedidosDoDia.filter(p => p.status !== 'Cancelado');
            const totalDia = validos.reduce((s, p) => s + p.total, 0);

            html += `<div class="data-header">${formatarDia(dia)}${chave === hojeChave ? ' — HOJE' : ''}</div>`;
            html += `<div class="total-dia">Total do dia: R$ ${totalDia.toFixed(2)} (${validos.length} pedidos)</div>`;
            pedidosDoDia.forEach(p => { html += cardPedido(p); });
        }

        const anteriores = Object.keys(pedidosPorDia)
            .filter(ch => ch < chaveDia(inicioSemana))
            .sort((a, b) => b.localeCompare(a));

        if (anteriores.length > 0) {
            html += `<h2 style="margin-top: 30px;">📜 Histórico Anterior</h2>`;
            anteriores.forEach(ch => {
                const pedidosDoDia = pedidosPorDia[ch];
                const validos = pedidosDoDia.filter(p => p.status !== 'Cancelado');
                const totalDia = validos.reduce((s, p) => s + p.total, 0);
                html += `<div class="data-header">${formatarDia(new Date(pedidosDoDia[0].dataPedido))}</div>`;
                html += `<div class="total-dia">Total do dia: R$ ${totalDia.toFixed(2)} (${validos.length} pedidos)</div>`;
                pedidosDoDia.forEach(p => { html += cardPedido(p); });
            });
        }

        document.getElementById('resumo-financeiro').innerHTML = html;

        document.getElementById('lista-pedidos').innerHTML = todosPedidos.length === 0
            ? '<p>Nenhum pedido ainda.</p>'
            : todosPedidos.map(p => cardPedido(p, true)).join('');

        const resIns = await fetch('/api/insumos');
        const insumos = await resIns.json();

        document.getElementById('lista-insumos').innerHTML = insumos.length === 0
            ? '<p>Nenhum insumo ainda.</p>'
            : insumos.map(i => `
                <div class="card" style="display: flex; justify-content: space-between; align-items: center; gap: 15px; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 250px;">
                        <strong>${i.nome}</strong> (${i.categoria})<br>
                        Qtd: ${i.quantidade} ${i.unidade} | Total: <strong>R$ ${(i.quantidade * i.precoUnitario).toFixed(2)}</strong>
                        <div class="insumo-data" style="font-size: 0.85rem; color: #aaa; margin-top: 5px;">📅 Cadastrado em: ${formatarData(i.dataEntrada)}</div>
                    </div>
                    <div style="display: flex; gap: 8px; flex-shrink: 0;">
                        <button class="btn-action" onclick="editarInsumo('${i._id || i.id}')" style="background: #ffc107; color: #000; font-weight: bold; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">✏️ Editar</button>
                        <button class="btn-action" onclick="excluirInsumo('${i._id || i.id}', '${i.nome}')" style="background: #dc3545; color: #fff; font-weight: bold; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">🗑️ Excluir</button>
                    </div>
                </div>`).join('');

        // Carregar lista de lançamentos financeiros
        const containerFin = document.getElementById('lista-lancamentos-fin');
        if (containerFin) {
            containerFin.innerHTML = listaFin.length === 0
                ? '<p style="color: #888; text-align: center; padding: 10px;">Nenhum lançamento registrado.</p>'
                : listaFin.map(f => `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding: 10px; background: #2d2d2d; border-radius: 6px; border-left: 4px solid ${f.tipo === 'Entrada' ? '#28a745' : '#dc3545'};">
                        <div>
                            <strong style="color: #fff;">${f.tipo === 'Entrada' ? '💵' : '💸'} ${f.descricao}</strong> 
                            <span style="color: #aaa; font-size: 0.85rem;">(${f.categoria || 'Geral'})</span><br>
                            <small style="color: #888;">${formatarData(f.data)}</small>
                        </div>
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <strong style="color: ${f.tipo === 'Entrada' ? '#28a745' : '#dc3545'}; font-size: 1.1rem;">
                                R$ ${f.valor.toFixed(2)}
                            </strong>
                            <button onclick="excluirLancamentoFinanceiro('${f._id}')" 
                                style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;" title="Excluir">
                                🗑️
                            </button>
                        </div>
                    </div>
                `).join('');
        }
    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
        document.querySelectorAll('.section').forEach(s => s.innerHTML = '<p class="danger">️ Erro ao conectar com o banco.</p>');
    }
}

// ====== 8. SALVAR PEDIDO REAL ======
async function salvarPedidoReal() {
    const subtotal = parseFloat(document.getElementById('pedidoSubtotal').value) || 0;
    const taxaEntrega = parseFloat(document.getElementById('taxaEntrega').value) || 0;
    const total = subtotal + taxaEntrega;
    
    const dados = {
        cliente: { 
            nome: document.getElementById('clienteNome').value, 
            telefone: document.getElementById('clienteTelefone').value, 
            bairro: document.getElementById('clienteBairro').value 
        },
        itens: [{ nome: document.getElementById('pedidoItens').value, quantidade: 1, preco: subtotal }],
        subtotal: subtotal,
        taxaEntrega: taxaEntrega,
        total: total,
        formaPagamento: 'Manual (Telefone)',
        status: document.getElementById('pedidoStatus').value
    };
    
    try {
        const res = await fetch('/api/pedidos', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(dados) 
        });
        
        if (res.ok) {
            alert('✅ Pedido salvo!\nPizza: R$ ' + subtotal.toFixed(2) + '\nTaxa: R$ ' + taxaEntrega.toFixed(2) + '\nTotal: R$ ' + total.toFixed(2));
            closeModal('modalPedido');
            document.getElementById('clienteNome').value = '';
            document.getElementById('clienteTelefone').value = '';
            document.getElementById('clienteBairro').value = '';
            document.getElementById('pedidoItens').value = '';
            document.getElementById('pedidoSubtotal').value = '';
            document.getElementById('taxaEntrega').value = '';
            document.getElementById('pedidoTotal').value = '';
            document.getElementById('pedidoStatus').value = 'Pendente';
            carregarDadosReais();
        } else {
            alert(' Erro ao salvar: ' + (await res.json()).message);
        }
    } catch (e) { 
        alert('❌ Erro de conexão.'); 
    }
}

// ====== 9. CÁLCULO AUTOMÁTICO DE TAXA E TOTAL ======
function calcularTaxaAutomatica() {
    const bairroSelect = document.getElementById('clienteBairro');
    const taxaInput = document.getElementById('taxaEntrega');
    const taxa = parseFloat(bairroSelect.options[bairroSelect.selectedIndex].getAttribute('data-taxa')) || 0;
    taxaInput.value = taxa.toFixed(2);
    calcularTotalAutomatico();
}

function calcularTotalAutomatico() {
    const subtotal = parseFloat(document.getElementById('pedidoSubtotal').value) || 0;
    const taxa = parseFloat(document.getElementById('taxaEntrega').value) || 0;
    const total = subtotal + taxa;
    document.getElementById('pedidoTotal').value = total.toFixed(2);
}

// ====== 10. SALVAR INSUMO REAL ======
async function salvarInsumoReal(event) {
    if (event) event.preventDefault();
    const id = document.getElementById('insumoId') ? document.getElementById('insumoId').value : '';
    const dados = {
        nome: document.getElementById('insumoNome').value,
        categoria: document.getElementById('insumoCategoria').value,
        quantidade: parseFloat(document.getElementById('insumoQuantidade').value) || 0,
        unidade: document.getElementById('insumoUnidade').value,
        precoUnitario: parseFloat(document.getElementById('insumoPreco').value) || 0,
        fornecedor: document.getElementById('insumoFornecedor').value,
        validade: document.getElementById('insumoValidade') ? document.getElementById('insumoValidade').value : '',
        minimo: document.getElementById('insumoEstoqueMinimo') ? parseFloat(document.getElementById('insumoEstoqueMinimo').value) : 0
    };
    try {
        const url = id ? `/api/insumos/${id}` : '/api/insumos';
        const method = id ? 'PUT' : 'POST';
        const res = await fetch(url, { method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dados) });
        if (res.ok) {
            alert(id ? '✅ Insumo atualizado!' : '✅ Insumo salvo!');
            closeModal('modalInsumo');
            document.getElementById('insumoNome').value = '';
            document.getElementById('insumoQuantidade').value = '';
            document.getElementById('insumoPreco').value = '';
            document.getElementById('insumoFornecedor').value = '';
            if (document.getElementById('insumoId')) document.getElementById('insumoId').value = '';
            carregarDadosReais();
        } else {
            alert('❌ Erro ao salvar: ' + (await res.json()).message);
        }
    } catch (e) { alert('❌ Erro de conexão.'); }
}

function abrirNovoInsumo() {
    document.getElementById('tituloModalInsumo').textContent = ' Novo Insumo';
    if (document.getElementById('insumoId')) document.getElementById('insumoId').value = '';
    document.getElementById('insumoNome').value = '';
    document.getElementById('insumoQuantidade').value = '';
    document.getElementById('insumoPreco').value = '';
    document.getElementById('insumoFornecedor').value = '';
    openModal('modalInsumo');
}

async function editarInsumo(id) {
    try {
        const res = await fetch(`/api/insumos/${id}`);
        const insumo = await res.json();
        if (document.getElementById('insumoId')) document.getElementById('insumoId').value = insumo._id || insumo.id;
        document.getElementById('insumoNome').value = insumo.nome;
        document.getElementById('insumoCategoria').value = insumo.categoria;
        document.getElementById('insumoQuantidade').value = insumo.quantidade;
        document.getElementById('insumoUnidade').value = insumo.unidade;
        document.getElementById('insumoPreco').value = insumo.precoUnitario;
        document.getElementById('insumoFornecedor').value = insumo.fornecedor || '';
        if (document.getElementById('insumoValidade')) document.getElementById('insumoValidade').value = insumo.validade || '';
        if (document.getElementById('insumoEstoqueMinimo')) document.getElementById('insumoEstoqueMinimo').value = insumo.minimo || 0;
        document.getElementById('tituloModalInsumo').textContent = '✏️ Editar Insumo';
        openModal('modalInsumo');
    } catch (e) { alert('❌ Erro ao carregar dados do insumo.'); }
}

async function excluirInsumo(id, nome) {
    if (!confirm(`⚠️ Tem certeza que deseja EXCLUIR "${nome}"?`)) return;
    try {
        const res = await fetch(`/api/insumos/${id}`, { method: 'DELETE' });
        if (res.ok) { alert('✅ Insumo excluído!'); carregarDadosReais(); }
        else alert('❌ Erro ao excluir: ' + (await res.json()).message);
    } catch (e) { alert('❌ Erro de conexão.'); }
}

// ====== 11. FINANCEIRO: MOSTRAR/OCULTAR E EXCLUIR ======
function toggleHistoricoFinanceiro() {
    const container = document.getElementById('container-historico-fin');
    const btn = event.target;
    if (container.style.display === 'none' || container.style.display === '') {
        container.style.display = 'block';
        btn.innerHTML = '🔼 Ocultar Histórico';
        btn.style.background = '#495057';
    } else {
        container.style.display = 'none';
        btn.innerHTML = '📜 Ver Histórico Detalhado de Lançamentos';
        btn.style.background = '#6c757d';
    }
}

async function excluirLancamentoFinanceiro(id) {
    if (!confirm('⚠️ Tem certeza que deseja EXCLUIR este lançamento?')) return;
    try {
        const res = await fetch(`/api/financeiro/${id}`, { method: 'DELETE' });
        if (res.ok) {
            alert('✅ Lançamento excluído!');
            carregarDadosReais();
        } else {
            alert('❌ Erro ao excluir: ' + (await res.json()).message);
        }
    } catch (e) { alert('❌ Erro de conexão.'); }
}

async function salvarMovimentacaoFinanceiraReal() {
    const dados = {
        tipo: document.getElementById('finTipo').value,
        descricao: document.getElementById('finDescricao').value,
        valor: parseFloat(document.getElementById('finValor').value) || 0,
        categoria: document.getElementById('finCategoria').value
    };
    if (!dados.descricao || dados.valor <= 0) { alert('⚠️ Preencha descrição e valor válido!'); return; }
    try {
        const res = await fetch('/api/financeiro', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dados) });
        if (res.ok) { 
            alert('✅ Lançamento salvo!'); 
            closeModal('modalFinanceiro'); 
            document.getElementById('finDescricao').value = ''; 
            document.getElementById('finValor').value = ''; 
            carregarDadosReais(); 
        }
        else alert('❌ Erro ao salvar: ' + (await res.json()).message);
    } catch (e) { alert('❌ Erro de conexão.'); }
}

// ====== INICIALIZAÇÃO ======
carregarDadosReais();