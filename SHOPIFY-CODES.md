# 📋 CÓDIGOS PRONTOS PARA COPIAR - SHOPIFY

## 🔹 CÓDIGO 1: Página do Diagnóstico (iframe)

**Onde usar:** Online Store → Pages → Add page → Show HTML

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
  window.addEventListener('message', function(e) {
    if (e.data.height) {
      document.querySelector('.diagnostico-container').style.height = e.data.height + 'px';
    }
  });
</script>
```

**⚠️ TROCAR:** `https://SUA-URL.vercel.app` pela URL real do Vercel

---

## 🔹 CÓDIGO 2: Banner CTA na Home

**Onde usar:** Online Store → Themes → Customize → Add section → Custom HTML

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

---

## 🔹 CÓDIGO 3: Banner alternativo com foto de fundo

**Onde usar:** Online Store → Themes → Customize → Add section → Custom HTML

```html
<style>
  .diagnostico-hero {
    background: url('URL_DA_IMAGEM_AQUI') center/cover;
    position: relative;
    padding: 100px 20px;
    text-align: center;
    margin: 40px auto;
    max-width: 1400px;
    border-radius: 20px;
    overflow: hidden;
  }
  
  .diagnostico-hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%);
  }
  
  .diagnostico-hero-content {
    position: relative;
    z-index: 1;
  }
  
  .diagnostico-hero h2 {
    color: #ff6b35;
    font-size: 48px;
    font-weight: 900;
    margin-bottom: 20px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  }
  
  .diagnostico-hero p {
    color: #fff;
    font-size: 24px;
    margin-bottom: 40px;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
  }
  
  .diagnostico-hero-btn {
    display: inline-block;
    background: #ff6b35;
    color: white !important;
    padding: 22px 70px;
    border-radius: 50px;
    font-size: 24px;
    font-weight: bold;
    text-decoration: none;
    transition: all 0.3s;
    box-shadow: 0 15px 35px rgba(255, 107, 53, 0.4);
  }
  
  .diagnostico-hero-btn:hover {
    background: #e55a2b;
    transform: translateY(-7px);
    box-shadow: 0 20px 45px rgba(255, 107, 53, 0.6);
  }
  
  @media (max-width: 768px) {
    .diagnostico-hero {
      padding: 60px 20px;
    }
    
    .diagnostico-hero h2 {
      font-size: 32px;
    }
    
    .diagnostico-hero p {
      font-size: 18px;
    }
    
    .diagnostico-hero-btn {
      font-size: 20px;
      padding: 18px 50px;
    }
  }
</style>

<div class="diagnostico-hero">
  <div class="diagnostico-hero-content">
    <h2>Descubra Sua Barba Perfeita</h2>
    <p>Análise profissional com Inteligência Artificial em minutos</p>
    <a href="/pages/diagnostico-barba" class="diagnostico-hero-btn">
      Começar Agora →
    </a>
  </div>
</div>
```

**⚠️ TROCAR:** `URL_DA_IMAGEM_AQUI` por uma URL de imagem do Shopify

---

## 🔹 CÓDIGO 4: Botão flutuante (sticky)

**Onde usar:** Online Store → Themes → Edit code → Layout → theme.liquid (antes de `</body>`)

```html
<style>
  .diagnostico-float {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
  }
  
  .diagnostico-float-btn {
    background: #ff6b35;
    color: white !important;
    padding: 16px 30px;
    border-radius: 50px;
    font-size: 16px;
    font-weight: bold;
    text-decoration: none;
    box-shadow: 0 8px 25px rgba(255, 107, 53, 0.5);
    display: flex;
    align-items: center;
    gap: 10px;
    transition: all 0.3s;
  }
  
  .diagnostico-float-btn:hover {
    background: #e55a2b;
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(255, 107, 53, 0.7);
  }
  
  .diagnostico-float-icon {
    font-size: 24px;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  
  @media (max-width: 768px) {
    .diagnostico-float {
      bottom: 10px;
      right: 10px;
    }
    
    .diagnostico-float-btn {
      padding: 12px 20px;
      font-size: 14px;
    }
  }
</style>

<div class="diagnostico-float">
  <a href="/pages/diagnostico-barba" class="diagnostico-float-btn">
    <span class="diagnostico-float-icon">🧔</span>
    <span>Diagnóstico Grátis</span>
  </a>
</div>
```

---

