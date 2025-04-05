// common.js - Ortak veri yönetimi

function getData() {
  const data = localStorage.getItem('siteData');
  if (data) {
    return JSON.parse(data);
  } else {
    const defaultData = {
      products: [],
      collections: [],
      categories: [],
      campaigns: []
    };
    localStorage.setItem('siteData', JSON.stringify(defaultData));
    return defaultData;
  }
}

function saveData(data) {
  localStorage.setItem('siteData', JSON.stringify(data));
}

function addProduct(product) {
  const data = getData();
  product.id = Date.now();
  product.dateAdded = new Date().toISOString();
  product.discount = product.discount || 0;
  data.products.push(product);
  // Kampanya kontrolü: %15 ve üzeri indirimli ürünler
  if (product.discount >= 15) {
    data.campaigns.push(product);
  }
  // Kategori ekleme (varsa tekrarı engellemek için)
  if (product.category && !data.categories.includes(product.category)) {
    data.categories.push(product.category);
  }
  saveData(data);
}

function addCollection(collection) {
  const data = getData();
  collection.id = Date.now();
  data.collections.push(collection);
  saveData(data);
}

function addCategory(category) {
  const data = getData();
  if (!data.categories.includes(category)) {
    data.categories.push(category);
    saveData(data);
  }
}

// Güncellenmiş updateCampaign: Her güncellemede discount değeri güncelleniyor.
// Eğer discount %15'in altına düşerse kampanyadan kaldırılıyor.
function updateCampaign(productId, discount) {
  const data = getData();
  const product = data.products.find(p => p.id == productId);
  if (product) {
    product.discount = discount;
    const campaignIndex = data.campaigns.findIndex(p => p.id == productId);
    if (discount >= 15) {
      if (campaignIndex === -1) {
        data.campaigns.push(product);
      } else {
        data.campaigns[campaignIndex] = product;
      }
    } else {
      if (campaignIndex !== -1) {
        data.campaigns.splice(campaignIndex, 1);
      }
    }
    saveData(data);
  }
}

function getNewProducts() {
  const data = getData();
  return data.products.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
}

function getCampaignProducts() {
  const data = getData();
  return data.campaigns;
}

function getProductById(id) {
  const data = getData();
  return data.products.find(p => p.id == id);
}
