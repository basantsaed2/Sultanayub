// import qz from "qz-tray";
// import { toast } from "react-toastify";

// // ===================================================================
// // 1. HashMap للطابعات
// // ===================================================================
// const PRINTER_CONFIG = {
//   cashier: {
//     printerName: "XP-58C",
//     type: "cashier",
//     printAll: true,
//     categories: [],
//     design: "full",
//   },
//   mainKitchen: {
//     printerName: "POS-80C (copy 1)",
//     type: "kitchen",
//     printAll: false,
//     categories: [126],
//     kitchenId: 5,
//     design: "kitchen",
//   },
// };

// // ===================================================================
// // 5. تصميم إيصال المطبخ
// // ===================================================================

// const formatKitchenReceipt = (receiptData, productsList = []) => {

//   console.log("receiptData", receiptData);
//   console.log("productsList", productsList);

//   if (!Array.isArray(productsList)) productsList = [];
//   const isArabic = localStorage.getItem("language") === "ar";
//   const currentOrderType = (receiptData.orderType || "").toLowerCase();

//   let orderTypeLabel = isArabic ? "تيك اواي" : "Takeaway";
//   let displayBigNumber = isArabic ? "تيك اواي" : "To Go";
//   let isDineIn = false;
//   let tableNumber = receiptData.table;

//   if (!tableNumber || tableNumber === "N/A" || tableNumber === "null")
//     tableNumber = "";

//   if (currentOrderType === "dine_in") {
//     orderTypeLabel = isArabic ? "صالة" : "Dine In";
//     displayBigNumber = tableNumber;
//     isDineIn = true;
//   } else if (currentOrderType === "delivery") {
//     orderTypeLabel = isArabic ? "توصيل" : "Delivery";
//     displayBigNumber = isArabic ? "توصيل" : "Delivery";
//   } else if (currentOrderType === "take_away") {
//     orderTypeLabel = isArabic ? "تيك أواي" : "Takeaway";
//     displayBigNumber = isArabic ? "تيك اواي" : "Takeaway";
//   }
//   const poweredByLine = `
//     <div style="text-align: center; font-weight: bold; font-size: 14px; margin: 15px 0 10px 0; padding: 8px 0; ">
//       Powered by Food2Go - food2go.online
//     </div>
//   `;
//   // ✅ إجمالي الأصناف (orderCount) لو موجود في الـ receiptData
//   const totalItems = receiptData.orderCount || 0;

//   return `
//     <html>
//       <head>
//         <style>
//           * { box-sizing: border-box; }
//           body, html { width: 100%; margin: 0; padding: 0; font-family: 'Tahoma', sans-serif; direction: ${isArabic ? "rtl" : "ltr"
//     }; }
//           .header-box { border: 3px solid #000; display: flex; margin-bottom: 10px; min-height: 140px; }
//           .box-left { width: 60%; border-${isArabic ? "left" : "right"
//     }: 3px solid #000; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 5px; }
//           .box-right { width: 40%; display: flex; flex-direction: column; justify-content: space-between; }
//           .row-label { 
//             border-bottom: 1px solid #000; 
//             padding: 8px; 
//             text-align: center; 
//             font-weight: bold; 
//             flex-grow: 1; 
//             display: flex; 
//             align-items: center; 
//             justify-content: center; 
//             font-size: 16px; 
//           }
//           .row-label:last-child { border-bottom: none; }

//           .big-number { font-size: ${isDineIn ? "40px" : "24px"
//     }; font-weight: 900; line-height: 1; margin-bottom: 5px; }

//           .title-strip { color: black; text-align: center; font-weight: bold; font-size: 12px; padding: 2px 0; margin-bottom: 5px; }

//           table { width: 100%; border-collapse: collapse; border: 2px solid #000; }
//           th { border: 2px solid #000; background: #ddd; padding: 5px; font-size: 10px; }
//           td { border: 2px solid #000; padding: 5px; font-weight: bold; font-size: 12px; vertical-align: middle; }
//           .qty-col { width: 15%; text-align: center; font-size: 12px; }
//           .item-col { text-align: ${isArabic ? "right" : "left"}; }

