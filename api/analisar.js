import Anthropic from '@anthropic-ai/sdk';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Configuração Shopify
const SHOPIFY_STORE = process.env.SHOPIFY_STORE_NAME;
const SHOPIFY_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

// Função para verificar estoque no Shopify
async function checkProductStock(productHandle) {
  if (!SHOPIFY_STORE || !SHOPIFY_TOKEN) {
    return true;
  }

  try {
    const url = `https://${SHOPIFY_STORE}.myshopify.com/admin/api/2024-01/products.json?handle=${productHandle}`;
    
    const response = await fetch(url, {
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) return true;

    const data = await response.json();
    
    if (!data.products || data.products.length === 0) return false;

    const product = data.products[0];
    const isPublished = product.status === 'active';
    const hasStock = product.variants.some(variant => 
      variant.inventory_quantity > 0 || variant.inventory_policy === 'continue'
    );

    return isPublished && hasStock;
  } catch (error) {
    return true;
  }
}

function extractHandleFromUrl(url) {
  const match = url.match(/\/products\/([^/?]+)/);
  return match ? match[1] : null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({ multiples: true, maxFileSize: 10 * 1024 * 1024 });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Erro no upload' });
    }

    const { objetivo, pele, tempo, estilo } = fields;
    const fotos = files.fotos ? (Array.isArray(files.fotos) ? files.fotos : [files.fotos]) : [];

    if (fotos.length !== 3) {
      return res.status(400).json({ error: 'Preciso das 3 fotos, parceiro!' });
    }

    try {
      const fs = await import('fs');
      
      const imagensBase64 = fotos.map(foto => ({
        type: 'image',
        source: {
          type: 'base64',
          media_type: foto.mimetype,
          data: fs.readFileSync(foto.filepath, 'base64')
        }
      }));

      const prompt = `Você é um consultor de barbas descolado da "Barba de Respeito", a maior marca de produtos para barba do Brasil. Use um tom informal, leve e levemente bem-humorado - tipo aquele brother que manja tudo de barba.

Analisou as 3 fotos da barba do cara (direita, frente, esquerda) e as respostas dele.

IMPORTANTE: Retorne APENAS JSON puro, sem markdown:

{
  "analise": "Análise detalhada mas com tom brother: Ex: 'Olha, sua barba tá massa, mas...' - seja específico sobre densidade, falhas nos lados, textura, etc. Use linguagem tipo: 'tá precisando de uns cuidados', 'tem umas falhazinhas ali', 'fios meio ressecados'",
  "produtos": [
    {
      "nome": "Nome do produto",
      "motivo": "Explicação com tom leve: Ex: 'Esse aqui vai resolver aquelas falhas que você tem no lado direito, confia'",
      "link": "URL",
      "prioridade": "alta|média|baixa"
    }
  ],
  "rotina": "Rotina com linguagem informal:\\n\\nDE MANHÃ:\\n1. [produto] - Ex: 'Passa esse aqui logo depois do banho, deixa a barba sedosa'\\n\\nDE NOITE:\\n1. [produto] - Ex: 'Antes de dormir, manda ver nesse aqui'",
  "tempoResultados": "Seja realista mas animador: Ex: 'Dá uns 2 meses e tu já vai ver a diferença, mas vai por mim que vale a pena'",
  "dicas": ["Dica com humor leve", "Outra dica brother", "Mais uma sacada"]
}

RESPOSTAS DO BROTHER:
- Objetivo: ${objetivo}
- Pele: ${pele}
- Tempo de barba: ${tempo}
- Estilo: ${estilo}

PRODUTOS (URLs exatas):
- Blend Original 1 mês: https://barbaderespeito.com.br/products/blend-original-para-crescimento-de-barba-30ml
- Kit 3 meses Blend: https://barbaderespeito.com.br/products/kit-3-meses-blend-original-para-crescimento-de-barba
- Balm Premium 80g: https://barbaderespeito.com.br/products/balm-para-barba-barba-de-respeito-80g-premium
- Óleo Premium 30ml: https://barbaderespeito.com.br/products/oleo-hidratante-para-barba-30ml-premium
- Shampoo Ice 220ml: https://barbaderespeito.com.br/products/shampoo-ice-para-barba-e-cabelo-220ml-premium

REGRAS:
1. NUNCA recomende Cera para barba - Cera é SÓ pra cabelo!
2. Pra modelar barba usa BALM
3. Tom brother mas profissional - nada vulgar
4. Seja sincero mas motivador`;

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: [...imagensBase64, { type: 'text', text: prompt }]
        }]
      });

      let responseText = message.content[0].text.trim();
      if (responseText.includes('```json')) {
        responseText = responseText.split('```json')[1].split('```')[0].trim();
      } else if (responseText.includes('```')) {
        responseText = responseText.split('```')[1].split('```')[0].trim();
      }

      const resultado = JSON.parse(responseText);

      const produtosComEstoque = [];
      for (const produto of resultado.produtos) {
        const handle = extractHandleFromUrl(produto.link);
        if (handle) {
          const temEstoque = await checkProductStock(handle);
          if (temEstoque) {
            produtosComEstoque.push(produto);
          }
        } else {
          produtosComEstoque.push(produto);
        }
      }

      resultado.produtos = produtosComEstoque;

      if (produtosComEstoque.length === 0) {
        return res.status(500).json({
          error: 'Eita, os produtos que iam bombar pra você tão em falta no momento. Tenta de novo logo mais!'
        });
      }

      res.json({ success: true, resultado });

    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({
        error: 'Deu ruim aqui',
        message: error.message
      });
    }
  });
}
