const express = require('express');
const router = express.Router();
const Movimentacao = require('../models/Movimentacao');

// 1. Rota para LISTAR todas as movimentações
router.get('/', async (req, res) => {
    try {
        const movimentacoes = await Movimentacao.find().sort({ data: -1 });
        res.json(movimentacoes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. Rota para o RESUMO (Totais)
router.get('/resumo', async (req, res) => {
    try {
        const entradas = await Movimentacao.aggregate([
            { $match: { tipo: 'Entrada' } },
            { $group: { _id: null, total: { $sum: '$valor' } } }
        ]);

        const saidas = await Movimentacao.aggregate([
            { $match: { tipo: { $in: ['Saídas', 'Saída', 'Saida', 'Saidas'] } } },
            { $group: { _id: null, total: { $sum: '$valor' } } }
        ]);

        res.json({
            totalEntradas: entradas[0]?.total || 0,
            totalSaidas: saidas[0]?.total || 0,
            saldo: (entradas[0]?.total || 0) - (saidas[0]?.total || 0)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ 3. NOVA ROTA: Resumo da SEMANA ATUAL (Segunda a Domingo)
router.get('/resumo-semana', async (req, res) => {
    try {
        const agora = new Date();
        const diaSemana = agora.getDay(); // 0=Dom, 1=Seg, 2=Ter, ...
        
        // Ajusta para segunda-feira
        const diasParaSegunda = diaSemana === 0 ? 6 : diaSemana - 1;
        
        const inicioSemana = new Date(agora);
        inicioSemana.setDate(agora.getDate() - diasParaSegunda);
        inicioSemana.setHours(0, 0, 0, 0);
        
        const fimSemana = new Date(inicioSemana);
        fimSemana.setDate(inicioSemana.getDate() + 6);
        fimSemana.setHours(23, 59, 59, 999);

        const entradasSemana = await Movimentacao.aggregate([
            {
                $match: {
                    tipo: 'Entrada',
                    data: { $gte: inicioSemana, $lte: fimSemana }
                }
            },
            { $group: { _id: null, total: { $sum: '$valor' } } }
        ]);

        const saidasSemana = await Movimentacao.aggregate([
            {
                $match: {
                    tipo: { $in: ['Saídas', 'Saída', 'Saida', 'Saidas'] },
                    data: { $gte: inicioSemana, $lte: fimSemana }
                }
            },
            { $group: { _id: null, total: { $sum: '$valor' } } }
        ]);

        res.json({
            inicioSemana: inicioSemana.toISOString(),
            fimSemana: fimSemana.toISOString(),
            totalEntradas: entradasSemana[0]?.total || 0,
            totalSaidas: saidasSemana[0]?.total || 0,
            saldo: (entradasSemana[0]?.total || 0) - (saidasSemana[0]?.total || 0)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 4. Rota POST (Salvar lançamento manual)
router.post('/', async (req, res) => {
    try {
        const { tipo, descricao, valor, categoria } = req.body;
        
        if (!descricao || !valor || valor <= 0) {
            return res.status(400).json({ message: 'Preencha descrição e valor válido!' });
        }

        const novoLancamento = new Movimentacao({
            tipo,
            descricao,
            valor,
            categoria
        });
        await novoLancamento.save();
        res.status(201).json(novoLancamento);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao salvar lançamento' });
    }
});

// Deletar um lançamento financeiro
router.delete('/:id', async (req, res) => {
    try {
        await Movimentacao.findByIdAndDelete(req.params.id);
        res.json({ message: 'Lançamento deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

