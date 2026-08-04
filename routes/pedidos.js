const express = require('express');
const router = express.Router();
const Pedido = require('../models/Pedido');
const Movimentacao = require('../models/Movimentacao');

// Criar novo pedido
router.post('/', async (req, res) => {
    try {
        const pedido = new Pedido(req.body);
        await pedido.save();
        
        // Registra a entrada financeira (mesmo que pendente, já fica registrado)
        const movimentacao = new Movimentacao({
            tipo: 'Entrada',
            descricao: 'Pedido #' + pedido._id.toString().slice(-4),
            valor: pedido.total,
            categoria: 'Venda'
        });
        await movimentacao.save();
        
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

// Atualizar status do pedido
router.patch('/:id', async (req, res) => {
    try {
        const pedido = await Pedido.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(pedido);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Deletar pedido
router.delete('/:id', async (req, res) => {
    try {
        await Pedido.findByIdAndDelete(req.params.id);
        res.json({ message: 'Pedido deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;