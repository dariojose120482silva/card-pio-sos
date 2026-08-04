const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  cliente: {
    nome: String,
    telefone: String,
    endereco: String,
    bairro: String
  },
  itens: [{
    nome: String,
    quantidade: Number,
    preco: Number
  }],
  subtotal: Number,
  taxaEntrega: Number,
  total: Number,
  formaPagamento: String,
  status: {
    type: String,
    enum: ['Pendente', 'Em Preparo', 'Saiu para Entrega', 'Entregue', 'Cancelado'],
    default: 'Pendente'
  },
  dataPedido: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Pedido', pedidoSchema);
