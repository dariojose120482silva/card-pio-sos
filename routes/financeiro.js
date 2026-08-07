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
    // Busca entradas
    const entradas = await Movimentacao.aggregate([
      { $match: { tipo: 'Entrada' } },
      { $group: { _id: null, total: { $sum: '$valor' } } }
    ]);
    
    // ⚠️ CORREÇÃO DEFINITIVA: Busca por "Saídas", "Saída", "Saida", etc.
    // O operador $in verifica se o campo 'tipo' é igual a qualquer um desses valores
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

// 3. ⚠️ AQUI ESTAVA O PROBLEMA DO "ROTA NÃO ENCONTRADA": A ROTA POST (SALVAR)
router.post('/', async (req, res) => {
  try {
    const { tipo, descricao, valor, categoria } = req.body;

    // Validação simples
    if (!descricao || !valor || valor <= 0) {
      return res.status(400).json({ message: 'Preencha descrição e valor válido!' });
    }

    const novoLancamento = new Movimentacao({
      tipo, // Vai salvar exatamente como veio do front (ex: "Saída (Despesa)")
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

module.exports = router;