//           .footer-info { display: flex; justify-content: space-between; margin-top: 10px; font-size: 10px; font-weight: bold; }
//           .order-note-box { 
//             border: 2px solid #d00; 
//             background: #ffe6e6; 
//             padding: 8px; 
//             margin: 10px 0; 
//             text-align: center; 
//             font-weight: bold; 
//             font-size: 14px;
//             color: #d00;
//           }
//         </style>
//       </head>
//       <body>
//         <div class="header-box">
//           <div class="box-left">
//             <div class="big-number">${displayBigNumber}</div>
//           </div>
//           <div class="box-right">
//             <div class="row-label">${isArabic ? "رقم الفاتورة" : "Order #"} ${receiptData.invoiceNumber
//     }</div>
//             <div class="row-label">${receiptData.timeFormatted}<br>${receiptData.dateFormatted}</div>
//             <!-- ✅ إضافة إجمالي الأصناف -->
//             <div class="row-label">${isArabic ? "إجمالي الأصناف" : "Total Items"}: ${totalItems}</div>
//           </div>
//         </div>

//         ${receiptData.orderNote
//       ? `<div class="order-note-box">
//                  ${isArabic ? "📌 ملاحظة الطلب:" : "📌 Order Note:"} ${receiptData.orderNote
//       }
//                </div>`
//       : ""
//     }

//         <table>
//           <thead>
//             <tr>
//               <th>${isArabic ? "العدد" : "Qty"}</th>
//               <th>${isArabic ? "الصنف" : "Item"}</th>
//             </tr>
//           </thead>

//           <tbody>
// ${receiptData.items
//       .map((item) => {
//         let finalName = item.name;
//         if (isArabic && productsList.length > 0) {
//           const original = productsList.find((p) => p.id == item.id);
//           if (original)
//             finalName = original.name_ar || original.nameAr || item.name;
//         }

//         const safeName = (item) => {
//           if (!item) return "";
//           if (typeof item === "string") return item;
//           if (item.name) return item.name;
//           if (item.option) return item.option;
//           if (item.variation) return item.variation;
//           return String(item);
//         };

//         const addonsHTML = (item.addons || [])
//           .map((add) => {
//             const name = safeName(add);
//             const price = add.price ? ` (${Number(add.price).toFixed(2)})` : "";
//             return name ? `<div class="addon-row">+ ${name}${price}</div>` : "";
//           })
//           .filter(Boolean)
//           .join("");

//         const extrasHTML = (item.extras || [])
//           .map((extra) => {
//             const name = safeName(extra);
//             return name ? `<div class="addon-row">+ ${name}</div>` : "";
//           })
//           .filter(Boolean)
//           .join("");

//         const excludesHTML = (item.excludes || [])
//           .map((exc) => {
//             const name = safeName(exc);
//             return name
//               ? `<div class="addon-row" style="color:#d00;">- ${name}</div>`
//               : "";
//           })
//           .filter(Boolean)
//           .join("");



//         // في دالة formatKitchenReceipt، استبدل كل الـ variationsHTML block بالكود ده بالكامل:

//         const variationsHTML = (item.variations || item.variation_selected || [])
//           .map((group) => {
//             // لو مفيش group أو name، نتخطاه
//             if (!group || !group.name) return "";

//             // نستخرج أسماء الـ options الداخلية فقط (اللي هي الاختيارات الفعلية)
//             const optionsText = (group.options || [])
//               .map((opt) => opt.name || opt.option || String(opt)) // نأخذ الـ name أولاً
//               .filter(Boolean) // نتخلص من أي فارغ
//               .join(", ");

//             // لو مفيش options مختارة، نتخطاه
//             if (!optionsText) return "";

//             // نرجع النص النهائي: اسم الـ group + الـ options
//             return `• ${group.name}: ${optionsText}`;
//           })
//           .filter(Boolean) // نتخلص من أي فارغ
//           .map((text) => `<div style="font-size:10px;margin:2px 0;">${text}</div>`)
//           .join("");

//         const allModifiers = [addonsHTML, extrasHTML, excludesHTML, variationsHTML]
//           .filter(Boolean)
//           .join("");

