const express = require('express');
const router = express.Router();
const Pedido = require('../models/Pedido');
const Movimentacao = require('../models/Movimentacao');

// 1. Criar novo pedido (NÃO cria movimentação financeira ainda)
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

// 3. Atualizar status do pedido (CRIA A ENTRADA FINANCEIRA AO SER ENTREGUE)
router.patch('/:id', async (req, res) => {
    try {
        const pedidoId = req.params.id;
        const pedido = await Pedido.findById(pedidoId);
        
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }

        const novoStatus = req.body.status;
        const statusAntigo = pedido.status;

        // Se o status mudou para 'Entregue' e antes não era 'Entregue'
        if (novoStatus === 'Entregue' && statusAntigo !== 'Entregue') {
            const descricaoMovimentacao = 'Pedido #' + pedidoId.toString().slice(-4);
            
            // Verifica se já não existe essa entrada (evita duplicidade)
            const entradaExistente = await Movimentacao.findOne({ 
                tipo: 'Entrada', 
                descricao: descricaoMovimentacao 
            });

            if (!entradaExistente) {
                await new Movimentacao({
                    tipo: 'Entrada',
                    descricao: descricaoMovimentacao,
                    valor: pedido.total,
                    categoria: 'Venda',
                    data: pedido.dataPedido // ✅ PRESERVA A DATA ORIGINAL DO PEDIDO
                }).save();
            }
        }

        // Atualiza o status
        pedido.status = novoStatus;
        await pedido.save();
        
        res.json(pedido);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 4. Deletar pedido (e remover do financeiro)
router.delete('/:id', async (req, res) => {
    try {
        const pedidoId = req.params.id;
        const pedido = await Pedido.findById(pedidoId);
        
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }
        
        await Pedido.findByIdAndDelete(pedidoId);
        
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

// ✅ 5. NOVA ROTA: Buscar pedido específico por ID (pública, para a página de sucesso)
router.get('/publico/:id', async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }
        res.json(pedido);
    } catch (error) {
        console.error("Erro ao buscar pedido público:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;