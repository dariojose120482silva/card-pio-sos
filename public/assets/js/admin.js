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

function formatarDataCurta(dataISO) {
    if (!dataISO) return '';
    const data = new Date(dataISO);
    const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const diaSemana = dias[data.getDay()];
    return `${diaSemana}, ${dia}/${mes}/${ano}`;
}

function extrairData(dataISO) {
    const data = new Date(dataISO);
    return data.toISOString().split('T')[0];
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
    if (!confirm('⚠️ Tem certeza que deseja DESCARTAR este pedido?\n\nEsta ação é permanente e remove o pedido do banco de dados.')) {
        return;
    }
    try {
        const res = await fetch(`/api/pedidos/${id}`, { method: 'DELETE' });
        if (res.ok) {
            alert('✅ Pedido descartado com sucesso!');
            carregarDadosReais();
        } else {
            alert('❌ Erro ao descartar pedido: ' + (await res.json()).message);
        }
    } catch (error) {
        console.error("Erro ao descartar:", error);
        alert('❌ Erro de conexão com o servidor.');
    }
}

async function cancelarPedido(id) {
    if (!confirm('Deseja marcar este pedido como CANCELADO?\n\nEle permanecerá no histórico mas não será contabilizado no total.')) {
        return;
    }
    try {
        const res = await fetch(`/api/pedidos/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Cancelado' })
        });
        if (res.ok) {
            alert('✅ Pedido marcado como cancelado!');
            carregarDadosReais();
        } else {
            alert('❌ Erro ao cancelar pedido: ' + (await res.json()).message);
        }
    } catch (error) {
        console.error("Erro ao cancelar:", error);
        alert('❌ Erro de conexão com o servidor.');
    }
}

async function carregarDadosReais() {
    try {
        const resFin = await fetch('/api/financeiro/resumo');
        const fin = await resFin.json();

        const resPed = await fetch('/api/pedidos');
        const todosPedidos = await resPed.json();

        const hoje = new Date();
        const dataHoje = formatarDataCurta(hoje.toISOString());

        const pedidosHoje = todosPedidos.filter(p => extrairData(p.dataPedido) === extrairData(hoje.toISOString()));
        const totalHoje = pedidosHoje.reduce((sum, p) => sum + p.total, 0);

        const pedidosPorDia = {};
        todosPedidos.forEach(p => {
            const dia = extrairData(p.dataPedido);
            if (!pedidosPorDia[dia]) pedidosPorDia[dia] = [];
            pedidosPorDia[dia].push(p);
        });

        const diasOrdenados = Object.keys(pedidosPorDia).sort((a, b) => new Date(b) - new Date(a));

        let htmlFinanceiro = `
                    <div class="data-header">📅 ${dataHoje}</div>
                    <div class="total-dia">Total de hoje: R$ ${totalHoje.toFixed(2)} (${pedidosHoje.length} pedidos)</div>
                    <div class="card">
                        <p style="font-size: 1.1rem;">💵 Entradas: <span class="success">R$ ${fin.totalEntradas.toFixed(2)}</span></p>
                        <p style="font-size: 1.1rem;">💸 Saídas: <span class="danger">R$ ${fin.totalSaidas.toFixed(2)}</span></p>
                        <hr style="border-color: #555; margin: 15px 0;">
                        <p style="font-size: 1.3rem;">Saldo: <strong class="${fin.saldo >= 0 ? 'success' : 'danger'}">R$ ${fin.saldo.toFixed(2)}</strong></p>
                    </div>
                    <h2 style="margin-top: 30px;">Histórico de Pedidos por Dia</h2>`;

        diasOrdenados.forEach(dia => {
            const pedidosDoDia = pedidosPorDia[dia];
            const pedidosValidos = pedidosDoDia.filter(p => p.status !== 'Cancelado');
            const totalDia = pedidosValidos.reduce((sum, p) => sum + p.total, 0);
            const dataFormatada = formatarDataCurta(dia + 'T00:00:00');

            htmlFinanceiro += `<div class="data-header">${dataFormatada}</div>`;
            htmlFinanceiro += `<div class="total-dia">Total do dia: R$ ${totalDia.toFixed(2)} (${pedidosValidos.length} pedidos)</div>`;

            pedidosDoDia.forEach(p => {
                htmlFinanceiro += `
                            <div class="card">
                                <div class="pedido-data">🕐 ${formatarData(p.dataPedido)}</div>
                                <strong>Pedido #${p._id.slice(-4)}</strong> - ${p.cliente?.nome || 'Cliente'} (${p.cliente?.bairro || 'Bairro'})<br>
                                Total: <strong>R$ ${p.total.toFixed(2)}</strong> | Status: <span class="status-badge status-${p.status === 'Entregue' ? 'entregue' : p.status === 'Em Preparo' ? 'preparo' : p.status === 'Cancelado' ? 'cancelado' : 'pendente'}">${p.status}</span>
                            </div>`;
            });
        });

        document.getElementById('resumo-financeiro').innerHTML = htmlFinanceiro;

        document.getElementById('lista-pedidos').innerHTML = todosPedidos.length === 0 ? '<p>Nenhum pedido ainda.</p>' : todosPedidos.map(p => `
                    <div class="card">
                        <div class="pedido-data">🕐 ${formatarData(p.dataPedido)}</div>
                        <strong>Pedido #${p._id.slice(-4)}</strong> - ${p.cliente?.nome || 'Cliente'} (${p.cliente?.bairro || 'Bairro'})<br>
                        Total: <strong>R$ ${p.total.toFixed(2)}</strong> | Status: <span class="status-badge status-${p.status === 'Entregue' ? 'entregue' : p.status === 'Em Preparo' ? 'preparo' : p.status === 'Cancelado' ? 'cancelado' : 'pendente'}">${p.status}</span>
                        <div style="margin-top: 10px;">
                            <button class="btn-action btn-cancelar" onclick="cancelarPedido('${p._id}')">❌ Cancelar</button>
                            <button class="btn-action btn-descartar" onclick="descartarPedido('${p._id}')">🗑️ Descartar</button>
                        </div>
                    </div>`).join('');

        const resIns = await fetch('/api/insumos');
        const insumos = await resIns.json();
        document.getElementById('lista-insumos').innerHTML = insumos.length === 0 ? '<p>Nenhum insumo ainda.</p>' : insumos.map(i => `
                    <div class="card">
                        <strong>${i.nome}</strong> (${i.categoria})<br>
                        Qtd: ${i.quantidade} ${i.unidade} | Total: <strong>R$ ${(i.quantidade * i.precoUnitario).toFixed(2)}</strong>
                        <div class="insumo-data">📅 Cadastrado em: ${formatarData(i.createdAt)}</div>
                    </div>`).join('');
    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
        document.querySelectorAll('.section').forEach(s => s.innerHTML = '<p class="danger">⚠️ Erro ao conectar com o banco. Verifique se o servidor está rodando.</p>');
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
            alert('✅ Pedido salvo no banco de dados e registrado no Financeiro!');
            closeModal('modalPedido');
            document.getElementById('clienteNome').value = ''; document.getElementById('clienteTelefone').value = ''; document.getElementById('pedidoItens').value = ''; document.getElementById('pedidoTotal').value = '';
            carregarDadosReais();
        } else { alert('❌ Erro ao salvar: ' + (await res.json()).message); }
    } catch (error) { console.error("Erro de rede:", error); alert('❌ Erro de conexão com o servidor.'); }
}

async function salvarInsumoReal() {
    const dados = { nome: document.getElementById('insumoNome').value, categoria: document.getElementById('insumoCategoria').value, quantidade: parseFloat(document.getElementById('insumoQuantidade').value) || 0, unidade: document.getElementById('insumoUnidade').value, precoUnitario: parseFloat(document.getElementById('insumoPreco').value) || 0, fornecedor: document.getElementById('insumoFornecedor').value };
    try {
        const res = await fetch('/api/insumos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dados) });
        if (res.ok) { alert('✅ Insumo salvo no banco de dados!'); closeModal('modalInsumo'); carregarDadosReais(); }
        else { alert('❌ Erro ao salvar: ' + (await res.json()).message); }
    } catch (error) { console.error("Erro de rede:", error); alert('❌ Erro de conexão com o servidor.'); }
}

async function salvarMovimentacaoFinanceiraReal() {
    const dados = { tipo: document.getElementById('finTipo').value, descricao: document.getElementById('finDescricao').value, valor: parseFloat(document.getElementById('finValor').value) || 0, categoria: document.getElementById('finCategoria').value };
    if (!dados.descricao || dados.valor <= 0) { alert('⚠️ Preencha a descrição e um valor válido maior que zero!'); return; }
    try {
        const res = await fetch('/api/financeiro', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dados) });
        if (res.ok) { alert('✅ Lançamento financeiro salvo com sucesso!'); closeModal('modalFinanceiro'); document.getElementById('finDescricao').value = ''; document.getElementById('finValor').value = ''; carregarDadosReais(); }
        else { alert('❌ Erro ao salvar: ' + (await res.json()).message); }
    } catch (error) { console.error("Erro de rede:", error); alert('❌ Erro de conexão com o servidor.'); }
}

carregarDadosReais();