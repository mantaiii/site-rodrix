let currentPrice = 0;

// Gerencia a navegação principal (Sidebar)
function navigate(sectionId) {
    // Esconde todas as seções principais
    document.querySelectorAll('.main-container').forEach(section => {
        section.classList.remove('active');
    });

    // Remove destaque de todos os botões da sidebar
    document.querySelectorAll('.side-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Mostra a seção desejada
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.add('active');
        
        // Ativa o botão clicado na sidebar
        if (event && event.currentTarget) {
            event.currentTarget.classList.add('active');
        }

        // --- LÓGICA ESPECÍFICA PARA CORPS ---
        if (sectionId === 'cat-corps') {
            // Busca o botão da Corp Média
            const mediaBtn = target.querySelector('.sub-tab-btn[onclick*="corp-media"]');
            if (mediaBtn) {
                // Chama a função para abrir a aba média automaticamente
                openSubTab('corp-media', mediaBtn);
            }
        }
    }
    
    document.querySelector('.main-content').scrollTop = 0;
}

// Controle de Sub-Abas (Categorias de Gangues: Pequena, Média, Grande)
function openSubTab(tabId, element) {
    // Encontra o container pai para não afetar outras seções
    const parent = element.closest('.main-container');
    
    // Esconde os conteúdos das abas
    parent.querySelectorAll('.category-content').forEach(content => {
        content.classList.remove('active');
    });

    // Remove active dos botões de sub-navegação
    parent.querySelectorAll('.sub-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Ativa o conteúdo e o botão selecionado
    document.getElementById(tabId).classList.add('active');
    element.classList.add('active');

    const parentSection = element.closest('.main-container');

    parentSection.querySelectorAll('.category-content').forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none'; // Garante a ocultação
    });

    parentSection.querySelectorAll('.sub-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Ativa o alvo
    const target = document.getElementById(tabId);
    if (target) {
        target.style.display = 'block';
        // Pequeno delay para o browser registrar a mudança e rodar a animação de fade
        setTimeout(() => {
            target.classList.add('active');
        }, 10);
    }
    element.classList.add('active');
}
    
// Atualização de Preço e Plano (Troca 30D, 60D, PERM)
function updatePrice(button, price, planName, productName) {
    const card = button.closest('.card-details') || button.closest('.card-details-wrapper');
     
    if (!card) return;
    
    // 1. Atualizar estilo do botão de plano clicado
    card.querySelectorAll('.plan-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // 2. Atualizar o visor de preço no card
    const priceDisplay = card.querySelector('.price-tag-box');
    if (priceDisplay) {
        priceDisplay.innerText = `R$ ${price.toFixed(2).replace('.', ',')}`;
    }
    
    // 3. Atualizar o evento do botão de compra principal para levar o novo preço/plano
     const buyBtn = card.querySelector('.buy-btn') || card.querySelector('.buy-bar-btn');
    if (buyBtn) {
        // Atualiza o atributo onclick dinamicamente
        buyBtn.setAttribute('onclick', `openCheckout('${productName} (${planName})', ${price})`);
    }
}
// Barra de Busca
function searchProducts() {
    let input = document.getElementById('site-search').value.toLowerCase();
    let cards = document.querySelectorAll('.product-compact-card, .vip-card');
    
    cards.forEach(card => {
        let text = card.innerText.toLowerCase();
        // Se o texto incluir a busca, mostra o card, senão esconde
        card.style.display = text.includes(input) ? "" : "none";
    });
}

// Modal de Checkout
function openCheckout(productName, price) {
    currentPrice = price; // Atualiza a variável global
    const modal = document.getElementById('modal-checkout'); // ID correto do HTML
    const title = document.getElementById('modal-title');
    const priceDisplay = document.getElementById('modal-price');
    
    if (title) title.innerText = productName;
    if (priceDisplay) priceDisplay.innerText = `R$ ${price.toFixed(2).replace('.', ',')}`;
    
    modal.style.display = 'flex';
}


function generatePix() {
    const id = document.getElementById('player-id').value;
    if(!id || id.trim().length < 2) {
        return alert("Por favor, informe seu ID ou Nome para identificação!");
    }

    const pixKey = "augusto.mantai@live.com";
    // QR Code dinâmico via API externa (apenas visual para este exemplo)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Chave:${pixKey}|Valor:${currentPrice}|ID:${id}`;

    document.getElementById('pix-qr-img').src = qrUrl;
    document.getElementById('pix-qr-container').style.display = 'block';
    document.getElementById('main-action-btn').style.display = 'none';
}

function closeModal() {
    document.getElementById('modal-checkout').style.display = 'none';
}

// Fechar modal ao clicar na área escura (overlay)
window.onclick = function(event) {
    const modal = document.getElementById('modal-checkout');
    if (event.target == modal) {
        closeModal();
    }
}