//         return `
//   <tr>
//     <td class="qty-col" style="vertical-align: top;">${item.qty}</td>
//     <td class="item-col">
//       ${finalName}
//       ${item.notes
//             ? `<br><span style="font-size:10px;">(${item.notes})</span>`
//             : ""
//           }
//       ${allModifiers ? `<br>${allModifiers}` : ""}
//     </td>
//   </tr>`;
//       })
//       .join("")}
//           </tbody>
//         </table>

//         <div class="footer-info">
//           <span>User: ${receiptData.cashier || "System"}</span>
//           <span>Date: ${receiptData.dateFormatted}</span>
//         </div>
//         ${poweredByLine}
//       </body>
//     </html>
//     `;
// };

// // ===================================================================
// // 6. تصميم إيصال الباريستا
// // ===================================================================
// const formatBaristaReceipt = (receiptData) => {
//   return `
//     <html>
//       <head>
//         <style>
//           body, html { width: 58mm; margin: 0; padding: 5px; font-family: Arial, sans-serif; font-size: 10px; direction: rtl; }
//           .center { text-align: center; }
//           .line { border-top: 2px dashed black; margin: 5px 0; }
//           .bold { font-weight: bold; }
//           .item-row { padding: 8px 0; border-bottom: 1px dotted #000; }
//         </style>
//       </head>
//       <body>
//           <div class="center bold" style="font-size: 10px;">☕ بار المشروبات</div>
//           <div class="line"></div>
//           <div class="center">
//             <strong># ${receiptData.invoiceNumber}</strong><br>
//             ${receiptData.table ? "طاولة: " + receiptData.table : ""}
//           </div>
//           <div class="line"></div>

//           ${receiptData.items
//       .map((item) => {
//         const productName = item.nameAr || item.name_ar || item.name;
//         return `
//             <div class="item-row">
//               <div class="bold" style="font-size: 12px;">${productName}</div>
//               <div>العدد: <span class="bold" style="font-size: 12px;">${item.qty
//           }</span></div>
//               ${item.notes ? `<div>ملاحظة: ${item.notes}</div>` : ""}
//             </div>
//           `;
//       })
//       .join("")}
//       </body>
//     </html>
//     `;
// };

// // ===================================================================
// // 7. اختيار التصميم
// // ===================================================================
// const getReceiptHTML = (receiptData, designType) => {
//   // designType سيتم إرساله بناءً على اسم المطبخ
//   switch (designType) {
//     case "barista":
//       return formatBaristaReceipt(receiptData);
//     case "kitchen":
//     default:
//       return formatKitchenReceipt(receiptData);
//   }
// };

// // ===================================================================
// // 8. تهيئة البيانات
// // ===================================================================

// export const prepareReceiptData = (response) => {

//   console.log("receiptData", response);

//   const itemsSource =
//     response && response.success && response.success.length > 0
//       ? response.success
//       : orderItems;

//   const dateObj = response?.date ? new Date(response.date) : new Date();
//   const dateFormatted = dateObj.toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "2-digit",
//     year: "2-digit",
//   });
//   const timeFormatted = dateObj.toLocaleTimeString("en-US", {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   });

//   return {
//     invoiceNumber: response?.order_id || response?.order_number,
//     dateFormatted: dateFormatted,
//     timeFormatted: timeFormatted,
//     // orderType: finalOrderType,
//     items: itemsSource.map((item) => ({
//       qty: item.count,
//       name: item.name,
//       nameAr: item.name_ar || item.nameAr,
//       nameEn: item.name_en || item.nameEn,
//       notes: item.notes || "",
//       orderNote: response?.order_note || "", // ✅ إضافة ملاحظة الأوردر
//       category_id: item.category_id || item.product?.category_id,
//       id: item.id || item.product_id, // Important for kitchen mapping
//       // === الجديد هنا ===
//       addons: item.addons || [],
//       extras: item.extras || [], // زي Medium Crab
//       excludes: item.excludes || [],
//       variations: item.variations || [], // زي الحجم: كبير
//       // ====================
//     })),
//     customer: response?.customer || null,
//     preparationNum: response?.preparation_num || response?.preparation_number || null,
//     restaurantName: t("projectName"),
//   };
// };

