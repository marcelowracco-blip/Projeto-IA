// Banco de dados de produtos
const products = [
    { id: 1, name: 'Camiseta Verde Eco', price: 89.90, category: 'camisetas', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=250&fit=crop', featured: true },
    { id: 2, name: 'Calça Jeans Sustentável', price: 199.90, category: 'calcas', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=250&fit=crop', featured: true },
    { id: 3, name: 'Vestido Floral', price: 159.90, category: 'vestidos', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=300&h=250&fit=crop', featured: true },
    { id: 4, name: 'Bolsa Ecológica', price: 129.90, category: 'acessorios', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=250&fit=crop', featured: true },
    { id: 5, name: 'Camiseta Amarela', price: 79.90, category: 'camisetas', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=300&h=250&fit=crop', featured: false },
    { id: 6, name: 'Calça de Linho', price: 179.90, category: 'calcas', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=250&fit=crop', featured: false },
    { id: 7, name: 'Vestido Laranja', price: 189.90, category: 'vestidos', image: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=300&h=250&fit=crop', featured: false },
    { id: 8, name: 'Chapéu de Palha', price: 49.90, category: 'acessorios', image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=300&h=250&fit=crop', featured: false }
];

// Carrinho de compras
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Funções do Carrinho
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    updateCartDisplay();
    showNotification('Produto adicionado ao carrinho!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartDisplay();
        }
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function updateCartDisplay() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
    
    const cartTotalElement = document.getElementById('cartTotal');
    if (cartTotalElement) {
        cartTotalElement.textContent = getCartTotal().toFixed(2);
    }
    
    const cartItemsContainer = document.getElementById('cartItems');
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center;">Seu carrinho está vazio</p>';
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div>
                        <strong>${item.name}</strong><br>
                        R$ ${item.price.toFixed(2)}
                    </div>
                    <div>
                        <button onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button onclick="removeFromCart(${item.id})">🗑️</button>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Funções de UI
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary-green);
        color: white;
        padding: 1rem;
        border-radius: 5px;
        z-index: 1002;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Carregar produtos em destaque
function loadFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-products');
    if (!featuredContainer) return;
    
    const featuredProducts = products.filter(p => p.featured);
    
    featuredContainer.innerHTML = featuredProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">R$ ${product.price.toFixed(2)}</p>
                <button class="buy-btn" onclick="addToCart(${product.id})">Comprar</button>
            </div>
        </div>
    `).join('');
}

// Carregar todos os produtos
function loadAllProducts() {
    const productsContainer = document.getElementById('all-products');
    if (!productsContainer) return;
    
    productsContainer.innerHTML = products.map(product => `
        <div class="product-card" data-category="${product.category}">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">R$ ${product.price.toFixed(2)}</p>
                <button class="buy-btn" onclick="addToCart(${product.id})">Comprar</button>
            </div>
        </div>
    `).join('');
}

// Configurar filtros
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            
            // Atualizar botões ativos
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filtrar produtos
            const productCards = document.querySelectorAll('#all-products .product-card');
            productCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Carregar carrossel
function loadCarousel() {
    const carouselTrack = document.getElementById('carouselTrack');
    if (!carouselTrack) return;
    
    const promoProducts = products.slice(0, 6);
    
    carouselTrack.innerHTML = promoProducts.map(product => `
        <div class="carousel-item">
            <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 200px; object-fit: cover;">
            <div class="product-info">
                <h4>${product.name}</h4>
                <p class="product-price">R$ ${product.price.toFixed(2)}</p>
                <button class="buy-btn" onclick="addToCart(${product.id})">Comprar</button>
            </div>
        </div>
    `).join('');
    
    // Configurar navegação do carrossel
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            carouselTrack.scrollBy({ left: -320, behavior: 'smooth' });
        });
        
        nextBtn.addEventListener('click', () => {
            carouselTrack.scrollBy({ left: 320, behavior: 'smooth' });
        });
    }
}

// Configurar formulário de contato
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        
        let isValid = true;
        
        // Validar nome
        if (name.value.trim().length < 3) {
            document.getElementById('nameError').textContent = 'Nome deve ter pelo menos 3 caracteres';
            isValid = false;
        } else {
            document.getElementById('nameError').textContent = '';
        }
        
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            document.getElementById('emailError').textContent = 'E-mail inválido';
            isValid = false;
        } else {
            document.getElementById('emailError').textContent = '';
        }
        
        // Validar mensagem
        if (message.value.trim().length < 10) {
            document.getElementById('messageError').textContent = 'Mensagem deve ter pelo menos 10 caracteres';
            isValid = false;
        } else {
            document.getElementById('messageError').textContent = '';
        }
        
        if (isValid) {
            showNotification('Mensagem enviada com sucesso!');
            form.reset();
        }
    });
}

// Menu responsivo
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Modal do carrinho
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.querySelector('.close-cart');
    
    if (cartIcon && cartModal) {
        cartIcon.addEventListener('click', () => {
            cartModal.classList.add('active');
            updateCartDisplay();
        });
        
        if (closeCart) {
            closeCart.addEventListener('click', () => {
                cartModal.classList.remove('active');
            });
        }
        
        // Fechar modal ao clicar fora
        window.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.classList.remove('active');
            }
        });
    }
});

// Adicionar estilos para notificações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification {
        animation: slideIn 0.3s ease;
    }
`;
document.head.appendChild(style);