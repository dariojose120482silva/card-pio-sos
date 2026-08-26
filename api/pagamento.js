const express = require('express');
const router = express.Router();
const { MercadoPagoConfig, Preference } = require('mercadopago');

// Inicializa o Mercado Pago com o Token de Teste que está no Render
const client = new MercadoPagoConfig({ accessToken: process.env.ACCESS_TOKEN });

// Importa o seu model de Pedido (que você me mostrou)
const Pedido = require('../models/Pedido'); 

router.post('/', async (req, res) => {
    try {
        const { items, payer, subtotal, taxaEntrega, total } = req.body;

        // 1. SALVA O PEDIDO NO BANCO (Com os campos exatos do seu Pedido.js)
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
            formaPagamento: 'Mercado Pago (Checkout Pro)',
            status: 'Pendente' // ✅ Bate perfeitamente com o enum do seu Pedido.js
        });

        // 2. CRIA O LINK DE PAGAMENTO SEGURO (Modal do Mercado Pago)
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
                    email: payer.email || 'cliente@sospizza.com' 
                },
                back_urls: {
                    // Após pagar, o Mercado Pago manda o cliente para esta página
                    success: `${process.env.FRONTEND_URL}/sucesso.html?pedido_id=${novoPedido._id}`,
                    failure: `${process.env.FRONTEND_URL}/`,
                    pending: `${process.env.FRONTEND_URL}/`
                },
                auto_return: 'approved'
            }
        });

        // Devolve o link para o site redirecionar o cliente
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