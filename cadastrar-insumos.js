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

// ⚠️ EDITE quantidades, preços e estoque mínimo antes de rodar, se quiser!
const insumos = [
    // 🧀 1. INSUMOS PRINCIPAIS
    { nome: 'Massa (Base)', categoria: 'Ingrediente', quantidade: 20, unidade: 'unidades', precoUnitario: 2.50, fornecedor: 'Produção própria', estoqueMinimo: 10 },
    { nome: 'Queijo Mussarela', categoria: 'Ingrediente', quantidade: 10, unidade: 'kg', precoUnitario: 45.00, fornecedor: 'Mercado', estoqueMinimo: 3 },
    { nome: 'Linguiça Calabresa', categoria: 'Ingrediente', quantidade: 8, unidade: 'kg', precoUnitario: 25.00, fornecedor: 'Mercado', estoqueMinimo: 2 },
    { nome: 'Frango', categoria: 'Ingrediente', quantidade: 6, unidade: 'kg', precoUnitario: 18.00, fornecedor: 'Mercado', estoqueMinimo: 2 },
    { nome: 'Presunto', categoria: 'Ingrediente', quantidade: 5, unidade: 'kg', precoUnitario: 22.00, fornecedor: 'Mercado', estoqueMinimo: 2 },
    { nome: 'Requeijão', categoria: 'Ingrediente', quantidade: 4, unidade: 'kg', precoUnitario: 28.00, fornecedor: 'Mercado', estoqueMinimo: 1 },
    { nome: 'Ovos', categoria: 'Ingrediente', quantidade: 30, unidade: 'unidades', precoUnitario: 1.00, fornecedor: 'Mercado', estoqueMinimo: 12 },

    // 🍅 2. COMPLEMENTOS E TEMPEROS
    { nome: 'Molho de Tomate', categoria: 'Ingrediente', quantidade: 5, unidade: 'kg', precoUnitario: 12.00, fornecedor: 'Mercado', estoqueMinimo: 2 },
    { nome: 'Azeite de Oliva', categoria: 'Ingrediente', quantidade: 2, unidade: 'litros', precoUnitario: 40.00, fornecedor: 'Mercado', estoqueMinimo: 1 },
    { nome: 'Azeitona', categoria: 'Ingrediente', quantidade: 2, unidade: 'kg', precoUnitario: 20.00, fornecedor: 'Mercado', estoqueMinimo: 1 },
    { nome: 'Cebola', categoria: 'Ingrediente', quantidade: 3, unidade: 'kg', precoUnitario: 8.00, fornecedor: 'Feira', estoqueMinimo: 1 },
    { nome: 'Tomate', categoria: 'Ingrediente', quantidade: 3, unidade: 'kg', precoUnitario: 9.00, fornecedor: 'Feira', estoqueMinimo: 1 },
    { nome: 'Pimentão', categoria: 'Ingrediente', quantidade: 1, unidade: 'kg', precoUnitario: 12.00, fornecedor: 'Feira', estoqueMinimo: 1 },
    { nome: 'Orégano', categoria: 'Ingrediente', quantidade: 5, unidade: 'pacotes', precoUnitario: 3.00, fornecedor: 'Mercado', estoqueMinimo: 2 },
    { nome: 'Fermento Biológico', categoria: 'Ingrediente', quantidade: 10, unidade: 'sachês', precoUnitario: 1.50, fornecedor: 'Mercado', estoqueMinimo: 5 },

    // 📦 3. EMBALAGENS E ADICIONAIS
    { nome: 'Caixa de Pizza 35cm', categoria: 'Embalagem', quantidade: 50, unidade: 'unidades', precoUnitario: 1.20, fornecedor: 'Fornecedor de embalagens', estoqueMinimo: 20 },
    { nome: 'Caixa de Pizza 30cm', categoria: 'Embalagem', quantidade: 50, unidade: 'unidades', precoUnitario: 1.00, fornecedor: 'Fornecedor de embalagens', estoqueMinimo: 20 },
    { nome: 'Ketchup (sachê)', categoria: 'Embalagem', quantidade: 100, unidade: 'sachês', precoUnitario: 0.15, fornecedor: 'Mercado', estoqueMinimo: 50 },
    { nome: 'Maionese (sachê)', categoria: 'Embalagem', quantidade: 100, unidade: 'sachês', precoUnitario: 0.15, fornecedor: 'Mercado', estoqueMinimo: 50 },

    // 🥤 4. BEBIDAS
    { nome: 'Refrigerante 2L', categoria: 'Bebida', quantidade: 20, unidade: 'unidades', precoUnitario: 5.00, fornecedor: 'Distribuidor', estoqueMinimo: 10 },
    { nome: 'Suco Natural 1L', categoria: 'Bebida', quantidade: 15, unidade: 'unidades', precoUnitario: 6.00, fornecedor: 'Distribuidor', estoqueMinimo: 8 },

    // 🍰 5. Lanche da viagem ou mercado

    { nome: 'Lanche', categoria: 'Alimento', quantidade: 1, unidade: 'unidades', precoUnitario: 20.00, fornecedor: 'Distribuidor', estoqueMinimo: 4 }

];

async function semear() {
    await mongoose.connect(process.env.MONGO_URI);
    for (const item of insumos) {
        await Insumo.create(item);
    }
    console.log(`✅ ${insumos.length} insumos cadastrados com sucesso!`);
    await mongoose.disconnect();
    process.exit(0);
}
semear();