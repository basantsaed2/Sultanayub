import React, { useEffect, useState } from "react";
import { useGet } from "../../../../../Hooks/useGet";
import { useParams } from "react-router-dom";
import { LoaderLogin } from "../../../../../Components/Components";
import { useTranslation } from "react-i18next";
import { FaPrint, FaArrowLeft } from "react-icons/fa";

// ===================================================================
// Helper: Clean Logo URL
// ===================================================================
const cleanLogoUrl = (url) => {
  if (!url) return "";
  try {
    const clean = url.replace(/(https?:\/\/[^\/]+)?\/storage\/+/g, (match, p1) => {
      return p1 ? p1 + "/storage/" : "/storage/";
    });
    return clean;
  } catch (e) {
    return url;
  }
};

// ===================================================================
// RECEIPT FORMATTING FUNCTION
// ===================================================================
const formatCashierReceipt = (receiptData, t, isRtl) => {
  const phones = [receiptData.customerPhone, receiptData.customerPhone2]
    .filter(Boolean)
    .join(" / ");

  const logoUrl = cleanLogoUrl(receiptData.logoLink);

  // NOTE: We wrap everything in "receipt-only" class
  return `
    <div class="receipt-only" dir="${isRtl ? 'rtl' : 'ltr'}">
      
      <style>
        /* 1. Global Print Settings (These don't affect screen) */
        @page { 
            size: 80mm auto; 
            margin: 0mm; 
        }

        /* 2. Scoped Styles - Only affect elements inside .receipt-only */
        
        .receipt-only {
            width: 80mm; 
            font-family: sans-serif;
            color: #000;
            background: #fff;
            padding: 5px;
            /* No Zoom - Text size is "as it is" */
        }

        /* Reset box sizing just for receipt */
        .receipt-only * { 
            box-sizing: border-box; 
        }
        
        /* Headers */
        .receipt-only .header { text-align: center; margin-bottom: 5px; border-bottom: 1px dashed #000; padding-bottom: 5px;}
        .receipt-only .header h1 { font-size: 18px; font-weight: bold; margin: 0; }
        .receipt-only .header p { font-size: 14px; margin: 2px 0 0 0; }
        .receipt-only .header img { max-width: 150px; max-height: 80px; height: auto; width: auto; margin: 0 auto; display: block; }
        
        /* Info Box */
        .receipt-only .info-box { 
          padding: 5px 0; 
          margin-bottom: 5px; 
          font-size: 12px;
          border-bottom: 1px dashed #000;
        }
        .receipt-only .info-row { display: flex; justify-content: space-between; margin-bottom: 2px; }
        .receipt-only .info-label { font-weight: bold; }
        
        /* Address Section */
        .receipt-only .address-notes-section { margin-bottom: 5px; font-size: 12px; border-bottom: 1px dashed #000; padding-bottom: 5px;}
        .receipt-only .section-title { font-weight: bold; text-decoration: underline; margin-bottom: 2px; display: block; }
        
        /* Tables - SCOPED to avoid affecting main page tables */
        .receipt-only table { 
          width: 100%; 
          font-size: 12px; 
          border-collapse: collapse; 
          margin-bottom: 5px;
        }
        .receipt-only th { 
          border: none !important; 
          border-bottom: 1px solid #000 !important; 
          padding: 4px 0; 
          text-align: center; 
          font-weight: bold; 
          background: transparent; /* Reset any global backgrounds */
        }
        .receipt-only td { 
          border: none; 
          padding: 4px 0; 
          text-align: center; 
        }
        
        .receipt-only .item-name { 
          text-align: ${isRtl ? 'right' : 'left'}; 
          direction: ${isRtl ? 'rtl' : 'ltr'}; 
        }
        .receipt-only .item-variations { font-size: 11px; margin-top: 1px; color: #333; }
        .receipt-only .item-note { font-size: 11px; margin-top: 1px; font-style: italic; }
        .receipt-only .item-block-last td { border-bottom: 1px solid #ccc; }

        /* Totals */
        .receipt-only .totals-section { 
          text-align: ${isRtl ? 'left' : 'right'}; 
          font-size: 12px; 
          margin: 5px 0 0 0; 
        }
        .receipt-only .total-row { margin-bottom: 2px; display: flex; justify-content: space-between; }
        
        .receipt-only .grand-total { 
          font-size: 16px; 
          font-weight: bold; 
          border-top: 2px solid #000; 
          padding-top: 4px; 
          margin-top: 4px; 
          margin-bottom: 0px; 
        }
        
        /* Footer */
        .receipt-only .footer { 
          text-align: center; 
          font-size: 12px; 
          font-weight: bold; 
          margin-top: 5px; 
          padding-top: 5px;
          border-top: 1px dashed #000; 
        }
      </style>

      <div class="header">
        ${logoUrl 
          ? `<img src="${logoUrl}" alt="Restaurant Logo" />`
          : ``
        }
        <h1>${receiptData.restaurantName}</h1>
        ${receiptData.branchName ? `<p>${receiptData.branchName}</p>` : ''}
      </div>

      <div class="info-box">
        <div class="info-row"><span class="info-label">${t("InvoiceNumber")}:</span><span>${receiptData.invoiceNumber}</span></div>
        <div class="info-row"><span class="info-label">${t("Date")}:</span><span dir="ltr">${receiptData.date}</span></div>
        <div class="info-row"><span class="info-label">${t("Time")}:</span><span dir="ltr">${receiptData.orderTime || ''}</span></div>
        <div class="info-row"><span class="info-label">${t("Client")}:</span><span>${receiptData.customerName}</span></div>
        ${phones ? `<div class="info-row"><span class="info-label">${t("Phone")}:</span><span dir="ltr">${phones}</span></div>` : ''}
        ${(receiptData.orderType === t("Delivery") || receiptData.orderType === "Delivery") && receiptData.deliveryMan ? 
          `<div class="info-row"><span class="info-label">${t("DeliveryMan")}:</span><span>${receiptData.deliveryMan}</span></div>` : ''}
        <div class="info-row"><span class="info-label">${t("OrderType")}:</span><span>${receiptData.orderType}</span></div>
        <div class="info-row"><span class="info-label">${t("Payment")}:</span><span>${receiptData.payment}</span></div>
      </div>

      <div class="address-notes-section">
        ${(receiptData.orderType === t("Delivery") || receiptData.orderType === "Delivery") && receiptData.customerAddress ? 
          `<div style="margin-bottom:5px"><span class="section-title">${t("DeliveryAddress")}:</span><div>${receiptData.customerAddress}</div></div>` : ''}
        ${receiptData.orderNotes ? 
          `<div><span class="section-title">${t("Notes")}:</span><div>${receiptData.orderNotes}</div></div>` : ''}
      </div>

      <table>
        <thead>
          <tr style="font-weight:bold;font-size:14px;">
            <th style="width:40%;text-align:left">${t("Item")}</th>
            <th style="width:15%">${t("Qty")}</th>
            <th style="width:20%">${t("Price")}</th>
            <th style="width:25%">${t("Total")}</th>
          </tr>
        </thead>
        <tbody>
          ${receiptData.items.map(item => {
            const hasAddons = item.addons && item.addons.length > 0;
            const hasExtras = item.extras && item.extras.length > 0;
            const showTotalOnMainRow = !hasAddons && !hasExtras;

            let rows = '';

            const isMainLast = !hasAddons && !hasExtras;
            rows += `<tr ${isMainLast ? 'class="item-block-last"' : ''}>
              <td class="item-name" style="font-size:14px;font-weight:600;">
                ${item.name}
                ${item.variationString ? `<div class="item-variations">${item.variationString}</div>` : ''}
                ${item.notesString ? `<div class="item-note">${t("Note")}: ${item.notesString}</div>` : ''}
              </td>
              <td>${item.qty}</td>
              <td>${Number(item.price).toFixed(2)}</td>
              <td style="font-size:14px;font-weight:600;">${showTotalOnMainRow ? Number(item.total).toFixed(2) : ''}</td>
            </tr>`;

            if (hasAddons) {
              item.addons.forEach((addon, i) => {
                const isLast = i === item.addons.length - 1 && !hasExtras;
                rows += `<tr ${isLast ? 'class="item-block-last"' : ''}>
                  <td class="item-name" style="font-size:11px; ${isRtl ? 'padding-right:15px' : 'padding-left:15px'};">+ ${addon.name}</td>
                  <td>${addon.count > 1 ? addon.count : ''}</td>
                  <td>${Number(addon.price).toFixed(2)}</td>
                  <td>${isLast ? Number(item.total).toFixed(2) : ''}</td>
                </tr>`;
              });
            }

            if (hasExtras) {
              item.extras.forEach((extra, i) => {
                const isLast = i === item.extras.length - 1;
                rows += `<tr ${isLast ? 'class="item-block-last"' : ''}>
                  <td class="item-name" style="font-size:11px; ${isRtl ? 'padding-right:15px' : 'padding-left:15px'};">+ ${extra.name}</td>
                  <td></td>
                  <td>${Number(extra.price).toFixed(2)}</td>
                  <td>${isLast ? Number(item.total).toFixed(2) : ''}</td>
                </tr>`;
              });
            }

            return rows;
          }).join('')}
        </tbody>
      </table>

      <div class="totals-section">
        <div class="total-row"><span>${t("TotalProductPrice")}</span><span>${Number(receiptData.subtotal).toFixed(2)}</span></div>
        <div class="total-row"><span>${t("Tax")} %:</span><span>${Number(receiptData.tax).toFixed(2)}</span></div>
        ${receiptData.delivery > 0 ? `<div class="total-row"><span>${t("DeliveryFee")}</span><span>${Number(receiptData.delivery).toFixed(2)}</span></div>` : ''}
        ${receiptData.discount > 0 ? `<div class="total-row"><span>${t("Discount")}</span><span>-${Number(receiptData.discount).toFixed(2)}</span></div>` : ''}
        <div class="total-row grand-total"><span>${t("GrandTotal")}</span><span>${Number(receiptData.total).toFixed(2)}</span></div>
      </div>

      <div class="footer">
        ${t("ThankYouForYourOrder")}
        <div style="font-size:10px;margin-top:2px;">Powered by Food2Go</div>
        <div style="font-size:10px;">food2go.online</div>
      </div>
    </div>
  `;
};

