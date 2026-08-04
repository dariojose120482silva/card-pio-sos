const express = require('express');
const router = express.Router();
const Movimentacao = require('../models/Movimentacao');

router.get('/', async (req, res) => {
  try {
    const movimentacoes = await Movimentacao.find().sort({ data: -1 });
    res.json(movimentacoes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/resumo', async (req, res) => {
  try {
    const entradas = await Movimentacao.aggregate([
      { $match: { tipo: 'Entrada' } },
      { $group: { _id: null, total: { $sum: '$valor' } } }
    ]);
    
    const saidas = await Movimentacao.aggregate([
      { $match: { tipo: 'Saida' } },
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

module.exports = router;
