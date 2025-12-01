import React, { useEffect, useState } from "react";
import { useGet } from "../../../../../Hooks/useGet";
import { useParams } from "react-router-dom";
import { LoaderLogin } from "../../../../../Components/Components";
import { useTranslation } from "react-i18next";
import { FaPrint, FaArrowLeft } from "react-icons/fa";

// ===================================================================
// 1. دالة الإيصال - تم تعديلها فقط لحل المشكلتين المطلوبتين
// ===================================================================
const formatCashierReceipt = (receiptData, t, isRtl) => {
  const phones = [receiptData.customerPhone, receiptData.customerPhone2]
    .filter(Boolean)
    .join(" / ");

  return `
    <div dir="${isRtl ? 'rtl' : 'ltr'}" style="width: 100%; max-width:100%; margin: 0 auto; font-family: Arial, Helvetica, sans-serif; color: #000; padding: 10px; box-sizing: border-box; word-wrap: break-word;">
      
      <style>
        @page { size: auto; margin: 0mm; }
        body { margin: 0; padding: 0; }
        * { box-sizing: border-box; }
        
        .header { text-align: center; margin-bottom: 15px; }
        .header h1 { font-size: 24px; font-weight: bold; margin: 0; text-transform: uppercase; }
        .header p { font-size: 16px; margin: 5px 0 0 0; }
        
        .info-box { 
          padding: 10px; 
          margin-bottom: 15px; 
          font-size: 14px;
          border-bottom: 1px solid #000;
        }
        .info-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .info-label { font-weight: bold; }
        
        .address-notes-section { margin-bottom: 15px; font-size: 14px; }
        .section-title { font-weight: bold; text-decoration: underline; margin-bottom: 5px; display: block; }
        
        /* الجدول: فقط خط أسفل العناوين + لا مسافات كبيرة */
        table { 
          width: 100%; 
          font-size: 14px; 
          border-collapse: collapse; 
          margin-bottom: 8px; /* تم تقليله من 15px */
        }
        th { 
          border: none !important; 
          border-bottom: 2px solid #000 !important; 
          padding: 8px 4px; 
          text-align: center; 
          background-color: #f0f0f0; 
          font-weight: bold; 
        }
        td { 
          border: none; 
          padding: 8px 4px; 
          text-align: center; 
        }
        
        .item-name { 
          text-align: ${isRtl ? 'right' : 'left'}; 
          direction: ${isRtl ? 'rtl' : 'ltr'}; 
        }
        .item-variations { font-size: 12px; margin-top: 2px; }
        .item-note { font-size: 12px; margin-top: 2px; font-style: italic; }

        /* خط فاصل خفيف بعد كل عنصر (اختياري لكن جميل) */
        .item-block-last td { border-bottom: 1px solid #999; }

        .totals-section { 
          text-align: ${isRtl ? 'left' : 'right'}; 
          font-size: 14px; 
          margin: 8px 0 10px 0; /* تم تقليله بشدة */
        }
        .total-row { margin-bottom: 3px; display: flex; justify-content: space-between; }
        .grand-total { 
          font-size: 18px; 
          font-weight: bold; 
          border-top: 2px solid #000; 
          padding-top: 4px 0; 
          margin-top: 4px; 
        }
        
        .footer { 
          text-align: center; 
          font-size: 14px; 
          font-weight: bold; 
          margin-top: 10px; /* تم تقليله من قيم كبيرة */
        }
      </style>

      <div class="header">
        <h1>${receiptData.restaurantName}</h1>
        <p>${receiptData.branchName}</p>
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
          `<div style="margin-bottom:10px"><span class="section-title">${t("DeliveryAddress")}:</span><div>${receiptData.customerAddress}</div></div>` : ''}
        ${receiptData.orderNotes ? 
          `<div><span class="section-title">${t("Notes")}:</span><div>${receiptData.orderNotes}</div></div>` : ''}
      </div>

      <table>
        <thead>
          <tr>
            <th style="width:40%">${t("Item")}</th>
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

            // الصف الرئيسي
            const isMainLast = !hasAddons && !hasExtras;
            rows += `<tr ${isMainLast ? 'class="item-block-last"' : ''}>
              <td class="item-name">
                ${item.name}
                ${item.variationString ? `<div class="item-variations">${item.variationString}</div>` : ''}
                ${item.notesString ? `<div class="item-note">${t("Note")}: ${item.notesString}</div>` : ''}
              </td>
              <td>${item.qty}</td>
              <td>${Number(item.price).toFixed(2)}</td>
              <td>${showTotalOnMainRow ? Number(item.total).toFixed(2) : ''}</td>
            </tr>`;

            // Addons
            if (hasAddons) {
              item.addons.forEach((addon, i) => {
                const isLast = i === item.addons.length - 1 && !hasExtras;
                rows += `<tr ${isLast ? 'class="item-block-last"' : ''}>
                  <td class="item-name" style="font-size:12px; ${isRtl ? 'padding-right:15px' : 'padding-left:15px'};">+ ${addon.name}</td>
                  <td>${addon.count > 1 ? addon.count : ''}</td>
                  <td>${Number(addon.price).toFixed(2)}</td>
                  <td>${isLast ? Number(item.total).toFixed(2) : ''}</td>
                </tr>`;
              });
            }

            // Extras
            if (hasExtras) {
              item.extras.forEach((extra, i) => {
                const isLast = i === item.extras.length - 1;
                rows += `<tr ${isLast ? 'class="item-block-last"' : ''}>
                  <td class="item-name" style="font-size:12px; ${isRtl ? 'padding-right:15px' : 'padding-left:15px'};">+ ${extra.name}</td>
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
        ${t("ThankYouForVisit")}
        <div style="font-size:10px;margin-top:5px;">Powered by Food2Go</div>
        <div style="font-size:10px;margin-top:5px;">food2go.online</div>
      </div>
    </div>
  `;
};

// ===================================================================
// 2. باقي الكود بدون أي تغيير في المنطق
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

  const { refetch, loading, data } = useGet({ url: apiEndpoint });
  const [invoiceHtml, setInvoiceHtml] = useState("");

  useEffect(() => { refetch(); }, [refetch]);

  useEffect(() => {
    if (data?.order) {
      const order = data.order;

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
        restaurantName: t("projectName"),
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
    const pw = window.open("", "", "width=400,height=600");
    if (pw) {
      pw.document.write("<html><head><title>Print</title></head><body style='margin:0'>");
      pw.document.write(invoiceHtml);
      pw.document.write("</body></html>");
      pw.document.close();
      setTimeout(() => { pw.print(); pw.close(); }, 500);
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
        <div style={{ width: "320px", border: "1px solid #eee", padding: "10px", background: "white" }}
          dangerouslySetInnerHTML={{ __html: invoiceHtml }}
        />
      </div>
    </div>
  );
};

export default InvoiceOrderPage;