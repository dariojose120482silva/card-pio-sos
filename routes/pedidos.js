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
        const pedidos = await Pedido.find().sort({ dataPedido: -1 });
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 3. Atualizar status do pedido (cria entrada financeira ao entregar)
router.patch('/:id', async (req, res) => {
    try {
        const pedidoId = req.params.id;
        const pedido = await Pedido.findById(pedidoId);
        
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }

        const novoStatus = req.body.status ? String(req.body.status).trim() : '';
        const statusAntigo = pedido.status ? String(pedido.status).trim() : '';

        console.log(`📝 Pedido #${pedidoId.slice(-4)}: '${statusAntigo}' → '${novoStatus}'`);

        // Cria entrada financeira quando muda para Entregue
        if (novoStatus === 'Entregue' && statusAntigo !== 'Entregue') {
            const descricao = 'Pedido #' + pedidoId.toString().slice(-4);
            
            const existe = await Movimentacao.findOne({ 
                tipo: 'Entrada', 
                descricao: descricao 
            });

            if (!existe) {
                await new Movimentacao({
                    tipo: 'Entrada',
                    descricao: descricao,
                    valor: pedido.total,
                    categoria: 'Venda',
                    data: pedido.dataPedido
                }).save();
                console.log(`💰 Entrada criada: R$ ${pedido.total}`);
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
        const pedidoId = req.params.id;
        const pedido = await Pedido.findById(pedidoId);
        
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }
        
        await Pedido.findByIdAndDelete(pedidoId);
        
        const descricao = 'Pedido #' + pedidoId.toString().slice(-4);
        await Movimentacao.deleteOne({
            tipo: 'Entrada',
            descricao: descricao
        });
        
        res.json({ message: 'Pedido deletado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 5. Rota pública (para página de sucesso)
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

// 6. CORRIGIR TODOS OS PEDIDOS ENTREGUES SEM ENTRADA FINANCEIRA
router.post('/corrigir-todos', async (req, res) => {
    try {
        const pedidos = await Pedido.find({ status: 'Entregue' });
        let corrigidos = 0;
        
        for (const p of pedidos) {
            const descricao = 'Pedido #' + p._id.toString().slice(-4);
            const existe = await Movimentacao.findOne({ 
                tipo: 'Entrada', 
                descricao: descricao 
            });
            
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
        
        res.json({ mensagem: `✅ ${corrigidos} entradas criadas!` });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

module.exports = router;