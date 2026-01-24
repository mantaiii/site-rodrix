const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Payment } = require('mercadopago');
const axios = require('axios'); // Para enviar logs ao Discord
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const client = new MercadoPagoConfig({ 
    accessToken: process.env.MP_ACCESS_TOKEN 
});
const payment = new Payment(client);

// URL do Webhook do seu canal no Discord
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

app.get('/', (req, res) => {
    res.send('Servidor da Loja Online está rodando e acessível via Ngrok!');
});
// Rota para criar o Pix
app.post('/criar-pix', async (req, res) => {
    try {
        const { valor, email, player_id, producto } = req.body;

        // IMPORTANTE: Esta URL deve ser acessível pela internet (Sua VPS ou Ngrok)
        // Exemplo: "https://sua-vps-ip.com/notificacao" ou "https://random-id.ngrok-free.app/notificacao"
        const WEBHOOK_URL = "https://pseudoameboid-unsour-anabel.ngrok-free.dev/notificacao";
        const BASE_URL = "https://pseudoameboid-unsour-anabel.ngrok-free.dev/notificacao"; // URL ATUAL DO SEU NGROK

        const dadosDoPagamento = {
            body: {
                transaction_amount: Number(valor), // Garante que é número
                description: `Produto: ${producto} | ID: ${player_id}`,
                payment_method_id: 'pix',
                notification_url: "https://pseudoameboid-unsour-anabel.ngrok-free.dev/notificacao", 
                payer: { 
                    email: email || "capitalfugas.notify@gmail.com" 
                },
                metadata: { 
                    // O Mercado Pago converte metadados para strings ou números simples
                    player_id: player_id,
                    product_name: producto
                }
            }
        };

        const resultado = await payment.create(dadosDoPagamento);

        res.json({
            copia_e_cola: resultado.point_of_interaction.transaction_data.qr_code,
            imagem_qr_code: resultado.point_of_interaction.transaction_data.qr_code_base64,
            id_pagamento: resultado.id
        });

    } catch (error) {
        console.error("Erro ao criar Pix:", error);
        res.status(500).json({ erro: error.message });
    }
});
// ROTA DE NOTIFICAÇÃO (Webhook)
app.post('/notificacao', async (req, res) => {
    const { query } = req;
    const topic = query.topic || query.type;

    // O Mercado Pago envia várias notificações, queremos apenas 'payment'
    if (topic === 'payment') {
        const paymentId = query.id || (req.body && req.body.data && req.body.data.id);

        try {
            // Consultamos o status real do pagamento
            const pamentoInfo = await payment.get({ id: paymentId });
            const status = pamentoInfo.status;
            console.log(pamentoInfo.metadata)
            const metadata = pamentoInfo.metadata;

            if (status === 'approved') {
                console.log(`✅ Pagamento ${paymentId} APROVADO!`);

                // Enviar Log para o Discord
                if (DISCORD_WEBHOOK_URL) {
                    await axios.post(DISCORD_WEBHOOK_URL, {
                        embeds: [{
                            title: "💰 NOVO PAGAMENTO APROVADO",
                            color: 65280, // Verde
                            fields: [
                                { name: "Jogador ID", value: metadata.player_id.toString(), inline: true },
                                { name: "Produto", value: metadata.product_name, inline: true },
                                { name: "Valor", value: `R$ ${pamentoInfo.transaction_amount}`, inline: true }
                            ],
                            timestamp: new Date()
                        }]
                    });
                }
                
                // AQUI: Você pode chamar uma função para entregar o item no seu banco de dados
            }
        } catch (err) {
            console.error("Erro ao processar notificação:", err);
        }
    }

    res.status(200).send('OK'); // Sempre responda 200 para o Mercado Pago
});

app.listen(3000, () => console.log('🚀 Servidor rodando em http://localhost:3000'));