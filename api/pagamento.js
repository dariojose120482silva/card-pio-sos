const { MercadoPagoConfig, Payment } = require('mercadopago');
const client = new MercadoPagoConfig({ accessToken: process.env.ACCESS_TOKEN });

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        const { token, transaction_amount, email, payment_method_id, installments } = req.body;
        
        const payment = new Payment(client);
        const result = await payment.create({
            body: {
                transaction_amount: Number(transaction_amount),
                token: token,
                description: 'Pagamento S.O.S Pizza',
                installments: Number(installments),
                payment_method_id: payment_method_id,
                payer: { email: email }
            }
        });

        return res.status(200).json({ status: result.status, message: 'Sucesso!' });

    } catch (error) {
        // Garantimos que o erro saia como JSON para não quebrar o site
        return res.status(500).json({ error: error.message || 'Erro desconhecido' });
    }
}