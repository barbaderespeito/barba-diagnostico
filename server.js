import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do multer para upload de imagens
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// Inicializar Claude API
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Configuração Shopify
const SHOPIFY_STORE = process.env.SHOPIFY_STORE_NAME;
const SHOPIFY_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

// Função para verificar estoque no Shopify
async function checkProductStock(productHandle) {
    if (!SHOPIFY_STORE || !SHOPIFY_TOKEN) {
        console.log('Shopify não configurado, pulando verificação de estoque');
        return true; // Se não configurado, assume que está disponível
    }

    try {
        const url = `https://${SHOPIFY_STORE}.myshopify.com/admin/api/2024-01/products.json?handle=${productHandle}`;
        
        const response = await fetch(url, {
            headers: {
                'X-Shopify-Access-Token': SHOPIFY_TOKEN,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error(`Erro ao verificar estoque: ${response.status}`);
            return true; // Em caso de erro, assume disponível
        }

        const data = await response.json();
        
        if (!data.products || data.products.length === 0) {
            console.log(`Produto ${productHandle} não encontrado no Shopify`);
            return false;
        }

        const product = data.products[0];
        
        // Verificar se o produto está publicado e tem estoque
        const isPublished = product.status === 'active';
        const hasStock = product.variants.some(variant => 
            variant.inventory_quantity > 0 || variant.inventory_policy === 'continue'
        );

        console.log(`Produto ${productHandle}: publicado=${isPublished}, estoque=${hasStock}`);
        
        return isPublished && hasStock;
    } catch (error) {
        console.error(`Erro ao verificar estoque de ${productHandle}:`, error.message);
        return true; // Em caso de erro, assume disponível
    }
}

// Mapeamento de URLs para handles do Shopify
function extractHandleFromUrl(url) {
    // Extrai o handle da URL do produto
    // Ex: https://barbaderespeito.com.br/products/blend-original-para-crescimento-de-barba-30ml
    // Retorna: blend-original-para-crescimento-de-barba-30ml
    const match = url.match(/\/products\/([^/?]+)/);
    return match ? match[1] : null;
}

// Rota principal - serve o HTML
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Rota de análise com 3 fotos
app.post('/api/analisar', upload.array('fotos', 3), async (req, res) => {
    try {
        const { objetivo, pele, tempo, estilo } = req.body;
        const fotos = req.files;

        if (!fotos || fotos.length !== 3) {
            return res.status(400).json({ 
                error: 'É necessário enviar exatamente 3 fotos (direita, frente, esquerda)' 
            });
        }

        if (!objetivo || !pele || !tempo || !estilo) {
            return res.status(400).json({ 
                error: 'Todos os campos do questionário são obrigatórios' 
            });
        }

        // Converter imagens para base64
        const imagensBase64 = fotos.map(foto => ({
            type: 'image',
            source: {
                type: 'base64',
                media_type: foto.mimetype,
                data: foto.buffer.toString('base64')
            }
        }));

        // Criar prompt para Claude
        const prompt = `Você é um especialista em análise de barbas para a marca "Barba de Respeito", a maior marca de produtos para barba do Brasil.

Você recebeu 3 fotos da barba do cliente:
1. Lado direito do rosto
2. Frente
3. Lado esquerdo do rosto

Analise TODAS as 3 fotos em detalhes e as respostas do questionário abaixo. 

IMPORTANTE: Retorne APENAS um JSON válido (sem markdown, sem backticks, sem explicações extras) no seguinte formato exato:

{
  "analise": "Análise detalhada baseada nas 3 fotos: densidade geral, falhas específicas (mencione lado direito, esquerdo ou ambos), comprimento, textura, uniformidade, problemas visíveis (frizz, ressecamento, etc.). Seja específico sobre as diferenças entre os lados.",
  "produtos": [
    {
      "nome": "Nome exato do produto",
      "motivo": "Por que esse produto é essencial baseado nas 3 fotos analisadas",
      "link": "URL completa do produto",
      "prioridade": "alta|média|baixa"
    }
  ],
  "rotina": "Rotina DETALHADA passo a passo:\n\nMANHÃ:\n1. [produto] - como usar\n2. [produto] - como usar\n\nNOITE:\n1. [produto] - como usar\n2. [produto] - como usar\n\nFREQUÊNCIA SEMANAL:\n- [produto especial] - quando usar",
  "tempoResultados": "Estimativa realista de quando verá resultados (ex: 2-4 semanas para hidratação, 3-6 meses para crescimento)",
  "dicas": ["Dica prática 1", "Dica prática 2", "Dica prática 3"]
}

QUESTIONÁRIO DO CLIENTE:
- Objetivo: ${objetivo}
- Tipo de pele: ${pele}
- Tempo de barba: ${tempo}
- Estilo preferido: ${estilo}

PRODUTOS DISPONÍVEIS (use APENAS estes produtos e URLs exatas):

CRESCIMENTO E FORTALECIMENTO:
- Blend Original® 30ml (1 mês): https://barbaderespeito.com.br/products/blend-original-para-crescimento-de-barba-30ml
- Kit 2 meses Blend Original®: https://barbaderespeito.com.br/products/kit-2-meses-blend-original-para-crescimento-de-barba
- Kit 3 meses Blend Original®: https://barbaderespeito.com.br/products/kit-3-meses-blend-original-para-crescimento-de-barba
- Blend Original® 6 meses + Shampoo: https://barbaderespeito.com.br/products/blend-original%C2%AE-para-crescimento-de-barba-30ml-6-meses-barba-de-respeito

HIDRATAÇÃO:
- Balm Premium 80g: https://barbaderespeito.com.br/products/balm-para-barba-barba-de-respeito-80g-premium
- Balm Canela com Rum 80g: https://barbaderespeito.com.br/products/balm-para-barba-barba-de-respeito-65g-canela-com-rum
- Balm 500ml: https://barbaderespeito.com.br/products/balm-para-barba-500ml
- Óleo Premium 30ml: https://barbaderespeito.com.br/products/oleo-hidratante-para-barba-30ml-premium
- Óleo Canela com Rum 30ml: https://barbaderespeito.com.br/products/oleo-hidratante-para-barba-30ml-canela-com-rum-barba-de-respeito
- Óleo Linha Essencial 30ml: https://barbaderespeito.com.br/products/oleo-de-barba-30ml-4por1-barba-de-respeito

LIMPEZA (BARBA):
- Shampoo Ice 220ml: https://barbaderespeito.com.br/products/shampoo-ice-para-barba-e-cabelo-220ml-premium
- Shampoo Ice 1 Litro: https://barbaderespeito.com.br/products/shampoo-ice-para-barba-e-cabelo-1-litro-barba-de-respeito

MODELAGEM DE BARBA (NUNCA USE CERA NA BARBA!):
- Balm para Barba (modela e controla frizz): Use os Balms listados em HIDRATAÇÃO
- ATENÇÃO: Ceras são APENAS para cabelo, NUNCA para barba!

PRODUTOS PARA CABELO (só recomende se o usuário mencionar interesse em cuidar do cabelo):
- Cera Efeito Seco 80g Premium: https://barbaderespeito.com.br/products/cera-modeladora-efeito-seco-barba-de-respeito-80g-premium
- Cera Efeito Molhado 80g Premium: https://barbaderespeito.com.br/products/cera-modeladora-efeito-molhado-barba-de-respeito-80g-premium
- Leave-In Cera Modeladora: https://barbaderespeito.com.br/products/o-leave-in-cera-modeladora-para-cabelos-efeito-matte-da-barba-de-respeito

PÓS-BARBA:
- Loção Pós-Barba 140ml: https://barbaderespeito.com.br/products/locao-pos-barba-barba-de-respeito-calmante-140-ml

KITS COMPLETOS:
- Kit Barbudo de Respeito: https://barbaderespeito.com.br/products/kit-barbudo-de-respeito-1
- Kit Barba de Respeito (Limpeza + Hidratação + Crescimento): https://barbaderespeito.com.br/products/kit-barba-de-respeito
- Kit Essencial do Barbudo Moderno: https://barbaderespeito.com.br/products/kit-essencial-do-barbudo-moderno-linha-4-por-1
- Kit Classic Canela & Rum: https://barbaderespeito.com.br/products/kit-classic-canela-rum-shampoo-200-ml-cera-para-cabelos-balm-hidratante

ACESSÓRIOS:
- Pente de Madeira: https://barbaderespeito.com.br/products/pente-de-madeira-para-barba-original-barba-de-respeito

REGRAS CRÍTICAS:
1. NUNCA recomende Cera para barba - Cera é APENAS para cabelo!
2. Para modelar/controlar frizz da BARBA, use BALM (nunca cera)
3. Só recomende produtos de CABELO (ceras, leave-in) se:
   - O usuário explicitamente mencionar cabelo no questionário OU
   - Você identificar nas fotos que o cabelo também precisa de cuidados E achar relevante
4. Foco principal é sempre a BARBA (esse é um diagnóstico de barba)

INSTRUÇÕES GERAIS:
1. Recomende entre 3-5 produtos que façam SENTIDO juntos
2. Se o objetivo for crescimento, SEMPRE inclua Blend Original (escolha o kit adequado ao tempo que o usuário quer investir)
3. Para pele oleosa, evite produtos muito oleosos
4. Para iniciantes (menos de 3 meses), recomende kits completos
5. Seja específico sobre as diferenças observadas entre os lados direito e esquerdo
6. Priorize produtos que resolvam os problemas VISÍVEIS nas fotos
7. LEMBRE-SE: BALM modela a barba, CERA modela o cabelo!`;

        // Chamar Claude API
        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2000,
            messages: [
                {
                    role: 'user',
                    content: [
                        ...imagensBase64,
                        {
                            type: 'text',
                            text: prompt
                        }
                    ]
                }
            ]
        });

        // Extrair resposta
        let responseText = message.content[0].text;
        
        // Limpar possíveis markdown
        responseText = responseText.trim();
        if (responseText.includes('```json')) {
            responseText = responseText.split('```json')[1].split('```')[0].trim();
        } else if (responseText.includes('```')) {
            responseText = responseText.split('```')[1].split('```')[0].trim();
        }

        const resultado = JSON.parse(responseText);

        // Verificar estoque de cada produto recomendado
        console.log('Verificando estoque dos produtos recomendados...');
        const produtosComEstoque = [];
        
        for (const produto of resultado.produtos) {
            const handle = extractHandleFromUrl(produto.link);
            if (handle) {
                const temEstoque = await checkProductStock(handle);
                if (temEstoque) {
                    produtosComEstoque.push(produto);
                } else {
                    console.log(`Produto ${produto.nome} está fora de estoque, removendo da lista`);
                }
            } else {
                // Se não conseguir extrair o handle, mantém o produto
                produtosComEstoque.push(produto);
            }
        }

        // Se removeu muitos produtos e ficou com menos de 2, avisar
        if (produtosComEstoque.length < 2 && resultado.produtos.length > 2) {
            console.log('AVISO: Muitos produtos fora de estoque! Mantendo apenas os disponíveis.');
        }

        // Atualizar resultado com apenas produtos em estoque
        resultado.produtos = produtosComEstoque;

        // Se não sobrou nenhum produto, retornar erro
        if (produtosComEstoque.length === 0) {
            return res.status(500).json({
                error: 'Produtos recomendados estão temporariamente indisponíveis',
                message: 'Os produtos ideais para você estão em reabastecimento. Por favor, tente novamente em breve ou entre em contato conosco.'
            });
        }

        res.json({
            success: true,
            resultado
        });

    } catch (error) {
        console.error('Erro na análise:', error);
        res.status(500).json({
            error: 'Erro ao processar análise',
            message: error.message
        });
    }
});

