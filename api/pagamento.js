// Importe a biblioteca do Mercado Pago
const { MercadoPagoConfig, Payment } = require('mercadopago');

// Inicialize o cliente com a variável de ambiente (que você configurará na Vercel)
const client = new MercadoPagoConfig({ accessToken: process.env.ACCESS_TOKEN });

export default async function handler(req, res) {
    // 1. Permite apenas requisições POST para segurança
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {

        console.log('Dados recebidos no servidor:', req.body);
        const { token, transaction_amount, email, payment_method_id, installments } = req.body;

        // 2. Cria o objeto de pagamento
        const payment = new Payment(client);
        const result = await payment.create({
            body: {
                transaction_amount: Number(transaction_amount),
                token: token,
                description: 'Pagamento S.O.S Pizza',
                installments: Number(installments),
                payment_method_id: payment_method_id,
                payer: {
                    email: email
                }
            }
        });

        // 3. Retorna a resposta de sucesso para o seu script.js
        return res.status(200).json({ status: result.status, message: 'Pagamento processado com sucesso!' });

    } catch (error) {
        // 4. Retorna erro caso algo falhe
        return res.status(500).json({ error: error.message });
    }
}