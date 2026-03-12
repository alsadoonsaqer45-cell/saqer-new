// ============================================================
//  THALLAJATAK — Main App JavaScript
// ============================================================

// ===== DATA =====
const PRODUCTS = [
  {
    id: 'tees', name: 'التيس البلدي', img: 'goat.png',
    desc: 'تيس بلدي أصيل مغذى على العشب — لحم طري ذو نكهة غنية مميزة',
    pricePerKg: 85, badge: 'الأكثر طلباً', origin: '🌿 البلدي الأصيل',
    details: 'يُربى على المراعي الطبيعية — يُذبح يومياً ويُسلّم طازجاً'
  },
  {
    id: 'howar', name: 'الحوار', img: 'camel.png',
    desc: 'حوار أصيل من أجود الأصناف — لحم طري خفيف الدهون بنكهة مميزة',
    pricePerKg: 120, badge: 'نادر وفاخر', origin: '🐪 الإبل العربية',
    details: 'من أغلى أنواع اللحوم وأفضلها قيمة غذائية'
  },
  {
    id: 'naimi', name: 'النعيمي', img: 'sheep.png',
    desc: 'ضأن نعيمي أصيل بذيل دهني كبير — أفضل لحم للمندي والكبسة',
    pricePerKg: 70, badge: 'مناسب للمندي', origin: '🐑 النعيمي الأصيل',
    details: 'الأنسب للوجبات الكبيرة والمناسبات العائلية العريقة'
  },
  {
    id: 'chicken', name: 'الدجاج البلدي', img: 'chicken.png',
    desc: 'دجاج بلدي حر التربية — نكهة طبيعية لا تقارن بالمزارع',
    pricePerKg: 45, badge: 'طازج يومياً', origin: '🐓 دجاج بلدي',
    details: 'يُربى في الهواء الطلق — خالٍ من الهرمونات والمواد الحافظة'
  }
];

const CUT_TYPES = ['كامل غير مقطع','مقطع كباب','مقطع مرق','مفروم','ربع وأجزاء'];
const FAT_OPTIONS = ['مع الشحم الطبيعي','شحم خفيف','بدون شحم'];
const PACKAGE_PRICES = { 'أكياس عادية': 0, 'تغليف فاخر': 15, 'صناديق هدايا': 30 };
const DELIVERY_FEE = 25;

// ===== STATE =====
let cart = JSON.parse(localStorage.getItem('thallajatak_cart') || '[]');
let currentProduct = null;
let currentWeight = 1000;
let currentCut = CUT_TYPES[0];
let currentFat = FAT_OPTIONS[0];
let currentPackage = 'أكياس عادية';
let subMeats = [];
let currentSubPlan = null;
let currentSubPrice = 0;
let orders = JSON.parse(localStorage.getItem('thallajatak_orders') || '[]');

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCart();

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
  });
});

// ===== PRODUCTS =====
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  grid.innerHTML = PRODUCTS.map(p => `
    <div class="product-card" onclick="openOrderModal('${p.id}')">
      <div class="product-img-wrap">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <div class="product-badge">${p.badge}</div>
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-meta">
          <div class="product-price">${p.pricePerKg}<span> ريال/كج</span></div>
          <div class="product-origin">${p.origin}</div>
        </div>
        <button class="btn-order">اطلب الآن ←</button>
      </div>
    </div>
  `).join('');
}

