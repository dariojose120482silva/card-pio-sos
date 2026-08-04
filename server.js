require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares essenciais
app.use(cors());
app.use(express.json()); // ⚠️ Fundamental para o body do pagamento chegar corretamente
app.use(express.static(path.join(__dirname, 'public')));

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado com sucesso!'))
  .catch(err => console.error('⚠️ Erro ao conectar no MongoDB:', err));

// --- CONEXÃO DAS ROTAS DA API ---
app.use('/api/pedidos', require('./routes/pedidos'));
app.use('/api/insumos', require('./routes/insumos'));
app.use('/api/financeiro', require('./routes/financeiro'));

// ⚠️ AQUI ESTAVA FALTANDO: A rota de pagamento do Mercado Pago!
// (Nota: Como você mencionou que o arquivo está na pasta 'api', o caminho é './api/pagamento'. 
// Se você moveu para 'routes', mude para './routes/pagamento')
app.use('/api/pagamento', require('./api/pagamento')); 
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log('📡 APIs ativas em:');
  console.log('   - http://localhost:' + PORT + '/api/pedidos');
  console.log('   - http://localhost:' + PORT + '/api/insumos');
  console.log('   - http://localhost:' + PORT + '/api/financeiro');
  console.log('   - http://localhost:' + PORT + '/api/pagamento'); // <-- Nova linha no console
});