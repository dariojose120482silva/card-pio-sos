const fs = require('fs');
const mongoose = require('mongoose');

const linhas = fs.readFileSync('.env', 'utf8').split('\n');
for (const linha of linhas) {
    if (linha.includes('=')) {
        const [chave, ...resto] = linha.split('=');
        process.env[chave.trim()] = resto.join('=').trim();
    }
}

const Movimentacao = require('./models/Movimentacao');

async function lancar() {
    await mongoose.connect(process.env.MONGO_URI);

    await Movimentacao.create({
        tipo: 'Saida',
        descricao: '🏍️ Gasolina da moto — semana',
        valor: 50,
        categoria: 'Outros',
        data: new Date()
    });

    await Movimentacao.create({
        tipo: 'Saida',
        descricao: '🚌 Passagem/deslocamento ao mercado',
        valor: 30,
        categoria: 'Outros',
        data: new Date()
    });

    console.log('✅ Despesas da semana lançadas: R$ 50 (gasolina) + R$ 30 (passagem) = R$ 80');
    await mongoose.disconnect();
    process.exit(0);
}
lancar();