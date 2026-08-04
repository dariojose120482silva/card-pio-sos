const express = require('express');
const router = express.Router();
const { MercadoPagoConfig, Payment } = require('mercadopago');

// Inicializa o cliente do Mercado Pago com seu Access Token
const client = new MercadoPagoConfig({ accessToken: process.env.ACCESS_TOKEN });

router.post('/', async (req, res) => {
    try {
        const { token, transaction_amount, email, payment_method_id, installments, payer_doc } = req.body;
        
        const payment = new Payment(client);
        
        const result = await payment.create({
            body: {
                transaction_amount: Number(transaction_amount),
                token: token,
                description: 'Pagamento S.O.S Pizza',
                installments: Number(installments),
                payment_method_id: payment_method_id,
                payer: { 
                    email: email,
                    identification: {
                        type: 'CPF',
                        number: payer_doc // ⚠️ OBRIGATÓRIO PARA CARTÃO NO BRASIL
                    }
                }
            }
        });

        // Se quiser, aqui você pode atualizar o status do pedido para "Pago" no banco

        return res.status(200).json({ 
            status: result.status, 
            message: 'Pagamento processado com sucesso!',
            paymentId: result.id
        });

    } catch (error) {
        console.error('Erro no Mercado Pago:', error);
        return res.status(500).json({ 
            error: error.message || 'Erro desconhecido ao processar pagamento' 
        });
    }
});

module.exports = router;