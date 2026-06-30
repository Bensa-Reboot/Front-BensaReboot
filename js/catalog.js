// Resolve a pasta `images/` a partir da localização real deste arquivo
// (js/catalog.js), e não da página que o importou. Isso gera uma URL
// absoluta válida em qualquer página (raiz ou pages/), sem precisar
// adivinhar a profundidade da pasta atual em tempo de execução.
const IMAGES_BASE = new URL("../images/", import.meta.url).href;

export const brandSymbols = {
  adidas:     `<img class="brand-logo-mark" src="${IMAGES_BASE}logo-adidas.png"     alt="Adidas">`,
  nike:       `<img class="brand-logo-mark" src="${IMAGES_BASE}logo-nike.png"       alt="Nike">`,
  jordan:     `<img class="brand-logo-mark" src="${IMAGES_BASE}logo-jordan.png"     alt="Jordan">`,
  vans:       `<img class="brand-logo-mark" src="${IMAGES_BASE}logo-vans.png"       alt="Vans">`,
  stussy:     `<img class="brand-logo-mark" src="${IMAGES_BASE}logo-stussy.png"     alt="Stüssy">`,
  newbalance: `<img class="brand-logo-mark" src="${IMAGES_BASE}logo-newbalance.png" alt="New Balance">`,
};

export const brandLabels = {
  adidas:     'Adidas',
  nike:       'Nike',
  jordan:     'Jordan',
  vans:       'Vans',
  stussy:     'Stüssy',
  newbalance: 'New Balance',
};

