# 📸 Diagnóstico de Barba - Barba de Respeito

Aplicação web com **análise de IA** que recomenda produtos personalizados baseado em **3 fotos da barba** do usuário.

## ✨ TODAS AS CUSTOMIZAÇÕES INCLUÍDAS:

✅ **Logo da Barba de Respeito** no header  
✅ **Captura de 3 fotos** (lado direito, frente, lado esquerdo)  
✅ **Análise completa por IA** usando Claude Sonnet 4  
✅ **Cupom único personalizado** para cada usuário (15% desconto)  
✅ **Google Analytics** integrado  
✅ **Facebook Pixel** integrado  
✅ **Tracking completo de eventos** (fotos, questionário, produtos, conversão)  
✅ **Design com cores da marca** (#ff6b35)  
✅ **Rotina personalizada** de cuidados  
✅ **Estimativa de resultados** realista  
✅ **Links diretos** para produtos do site  
✅ **100% responsivo** (mobile-first)  

## 🎯 Funcionalidades Principais

### 1. Captura Inteligente de Fotos
- **3 ângulos diferentes:** Lado direito, frente, lado esquerdo
- **Instruções visuais** para o usuário tirar fotos corretas
- **Preview em tempo real**
- **Validação de upload** (max 10MB por foto)

### 2. Análise de IA Avançada
A IA analisa:
- Densidade da barba em cada lado
- Falhas e áreas específicas
- Comprimento e textura dos fios
- Uniformidade entre os lados
- Problemas visíveis (frizz, ressecamento, etc.)
- Assimetrias e diferenças

### 3. Recomendações Personalizadas
- **3-5 produtos específicos** da Barba de Respeito
- **Priorização** (alta/média/baixa)
- **Justificativa** de cada produto
- **Links diretos** para compra

### 4. Rotina Completa
- **Manhã:** Produtos e aplicação
- **Noite:** Produtos e aplicação
- **Frequência semanal:** Produtos especiais
- **Tempo estimado** de resultados

### 5. Tracking & Analytics
**Eventos rastreados:**
- `foto_enviada` - Cada foto carregada
- `questionario_completo` - Form enviado
- `analise_completa` - IA retorna resultados
- `produto_recomendado` - Cada produto exibido
- `click_produto` - Clique em "Ver produto"
- `resultados_exibidos` - Página de resultados
- `click_cta_site` - Botão principal
- `nova_analise` - Reinicia diagnóstico

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta Anthropic (grátis): https://console.anthropic.com/
- Conta Vercel (grátis): https://vercel.com
- (Opcional) Google Analytics
- (Opcional) Facebook Business Manager

## 🚀 Instalação em 3 Passos

### 1. Instalar dependências

```bash
cd barba-diagnostico-app
npm install
```

### 2. Configurar API Key

Copie `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite `.env` e adicione sua chave:

```env
ANTHROPIC_API_KEY=sk-ant-api03-sua-chave-aqui
PORT=3000
```

**Obter API Key:**
1. Crie conta em https://console.anthropic.com/
2. Vá em "API Keys"
3. Clique em "Create Key"
4. Copie e cole no `.env`

### 3. Rodar localmente

```bash
npm start
```

Abra http://localhost:3000 🎉

## 🌐 Deploy em Produção (Vercel)

### Deploy automático:

```bash
npm install -g vercel
vercel login
vercel
```

### Configurar variáveis:

No painel da Vercel:
1. Settings → Environment Variables
2. Adicione `ANTHROPIC_API_KEY`
3. Redeploy

**Pronto!** Seu app estará em `https://seu-projeto.vercel.app`

## 🛍️ Integração com Shopify

Consulte os guias completos:

📖 **SHOPIFY-INTEGRATION.md** - Guia passo a passo completo  
📋 **SHOPIFY-CODES.md** - Códigos prontos para copiar e colar

### Resumo rápido:

1. **Fazer deploy** no Vercel
2. **Criar página** no Shopify com iframe
3. **Adicionar no menu** principal
4. **Configurar Analytics** (GA4 + FB Pixel)
5. **Testar** tudo

## 📊 Analytics Setup

### Google Analytics 4:

No arquivo `public/index.html`, linha ~10:

```javascript
gtag('config', 'G-XXXXXXXXXX'); // Seu ID aqui
```

Obter ID:
1. https://analytics.google.com/
2. Admin → Data Streams
3. Copie o Measurement ID

### Facebook Pixel:

No arquivo `public/index.html`, linha ~22:

```javascript
fbq('init', 'XXXXXXXXXXXXXXXXX'); // Seu Pixel ID aqui
```

Obter ID:
1. https://business.facebook.com/
2. Event Manager
3. Copie o Pixel ID

## 💰 Custos

| Item | Custo Mensal |
|------|--------------|
| Vercel Hosting | **Grátis** (até 100GB) |
| Anthropic API | ~$10 (100 análises) |
| Google Analytics | **Grátis** |
| Facebook Pixel | **Grátis** |

**Total para 100 análises:** ~$10/mês

## 📦 Estrutura do Projeto

```
barba-diagnostico-app/
├── server.js                    # Backend Node.js + Express
├── public/
│   ├── index.html              # Frontend completo
│   └── logo.png                # Logo Barba de Respeito
├── package.json                # Dependências
├── .env.example                # Template configuração
├── README.md                   # Este arquivo
├── SHOPIFY-INTEGRATION.md      # Guia Shopify completo
└── SHOPIFY-CODES.md           # Códigos prontos
```

## 🎨 Customizações Rápidas

### Mudar cores:

No `public/index.html`, procure:
```css
.brand-orange { color: #ff6b35; }
.bg-brand-orange { background: #ff6b35; }
```

### Adicionar produtos:

No `server.js`, seção `PRODUTOS DISPONÍVEIS`:
```javascript
- Novo Produto: https://barbaderespeito.com.br/products/url
```

### Ajustar desconto:

No `public/index.html`, procure:
```javascript
const cupomPersonalizado = gerarCupomUnico(); // Função que gera cupom
```

E no HTML do resultado:
```html
<span>15% de desconto</span> <!-- Mude aqui -->
```

## 🔒 Segurança

✅ API key em variável de ambiente  
✅ CORS configurado  
✅ Validação de uploads  
✅ Limite de 3 fotos  
✅ HTTPS automático (Vercel)  

**Recomendações adicionais:**
- Rate limiting (5 análises/IP/dia)
- Captcha (opcional)
- Honeypot anti-bot

## 🐛 Troubleshooting

### "API key não configurada"
- Verifique arquivo `.env`
- Reinicie o servidor

### Fotos não carregam
- Max 10MB por foto
- Formatos: JPG, PNG, WEBP

### Análise demora muito
- Normal: 15-30 segundos
- Mais de 1min: verifique conexão

### Erro no Shopify iframe
- Verifique URL do Vercel
- Adicione `allow="camera"`

## 📱 Compatibilidade

✅ Chrome, Firefox, Safari, Edge  
✅ iOS Safari, Android Chrome  
✅ Mobile e Tablet  
✅ Navegadores modernos  

## 📞 Suporte

- **App:** Abra issue no GitHub
- **Anthropic:** https://docs.anthropic.com/
- **Vercel:** https://vercel.com/support
- **Shopify:** https://help.shopify.com/

## 📄 Licença

MIT - Livre para uso e modificação

---

**Desenvolvido com ❤️ para Barba de Respeito**  
*A maior marca de produtos para barba do Brasil*
