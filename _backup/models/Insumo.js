const mongoose = require('mongoose');

const insumoSchema = new mongoose.Schema({
  nome: String,
  categoria: {
    type: String,
    enum: ['Ingrediente', 'Embalagem', 'Outros'],
    required: true
  },
  quantidade: Number,
  unidade: String,
  precoUnitario: Number,
  fornecedor: String,
  dataEntrada: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Insumo', insumoSchema);