// Rota de health check
app.get('/api/health', (req, res) => {
    const hasApiKey = !!process.env.ANTHROPIC_API_KEY && 
                      process.env.ANTHROPIC_API_KEY !== 'sua_chave_api_aqui';
    const hasShopify = !!process.env.SHOPIFY_STORE_NAME && !!process.env.SHOPIFY_ACCESS_TOKEN;
    
    res.json({
        status: 'online',
        apiKeyConfigured: hasApiKey,
        shopifyConfigured: hasShopify,
        shopifyStore: hasShopify ? process.env.SHOPIFY_STORE_NAME : 'not configured'
    });
});

app.listen(PORT, () => {
    console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`\n📸 Diagnóstico de Barba - Barba de Respeito`);
    
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'sua_chave_api_aqui') {
        console.log(`\n⚠️  ATENÇÃO: Configure sua API key no arquivo .env`);
        console.log(`   Copie .env.example para .env e adicione sua chave`);
        console.log(`   Obtenha em: https://console.anthropic.com/\n`);
    } else {
        console.log(`\n✅ API Key da Anthropic configurada corretamente`);
    }

    if (!process.env.SHOPIFY_STORE_NAME || !process.env.SHOPIFY_ACCESS_TOKEN) {
        console.log(`\n⚠️  Shopify não configurado - verificação de estoque desabilitada`);
        console.log(`   Todos os produtos serão recomendados independente do estoque\n`);
    } else {
        console.log(`✅ Shopify configurado - verificação de estoque ativada`);
        console.log(`   Loja: ${process.env.SHOPIFY_STORE_NAME}.myshopify.com\n`);
    }
});
