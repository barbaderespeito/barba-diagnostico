# 🛍️ GUIA DE INTEGRAÇÃO COM SHOPIFY - BARBA DE RESPEITO

## ✅ TODAS AS CUSTOMIZAÇÕES IMPLEMENTADAS:

1. ✅ **Logo da marca** adicionada no header
2. ✅ **Cores da marca** (#ff6b35 laranja)
3. ✅ **Cupom único** gerado para cada usuário (15% desconto)
4. ✅ **Google Analytics** tracking integrado
5. ✅ **Facebook Pixel** tracking integrado
6. ✅ **Tracking de eventos** completo:
   - Foto enviada (cada uma)
   - Questionário completo
   - Análise concluída
   - Produtos recomendados visualizados
   - Cliques em produtos
   - CTA site principal
   - Nova análise iniciada

---

## 🚀 PASSO A PASSO COMPLETO PARA SHOPIFY

### PARTE 1: DEPLOY NO VERCEL

#### 1. Crie conta no Vercel
- Acesse: https://vercel.com
- Clique em "Sign Up"
- Use GitHub, GitLab ou email

#### 2. Instale Vercel CLI
```bash
npm install -g vercel
```

#### 3. Faça login
```bash
vercel login
```

#### 4. Deploy do app
```bash
cd barba-diagnostico-app
vercel
```

Responda as perguntas:
- Set up and deploy? → **Yes**
- Which scope? → Sua conta
- Link to existing project? → **No**
- Project name? → **barba-diagnostico**
- In which directory? → **.** (enter)
- Override settings? → **No**

#### 5. Configure variáveis de ambiente

No painel da Vercel (https://vercel.com/dashboard):

1. Clique no projeto **barba-diagnostico**
2. Vá em **Settings** → **Environment Variables**
3. Adicione:

| Name | Value |
|------|-------|
| ANTHROPIC_API_KEY | Sua chave da API (https://console.anthropic.com/) |

4. Clique em **Save**
5. Volte em **Deployments** → Clique nos 3 pontos → **Redeploy**

#### 6. Configure Analytics (IMPORTANTE!)

**No arquivo `public/index.html` que você baixou:**

Substitua os IDs:

```javascript
// Linha ~10: Google Analytics
gtag('config', 'G-XXXXXXXXXX'); 
// Troque por seu ID do Google Analytics 4

// Linha ~22: Facebook Pixel  
fbq('init', 'XXXXXXXXXXXXXXXXX');
// Troque por seu Pixel ID do Facebook
```

**Como obter os IDs:**

**Google Analytics:**
1. Acesse https://analytics.google.com/
2. Vá em **Admin** → **Property** → **Data Streams**
3. Copie o **Measurement ID** (ex: G-ABC123XYZ)

**Facebook Pixel:**
1. Acesse https://business.facebook.com/
2. Vá em **Event Manager**
3. Copie o **Pixel ID** (número de 15 dígitos)

Depois de editar, faça novo deploy:
```bash
vercel --prod
```

Sua URL final será algo como:
```
https://barba-diagnostico.vercel.app
```

---

### PARTE 2: ADICIONAR NO SHOPIFY

#### OPÇÃO A: Página dedicada (RECOMENDADO)

1. **No Admin do Shopify:**
   - **Online Store** → **Pages** → **Add page**

2. **Configure:**
   - **Title:** `Diagnóstico de Barba`
   - **URL:** `diagnostico-barba`
   - Clique no ícone **<>** (Show HTML)

3. **Cole este código:**

```html
<style>
  .diagnostico-container {
    width: 100%;
    height: 100vh;
    min-height: 900px;
    border: none;
    margin: 0;
    padding: 0;
  }
  
  .diagnostico-wrapper {
    margin: 0 -40px;
  }
  
  @media (max-width: 768px) {
    .diagnostico-wrapper {
      margin: 0 -20px;
    }
    
    .diagnostico-container {
      min-height: 800px;
    }
  }
</style>

<div class="diagnostico-wrapper">
  <iframe 
    src="https://SUA-URL.vercel.app" 
    class="diagnostico-container"
    frameborder="0"
    scrolling="yes"
    title="Diagnóstico de Barba - Barba de Respeito"
    allow="camera; microphone"
  ></iframe>
</div>

<script>
  // Ajuste automático de altura do iframe
  window.addEventListener('message', function(e) {
    if (e.data.height) {
      document.querySelector('.diagnostico-container').style.height = e.data.height + 'px';
    }
  });
</script>
```

**⚠️ LEMBRE-SE:** Substitua `https://SUA-URL.vercel.app` pela sua URL real!

4. **Salve a página**

#### OPÇÃO B: Banner CTA na Home

1. **No Shopify Admin:**
   - **Online Store** → **Themes** → **Customize**

2. **Na home, adicione seção:**
   - **Add section** → **Custom HTML** ou **Custom Liquid**

3. **Cole este código:**

```html
<style>
  .diagnostico-cta {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    padding: 60px 20px;
    text-align: center;
    margin: 40px auto;
    max-width: 1200px;
    border-radius: 20px;
  }
  
  .diagnostico-cta h2 {
    color: #ff6b35;
    font-size: 42px;
    font-weight: 900;
    margin-bottom: 15px;
    line-height: 1.2;
  }
  
  .diagnostico-cta p {
    color: #fff;
    font-size: 20px;
    margin-bottom: 30px;
  }
  
  .diagnostico-btn {
    display: inline-block;
    background: #ff6b35;
    color: white !important;
    padding: 20px 60px;
    border-radius: 12px;
    font-size: 22px;
    font-weight: bold;
    text-decoration: none;
    transition: all 0.3s;
    box-shadow: 0 10px 30px rgba(255, 107, 53, 0.3);
  }
  
  .diagnostico-btn:hover {
    background: #e55a2b;
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(255, 107, 53, 0.5);
  }
  
  @media (max-width: 768px) {
    .diagnostico-cta h2 {
      font-size: 28px;
    }
    
    .diagnostico-cta p {
      font-size: 16px;
    }
    
    .diagnostico-btn {
      font-size: 18px;
      padding: 16px 40px;
    }
  }
</style>

<div class="diagnostico-cta">
  <h2>🧔 Qual barba ideal para você?</h2>
  <p>Faça análise com IA em 2 minutos e descubra os produtos perfeitos</p>
  <a href="/pages/diagnostico-barba" class="diagnostico-btn">
    Começar Diagnóstico Grátis →
  </a>
</div>
```

4. **Posicione onde quiser** (recomendo logo abaixo do banner principal)

5. **Salve e publique**

#### OPÇÃO C: Menu principal

1. **No Shopify Admin:**
   - **Online Store** → **Navigation** → **Main menu**

2. **Adicione item:**
   - Clique em **Add menu item**
   - **Name:** `Diagnóstico de Barba` ou `🧔 Qual minha barba ideal?`
   - **Link:** Selecione **Pages** → **Diagnóstico de Barba**
   - Clique em **Add**

3. **Organize a posição** (arraste para onde quiser)

4. **Save menu**

---

### PARTE 3: CONFIGURAR CUPONS NO SHOPIFY

Os cupons únicos gerados pelo app (ex: DIAGAB123) precisam ser válidos no Shopify:

#### Criar cupom genérico com prefixo:

1. **No Shopify Admin:**
   - **Discounts** → **Create discount** → **Discount code**

2. **Configure:**
   - **Code:** `DIAG*` (com asterisco significa qualquer código que comece com DIAG)
   - **Type:** Percentage
   - **Value:** 15%
   - **Applies to:** All products (ou apenas produtos de barba)
   - **Minimum requirements:** None
   - **Usage limits:** 1 per customer
   - **Active dates:** Set end date (ex: 7 dias depois)

**OU use a API do Shopify** (avançado):

No arquivo `server.js`, adicione criação automática de cupons:

```javascript
// Após a análise, criar cupom único via Shopify API
const cupom = {
  code: cupomPersonalizado,
  discount_type: 'percentage',
  value: '-15.0',
  applies_to_resource: 'all'
};
// Enviar para Shopify REST API
```

---

### PARTE 4: TESTAR TUDO

#### Checklist de testes:

- [ ] Página do diagnóstico abre no site
- [ ] 3 fotos podem ser enviadas
- [ ] Questionário pode ser preenchido
- [ ] Análise retorna produtos da Barba de Respeito
- [ ] Cupom único aparece nos resultados
- [ ] Links dos produtos abrem corretamente
- [ ] Google Analytics registra eventos
- [ ] Facebook Pixel registra eventos
- [ ] Funciona no celular

#### Como testar Analytics:

1. **Google Analytics:**
   - Acesse https://analytics.google.com/
   - Vá em **Reports** → **Realtime**
   - Faça um diagnóstico
   - Veja os eventos aparecendo em tempo real

2. **Facebook Pixel:**
   - Instale extensão **Facebook Pixel Helper**
   - Abra o diagnóstico
   - Extensão mostrará eventos sendo disparados

---

### PARTE 5: MELHORIAS AVANÇADAS (OPCIONAL)

#### A. Capturar email do usuário

Adicione campo de email no questionário:

```html
<div class="mb-6">
  <label class="block text-gray-700 font-bold mb-2">Seu email (para receber dicas):</label>
  <input type="email" name="email" class="w-full border-2 border-gray-300 rounded-lg p-3" placeholder="seu@email.com" />
</div>
```

#### B. Salvar diagnósticos em banco de dados

Use Supabase ou Firebase para salvar:
- Fotos (opcional)
- Respostas do questionário
- Produtos recomendados
- Email do usuário
- Cupom gerado

#### C. Enviar email automático

Integre com Mailchimp/SendGrid para enviar:
- Resumo do diagnóstico
- Cupom personalizado
- Links diretos dos produtos

#### D. Remarketing

Use os eventos do Facebook Pixel para criar públicos:
- Pessoas que completaram diagnóstico
- Pessoas que viram produtos mas não compraram
- Pessoas que clicaram no CTA

---

## 📊 EVENTOS RASTREADOS

O app rastreia automaticamente:

| Evento | Quando dispara |
|--------|----------------|
| `foto_enviada` | Cada foto carregada |
| `questionario_completo` | Form enviado |
| `analise_completa` | IA retorna resultados |
| `produto_recomendado` | Cada produto exibido |
| `click_produto` | Usuário clica em "Ver produto" |
| `resultados_exibidos` | Página de resultados carregada |
| `click_cta_site` | Clica no botão principal |
| `nova_analise` | Inicia novo diagnóstico |

Use esses eventos para:
- Criar funis de conversão no GA4
- Configurar públicos personalizados no Facebook
- Otimizar campanhas de Ads
- A/B testing de produtos

---

## 💰 CUSTOS ESTIMADOS

| Item | Custo |
|------|-------|
| Vercel (Hospedagem) | **Grátis** até 100GB bandwidth |
| Anthropic API | ~$0.10/análise (inclui 3 fotos) |
| Shopify | Sem custo adicional |
| Google Analytics | **Grátis** |
| Facebook Pixel | **Grátis** |

**Total por 100 análises/mês:** ~$10

---

## 🔒 SEGURANÇA

✅ API Key protegida em variável de ambiente  
✅ CORS configurado  
✅ Validação de uploads (max 10MB)  
✅ Limite de 3 fotos por análise  
✅ HTTPS automático no Vercel  

**Para produção, adicione:**
- Rate limiting (ex: 5 análises por IP por dia)
- Honeypot para evitar bots
- Captcha (opcional)

---

## 📞 SUPORTE

- **App técnico:** Consulte o README.md
- **Shopify:** https://help.shopify.com/
- **Vercel:** https://vercel.com/support
- **Anthropic API:** https://docs.anthropic.com/

---

## 🎉 PRONTO!

Agora você tem:
✅ App de diagnóstico com IA funcionando  
✅ Integrado no Shopify  
✅ Analytics completo  
✅ Cupons personalizados  
✅ Logo da marca  

**Próximos passos sugeridos:**
1. Divulgar no Instagram da @barbaderespeito
2. Criar anúncios no Facebook/Instagram
3. Adicionar call-to-action em emails
4. Testar diferentes cupons de desconto

Boa sorte! 🚀🧔
