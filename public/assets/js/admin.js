// ===== Helpers de data =====
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

function cardPedido(p, comBotoes = false) {
    const statusClass = p.status === 'Entregue' ? 'entregue' : p.status === 'Em Preparo' ? 'preparo' : p.status === 'Cancelado' ? 'cancelado' : 'pendente';
    const botoes = comBotoes ? `
        <div style="margin-top: 10px;">
            <button class="btn-action btn-cancelar" onclick="cancelarPedido('${p._id}')">❌ Cancelar</button>
            <button class="btn-action btn-descartar" onclick="descartarPedido('${p._id}')">🗑️ Descartar</button>
        </div>` : '';
    return `
        <div class="card">
            <div class="pedido-data">🕐 ${formatarData(p.dataPedido)}</div>
            <strong>Pedido #${p._id.slice(-4)}</strong> - ${p.cliente?.nome || 'Cliente'} (${p.cliente?.bairro || 'Bairro'})<br>
            Total: <strong>R$ ${p.total.toFixed(2)}</strong> | Status: <span class="status-badge status-${statusClass}">${p.status}</span>
            ${botoes}
        </div>`;
}

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

async function carregarDadosReais() {
    try {
        const resFin = await fetch('/api/financeiro/resumo');
        const fin = await resFin.json();

        const resPed = await fetch('/api/pedidos');
        const todosPedidos = await resPed.json();

        const pedidosPorDia = {};
        todosPedidos.forEach(p => {
            const chave = chaveDia(new Date(p.dataPedido));
            if (!pedidosPorDia[chave]) pedidosPorDia[chave] = [];
            pedidosPorDia[chave].push(p);
        });

        const hoje = new Date();
        const hojeChave = chaveDia(hoje);

        const inicioSemana = new Date(hoje);
        inicioSemana.setDate(hoje.getDate() - hoje.getDay());

        let html = `
            <div class="card">
                <p style="font-size: 1.1rem;">💵 Entradas: <span class="success">R$ ${fin.totalEntradas.toFixed(2)}</span></p>
                <p style="font-size: 1.1rem;">💸 Saídas: <span class="danger">R$ ${fin.totalSaidas.toFixed(2)}</span></p>
                <hr style="border-color: #555; margin: 15px 0;">
                <p style="font-size: 1.3rem;">Saldo: <strong class="${fin.saldo >= 0 ? 'success' : 'danger'}">R$ ${fin.saldo.toFixed(2)}</strong></p>
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
                <div class="card">
                    <strong>${i.nome}</strong> (${i.categoria})<br>
                    Qtd: ${i.quantidade} ${i.unidade} | Total: <strong>R$ ${(i.quantidade * i.precoUnitario).toFixed(2)}</strong>
                    <div class="insumo-data">📅 Cadastrado em: ${formatarData(i.dataEntrada)}</div>
                </div>`).join('');
    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
        document.querySelectorAll('.section').forEach(s => s.innerHTML = '<p class="danger">⚠️ Erro ao conectar com o banco.</p>');
    }
}

async function salvarPedidoReal() {
    const total = parseFloat(document.getElementById('pedidoTotal').value) || 0;
    const dados = {
        cliente: { nome: document.getElementById('clienteNome').value, telefone: document.getElementById('clienteTelefone').value, bairro: document.getElementById('clienteBairro').value },
        itens: [{ nome: document.getElementById('pedidoItens').value, quantidade: 1, preco: total }],
        subtotal: total, taxaEntrega: 0, total: total, formaPagamento: 'Manual (Telefone)', status: document.getElementById('pedidoStatus').value
    };
    try {
        const res = await fetch('/api/pedidos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dados) });
        if (res.ok) {
            alert('✅ Pedido salvo e registrado no Financeiro!');
            closeModal('modalPedido');
            document.getElementById('clienteNome').value = '';
            document.getElementById('clienteTelefone').value = '';
            document.getElementById('pedidoItens').value = '';
            document.getElementById('pedidoTotal').value = '';
            carregarDadosReais();
        } else alert('❌ Erro ao salvar: ' + (await res.json()).message);
    } catch (e) { alert('❌ Erro de conexão.'); }
}

async function salvarInsumoReal() {
    const dados = {
        nome: document.getElementById('insumoNome').value,
        categoria: document.getElementById('insumoCategoria').value,
        quantidade: parseFloat(document.getElementById('insumoQuantidade').value) || 0,
        unidade: document.getElementById('insumoUnidade').value,
        precoUnitario: parseFloat(document.getElementById('insumoPreco').value) || 0,
        fornecedor: document.getElementById('insumoFornecedor').value
    };
    try {
        const res = await fetch('/api/insumos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dados) });
        if (res.ok) { alert('✅ Insumo salvo!'); closeModal('modalInsumo'); carregarDadosReais(); }
        else alert('❌ Erro ao salvar: ' + (await res.json()).message);
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
        if (res.ok) { alert('✅ Lançamento salvo!'); closeModal('modalFinanceiro'); document.getElementById('finDescricao').value = ''; document.getElementById('finValor').value = ''; carregarDadosReais(); }
        else alert('❌ Erro ao salvar: ' + (await res.json()).message);
    } catch (e) { alert('❌ Erro de conexão.'); }
}

carregarDadosReais();