const mongoose = require('mongoose');

const movimentacaoSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ['Entrada', 'Saida'],
    required: true
  },
  descricao: String,
  valor: Number,
  categoria: {
    type: String,
    enum: ['Venda', 'Compra Insumo', 'Outros'],
    required: true
  },
  data: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Movimentacao', movimentacaoSchema);
