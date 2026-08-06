const fs = require('fs');
const mongoose = require('mongoose');

const linhas = fs.readFileSync('.env', 'utf8').split('\n');
for (const linha of linhas) {
    if (linha.includes('=')) {
        const [chave, ...resto] = linha.split('=');
        process.env[chave.trim()] = resto.join('=').trim();
    }
}

const Insumo = require('./models/Insumo');

async function limpar() {
    await mongoose.connect(process.env.MONGO_URI);
    const r = await Insumo.deleteMany({});
    console.log(`🗑️ ${r.deletedCount} insumos apagados.`);
    await mongoose.disconnect();
    process.exit(0);
}
limpar();