export const catalog = {
  roupas: {
    symbol: ``,
    products: [
      { title: 'Box Logo Tee Black',    price: 349.99, image: IMAGES_BASE + 'product-shirt.png', badge: 'Best Seller' },
      { title: 'Gradient Hoodie Red',   price: 589.99, image: IMAGES_BASE + 'product-shirt.png', badge: 'Novo' },
      { title: 'Varsity Jacket White',  price: 899.99, image: IMAGES_BASE + 'product-shirt.png', badge: 'Best Seller' },
      { title: 'Cargo Pants Black',     price: 459.99, image: IMAGES_BASE + 'product-shirt.png', badge: '' },
      { title: 'Crewneck Sweater Gray', price: 319.99, image: IMAGES_BASE + 'product-shirt.png', badge: 'Novo', stock: 12 },
      { title: 'Windbreaker Red',       price: 679.99, image: IMAGES_BASE + 'product-shirt.png', badge: '' },
      { title: 'LRC Signature V3 Tee',  price: 189.99, image: IMAGES_BASE + 'product-shirt.png', badge: 'Best Seller' },
      { title: 'Script Logo Tee White', price: 229.99, image: IMAGES_BASE + 'product-shirt.png', badge: '', stock: 5 },
      { title: 'Puffer Vest Black',     price: 529.99, image: IMAGES_BASE + 'product-shirt.png', badge: 'Novo' },
    ]
  },
  calcados: {
    symbol: brandSymbols.adidas,
    products: [
      { title: 'ADI2000 Branco/Cinza', price: 679.99, image: IMAGES_BASE + 'product-shoe.png', badge: 'Best Seller', stock: 8 },
      { title: 'Forum Low Black',      price: 549.99, image: IMAGES_BASE + 'product-shoe.png', badge: 'Novo' },
      { title: 'Samba OG White',       price: 749.99, image: IMAGES_BASE + 'product-shoe.png', badge: 'Best Seller' },
      { title: 'Campus 00s Red',       price: 629.99, image: IMAGES_BASE + 'product-shoe.png', badge: '' },
      { title: 'Gazelle Bold Gray',    price: 589.99, image: IMAGES_BASE + 'product-shoe.png', badge: 'Novo' },
      { title: 'NMD R1 Black',         price: 819.99, image: IMAGES_BASE + 'product-shoe.png', badge: '' },
      { title: 'Ultraboost 23',        price: 999.99, image: IMAGES_BASE + 'product-shoe.png', badge: 'Best Seller' },
      { title: 'Stan Smith Green',     price: 499.99, image: IMAGES_BASE + 'product-shoe.png', badge: '' },
      { title: 'Handball Spezial',     price: 659.99, image: IMAGES_BASE + 'product-shoe.png', badge: 'Novo' },
    ]
  },
  acessorios: {
    symbol: ``,
    products: [
      { title: 'Boné Snapback Black',  price: 149.99, image: IMAGES_BASE + 'product-shoe.png', badge: 'Best Seller' },
      { title: 'Mochila Streetwear',   price: 289.99, image: IMAGES_BASE + 'product-shoe.png', badge: 'Novo' },
      { title: 'Shoulder Bag Red',     price: 199.99, image: IMAGES_BASE + 'product-shoe.png', badge: '' },
      { title: 'Carteira Slim Black',  price: 119.99, image: IMAGES_BASE + 'product-shoe.png', badge: 'Best Seller' },
      { title: 'Cinto Tático Gray',    price:  89.99, image: IMAGES_BASE + 'product-shoe.png', badge: '', stock: 12 },
      { title: 'Meias Pack 3x',        price:  69.99, image: IMAGES_BASE + 'product-shoe.png', badge: 'Novo' },
      { title: 'Óculos Street Black',  price: 239.99, image: IMAGES_BASE + 'product-shoe.png', badge: 'Best Seller' },
      { title: 'Touca Beanie Red',     price:  99.99, image: IMAGES_BASE + 'product-shoe.png', badge: '' },
      { title: 'Chaveiro Logo',        price:  49.99, image: IMAGES_BASE + 'product-shoe.png', badge: 'Novo' },
    ]
  },
  nike: {
    symbol: brandSymbols.nike,
    products: [
      { title: 'Air Force 1 White',    price:  799.99, image: IMAGES_BASE + 'product-shoe.png',  badge: 'Best Seller' },
      { title: 'Air Max 90 Black',     price:  899.99, image: IMAGES_BASE + 'product-shoe.png',  badge: '' },
      { title: 'Dunk Low Panda',       price:  849.99, image: IMAGES_BASE + 'product-shoe.png',  badge: 'Best Seller' },
      { title: 'Air Jordan 1 Red',     price: 1199.99, image: IMAGES_BASE + 'product-shoe.png',  badge: 'Novo' },
      { title: 'React Vision Gray',    price:  749.99, image: IMAGES_BASE + 'product-shoe.png',  badge: '' },
      { title: 'Tech Fleece Hoodie',   price:  449.99, image: IMAGES_BASE + 'product-shirt.png', badge: 'Novo' },
      { title: 'Club Tee Black',       price:  149.99, image: IMAGES_BASE + 'product-shirt.png', badge: '' },
      { title: 'Swoosh Windbreaker',   price:  599.99, image: IMAGES_BASE + 'product-shirt.png', badge: 'Best Seller' },
      { title: 'Air Max Plus TN',      price:  999.99, image: IMAGES_BASE + 'product-shoe.png',  badge: '' },
    ]
  },
  adidas: {
    symbol: brandSymbols.adidas,
    products: [
      { title: 'ADI2000 Branco/Cinza', price: 679.99, image: IMAGES_BASE + 'product-shoe.png',  badge: 'Best Seller', stock: 8 },
      { title: 'Samba OG White',       price: 749.99, image: IMAGES_BASE + 'product-shoe.png',  badge: 'Best Seller' },
      { title: 'Campus 00s Red',       price: 629.99, image: IMAGES_BASE + 'product-shoe.png',  badge: '' },
      { title: 'Forum Low Black',      price: 549.99, image: IMAGES_BASE + 'product-shoe.png',  badge: 'Novo' },
      { title: 'Gazelle Bold Gray',    price: 589.99, image: IMAGES_BASE + 'product-shoe.png',  badge: 'Novo' },
      { title: 'Handball Spezial',     price: 659.99, image: IMAGES_BASE + 'product-shoe.png',  badge: '' },
      { title: 'Ultraboost 23',        price: 999.99, image: IMAGES_BASE + 'product-shoe.png',  badge: 'Best Seller' },
      { title: 'Trefoil Hoodie Black', price: 389.99, image: IMAGES_BASE + 'product-shirt.png', badge: '', stock: 5 },
      { title: 'Stan Smith Green',     price: 499.99, image: IMAGES_BASE + 'product-shoe.png',  badge: '' },
    ]
  },
  jordan: {
    symbol: brandSymbols.jordan,
    products: [
      { title: 'Air Jordan 1 High OG',   price: 1299.99, image: IMAGES_BASE + 'product-shoe.png',  badge: 'Best Seller' },
      { title: 'Air Jordan 4 Black Cat', price: 1499.99, image: IMAGES_BASE + 'product-shoe.png',  badge: 'Novo' },
      { title: 'Air Jordan 3 White',     price: 1199.99, image: IMAGES_BASE + 'product-shoe.png',  badge: '' },
      { title: 'Air Jordan 11 Concord',  price: 1599.99, image: IMAGES_BASE + 'product-shoe.png',  badge: 'Best Seller', stock: 8 },
      { title: 'Jordan 1 Mid Red',       price:  899.99, image: IMAGES_BASE + 'product-shoe.png',  badge: '' },
      { title: 'Jordan Flight Fleece',   price:  349.99, image: IMAGES_BASE + 'product-shirt.png', badge: 'Novo' },
      { title: 'Jordan Essentials Tee',  price:  179.99, image: IMAGES_BASE + 'product-shirt.png', badge: '' },
      { title: 'Air Jordan 6 Carmine',   price: 1399.99, image: IMAGES_BASE + 'product-shoe.png',  badge: 'Best Seller' },
      { title: 'Jordan MA2 Black',       price:  749.99, image: IMAGES_BASE + 'product-shoe.png',  badge: '' },
    ]
  },
  vans: {
    symbol: brandSymbols.vans,
    products: [
      { title: 'Old Skool Black/White', price: 399.99, image: IMAGES_BASE + 'product-shoe.png',  badge: 'Best Seller' },
      { title: 'Sk8-Hi Black',          price: 449.99, image: IMAGES_BASE + 'product-shoe.png',  badge: '' },
      { title: 'Authentic Canvas Red',  price: 329.99, image: IMAGES_BASE + 'product-shoe.png',  badge: 'Novo' },
      { title: 'Era 59 Checkerboard',   price: 369.99, image: IMAGES_BASE + 'product-shoe.png',  badge: 'Best Seller' },
      { title: 'Slip-On White',         price: 299.99, image: IMAGES_BASE + 'product-shoe.png',  badge: '' },
      { title: 'Vault OG Epoch',        price: 599.99, image: IMAGES_BASE + 'product-shoe.png',  badge: 'Novo' },
      { title: 'Off The Wall Tee',      price: 139.99, image: IMAGES_BASE + 'product-shirt.png', badge: '' },
      { title: 'Checkerboard Hoodie',   price: 319.99, image: IMAGES_BASE + 'product-shirt.png', badge: 'Best Seller' },
      { title: 'Comfycush Old Skool',   price: 479.99, image: IMAGES_BASE + 'product-shoe.png',  badge: '' },
    ]
  },
  stussy: {
    symbol: brandSymbols.stussy,
    products: [
      { title: 'Stock Logo Tee White', price: 229.99, image: IMAGES_BASE + 'product-shirt.png', badge: 'Best Seller' },
      { title: 'Surfman Tee Black',    price: 249.99, image: IMAGES_BASE + 'product-shirt.png', badge: '' },
      { title: 'Smooth Stock Hoodie',  price: 489.99, image: IMAGES_BASE + 'product-shirt.png', badge: 'Novo' },
      { title: '8 Ball Tee Gray',      price: 219.99, image: IMAGES_BASE + 'product-shirt.png', badge: 'Best Seller' },
      { title: 'Tribe Shorts Black',   price: 299.99, image: IMAGES_BASE + 'product-shirt.png', badge: '' },
      { title: 'Graffiti Crewneck',    price: 429.99, image: IMAGES_BASE + 'product-shirt.png', badge: 'Novo' },
      { title: 'Camo Cargo Pants',     price: 549.99, image: IMAGES_BASE + 'product-shirt.png', badge: '' },
      { title: 'Link Tee Red',         price: 209.99, image: IMAGES_BASE + 'product-shirt.png', badge: 'Best Seller' },
      { title: 'Big Logo Cap Black',   price: 169.99, image: IMAGES_BASE + 'product-shoe.png',  badge: 'Novo' },
    ]
  },
  newbalance: {
    symbol: brandSymbols.newbalance,
    products: [
      { title: '550 White/Gray',       price: 699.99, image: IMAGES_BASE + 'product-shoe.png',  badge: 'Best Seller' },
      { title: '574 Navy',             price: 579.99, image: IMAGES_BASE + 'product-shoe.png',  badge: '' },
      { title: '990v5 Gray',           price: 999.99, image: IMAGES_BASE + 'product-shoe.png',  badge: 'Novo' },
      { title: '2002R White',          price: 799.99, image: IMAGES_BASE + 'product-shoe.png',  badge: 'Best Seller' },
      { title: '327 Green',            price: 649.99, image: IMAGES_BASE + 'product-shoe.png',  badge: '' },
      { title: '9060 Black',           price: 849.99, image: IMAGES_BASE + 'product-shoe.png',  badge: 'Novo' },
      { title: 'Athletics Tee',        price: 189.99, image: IMAGES_BASE + 'product-shirt.png', badge: '' },
      { title: 'NB Essentials Hoodie', price: 359.99, image: IMAGES_BASE + 'product-shirt.png', badge: 'Best Seller' },
      { title: '1906R Silver',         price: 899.99, image: IMAGES_BASE + 'product-shoe.png',  badge: '' },
    ]
  },
};

/**
 * Normaliza e compõe um identificador estável para o produto.
 * @param {string} sectionKey chave da seção (ex: "calcados")
 * @param {string} title título do produto
 * @param {number} index índice dentro da lista — evita colisões quando títulos se repetem
 * @returns {string} id composto e slugificado
 *
 * Rationale: garante IDs idênticos entre o grid e a página de produto sem
 * depender de um backend. A função slugifica o título para URLs legíveis.
 */
export function makeProductId(sectionKey, title, index) {
  return `${sectionKey}-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${index}`;
}

/**
 * Procura um produto pelo ID composto retornado por `makeProductId`.
 * @param {string} productId
 * @returns {Object|null} produto com propriedade `id` e `sectionKey`, ou `null`
 *
 * Observação de performance: busca linear (O(n)) considerada aceitável
 * para o catálogo local exibido no cliente — o tamanho máximo esperado é baixo.
 */
export function findProductById(productId) {
  for (const [sectionKey, section] of Object.entries(catalog)) {
    for (let i = 0; i < section.products.length; i++) {
      const product = section.products[i];
      const id = makeProductId(sectionKey, product.title, i);
      if (id === productId) {
        return { ...product, id, sectionKey };
      }
    }
  }
  return null;
}