// ===================================================================
// MAIN COMPONENT
// ===================================================================
const InvoiceOrderPage = () => {
  const { orderId } = useParams();
  const { t, i18n } = useTranslation();

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const userRole = localStorage.getItem("role") || "admin";
  const locale = i18n.language;
  const isRtl = locale === 'ar';

  const apiEndpoint =
    userRole === "branch"
      ? `${apiUrl}/branch/online_order/invoice/${orderId}?locale=${locale}`
      : `${apiUrl}/admin/order/invoice/${orderId}?locale=${locale}`;

  const { refetch, loading, data } = useGet({ url: `${apiUrl}/admin/order/invoice/${orderId}?locale=${locale}` });
  const [invoiceHtml, setInvoiceHtml] = useState("");

  useEffect(() => { refetch(); }, [refetch]);

  useEffect(() => {
    if (data) {
      const logo = data?.logo_link || "";
      const order = data?.order;

      let productsTotal = 0;
      let addonsTotal = 0;

      const items = order.order_details.map(item => {
        const product = item.product || {};
        const qty = parseFloat(item.count || item.quantity || product.count || 1);
        const basePrice = parseFloat(product.price || item.price || 0);

        const itemAddons = item.addons || [];
        const itemExtras = item.extras || [];

        const addonsPrice = itemAddons.reduce((s, a) => s + parseFloat(a.price || 0) * (a.count || 1), 0);
        const extrasPrice = itemExtras.reduce((s, e) => s + parseFloat(e.price || 0), 0);
        const extrasPerUnit = addonsPrice + extrasPrice;

        const variationPrice = item.variations?.reduce((acc, v) => 
          acc + (v.options?.reduce((oacc, opt) => oacc + parseFloat(opt.price || 0), 0) || 0), 0) || 0;

        const finalPrice = basePrice + variationPrice;

        productsTotal += finalPrice * qty;
        addonsTotal += extrasPerUnit * qty;

        const variationString = item.variations
          ?.map(v => v.options?.map(o => o.name).join(", ")).filter(Boolean).join(" - ") || "";

        const notesString = [product.notes, item.notes].filter(Boolean).join(" , ");

        return {
          qty,
          name: product.name || item.name || "Item",
          variationString,
          addons: itemAddons,
          extras: itemExtras,
          notesString,
          price: finalPrice,
          total: (finalPrice + extrasPerUnit) * qty,
        };
      });

      const subtotal = productsTotal + addonsTotal;
      const discount = parseFloat(order.total_discount || order.coupon_discount || 0);
      const tax = parseFloat(order.total_tax || 0);
      const total = parseFloat(order.amount || 0);
      const delivery = parseFloat(order.address?.zone?.price || 0);

      let orderTypeDisplay = t("TakeAway");
      const type = (order.order_type || "").toLowerCase();
      if (type.includes("dine")) orderTypeDisplay = t("DineIn");
      else if (type.includes("delivery")) orderTypeDisplay = t("Delivery");

      const receiptData = {
        restaurantName:  t("projectName"),
        logoLink:logo || "", 
        branchName: order.branch?.name || "",
        invoiceNumber: order.order_number || order.id,
        date: order.order_date,
        orderTime: order.order_time,
        orderType: orderTypeDisplay,
        payment: t(order.payment),
        customerName: order.user?.name || `${order.user?.f_name || ""} ${order.user?.l_name || ""}`.trim(),
        customerPhone: order.user?.phone || "",
        customerPhone2: order.user?.phone_2 || "",
        customerAddress: order.address?.address || "",
        orderNotes: order.notes || "",
        deliveryMan: order.delivery ? `${order.delivery.f_name || ''} ${order.delivery.l_name || ''}`.trim() : "",
        items,
        subtotal,
        tax,
        delivery,
        total,
        discount,
      };

      setInvoiceHtml(formatCashierReceipt(receiptData, t, isRtl));
    }
  }, [data, t, isRtl]);

  const handlePrint = () => {
    // Open a new window
    const pw = window.open("", "", "width=500,height=600");
    if (pw) {
      // Inline style on the NEW window body to remove margins, 
      // This is safe because it is a new window, not your React app.
      pw.document.write("<html><head><title>Print</title></head><body style='margin:0; padding:0;'>");
      pw.document.write(invoiceHtml);
      pw.document.write("</body></html>");
      pw.document.close();
      setTimeout(() => { pw.focus(); pw.print(); pw.close(); }, 500);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><LoaderLogin /></div>;
  if (!invoiceHtml) return <div className="mt-10 text-center">No Data</div>;

  return (
    <div className="min-h-screen py-8 bg-gray-100">
      <div className="flex justify-between max-w-md px-4 mx-auto mb-6">
        <button onClick={() => window.history.back()} className="flex items-center gap-2 px-4 py-2 bg-white rounded shadow">
          <FaArrowLeft /> {t("رجوع")}
        </button>
        <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-2 text-white bg-black rounded shadow">
          <FaPrint /> {t("طباعة")}
        </button>
      </div>

      <div className="flex justify-center">
        {/* The preview container */}
        <div style={{ width: "320px", border: "1px solid #eee", padding: "10px", background: "white" }}
          dangerouslySetInnerHTML={{ __html: invoiceHtml }}
        />
      </div>
    </div>
  );
};

export default InvoiceOrderPage;