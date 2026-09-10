const express = require('express');
const router = express.Router();
const Pedido = require('../models/Pedido');
const Movimentacao = require('../models/Movimentacao');

// 1. Criar novo pedido
router.post('/', async (req, res) => {
    try {
        const pedido = new Pedido(req.body);
        await pedido.save();
        res.status(201).json(pedido);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// 2. Listar todos os pedidos
router.get('/', async (req, res) => {
    try {
        // Busca todos os pedidos ordenados do mais recente para o mais antigo
        const pedidos = await Pedido.find().sort({ dataPedido: -1 });
        
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 3. Atualizar status (AQUI É ONDE A ENTRADA É CRIADA)
router.patch('/:id', async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido) return res.status(404).json({ message: 'Pedido não encontrado' });

        const novoStatus = String(req.body.status || '').trim();
        const statusAntigo = String(pedido.status || '').trim();

        // Se mudou PARA Entregue e NÃO era Entregue antes
        if (novoStatus === 'Entregue' && statusAntigo !== 'Entregue') {
            const descricao = 'Pedido #' + pedido._id.toString().slice(-4);
            
            // Verifica se já existe para não duplicar
            const existe = await Movimentacao.findOne({ tipo: 'Entrada', descricao });
            
            if (!existe) {
                await new Movimentacao({
                    tipo: 'Entrada',
                    descricao: descricao,
                    valor: pedido.total,
                    categoria: 'Venda',
                    data: pedido.dataPedido // Mantém a data original (terça/quarta)
                }).save();
                console.log(`✅ Entrada financeira criada para ${descricao}`);
            }
        }

        pedido.status = novoStatus;
        await pedido.save();
        res.json(pedido);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 4. Deletar pedido
router.delete('/:id', async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido) return res.status(404).json({ message: 'Pedido não encontrado' });
        
        // Monta a descrição exata usando o ID do pedido encontrado
        const descricao = 'Pedido #' + pedido._id.toString().slice(-4);
        
        // Deleta o pedido e a movimentação financeira correspondente
        await Pedido.findByIdAndDelete(req.params.id);
        await Movimentacao.deleteOne({ tipo: 'Entrada', descricao: descricao });
        
        res.json({ message: 'Pedido deletado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 5. Rota pública para a página de sucesso
router.get('/publico/:id', async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido) return res.status(404).json({ message: 'Pedido não encontrado' });
        res.json(pedido);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 6. FERRAMENTA DE CORREÇÃO EM MASSA (Para salvar os pedidos de terça/quarta)
router.get('/corrigir-historico', async (req, res) => {
    try {
        const pedidosEntregues = await Pedido.find({ status: 'Entregue' });
        let corrigidos = 0;
        
        for (const p of pedidosEntregues) {
            const descricao = 'Pedido #' + p._id.toString().slice(-4);
            const existe = await Movimentacao.findOne({ tipo: 'Entrada', descricao });
            
            if (!existe) {
                await new Movimentacao({
                    tipo: 'Entrada',
                    descricao: descricao,
                    valor: p.total,
                    categoria: 'Venda',
                    data: p.dataPedido
                }).save();
                corrigidos++;
            }
        }
        res.json({ mensagem: `Sucesso! ${corrigidos} entradas foram criadas no histórico.` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;