// ===== ORDER MODAL =====
function openOrderModal(productId) {
  currentProduct = PRODUCTS.find(p => p.id === productId);
  if (!currentProduct) return;
  currentWeight = 1000;
  currentCut = CUT_TYPES[0];
  currentFat = FAT_OPTIONS[0];
  currentPackage = 'أكياس عادية';

  document.getElementById('modalImg').src = currentProduct.img;
  document.getElementById('modalName').textContent = currentProduct.name;
  document.getElementById('modalDesc').textContent = currentProduct.details;
  document.getElementById('modalPricePerKg').textContent = currentProduct.pricePerKg;

  // Reset active states
  document.querySelectorAll('#cutOptions .option-btn').forEach((b,i) => {
    b.classList.toggle('active', i === 0);
  });
  document.querySelectorAll('#fatOptions .option-btn').forEach((b,i) => {
    b.classList.toggle('active', i === 0);
  });

  updateWeightDisplay();
  updatePrice();
  document.getElementById('orderModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('orderModal').classList.remove('open');
  document.body.style.overflow = '';
}
function closeOrderModal(e) {
  if (e.target.id === 'orderModal') closeModal();
}

function changeWeight(delta) {
  currentWeight = Math.max(250, currentWeight + delta);
  updateWeightDisplay();
  updatePrice();
}
function setWeight(w) {
  currentWeight = w;
  updateWeightDisplay();
  updatePrice();
}
function updateWeightDisplay() {
  const el = document.getElementById('weightDisplay');
  if (el) el.textContent = currentWeight >= 1000
    ? (currentWeight / 1000).toFixed(currentWeight % 1000 === 0 ? 0 : 1) + ' كج'
    : currentWeight + ' جم';
}

function selectCut(btn, val) {
  currentCut = val;
  btn.closest('.options-grid').querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  updatePrice();
}
function selectFat(btn, val) {
  currentFat = val;
  btn.closest('.options-grid').querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  updatePrice();
}
function selectPackage(btn, val) {
  currentPackage = val;
  btn.closest('.options-grid').querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  updatePrice();
}

function updatePrice() {
  if (!currentProduct) return;
  const meatCost = Math.round((currentProduct.pricePerKg / 1000) * currentWeight);
  const pkgCost = PACKAGE_PRICES[currentPackage] || 0;
  const total = meatCost + pkgCost + DELIVERY_FEE;

  const meatEl = document.getElementById('meatPrice');
  const pkgEl = document.getElementById('packagePrice');
  const totalEl = document.getElementById('totalPrice');
  if (meatEl) meatEl.textContent = meatCost + ' ريال';
  if (pkgEl) pkgEl.textContent = pkgCost ? pkgCost + ' ريال' : 'مجاني';
  if (totalEl) totalEl.textContent = total + ' ريال';
}

function addToCart() {
  if (!currentProduct) return;
  const meatCost = Math.round((currentProduct.pricePerKg / 1000) * currentWeight);
  const pkgCost = PACKAGE_PRICES[currentPackage] || 0;
  const total = meatCost + pkgCost + DELIVERY_FEE;
  const notes = document.getElementById('orderNotes')?.value || '';

  const item = {
    id: Date.now(),
    productId: currentProduct.id,
    name: currentProduct.name,
    img: currentProduct.img,
    weight: currentWeight,
    cut: currentCut,
    fat: currentFat,
    package: currentPackage,
    notes,
    meatCost,
    pkgCost,
    total
  };
  cart.push(item);
  localStorage.setItem('thallajatak_cart', JSON.stringify(cart));
  closeModal();
  updateCart();
  showCartAdded(currentProduct.name);
}

function showCartAdded(name) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed;bottom:30px;right:30px;z-index:9999;
    background:linear-gradient(135deg,#27AE60,#2ecc71);color:white;
    padding:14px 22px;border-radius:12px;font-family:Tajawal,sans-serif;
    font-size:15px;font-weight:700;box-shadow:0 6px 24px rgba(39,174,96,0.4);
    animation:slideInRight 0.4s ease;
  `;
  toast.innerHTML = `✅ تم إضافة ${name} للسلة`;
  document.head.insertAdjacentHTML('beforeend', `<style>@keyframes slideInRight{from{transform:translateX(100%);opacity:0}to{transform:translate(0);opacity:1}}</style>`);
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ===== CART =====
function updateCart() {
  const count = cart.length;
  const cartCountEl = document.getElementById('cartCount');
  if (cartCountEl) cartCountEl.textContent = count;

  const cartItems = document.getElementById('cartItems');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartFooter = document.getElementById('cartFooter');
  const cartTotal = document.getElementById('cartTotal');

  if (!cartItems) return;

  if (count === 0) {
    cartItems.innerHTML = '';
    if (cartEmpty) cartEmpty.style.display = 'block';
    if (cartFooter) cartFooter.style.display = 'none';
    return;
  }

  if (cartEmpty) cartEmpty.style.display = 'none';
  if (cartFooter) cartFooter.style.display = 'block';

  const totalAll = cart.reduce((s, i) => s + i.total, 0);
  if (cartTotal) cartTotal.textContent = totalAll + ' ريال';

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.img}" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-detail">${item.weight >= 1000 ? (item.weight/1000).toFixed(1)+' كج' : item.weight+' جم'} | ${item.cut}</div>
        <div class="cart-item-price">${item.total} ريال</div>
      </div>
      <button class="cart-item-del" onclick="removeFromCart(${item.id})">🗑</button>
    </div>
  `).join('');
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  localStorage.setItem('thallajatak_cart', JSON.stringify(cart));
  updateCart();
}

