export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fotos, objetivo, pele, tempo, estilo } = req.body;

    if (!fotos || fotos.length !== 3) {
      return res.status(400).json({ error: 'Preciso das 3 fotos!' });
    }

    // Chamar Anthropic
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: [
            ...fotos.map(f => ({
              type: 'image',
              source: { type: 'base64', media_type: f.type, data: f.data }
            })),
            {
              type: 'text',
              text: `Consultor brother de barbas da Barba de Respeito. Tom informal e leve.

Analise as 3 fotos (direita, frente, esquerda).

Cliente:
- Objetivo: ${objetivo}
- Pele: ${pele}  
- Tempo: ${tempo}
- Estilo: ${estilo}

Retorne APENAS JSON:
{
  "analise": "Análise com tom brother, específico sobre falhas, densidade, textura",
  "produtos": [{"nome":"", "motivo":"", "link":"", "prioridade":"alta"}],
  "rotina": "DE MANHÃ:\\n1. X\\nDE NOITE:\\n1. Y",
  "tempoResultados": "Realista mas animador",
  "dicas": ["Dica 1", "Dica 2"]
}

PRODUTOS:
- Blend 1 mês: https://barbaderespeito.com.br/products/blend-original-para-crescimento-de-barba-30ml
- Balm 80g: https://barbaderespeito.com.br/products/balm-para-barba-barba-de-respeito-80g-premium
- Óleo 30ml: https://barbaderespeito.com.br/products/oleo-hidratante-para-barba-30ml-premium

NUNCA recomendar cera para barba!`
            }
          ]
        }]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${error}`);
    }

    const data = await response.json();
    let text = data.content[0].text.trim();
    
    if (text.includes('```json')) {
      text = text.split('```json')[1].split('```')[0].trim();
    }

    const resultado = JSON.parse(text);
    
    res.json({ success: true, resultado });

  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({
      error: 'Deu ruim',
      message: error.message
    });
  }
}
