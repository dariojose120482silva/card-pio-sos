require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares essenciais
app.use(cors());
app.use(express.json()); // ⚠️ Fundamental para receber os dados JSON do pagamento
app.use(express.static(path.join(__dirname, 'public')));

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado com sucesso!'))
  .catch(err => console.error('⚠️ Erro ao conectar no MongoDB:', err));

// --- CONEXÃO DAS ROTAS DA API ---
// Certifique-se de que todos esses arquivos existem dentro da pasta 'routes'
app.use('/api/pedidos', require('./routes/pedidos'));
app.use('/api/insumos', require('./routes/insumos'));
app.use('/api/financeiro', require('./routes/financeiro'));

// ✅ NOVA ROTA: Integração com Mercado Pago
app.use('/api/pagamento', require('./routes/pagamento')); 
// --------------------------------

// Rota raiz servindo o frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Tratamento de rotas não encontradas (404)
app.use((req, res) => {
    res.status(404).json({ message: 'Rota não encontrada' });
});

// Inicialização do servidor
const PORT = process.env.PORT || 10000; // Render geralmente usa porta 10000 ou variável PORT
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log('📡 APIs ativas em:');
  console.log('   - http://localhost:' + PORT + '/api/pedidos');
  console.log('   - http://localhost:' + PORT + '/api/insumos');
  console.log('   - http://localhost:' + PORT + '/api/financeiro');
  console.log('   - http://localhost:' + PORT + '/api/pagamento'); // <-- Confirmação visual
});