function toggleCart() {
  const panel = document.getElementById('cartPanel');
  const overlay = document.getElementById('cartOverlay');
  if (!panel) return;
  const isOpen = panel.classList.contains('open');
  panel.classList.toggle('open', !isOpen);
  overlay.classList.toggle('open', !isOpen);
  document.body.style.overflow = isOpen ? '' : 'hidden';
}

// ===== CHECKOUT =====
function openCheckout() {
  toggleCart();
  updateCheckoutSummary();
  document.getElementById('checkoutModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCheckout() {
  document.getElementById('checkoutModal').classList.remove('open');
  document.body.style.overflow = '';
}
function closeCheckoutModal(e) {
  if (e.target.id === 'checkoutModal') closeCheckout();
}

function updateCheckoutSummary() {
  const box = document.getElementById('checkoutSummary');
  if (!box || cart.length === 0) return;
  const total = cart.reduce((s, i) => s + i.total, 0);
  box.innerHTML = `
    <div style="font-weight:700;font-size:15px;margin-bottom:10px;color:#C0392B;">ملخص طلبك</div>
    ${cart.map(i => `
      <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;color:#555">
        <span>${i.name} (${i.weight >= 1000 ? (i.weight/1000).toFixed(1)+' كج' : i.weight+' جم'})</span>
        <span style="font-weight:700">${i.total} ريال</span>
      </div>
    `).join('')}
    <div style="border-top:1px dashed #ddd;margin-top:12px;padding-top:10px;display:flex;justify-content:space-between;font-weight:900;font-size:16px">
      <span>الإجمالي</span><span style="color:#C0392B">${total} ريال</span>
    </div>
  `;
}

function formatCard(input) {
  let v = input.value.replace(/\D/g,'').substring(0,16);
  input.value = v.replace(/(.{4})/g,'$1 ').trim();
}
function formatExp(input) {
  let v = input.value.replace(/\D/g,'').substring(0,4);
  if (v.length >= 2) v = v.substring(0,2) + '/' + v.substring(2);
  input.value = v;
}

function processPayment() {
  const name = document.getElementById('cName')?.value?.trim();
  const phone = document.getElementById('cPhone')?.value?.trim();
  const address = document.getElementById('cAddress')?.value?.trim();
  const card = document.getElementById('cardNum')?.value?.trim();
  const exp = document.getElementById('cardExp')?.value?.trim();
  const cvv = document.getElementById('cardCvv')?.value?.trim();

  if (!name || !phone || !address) return showError('يرجى تعبئة الاسم والجوال والعنوان');
  if (!card || card.replace(/\s/g,'').length < 16) return showError('يرجى إدخال رقم البطاقة كاملاً');
  if (!exp) return showError('يرجى إدخال تاريخ انتهاء البطاقة');
  if (!cvv || cvv.length < 3) return showError('يرجى إدخال رمز CVV');

  const btn = document.getElementById('payBtn');
  const btnText = document.getElementById('payBtnText');
  if (btn) { btn.disabled = true; }
  if (btnText) btnText.textContent = '⏳ جاري معالجة الدفع...';

  const total = cart.reduce((s, i) => s + i.total, 0);
  const time = document.getElementById('cTime')?.value;
  const orderNum = 'TH-' + Date.now().toString().slice(-6);

  setTimeout(() => {
    const order = {
      id: orderNum, date: new Date().toISOString(),
      customer: { name, phone, address },
      items: [...cart], total, deliveryTime: time,
      status: 'قيد التجهيز', paymentStatus: 'مدفوع',
      paymentMethod: 'بطاقة بنكية'
    };
    orders.push(order);
    localStorage.setItem('thallajatak_orders', JSON.stringify(orders));
    cart = [];
    localStorage.setItem('thallajatak_cart', JSON.stringify(cart));
    updateCart();
    closeCheckout();
    showSuccessOrder(order);
    if (btn) { btn.disabled = false; }
    if (btnText) btnText.textContent = 'ادفع الآن وتأكيد الطلب';
  }, 2200);
}

function showError(msg) {
  const toast = document.createElement('div');
  toast.style.cssText = `position:fixed;bottom:30px;right:30px;z-index:9999;background:#C0392B;color:white;padding:14px 22px;border-radius:12px;font-family:Tajawal,sans-serif;font-size:15px;font-weight:700;box-shadow:0 6px 24px rgba(192,57,43,0.4);`;
  toast.textContent = '⚠️ ' + msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function showSuccessOrder(order) {
  document.getElementById('successTitle').textContent = 'تم الطلب بنجاح! ✅';
  document.getElementById('successMsg').textContent = 'طلبك قيد التجهيز. سيتواصل معك مندوبنا قريباً على رقم ' + order.customer.phone;
  const invoiceBox = document.getElementById('invoiceBox');
  invoiceBox.innerHTML = `
    <div style="display:flex;justify-content:space-between;margin-bottom:8px">
      <strong>رقم الطلب:</strong><span style="color:#C0392B;font-weight:800">${order.id}</span>
    </div>
    <div style="display:flex;justify-content:space-between;margin-bottom:8px">
      <strong>الاسم:</strong><span>${order.customer.name}</span>
    </div>
    <div style="display:flex;justify-content:space-between;margin-bottom:8px">
      <strong>الجوال:</strong><span>${order.customer.phone}</span>
    </div>
    <div style="display:flex;justify-content:space-between;margin-bottom:8px">
      <strong>التوصيل:</strong><span>${order.deliveryTime}</span>
    </div>
    <div style="display:flex;justify-content:space-between;border-top:1px dashed #ccc;padding-top:10px;margin-top:8px">
      <strong>المبلغ الكلي:</strong><span style="color:#C0392B;font-weight:900;font-size:18px">${order.total} ريال</span>
    </div>
  `;
  document.getElementById('successModal').classList.add('open');
}
function closeSuccess() {
  document.getElementById('successModal').classList.remove('open');
  document.body.style.overflow = '';
}

// ===== SUBSCRIPTION =====
function openSubscriptionForm(planName, price) {
  currentSubPlan = planName;
  currentSubPrice = price;
  document.getElementById('subPlanName').textContent = planName;
  document.getElementById('subPrice').textContent = price + ' ريال';
  document.getElementById('subModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeSubModal(e) {
  if (!e || e.target?.id === 'subModal' || !e.target) {
    document.getElementById('subModal').classList.remove('open');
    document.body.style.overflow = '';
  }
}
function toggleSubMeat(btn, meat) {
  btn.classList.toggle('active');
  if (btn.classList.contains('active')) {
    if (!subMeats.includes(meat)) subMeats.push(meat);
  } else {
    subMeats = subMeats.filter(m => m !== meat);
  }
}

function processSubscription() {
  const name = document.getElementById('subName')?.value?.trim();
  const phone = document.getElementById('subPhone')?.value?.trim();
  const card = document.getElementById('subCardNum')?.value?.trim();
  if (!name || !phone) return showError('يرجى تعبئة الاسم والجوال');
  if (!card || card.replace(/\s/g,'').length < 16) return showError('يرجى إدخال رقم البطاقة');

  setTimeout(() => {
    const subNum = 'SUB-' + Date.now().toString().slice(-5);
    const subs = JSON.parse(localStorage.getItem('thallajatak_subscriptions') || '[]');
    subs.push({
      id: subNum, plan: currentSubPlan, price: currentSubPrice,
      customer: { name, phone }, meats: subMeats,
      date: new Date().toISOString(), status: 'نشط'
    });
    localStorage.setItem('thallajatak_subscriptions', JSON.stringify(subs));
    closeSubModal();
    document.getElementById('successTitle').textContent = 'تم الاشتراك بنجاح! 🎉';
    document.getElementById('successMsg').textContent = `مرحباً ${name}! اشتراكك في خطة "${currentSubPlan}" فعّال من الآن.`;
    document.getElementById('invoiceBox').innerHTML = `
      <div style="display:flex;justify-content:space-between;margin-bottom:8px"><strong>رقم الاشتراك:</strong><span style="color:#C0392B;font-weight:800">${subNum}</span></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:8px"><strong>الخطة:</strong><span>${currentSubPlan}</span></div>
      <div style="display:flex;justify-content:space-between"><strong>الرسوم الشهرية:</strong><span style="color:#C0392B;font-weight:900">${currentSubPrice} ريال</span></div>
    `;
    document.getElementById('successModal').classList.add('open');
  }, 1500);
}

// ===== AI CHATBOT =====
const AI_RESPONSES = {
  greet: ['مرحباً! كيف أقدر أساعدك؟ 😊', 'أهلاً وسهلاً! أنا جزارك الذكي، بخدمتك 🤖'],
  guests: (n) => `لـ ${n} ضيف، توصيتي:\n• إذا وجبة رئيسية: احتاج ${Math.ceil(n * 0.35)} كج لحم (٣٥٠ جم/شخص)\n• إذا مناسبة كبيرة: ${Math.ceil(n * 0.45)} كج (٤٥٠ جم/شخص)\nالنعيمي أو التيس هو الأنسب للتجمعات العائلية 🐑`,
  mandi: '🍖 وصفة المندي تحتاج:\n• النعيمي هو الأنسب — نكهة غنية ودهن مدمج\n• اطلب "مقطع مرق" بدون عظم للمندي\n• ٤٠٠-٤٥٠ جم/شخص\n\nهل تريد أطلب لك النعيمي مباشرة؟',
  kabsa: '🍛 للكبسة الملكية:\n• النعيمي أو التيس — كلاهما رائع\n• اطلب "مقطع كباب" أو "ربع وأجزاء"\n• ٣٠٠-٣٥٠ جم/شخص',
  diff: '🐐 التيس البلدي: لحم طري بنكهة قوية، أغلى قليلاً، الأنسب للمشاوي والمرق\n🐑 النعيمي: دهن طبيعي كثير، نكهة فريدة، الملك في المندي والكبسة\n\nكلاهما بلدي ١٠٠٪ ولحم ممتاز 💪',
  chicken: '🐓 الدجاج البلدي عندنا:\n• تربية حرة — لا هرمونات\n• نكهة طبيعية لا تقارن بدجاج المزارع\n• الأنسب للمشاوي والمقالي والحساء\n• ٤٥ ريال/كج فقط!',
  camel: '🐪 الحوار لحم نادر وفاخر:\n• قيمة غذائية عالية جداً\n• خفيف الدهون مقارنة باللحوم الأخرى\n• نكهة مميزة فريدة\n• ١٢٠ ريال/كج\n\nأنسب للمناسبات الخاصة والضيافة الفاخرة!',
  price: '💰 أسعارنا اليوم:\n• 🐐 التيس البلدي: ٨٥ ريال/كج\n• 🐪 الحوار: ١٢٠ ريال/كج\n• 🐑 النعيمي: ٧٠ ريال/كج\n• 🐓 الدجاج البلدي: ٤٥ ريال/كج\n\nالتوصيل ٢٥ ريال لأي طلب',
  delivery: '🚚 التوصيل:\n• في نفس اليوم إذا الطلب قبل الساعة ٢ ظهراً\n• من ٤ عصراً حتى ١١ مساءً\n• رسوم التوصيل ٢٥ ريال فقط\n• مجاني مع اشتراكات الشهرية',
  sub: '📅 اشتراكاتنا الشهرية:\n• الأساسي: ٢٩٩ ريال — ٨ كج/شهر\n• العائلي: ٥٤٩ ريال — ١٦ كج/شهر ⭐\n• الضيافة: ٩٩٩ ريال — ٣٢ كج/شهر\n\nكل الاشتراكات تشمل توصيل مجاني وتخفيض خاص!',
  halal: '✅ نعم، جميع ذبائحنا حلال ١٠٠٪\n• ذبح شرعي يومي بإشراف مباشر\n• لا مواد حافظة\n• شهادات صحية معتمدة\n\nثلاجتك ما تخلى من الحلال الطازج 😊',
  default: [
    'سؤال ممتاز! 😊 قدر أساعدك بالتفصيل إذا أخبرتني بعدد الضيوف أو نوع الوجبة.',
    'أهلاً! اخبرني بما تريد وأنا أرشح لك الأنسب.',
    'بإمكاني مساعدتك في اختيار الصنف والكمية — فقط أخبرني بالتفاصيل.',
  ]
};

function getBotReply(msg) {
  const m = msg.toLowerCase().trim();
  if (m.match(/مرحب|أهلاً|سلام|هلا/)) return AI_RESPONSES.greet[Math.floor(Math.random()*2)];
  if (m.match(/مندي/)) return AI_RESPONSES.mandi;
  if (m.match(/كبسة/)) return AI_RESPONSES.kabsa;
  if (m.match(/فرق|مقارن|الأفضل|أيش.*تيس.*نعيمي|تيس.*نعيمي/)) return AI_RESPONSES.diff;
  if (m.match(/دجاج/)) return AI_RESPONSES.chicken;
  if (m.match(/حوار|جمل|إبل/)) return AI_RESPONSES.camel;
  if (m.match(/سعر|كم.*ريال|غلاء|رخيص/)) return AI_RESPONSES.price;
  if (m.match(/توصيل|يوصل|وقت|متى/)) return AI_RESPONSES.delivery;
  if (m.match(/اشتراك/)) return AI_RESPONSES.sub;
  if (m.match(/حلال|ذبح|شرعي/)) return AI_RESPONSES.halal;

  // Guest count detection
  const guestMatch = m.match(/(\d+)\s*(ضيف|أشخاص|شخص|نفر)/);
  if (guestMatch) return AI_RESPONSES.guests(guestMatch[1]);

  // Kilo/weight request
  if (m.match(/كم.*كيلو|كيلو.*كم|وزن/)) {
    const numMatch = m.match(/(\d+)/);
    if (numMatch) return AI_RESPONSES.guests(numMatch[1]);
  }

  return AI_RESPONSES.default[Math.floor(Math.random()*AI_RESPONSES.default.length)];
}

function sendChat() {
  const input = document.getElementById('chatInput');
  const msg = input?.value?.trim();
  if (!msg) return;
  input.value = '';
  appendChatMsg(msg, 'user');
  showTyping();
  const delay = 800 + Math.random() * 600;
  setTimeout(() => {
    removeTyping();
    appendChatMsg(getBotReply(msg), 'bot');
  }, delay);
}

function sendQuick(msg) {
  const input = document.getElementById('chatInput');
  if (input) input.value = msg;
  sendChat();
}

function handleChatKey(e) {
  if (e.key === 'Enter') sendChat();
}

function appendChatMsg(text, type) {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  const div = document.createElement('div');
  div.className = `chat-msg ${type}`;
  div.innerHTML = type === 'bot'
    ? `<div class="bot-avatar">🤖</div><div class="msg-content">${text.replace(/\n/g,'<br>')}</div>`
    : `<div class="msg-content">${text}</div><div class="user-avatar">👤</div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function showTyping() {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  const div = document.createElement('div');
  div.className = 'chat-msg bot'; div.id = 'typingIndicator';
  div.innerHTML = `<div class="bot-avatar">🤖</div><div class="msg-content"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}
function removeTyping() {
  const el = document.getElementById('typingIndicator');
  el?.remove();
}

function openChat() {
  const section = document.getElementById('ai-butcher');
  section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => document.getElementById('chatInput')?.focus(), 600);
}

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}
