// Dashboard Product Management System
// Uses LocalStorage for data persistence (can be replaced with API calls)

// Admin authentication system
const AdminAuth = {
  storageKey: 'adminSession',

  // Check if admin is logged in
  isLoggedIn() {
    const session = sessionStorage.getItem(this.storageKey);
    return session === 'true';
  },

  // Logout function
  logout() {
    sessionStorage.removeItem(this.storageKey);
    window.location.href = 'admin-login.html';
  },

  // Protect dashboard - redirect to login if not authenticated
  protectDashboard() {
    if (!this.isLoggedIn()) {
      window.location.href = 'admin-login.html';
    }
  }
};

const DashboardManager = {
  storageKey: 'dashboardProducts',

  // Initialize dashboard with products from shop.js
  init() {
    this.loadProductsFromShop();
    this.setupEventListeners();
    this.render();
  },

  // Load products from the global products array (shop.js)
  loadProductsFromShop() {
    if (typeof products === 'undefined') return;
    
    const stored = this.getStoredProducts();
    if (stored.length > 0) return; // Already loaded

    const dashboardProducts = products.map(p => ({
      id: p.id,
      title: p.title,
      price: p.price,
      image: p.image,
      rating: p.rating || 5,
      description: '',
      colors: [],
      sizes: []
    }));

    this.saveProducts(dashboardProducts);
  },

  // Get products from localStorage
  getStoredProducts() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    } catch (e) {
      console.error('Error reading products:', e);
      return [];
    }
  },

  // Save products to localStorage
  saveProducts(products) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(products));
      this.syncWithShop();
      return true;
    } catch (e) {
      console.error('Error saving products:', e);
      return false;
    }
  },

  // Sync dashboard products with shop.js global array
  syncWithShop() {
    if (typeof window !== 'undefined' && window.products) {
      const dashboardProducts = this.getStoredProducts();
      dashboardProducts.forEach(dashProduct => {
        const shopProduct = window.products.find(p => p.id === dashProduct.id);
        if (shopProduct) {
          shopProduct.title = dashProduct.title;
          shopProduct.price = dashProduct.price;
          shopProduct.image = dashProduct.image;
          shopProduct.rating = dashProduct.rating;
        }
      });
    }
  },

  // Get next available product ID
  getNextId() {
    const products = this.getStoredProducts();
    return products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : window.products.length + 1;
  },

  // Add new product
  addProduct(productData) {
    const products = this.getStoredProducts();
    const newProduct = {
      id: this.getNextId(),
      ...productData
    };
    products.push(newProduct);
    
    if (this.saveProducts(products)) {
      // Also add to global products array
      if (typeof window !== 'undefined' && window.products) {
        window.products.push({
          id: newProduct.id,
          title: newProduct.title,
          price: newProduct.price,
          image: newProduct.image,
          rating: newProduct.rating
        });
      }
      return newProduct;
    }
    return null;
  },

  // Update product
  updateProduct(id, updates) {
    const products = this.getStoredProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      if (this.saveProducts(products)) {
        return products[index];
      }
    }
    return null;
  },

  // Delete product
  deleteProduct(id) {
    const products = this.getStoredProducts();
    const filtered = products.filter(p => p.id !== id);
    if (this.saveProducts(filtered)) {
      // Also remove from global products array
      if (typeof window !== 'undefined' && window.products) {
        const shopIndex = window.products.findIndex(p => p.id === id);
        if (shopIndex !== -1) {
          window.products.splice(shopIndex, 1);
        }
      }
      return true;
    }
    return false;
  },

  // Setup all event listeners
  setupEventListeners() {
    // Authentication protection
    AdminAuth.protectDashboard();

    // Logout button
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to sign out?')) {
        AdminAuth.logout();
      }
    });

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
    });

    // Search and sort
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    
    if (searchInput) {
      searchInput.addEventListener('input', () => this.render());
    }
    if (sortSelect) {
      sortSelect.addEventListener('change', () => this.render());
    }

    // Add product form
    const addForm = document.getElementById('addProductForm');
    if (addForm) {
      addForm.addEventListener('submit', (e) => this.handleAddProduct(e));
      this.setupImageUpload();
      this.setupColorInput();
      this.setupSizeInput();
    }

    // Modal close buttons
    document.getElementById('closeModalBtn')?.addEventListener('click', () => this.closeModal());
    document.getElementById('cancelDeleteBtn')?.addEventListener('click', () => this.closeDeleteModal());
    document.querySelector('.modal-close')?.addEventListener('click', () => this.closeModal());

    // Sync button
    document.getElementById('syncBtn')?.addEventListener('click', () => this.handleSync());
  },

  // Tab switching
  switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    const tabContent = document.getElementById(`${tabName}-tab`);
    const tabBtn = document.querySelector(`[data-tab="${tabName}"]`);

    if (tabContent) tabContent.classList.add('active');
    if (tabBtn) tabBtn.classList.add('active');
  },

  // Image upload setup
  setupImageUpload() {
    const uploadArea = document.getElementById('imageUploadArea');
    const fileInput = document.getElementById('productImage');
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const removeBtn = document.getElementById('removeImageBtn');

    if (!uploadArea) return;

    uploadArea.addEventListener('click', () => fileInput.click());

    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.style.background = 'rgba(0, 0, 0, 0.05)';
    });

    uploadArea.addEventListener('dragleave', () => {
      uploadArea.style.background = '';
    });

    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.style.background = '';
      const files = e.dataTransfer.files;
      if (files.length) this.handleImageSelect(files[0], 'add');
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length) this.handleImageSelect(e.target.files[0], 'add');
    });

    removeBtn?.addEventListener('click', () => {
      preview.style.display = 'none';
      fileInput.value = '';
    });
  },

  // Handle image selection
  handleImageSelect(file, mode) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (mode === 'add') {
        const preview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');
        previewImg.src = e.target.result;
        preview.style.display = 'block';
        document.getElementById('imageUploadArea').style.display = 'none';
        // Store base64 for demo
        document.getElementById('productImage').dataset.imageData = e.target.result;
      } else if (mode === 'edit') {
        const editPreview = document.getElementById('editImagePreview');
        const editPreviewImg = document.getElementById('editPreviewImg');
        editPreviewImg.src = e.target.result;
        editPreviewImg.dataset.newImage = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  },

  // Color input setup
  setupColorInput() {
    const colorInput = document.getElementById('colorInput');
    const addColorBtn = document.getElementById('addColorBtn');
    const colorsList = document.getElementById('colorsList');

    if (!addColorBtn) return;

    addColorBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const color = colorInput.value.trim();
      if (!color) return;

      const colorItem = document.createElement('div');
      colorItem.className = 'color-item';
      colorItem.innerHTML = `
        <div class="color-box" style="background: ${this.nameToHex(color) || '#ccc'};"></div>
        <span>${color}</span>
        <button type="button" class="btn-remove-item" data-color="${color}">×</button>
      `;

      colorItem.querySelector('.btn-remove-item').addEventListener('click', () => {
        colorItem.remove();
      });

      colorsList.appendChild(colorItem);
      colorInput.value = '';
      colorInput.focus();
    });

    colorInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addColorBtn.click();
      }
    });
  },

  // Size input setup
  setupSizeInput() {
    const sizeInput = document.getElementById('sizeInput');
    const addSizeBtn = document.getElementById('addSizeBtn');
    const sizesList = document.getElementById('sizesList');

    if (!addSizeBtn) return;

    addSizeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const size = sizeInput.value.trim();
      if (!size) return;

      const sizeItem = document.createElement('div');
      sizeItem.className = 'size-item';
      sizeItem.innerHTML = `
        <span>${size}</span>
        <button type="button" class="btn-remove-item" data-size="${size}">×</button>
      `;

      sizeItem.querySelector('.btn-remove-item').addEventListener('click', () => {
        sizeItem.remove();
      });

      sizesList.appendChild(sizeItem);
      sizeInput.value = '';
      sizeInput.focus();
    });

    sizeInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addSizeBtn.click();
      }
    });
  },

  // Handle add product form submission
  handleAddProduct(e) {
    e.preventDefault();

    const title = document.getElementById('productTitle').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const rating = parseFloat(document.getElementById('productRating').value);
    const description = document.getElementById('productDescription').value;
    
    // Get selected colors
    const colors = Array.from(document.querySelectorAll('#colorsList .color-item span'))
      .map(el => el.textContent);

    // Get selected sizes
    const sizes = Array.from(document.querySelectorAll('#sizesList .size-item span'))
      .map(el => el.textContent);

    // Get image
    const imageData = document.getElementById('productImage').dataset.imageData || 'images/p1.jpeg';

    if (!title || !price || !imageData) {
      this.showMessage('Please fill in all required fields', false);
      return;
    }

    const product = this.addProduct({
      title,
      price,
      rating,
      description,
      image: imageData,
      colors,
      sizes
    });

    if (product) {
      this.showMessage('Product added successfully!');
      e.target.reset();
      document.getElementById('imagePreview').style.display = 'none';
      document.getElementById('imageUploadArea').style.display = 'block';
      document.getElementById('colorsList').innerHTML = '';
      document.getElementById('sizesList').innerHTML = '';
      this.switchTab('products');
      this.render();
    } else {
      this.showMessage('Failed to add product', false);
    }
  },

  // Edit product modal
  openEditModal(id) {
    const product = this.getStoredProducts().find(p => p.id === id);
    if (!product) return;

    document.getElementById('editProductTitle').value = product.title;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductRating').value = product.rating || 5;
    document.getElementById('editProductDescription').value = product.description || '';
    document.getElementById('editPreviewImg').src = product.image;
    document.getElementById('editModal').dataset.productId = id;

    const editForm = document.getElementById('editProductForm');
    editForm.onsubmit = (e) => this.handleEditProduct(e);

    const editImageInput = document.getElementById('editProductImage');
    editImageInput.addEventListener('change', (e) => {
      if (e.target.files.length) this.handleImageSelect(e.target.files[0], 'edit');
    });

    document.getElementById('editModal').classList.remove('hidden');
  },

  // Handle edit product form submission
  handleEditProduct(e) {
    e.preventDefault();

    const productId = parseInt(document.getElementById('editModal').dataset.productId);
    const title = document.getElementById('editProductTitle').value;
    const price = parseFloat(document.getElementById('editProductPrice').value);
    const rating = parseFloat(document.getElementById('editProductRating').value);
    const description = document.getElementById('editProductDescription').value;

    let image = document.getElementById('editPreviewImg').src;
    const newImage = document.getElementById('editPreviewImg').dataset.newImage;
    if (newImage) image = newImage;

    const updates = {
      title,
      price,
      rating,
      description,
      image
    };

    if (this.updateProduct(productId, updates)) {
      this.showMessage('Product updated successfully!');
      this.closeModal();
      this.render();
    } else {
      this.showMessage('Failed to update product', false);
    }
  },

  // Delete product modal
  openDeleteModal(id) {
    document.getElementById('deleteModal').dataset.productId = id;
    document.getElementById('confirmDeleteBtn').onclick = () => this.confirmDelete(id);
    document.getElementById('deleteModal').classList.remove('hidden');
  },

  // Confirm delete
  confirmDelete(id) {
    if (this.deleteProduct(id)) {
      this.showMessage('Product deleted successfully!');
      this.closeDeleteModal();
      this.render();
    } else {
      this.showMessage('Failed to delete product', false);
    }
  },

  // Close modals
  closeModal() {
    document.getElementById('editModal').classList.add('hidden');
  },

  closeDeleteModal() {
    document.getElementById('deleteModal').classList.add('hidden');
  },

  // Handle sync
  handleSync() {
    const syncBtn = document.getElementById('syncBtn');
    syncBtn.classList.add('syncing');
    
    setTimeout(() => {
      this.syncWithShop();
      syncBtn.classList.remove('syncing');
      this.showMessage('Changes synced to store!');
    }, 1500);
  },

  // Show success/error message
  showMessage(text, isSuccess = true) {
    const messageEl = document.getElementById('successMessage');
    const messageText = document.getElementById('successText');
    messageText.textContent = text;
    messageEl.classList.remove('hidden');
    messageEl.style.background = isSuccess ? '#4caf50' : '#f44336';
    
    setTimeout(() => {
      messageEl.classList.add('hidden');
    }, 3000);
  },

  // Color name to hex (simple conversion)
  nameToHex(name) {
    const colors = {
      'navy': '#001f3f',
      'black': '#000',
      'white': '#fff',
      'grey': '#999',
      'gray': '#999',
      'cream': '#fffdd0',
      'burgundy': '#800020',
      'olive': '#808000',
      'charcoal': '#36454f',
      'light blue': '#ADD8E6',
      'peach': '#FFDAB9',
      'mint': '#98FF98',
      'sage': '#9dc183',
      'slate': '#708090',
      'brown': '#8B4513'
    };
    return colors[name.toLowerCase()] || null;
  },

  // Render products grid
  render() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    let products = this.getStoredProducts();

    // Search
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    if (searchTerm) {
      products = products.filter(p =>
        p.title.toLowerCase().includes(searchTerm)
      );
    }

    // Sort
    const sortValue = document.getElementById('sortSelect')?.value || 'default';
    if (sortValue === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    }

    if (products.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          <p>No products found</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = products.map(p => `
      <div class="product-card-dashboard">
        <div class="product-image-wrapper">
          <img src="${p.image}" alt="${p.title}" />
          <span class="product-badge">ID: ${p.id}</span>
        </div>
        <div class="product-info">
          <h3 class="product-title">${p.title}</h3>
          <div class="product-price">₦${p.price.toLocaleString()}</div>
          <div class="product-meta">
            <span class="product-rating">⭐ ${p.rating}</span>
            <span>${p.colors.length} colors • ${p.sizes.length} sizes</span>
          </div>
          
          ${p.colors.length > 0 ? `
            <div class="product-colors-preview">
              ${p.colors.map(c => `
                <div class="color-dot" style="background: ${this.nameToHex(c) || '#ccc'};" title="${c}"></div>
              `).join('')}
            </div>
          ` : ''}
          
          ${p.sizes.length > 0 ? `
            <div class="product-sizes-preview">
              ${p.sizes.slice(0, 3).map(s => `
                <span class="size-tag">${s}</span>
              `).join('')}
              ${p.sizes.length > 3 ? `<span class="size-tag">+${p.sizes.length - 3}</span>` : ''}
            </div>
          ` : ''}
          
          <div class="product-actions">
            <button class="btn-edit" data-id="${p.id}">Edit</button>
            <button class="btn-delete" data-id="${p.id}">Delete</button>
          </div>
        </div>
      </div>
    `).join('');

    // Add event listeners to edit/delete buttons
    grid.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        this.openEditModal(parseInt(btn.dataset.id));
      });
    });

    grid.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        this.openDeleteModal(parseInt(btn.dataset.id));
      });
    });
  }
};

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  DashboardManager.init();
});
