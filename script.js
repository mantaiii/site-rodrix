let currentPrice = 0;

// Gerencia a navegação principal (Sidebar)
function navigate(sectionId, element = null) {
    // 1. Esconde TODAS as seções principais, incluindo a de busca
    document.querySelectorAll('.main-container').forEach(section => {
        section.classList.remove('active');
        section.style.display = "none";
    });

    // 2. Remove destaque de todos os botões da sidebar
    document.querySelectorAll('.side-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // 3. Mostra a seção desejada
    const target = document.getElementById(sectionId);
    if (target) {
        target.style.display = "block";
        // Timeout pequeno para permitir que o display:block seja processado antes da animação
        setTimeout(() => target.classList.add('active'), 10);
    }

    // 4. Ativa o botão correto na sidebar
    if (element) {
        element.classList.add('active');
    } else {
        // Se não passamos o elemento, tentamos achar o botão pelo ID da seção
        const btn = document.querySelector(`.side-btn[onclick*="${sectionId}"]`);
        if (btn) btn.classList.add('active');
    }

    // 5. Reseta o scroll e limpa o input de busca ao mudar de aba manualmente
    // (Opcional: limpa a busca se você clicar em outra categoria)
    // document.getElementById('site-search').value = '';

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
const originalContainers = {};

function searchProducts() {
    const input = document.getElementById('site-search').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('search-results-container');
    const resultsGrid = document.getElementById('results-grid');
    const allSections = document.querySelectorAll('.main-container:not(#search-results-container)');
    const noResults = document.getElementById('no-results');
    const searchBar = document.querySelector('.search-container');

if (input.length > 0) {
    searchBar.classList.add('has-text');
} else {
    searchBar.classList.remove('has-text');
}
    
    resultsGrid.innerHTML = '';

    // SE A BUSCA ESTIVER VAZIA:
    if (input.length === 0) {
        resultsContainer.classList.remove('active');
        resultsContainer.style.display = "none";
        
        // Recupera qual aba deveria estar aberta
        const activeBtn = document.querySelector('.side-btn.active');
        if (activeBtn) {
            // Extrai o ID da seção do onclick (ex: 'cat-vips')
            const sectionId = activeBtn.getAttribute('onclick').match(/'([^']+)'/)[1];
            navigate(sectionId, activeBtn);
        } else {
            // Se nada estiver ativo, volta para a home/vips por padrão
            navigate('cat-vips'); 
        }
        return;
    }

    // SE HOUVER BUSCA:
    allSections.forEach(s => {
        s.classList.remove('active');
        s.style.display = "none";
    });

    const allCards = document.querySelectorAll('.main-container:not(#search-results-container) .product-compact-card, .main-container:not(#search-results-container) .vip-card, .main-container:not(#search-results-container) .exclusivos-card');
    
    let foundCount = 0;
    allCards.forEach(card => {
        if (card.innerText.toLowerCase().includes(input)) {
            const clone = card.cloneNode(true);
            
            // Remove IDs duplicados do clone para evitar conflitos de CSS/JS
        clone.removeAttribute('id'); 
        
        clone.style.display = "flex"; // Garante que o clone herde o display flex
        resultsGrid.appendChild(clone);
        foundCount++;
    }
});

    resultsContainer.style.display = "block";
    setTimeout(() => resultsContainer.classList.add('active'), 10);

    document.getElementById('search-count').innerText = `${foundCount} itens encontrados`;
    if (noResults) noResults.style.display = foundCount > 0 ? "none" : "block";
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


async function generatePix() {
    const idPlayer = document.getElementById('player-id').value.trim();
    const modalTitle = document.getElementById('modal-title').innerText;

    if(!idPlayer) return alert("Por favor, informe seu ID do jogo!");

    const btn = document.getElementById('main-action-btn');
    btn.innerText = "GERANDO PIX...";
    btn.disabled = true;

    try {
        // Chamada para o SEU servidor Node.js
        const response = await fetch('http://localhost:3000/criar-pix', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                valor: currentPrice,
                email: "pagamento@capitalfugas.com", // E-mail apenas para registro no MP
                player_id: idPlayer,
                produto: modalTitle
            })
        });

        const data = await response.json();

        if (data.imagem_qr_code) {
            // 1. Esconde o campo de ID e o botão de gerar
            document.getElementById('player-id').style.display = 'none';
            btn.style.display = 'none';

            // 2. Mostra o container do QR Code
            const qrContainer = document.getElementById('pix-qr-container');
            qrContainer.style.display = 'block';

            // 3. Insere a imagem do QR Code
            document.getElementById('pix-qr-img').src = `data:image/png;base64,${data.imagem_qr_code}`;

            // 4. Substitui o texto da chave pelo código "Copia e Cola"
            // Vamos trocar aquele <p> da chave por um campo clicável
            qrContainer.innerHTML += `
                <div style="margin-top:15px;">
                    <p style="color:#00ff88; font-size:0.8rem; margin-bottom:5px;">Pix Copia e Cola:</p>
                    <input type="text" id="pix-input-copia" value="${data.copia_e_cola}" readonly 
                           style="width:100%; background:#222; border:1px solid #444; color:#fff; padding:8px; border-radius:5px; font-size:0.7rem;">
                    <button onclick="copyPixText()" style="background:#009ee3; border:none; color:white; padding:5px 10px; margin-top:5px; border-radius:3px; cursor:pointer; font-size:0.7rem;">
                        Copiar Código
                    </button>
                </div>
            `;
        } else {
            throw new Error("Resposta inválida do servidor");
        }

    } catch (error) {
        console.error("Erro ao gerar PIX:", error);
        alert("O servidor de pagamentos está offline. Verifique se rodou o comando 'node index.js'.");
        btn.disabled = false;
        btn.innerText = "GERAR PIX";
    }
}

// Função auxiliar para facilitar a vida do seu jogador
function copyPixText() {
    const copyText = document.getElementById("pix-input-copia");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
    alert("Código Pix copiado!");
}
function closeModal() {
    const modal = document.getElementById('modal-checkout');
    modal.style.display = 'none';
    
    // Reseta o modal para o estado original quando fechar
    document.getElementById('player-id').style.display = 'block';
    document.getElementById('main-action-btn').style.display = 'block';
    document.getElementById('main-action-btn').disabled = false;
    document.getElementById('main-action-btn').innerText = "GERAR PIX";
    document.getElementById('pix-qr-container').style.display = 'none';
    
    // Limpa o conteúdo extra do QR Code (para não duplicar se abrir de novo)
    const qrContainer = document.getElementById('pix-qr-container');
    qrContainer.innerHTML = `<img id="pix-qr-img" src="" alt="QR Code Pix" style="width:200px; height:200px; border:5px solid #fff; border-radius:10px;">`;
}
// Fechar modal ao clicar na área escura (overlay)
window.onclick = function(event) {
    const modal = document.getElementById('modal-checkout');
    if (event.target == modal) {
        closeModal();
    }
}