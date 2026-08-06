const fs = require('fs');
const mongoose = require('mongoose');

const linhas = fs.readFileSync('.env', 'utf8').split('\n');
for (const linha of linhas) {
    if (linha.includes('=')) {
        const [chave, ...resto] = linha.split('=');
        process.env[chave.trim()] = resto.join('=').trim();
    }
}

const Pedido = require('./models/Pedido');
const Movimentacao = require('./models/Movimentacao');
const Insumo = require('./models/Insumo');

async function limpar() {
    await mongoose.connect(process.env.MONGO_URI);
    const r1 = await Pedido.deleteMany({});
    const r2 = await Movimentacao.deleteMany({});
    const r3 = await Insumo.deleteMany({});
    console.log(`🗑️ Apagados: ${r1.deletedCount} pedidos, ${r2.deletedCount} lançamentos e ${r3.deletedCount} insumos.`);
    console.log('✅ Banco 100% zerado!');
    await mongoose.disconnect();
    process.exit(0);
}
limpar();