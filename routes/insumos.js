const express = require('express');
const router = express.Router();
const Insumo = require('../models/Insumo');
const Movimentacao = require('../models/Movimentacao');

// 1. Criar novo insumo
router.post('/', async (req, res) => {
    try {
        const insumo = new Insumo(req.body);
        await insumo.save();
        
        const valorTotal = insumo.quantidade * insumo.precoUnitario;
        
        const movimentacao = new Movimentacao({
            tipo: 'Saida',
            descricao: 'Compra de Insumo: ' + insumo.nome,
            valor: valorTotal,
            categoria: 'Compra Insumo'
        });
        await movimentacao.save();
        
        res.status(201).json(insumo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 2. Listar todos os insumos
router.get('/', async (req, res) => {
    try {
        const insumos = await Insumo.find().sort({ dataEntrada: -1 });
        res.json(insumos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ 3. NOVA ROTA: Buscar insumo específico por ID (Resolve o "undefined")
router.get('/:id', async (req, res) => {
    try {
        const insumo = await Insumo.findById(req.params.id);
        if (!insumo) {
            return res.status(404).json({ message: 'Insumo não encontrado' });
        }
        res.json(insumo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ 4. ROTA ALTERADA: De PATCH para PUT (Resolve a "Rota não encontrada")
router.put('/:id', async (req, res) => {
    try {
        const insumo = await Insumo.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!insumo) {
            return res.status(404).json({ message: 'Insumo não encontrado' });
        }
        res.json(insumo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 5. Deletar insumo
router.delete('/:id', async (req, res) => {
    try {
        await Insumo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Insumo deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;