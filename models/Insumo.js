const mongoose = require('mongoose');

const insumoSchema = new mongoose.Schema({
  nome: String,
  categoria: {
    type: String,
    enum: ['Ingrediente', 'Embalagem', 'Bebida', 'Alimento', 'Outros'],
    required: true
  },
  quantidade: Number,
  unidade: String,
  precoUnitario: Number,
  fornecedor: String,
  validade: Date,
  estoqueMinimo: { type: Number, default: 0 },
  dataEntrada: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Insumo', insumoSchema);
