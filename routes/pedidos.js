const express = require('express');
const router = express.Router();
const Pedido = require('../models/Pedido');
const Movimentacao = require('../models/Movimentacao');

// Criar novo pedido (NÃO cria movimentação financeira ainda)
router.post('/', async (req, res) => {
    try {
        const pedido = new Pedido(req.body);
        await pedido.save();
        
        // ️ NÃO cria movimentação financeira aqui
        // Só será criada quando o status for alterado para "Entregue"
        
        res.status(201).json(pedido);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Listar todos os pedidos
router.get('/', async (req, res) => {
    try {
        const pedidos = await Pedido.find().sort({ dataPedido: -1 });
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ ROTA ALTERADA: Atualizar status e criar movimentação quando for "Entregue"
router.patch('/:id', async (req, res) => {
    try {
        const pedidoId = req.params.id;
        const { status } = req.body;
        
        // Busca o pedido original
        const pedidoOriginal = await Pedido.findById(pedidoId);
        if (!pedidoOriginal) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }
        
        // Se o status está sendo alterado para "Entregue" e ainda não tinha movimentação
        if (status === 'Entregue' && pedidoOriginal.status !== 'Entregue') {
            // Verifica se já existe movimentação para este pedido
            const descricaoMovimentacao = 'Pedido #' + pedidoId.toString().slice(-4);
            const movimentacaoExistente = await Movimentacao.findOne({
                tipo: 'Entrada',
                descricao: descricaoMovimentacao
            });
            
            // Se não existe, cria a movimentação financeira
            if (!movimentacaoExistente) {
                const movimentacao = new Movimentacao({
                    tipo: 'Entrada',
                    descricao: descricaoMovimentacao,
                    valor: pedidoOriginal.total,
                    categoria: 'Venda',
                    data: pedidoOriginal.dataPedido // Mantém a data original do pedido
                });
                await movimentacao.save();
            }
        }
        
        // Atualiza o status do pedido, mantendo a data original
        const pedido = await Pedido.findByIdAndUpdate(
            pedidoId,
            { 
                status: status,
                dataPedido: pedidoOriginal.dataPedido // Preserva a data original
            },
            { new: true, runValidators: true }
        );
        
        res.json(pedido);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Deletar pedido (e remover do financeiro se existir)
router.delete('/:id', async (req, res) => {
    try {
        const pedidoId = req.params.id;
        const pedido = await Pedido.findById(pedidoId);
        
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }
        
        await Pedido.findByIdAndDelete(pedidoId);
        
        // Tenta deletar a movimentação financeira (se existir)
        const descricaoParaDeletar = 'Pedido #' + pedidoId.toString().slice(-4);
        await Movimentacao.deleteOne({
            tipo: 'Entrada',
            descricao: descricaoParaDeletar
        });
        
        res.json({ message: 'Pedido e registro financeiro deletados com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Buscar pedido específico por ID (pública, para a página de sucesso)
router.get('/publico/:id', async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }
        res.json(pedido);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;