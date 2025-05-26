class MenuModalSystem {
  constructor() {
    this.menuData = {};
    this.photoMap = {
      'chinese-fast-food': {
        photos: ['lychee-almond-milkshake.jpg', 'five-spice-french-fries.JPEG', 'hong-shao-rou-burger.jpg'],
        previews: ['shake.PNG', 'fries.PNG', 'burger.PNG']
      },
      'thai-italian': {
        photos: ['full-menu.jpeg', 'red-curry-focaccia.jpeg', 'pasta.jpeg', 'mango-coconut-panna-cotta.jpeg'],
        previews: ['focaccia.PNG', 'pasta.PNG', 'mango.PNG']
      },
      'japanese-mexican': {
        photos: [],
        previews: []
      },
      'mezze-brunch': {
        photos: ["za'atar-hashbrowns.jpg", 'shakshuka-eggs-benedict.JPG', 'baklava-french-toast.JPG', 'med-brunch-1.JPG', 'med-brunch-2.JPG'],
        previews: ['hashbrown.PNG', 'egg.PNG', 'toast.PNG']
      },
      'indian-texmex': {
        photos: ['chaat-nachos.jpeg', 'mango-cardamom-flan.jpeg', 'mango-cardamom-flan-2.jpeg'],
        previews: ['nachos.PNG', 'flan.PNG']
      },
      'korean-southern': {
        photos: ['corn-cheese-mac.jpeg', 'gochujang-ribs.jpeg', 'injeolmi-banana-pudding.jpeg'],
        previews: ['mac.PNG', 'ribs.PNG', 'pudding.PNG']
      },
      'spanish-japanese': {
        photos: ['tortilla-espanola.jpeg', 'dashi-paella.jpeg', 'dashi-paella-2.jpeg'],
        previews: ['tortilla.PNG', 'paella.PNG']
      },
      'mediterranean-viet': {
        photos: ['spring-roll.JPG', 'souvlaki-plate.JPG', 'med-che-thai.JPG', 'med-viet-3.JPG', 'med-viet-5.JPG', 'med-viet-2.jpg', 'med-viet-4.JPG'],
        previews: ['roll.PNG', 'plate.PNG', 'chethai.PNG']
      },
      'french-thai': {
        photos: ['nam-tok-tartine.jpeg', 'red-curry-ratatouille-full.jpeg', 'red-curry-ratatouille.jpeg', 'banana-tart-tatin.jpeg'], 
        previews: ['tartine.PNG', 'ratatouille.PNG', 'tart.PNG']
      }
    };
    this.init();
  }
  
  async init() {
    await this.loadMenus();
    this.renderMenuGrid();
    this.setupEventListeners();
  }
  
  async loadMenus() {
    const menus = [
      'chinese-fast-food',
      'thai-italian',
      'japanese-mexican',
      'mezze-brunch',
      'indian-texmex',
      'korean-southern',
      'spanish-japanese', 
      'mediterranean-viet',
      'french-thai'
    ];
    
    for (const menuName of menus) {
      try {
        this.menuData[menuName] = {
          name: this.formatMenuName(menuName),
          imagePath: `../secret/assets/cheddar/menus/${menuName}.png`,
          photos: await this.loadPhotosFromFolder(menuName),
          previews: await this.loadPreviewsFromFolder(menuName)
          // description: await this.loadMarkdownDescription(menuName)
        };
      } catch (error) {
        console.warn(`Could not load menu: ${menuName}`, error);
      }
    }
  }

  async loadPhotosFromFolder(menuName) {
    if (this.photoMap[menuName]) {
      return this.photoMap[menuName]["photos"].map(photo => `../secret/assets/cheddar/${menuName}/${photo}`);
    }
    
    return [];
  }

  async loadPreviewsFromFolder(menuName) {
    if (this.photoMap[menuName]) {
      return this.photoMap[menuName]["previews"].map(photo => `../secret/assets/cheddar/${menuName}/previews/${photo}`);
    }
    
    return [];
  }
  
  getPreviewImages(menuKey) {
    const menu = this.menuData[menuKey];
    if (!menu || !menu.photos) return [];
    
    const previews = menu.previews;
    
    return previews;
  }
  
  parseMarkdown(markdown) {
    return markdown
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.+)$/gm, '<p>$1</p>')
      .replace(/<p><\/p>/g, '');
  }
  
  formatMenuName(menuName) {
    return menuName
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }
  
  renderMenuGrid() {
    const container = document.getElementById('menuContainer');
    const menuItems = Object.entries(this.menuData).map(([key, menu]) => {
      const previewImages = this.getPreviewImages(key);
      previewImages.map((img, index) => console.log(img, index));
      const previewHtml = previewImages.map((img, index) => 
        `<img src="${img}" alt="${menu.name} preview ${index}" class="floating-preview"/>`
      ).join('');

      return `
        <div class="menu-container">
          <img src="${menu.imagePath}" 
               alt="${menu.name}" 
               class="menu-image" 
               onclick="menuSystem.openModal('${key}')"
          <div class="floating-previews">
            ${previewHtml}
          </div>
        </div>
      `;
    }).join('');
    
    container.innerHTML = menuItems || '<div class="loading">No menus found</div>';
  }
  
  openModal(menuKey) {
    const menu = this.menuData[menuKey];
    if (!menu) return;
    
    const modal = document.getElementById('menuModal');
    const modalBody = document.getElementById('modalBody');
    
    const photosHtml = menu.photos.map(photo => 
      `<img src="${photo}" alt="${menu.name} photo" onerror="this.style.display='none'" />`
    ).join('');
    
    modalBody.innerHTML = `
      <h2>${menu.name}</h2>
      
      <div class="modal-gallery">
        ${photosHtml}
      </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }
  
  closeModal(event) {
    if (!event || event.target.id === 'menuModal' || event.target.className === 'close') {
      document.getElementById('menuModal').style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }
  
  setupEventListeners() {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.closeModal();
      }
    });
  }

  // async loadMarkdownDescription(menuName) {
  //   try {
  //     const response = await fetch(`menus/${menuName}/description.md`);
  //     if (response.ok) {
  //       const markdown = await response.text();
  //       return this.parseMarkdown(markdown);
  //     }
  //   } catch (error) {
  //     console.warn(`Could not load description for ${menuName}`);
  //   }
    
  //   // 🔧 UPDATE THESE FALLBACK DESCRIPTIONS:
  //   const fallbackDescriptions = {
  //     'thai-italian': 'A delightful fusion of Thai spices and Italian classics, featuring dishes like Red Curry Focaccia and Mango Coconut Panna Cotta.',
  //     'spanish-japanese': 'Experience the best of both worlds with our Spanish-Japanese menu, including Tortilla Española and Dashi Paella.',
  //     'mediterranean-viet': 'A unique blend of Mediterranean and Vietnamese flavors, offering dishes like Lemongrass Souvlaki Rice Plate and Spring Rolls.',
  //     'mezze-brunch': 'Start your day with our Mediterranean brunch, featuring Za\'atar Hashbrowns and Shakshuka Eggs Benedict.',
  //     'korean-southern': 'A delicious mix of Korean and Southern cuisines, with dishes like Gochujang Ribs and Injeolmi Banana Pudding.',
  //     'indian-texmex': 'Savor the fusion of Indian and Tex-Mex flavors with Chaat Nachos and Mango Cardamom Flan.',
  //     'french-thai': 'A creative blend of French and Thai cuisines, featuring Nam Tok Tartine and Red Curry Ratatouille.',
  //     'chinese-fast-food': 'Enjoy a modern twist on Chinese fast food with Lychee Almond Milkshake and Hong Shao Rou Burger.'
  //   };
    
  //   return fallbackDescriptions[menuName] || 'Delicious menu items await you!';
  // }
}

// Initialize the system when the page loads
const menuSystem = new MenuModalSystem();

// Global functions for onclick handlers
function closeModal(event) {
  menuSystem.closeModal(event);
}