// // ===================================================================
// // 9. دالة الطباعة
// // ===================================================================
// export const printReceiptSilently = async (
//   receiptData,
//   apiResponse,
//   callback
// ) => {
//   try {
//     if (!qz.websocket.isActive()) {
//       toast.error("❌ QZ Tray is not connected.");
//       callback();
//       return;
//     }
//     const printJobs = [];
//     // 2. المطبخ - مع الحفاظ على كل التفاصيل (addons, extras, variations, excludes)
//     const kitchens = apiResponse?.kitchen_items || [];
//     for (const kitchen of kitchens) {
//       if (
//         !kitchen.print_name ||
//         kitchen.print_status !== 1 ||
//         !kitchen.order?.length
//       )
//         continue;

//       console.log("Kitchen:", kitchen.name);
//       console.log("Raw kitchen.order:", kitchen.order);

//       // === التجميع حسب id + notes + selected variation options + addons + extras + excludes ===
//       const grouped = new Map();

//       const getModifierKey = (item) => {
//         // دالة بسيطة لـ addons/extras/excludes (arrays بسيطة أو objects)
//         const stringifySimple = (arr) => {
//           if (!Array.isArray(arr)) return "";
//           return arr
//             .map((o) => o.id || o.name || o.option || o.variation || String(o))
//             .filter(Boolean)
//             .sort()
//             .join(",");
//         };

//         const addons = stringifySimple(item.addons_selected || item.addons || []);
//         const extras = stringifySimple(item.extras || []);
//         const excludes = stringifySimple(item.excludes || []);

//         // المهم هنا: نستخرج الـ selected options الداخلية فقط (اللي بتميز الvariation)
//         const variationOptions = (item.variation_selected || item.variations || [])
//           .flatMap((group) => {
//             if (!group || !Array.isArray(group.options)) return [];
//             return group.options.map((opt) => opt.id || opt.name || "");
//           })
//           .filter(Boolean)
//           .sort()
//           .join(",");

//         return `${variationOptions}|${addons}|${extras}|${excludes}`;
//       };

//       kitchen.order.forEach((item) => {
//         const modifierKey = getModifierKey(item);
//         const baseKey = `${item.id || item.product_id || "unknown"}|${item.notes || "no-notes"}`;
//         const fullKey = `${baseKey}|${modifierKey}`;

//         if (!grouped.has(fullKey)) {
//           grouped.set(fullKey, {
//             ...item,       // نحتفظ بكل الdata الأصلية (بما فيها variation_selected كامل)
//             qty: 0,
//           });
//         }

//         const entry = grouped.get(fullKey);
//         entry.qty += Number(item.count || item.qty || 1);  // أضفنا item.qty كـ fallback
//       });

//       const kitchenItems = Array.from(grouped.values()).map((group) => {
//         const original = receiptData.items.find(
//           (o) => o.id == group.id || o.id == group.product_id
//         );

//         return {
//           qty: group.qty,
//           name: group.name || original?.name || "غير معروف",
//           notes: group.notes || original?.notes || "",
//           addons: group.addons_selected || original?.addons || [],
//           extras: group.extras || original?.extras || [],
//           excludes: group.excludes || original?.excludes || [],
//           variations: group.variation_selected || original?.variations || [],
//           id: group.id || group.product_id,
//         };
//       });

//       const kitchenReceiptData = {
//         ...receiptData,
//         items: kitchenItems,
//         orderCount: kitchen.order_count ?? kitchenItems.reduce((sum, item) => sum + item.qty, 0),
//       };

//       const kitchenHtml = getReceiptHTML(kitchenReceiptData, {
//         design: "kitchen",
//         type: "kitchen",
//       });

//       const config = qz.configs.create(kitchen.print_name);
//       printJobs.push(
//         qz.print(config, [{ type: "html", format: "plain", data: kitchenHtml }])
//       );
//     }

//     await Promise.all(printJobs);
//     toast.success("✅ تم الطباعة");
//     callback();
//   } catch (err) {
//     console.error(err);
//     toast.error("❌ فشل الطباعة");
//     callback();
//   }
// };

// export const addPrinterConfig = (key, config) => {
//   PRINTER_CONFIG[key] = config;
// };
// export const getActivePrinters = () => {
//   return Object.keys(PRINTER_CONFIG);
// };
// export const updatePrinterConfig = (key, updates) => {
//   if (PRINTER_CONFIG[key])
//     PRINTER_CONFIG[key] = { ...PRINTER_CONFIG[key], ...updates };
// };




