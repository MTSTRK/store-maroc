/*
 * ============================================================
 *  Google Apps Script — استقبال الطلبات من الموقع
 * ============================================================
 *  Spreadsheet ID : 1i2G0NtqeqUdqDLNsgbmmLEk87ZvUsz55uxAr-BY63JM
 *  Sheet name     : PAGE001
 *
 *  خطوات النشر:
 *  1. شغّل testWrite() يدوياً أولاً (من القائمة Run) لمنح الصلاحيات
 *  2. Deploy > New deployment > Web app
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  3. انسخ الرابط إلى config.js → GOOGLE_SHEETS_WEBAPP_URL
 *  4. ⚠️ عند أي تعديل: Deploy > Manage deployments > تعديل > Version: New version > Deploy
 * ============================================================
 */

function doPost(e) {
  const sheet = SpreadsheetApp
    .openById("1i2G0NtqeqUdqDLNsgbmmLEk87ZvUsz55uxAr-BY63JM")
    .getSheetByName("PAGE001");

  const name = e.parameter.name || "";
  const phone = e.parameter.phone || "";
  const city = e.parameter.city || "";
  const product = e.parameter.product || "";
  const price = e.parameter.price || "";
  const notes = e.parameter.notes || "";

  sheet.appendRow([
    new Date(),
    name,
    phone,
    city,
    product,
    price,
    notes
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, message: "Web app is live" }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ================================================================
   testWrite — شغّلها يدوياً من Apps Script لاختبار الكتابة + منح الصلاحيات
   Run > testWrite
   ================================================================ */
function testWrite() {
  var sheet = SpreadsheetApp
    .openById("1i2G0NtqeqUdqDLNsgbmmLEk87ZvUsz55uxAr-BY63JM")
    .getSheetByName("PAGE001");
  sheet.appendRow([
    new Date(),
    "اسم تجريبي",
    "0600000000",
    "الدار البيضاء",
    "منتج تجريبي",
    "99 درهم",
    "ملاحظة تجريبية — هذا سطر اختبار"
  ]);
  console.log("✅ testWrite: تمت كتابة سطر تجريبي بنجاح في PAGE001");
}