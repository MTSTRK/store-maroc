/*
 * ============================================================
 *  اختبار يدوي — انسخ هذا الكود والصقه في Console المتصفح
 *  (F12 > Console) أثناء فتح الموقع
 * ============================================================
 */

// ---- اختبار 1: هل الرابط موجود في الكونفيج؟ ----
console.log("=== TEST 1: Config URL ===");
console.log("URL:", CONFIG.GOOGLE_SHEETS_WEBAPP_URL);

// ---- اختبار 2: إرسال طلب تجريبي عبر POST (مثل الموقع) ----
console.log("=== TEST 2: POST via URLSearchParams (no-cors) ===");

var testData = {
  name: "اختبار من المتصفح",
  phone: "0600000000",
  city: "الدار البيضاء",
  product: "منتج تجريبي",
  price: "99 درهم",
  notes: "هذا طلب تجريبي من Console"
};

var params = new URLSearchParams();
Object.keys(testData).forEach(function(k) { params.append(k, testData[k]); });

fetch(CONFIG.GOOGLE_SHEETS_WEBAPP_URL, {
  method: "POST",
  mode: "no-cors",
  body: params
})
.then(function(res) {
  console.log("✅ POST sent! Response type:", res.type, "| status:", res.status);
  console.log("⚠️ مع no-cors، الرد يكون opaque (status 0) — هذا طبيعي");
  console.log("👉 افتح Google Sheet وتأكد أن السطر التجريبي ظهر");
})
.catch(function(err) {
  console.error("❌ POST failed:", err);
});

// ---- اختبار 3: افتح هذا الرابط في تبويب جديد للتأكد أن Web App يعمل ----
console.log("=== TEST 3: افتح هذا الرابط في تبويب جديد ===");
console.log(CONFIG.GOOGLE_SHEETS_WEBAPP_URL);