import qz from "qz-tray";
import { toast } from "react-toastify";
import i18n from "i18next"; // للوصول للغة والاتجاه عالمياً داخل الدوال

// ===================================================================
// 1. تصاميم الإيصالات (Templates)
// ===================================================================
const getReceiptHTML = (preparedData, kitchenItem, t) => {
  const locale = i18n.language;
  const isRtl = locale === 'ar';

  return `
    <div class="receipt-only" dir="${isRtl ? 'rtl' : 'ltr'}">
      <style>
        @page { size: 80mm auto; margin: 0mm; }
        .receipt-only {
            width: 80mm; 
            font-family: sans-serif;
            color: #000;
            background: #fff;
            padding: 5px;
            font-size: 15px; 
        }
        .receipt-only * { box-sizing: border-box; }
        
        /* Brand Header */
        .receipt-only .brand-section { text-align: center; margin-bottom: 10px; }
        .receipt-only .brand-logo { max-height: 50px; width: auto; margin-bottom: 4px; filter: grayscale(1); }
        .receipt-only .brand-name { font-size: 14px; font-weight: bold; }

        /* Order Header */
        .receipt-only .header { text-align: center; margin-bottom: 7px; border: 2px solid #000; padding: 7px 0; }
        .receipt-only .header h1 { font-size: 35px; font-weight: bold; margin: 0; line-height: 1; }
        .receipt-only .header .order-type { font-size: 18px; font-weight: bold; text-transform: uppercase; margin-top: 5px; }
        
        /* Info Box */
        .receipt-only .info-box { 
          padding: 5px 0; 
          margin-bottom: 7px; 
          font-size: 16px;
          border-bottom: 2px solid #000;
        }
        .receipt-only .info-row { display: flex; justify-content: space-between; margin-bottom: 2px; }
        .receipt-only .info-label { font-weight: bold; }

        /* Table Design */
        .receipt-only table { width: 100%; border-collapse: collapse; margin-bottom: 7px; }
        .receipt-only th { border-bottom: 2px solid #000; padding: 8px 0; text-align: center; font-weight: bold; font-size: 18px; }
        .receipt-only td { border-bottom: 1px solid #ccc; padding: 12px 0; text-align: center; vertical-align: top; }
        
        .receipt-only .item-name-cell { text-align: ${isRtl ? 'right' : 'left'}; padding-${isRtl ? 'right' : 'left'}: 10px; }
        .receipt-only .main-item-name { font-size: 21px; font-weight: bold; display: block; line-height: 1.2; }

        .receipt-only .qty-box {
          font-size: 28px;
          font-weight: 900;
          border: 3px solid #000;
          display: inline-block;
          padding: 4px 12px;
          margin-top: 5px;
        }

        .receipt-only .item-variations { font-size: 15px; margin-top: 4px; font-weight: bold; color: #000; }
        .receipt-only .item-addon { font-size: 14px; margin-top: 2px; }
        .receipt-only .item-note { 
          font-size: 16px; margin-top: 6px; padding: 5px;
          background-color: #eee; border: 1px solid #000; font-weight: bold;
        }

        .receipt-only .order-notes-section { 
          margin-top: 10px; padding: 10px; border: 2px solid #000; font-size: 18px; text-align: center; font-weight: bold;
        }

        .receipt-only .footer { 
          text-align: center; font-size: 13px; margin-top: 15px; padding-top: 5px; border-top: 1px dashed #000; 
        }
      </style>

      <div class="brand-section">
        ${preparedData.logoLink ? `<img src="${preparedData.logoLink}" class="brand-logo" alt="logo" />` : ""}
        <div class="brand-name">${preparedData.restaurantName}</div>
      </div>

      <div class="header">
        <h1># ${preparedData.invoiceNumber}</h1>
        <div class="order-type">${preparedData.orderType}</div>
        ${preparedData.table ? `<div style="font-size: 24px; font-weight: bold; margin-top: 5px;">${t("Table")}: ${preparedData.table}</div>` : ''}
      </div>

      <div class="info-box">
        <div class="info-row">
          <span class="info-label">${t("Time")}:</span>
          <span dir="ltr">${preparedData.timeFormatted}</span>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width:25%;">${t("Qty")}</th>
            <th style="width:75%;" class="item-name-cell">${t("Item")}</th>
          </tr>
        </thead>
        <tbody>
          ${kitchenItem.items.map(item => `
            <tr>
              <td><span class="qty-box">${item.qty}</span></td>
              <td class="item-name-cell">
                <span class="main-item-name">${item.name}</span>
                ${item.variations.map(v => `<div class="item-variations">• ${v.name}: ${v.options.map(o => o.name).join(", ")}</div>`).join('')}
                ${item.addons.map(a => `<div class="item-addon">+ ${a.name}</div>`).join('')}
                ${item.notes ? `<div class="item-note">${t("Note")}: ${item.notes}</div>` : ''}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      ${preparedData.orderNote ? `
        <div class="order-notes-section">
          ${t("Notes")}:<br>${preparedData.orderNote}
        </div>
      ` : ''}

      <div class="footer">
        ${preparedData.timeFormatted} | ${kitchenItem.kitchenName}
        <div style="font-weight: bold; margin-top: 4px;">KITCHEN COPY</div>
      </div>
    </div>
  `;
};

// ===================================================================
// 2. تهيئة البيانات (Logic)
// ===================================================================
export const prepareReceiptData = (orderResponse, projectName, logo) => {
  const dateObj = new Date();

  const baseData = {
    restaurantName: projectName || "",
    logoLink: logo || "",
    invoiceNumber: orderResponse?.order_id || orderResponse?.order_number || orderResponse.cart_id || "-",
    timeFormatted: dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
    orderType: orderResponse?.order_type || "take_away",
    table: orderResponse?.table_name || orderResponse?.table || "",
    orderNote: orderResponse?.order_note || ""
  };

  const kitchenList = orderResponse?.kitchen?.kitchen_items || [];

  const processedKitchens = kitchenList.map((kitchen) => {
    const grouped = new Map();
    (kitchen.order || []).forEach((item) => {
      const varKey = (item.variation_selected || []).map(v => v.id).join("-");
      const addKey = (item.addons_selected || []).map(a => a.id).join("-");
      const fullKey = `${item.id}-${item.notes}-${varKey}-${addKey}`;

      if (!grouped.has(fullKey)) {
        grouped.set(fullKey, { ...item, totalCount: 0 });
      }
      grouped.get(fullKey).totalCount += Number(item.count || 1);
    });

    return {
      kitchenName: kitchen.name,
      printerName: kitchen.print_name,
      printStatus: kitchen.print_status,
      items: Array.from(grouped.values()).map(g => ({
        qty: g.totalCount,
        name: g.name,
        notes: (g.notes === "null" || !g.notes) ? "" : g.notes,
        addons: g.addons_selected || [],
        variations: g.variation_selected || []
      }))
    };
  });

  return { ...baseData, kitchens: processedKitchens };
};

// ===================================================================
// 3. دالة الطباعة والمعاينة
// ===================================================================
export const printReceiptSilently = async (preparedData, t, callback) => {
  try {
    const isQzActive = qz.websocket.isActive();

    for (const kitchenItem of preparedData.kitchens) {
      if (kitchenItem.items.length === 0 || kitchenItem.printStatus !== 1) continue;

      const htmlContent = getReceiptHTML(preparedData, kitchenItem, t);

      // if (!isQzActive) {
      //   // فتح المعاينة في المتصفح إذا لم يكن QZ Tray متاحاً
      //   const printWindow = window.open('', '_blank', 'width=600,height=800');
      //   printWindow.document.write('<html><head><title>Kitchen Receipt</title></head><body>' + htmlContent + '</body></html>');
      //   printWindow.document.close();
      //   printWindow.onload = () => {
      //     printWindow.print();
      //   };
      // }
      // else {
      // الطباعة التلقائية عبر QZ Tray
      const config = qz.configs.create(kitchenItem.printerName);
      await qz.print(config, [{ type: "html", format: "plain", data: htmlContent }]);
      // }
    }

    if (isQzActive) toast.success("✅ " + t("OrderSentToPrinter"));
    if (callback) callback();

  } catch (err) {
    console.error("Print Error:", err);
    toast.error("❌ " + t("PrintFailed"));
    if (callback) callback();
  }
};