## 🔹 CÓDIGO 5: Pop-up de saída (Exit Intent)

**Onde usar:** Online Store → Themes → Edit code → Layout → theme.liquid (antes de `</body>`)

```html
<style>
  .diagnostico-popup {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.8);
    z-index: 10000;
    justify-content: center;
    align-items: center;
  }
  
  .diagnostico-popup.active {
    display: flex;
  }
  
  .diagnostico-popup-content {
    background: white;
    padding: 40px;
    border-radius: 20px;
    max-width: 500px;
    text-align: center;
    position: relative;
    animation: slideDown 0.3s ease;
  }
  
  @keyframes slideDown {
    from { transform: translateY(-50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  .diagnostico-popup-close {
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #999;
  }
  
  .diagnostico-popup h3 {
    color: #1a1a1a;
    font-size: 28px;
    font-weight: 900;
    margin-bottom: 15px;
  }
  
  .diagnostico-popup p {
    color: #666;
    font-size: 16px;
    margin-bottom: 25px;
  }
  
  .diagnostico-popup-btn {
    background: #ff6b35;
    color: white !important;
    padding: 16px 40px;
    border-radius: 10px;
    font-size: 18px;
    font-weight: bold;
    text-decoration: none;
    display: inline-block;
    transition: all 0.3s;
  }
  
  .diagnostico-popup-btn:hover {
    background: #e55a2b;
    transform: translateY(-2px);
  }
</style>

<div class="diagnostico-popup" id="diagnosticoPopup">
  <div class="diagnostico-popup-content">
    <button class="diagnostico-popup-close" onclick="closePopup()">✕</button>
    <h3>🧔 Espera!</h3>
    <p>Antes de sair, descubra qual barba é perfeita para você em 2 minutos!</p>
    <a href="/pages/diagnostico-barba" class="diagnostico-popup-btn">
      Fazer Diagnóstico Grátis
    </a>
  </div>
</div>

<script>
  let popupShown = false;
  
  document.addEventListener('mouseleave', function(e) {
    if (e.clientY < 10 && !popupShown) {
      document.getElementById('diagnosticoPopup').classList.add('active');
      popupShown = true;
    }
  });
  
  function closePopup() {
    document.getElementById('diagnosticoPopup').classList.remove('active');
  }
  
  document.getElementById('diagnosticoPopup').addEventListener('click', function(e) {
    if (e.target === this) {
      closePopup();
    }
  });
</script>
```

---

## 🔹 CÓDIGO 6: Seção de produtos recomendados

**Onde usar:** Depois que o usuário fizer o diagnóstico, mostrar produtos relacionados

```liquid
<!-- Adicione na página de produto -->
{% if product.tags contains 'barba' %}
<div style="background: #f7f7f7; padding: 40px 20px; margin: 40px 0; border-radius: 15px; text-align: center;">
  <h3 style="font-size: 24px; font-weight: bold; margin-bottom: 15px;">
    🧔 Não sabe qual produto escolher?
  </h3>
  <p style="font-size: 16px; color: #666; margin-bottom: 25px;">
    Faça nosso diagnóstico com IA e descubra os produtos perfeitos para sua barba
  </p>
  <a href="/pages/diagnostico-barba" style="background: #ff6b35; color: white; padding: 14px 35px; border-radius: 8px; font-weight: bold; text-decoration: none; display: inline-block;">
    Fazer Diagnóstico →
  </a>
</div>
{% endif %}
```

---

## 📝 INSTRUÇÕES DE USO:

1. **Copie o código** que você quer usar
2. **Cole no local indicado** no Shopify
3. **Substitua os placeholders:**
   - `SUA-URL.vercel.app` → Sua URL do Vercel
   - `URL_DA_IMAGEM_AQUI` → URL de imagem
4. **Salve e publique**
5. **Teste** no site

---

## 💡 DICAS:

- **Código 1 e 2:** Básicos, use sempre
- **Código 3:** Use se tiver uma foto boa de barba
- **Código 4:** Ótimo para conversão, fica sempre visível
- **Código 5:** Use com moderação, pode irritar alguns usuários
- **Código 6:** Excelente para páginas de produto

**Pode usar VÁRIOS códigos juntos!** Por exemplo:
- Código 1 (página) + Código 2 (home) + Código 4 (botão flutuante)

---

Escolha os que fazem mais sentido para seu site! 🚀
