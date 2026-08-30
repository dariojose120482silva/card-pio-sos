// routes/pagamento.js
const express = require('express');
const router = express.Router();
const { MercadoPagoConfig, Preference } = require('mercadopago');
const Pedido = require('../models/Pedido'); // Ajuste o caminho se necessário

// Inicializa com o token de PRODUÇÃO que está no Render
const client = new MercadoPagoConfig({ 
    accessToken: process.env.ACCESS_TOKEN 
});

router.post('/', async (req, res) => {
    try {
        const { items, payer, subtotal, taxaEntrega, total } = req.body;

        // 1. Salva o pedido no banco como 'Pendente'
        const novoPedido = await Pedido.create({
            cliente: {
                nome: payer.nome,
                telefone: payer.telefone,
                endereco: payer.endereco,
                bairro: payer.bairro
            },
            itens: items.map(item => ({
                nome: item.nome,
                quantidade: Number(item.quantidade),
                preco: Number(item.preco)
            })),
            subtotal: Number(subtotal),
            taxaEntrega: Number(taxaEntrega),
            total: Number(total),
            formaPagamento: 'Mercado Pago',
            status: 'Pendente'
        });

        // 2. Gera o link de pagamento seguro
        const preference = new Preference(client);
        const result = await preference.create({
            body: {
                items: items.map(item => ({
                    title: item.nome,
                    unit_price: Number(item.preco),
                    quantity: Number(item.quantidade),
                    currency_id: 'BRL'
                })),
                payer: { 
                    name: payer.nome,
                    email: `pedido${Date.now()}@sospizza.com.br`, // Email único válido
                    identification: {
                        type: 'CPF',
                        number: payer.cpf ? payer.cpf.replace(/\D/g, '') : '00000000000'
                    }
                },
                back_urls: {
                    success: `${process.env.FRONTEND_URL}/sucesso.html?pedido_id=${novoPedido._id}`,
                    failure: `${process.env.FRONTEND_URL}/`,
                    pending: `${process.env.FRONTEND_URL}/`
                },
                auto_return: 'approved'
            }
        });

        return res.status(200).json({ 
            init_point: result.init_point, 
            pedido_id: novoPedido._id 
        });

    } catch (error) {
        console.error('Erro ao criar pagamento:', error);
        return res.status(500).json({ error: error.message });
    }
});


module.exports = router;