import React, { useEffect, useState } from "react";
import { useGet } from "../../../../../Hooks/useGet";
import { useParams } from "react-router-dom";
import { LoaderLogin } from "../../../../../Components/Components";
import { useTranslation } from "react-i18next";
import { FaPrint, FaArrowLeft } from "react-icons/fa";

// ===================================================================
// 1. دالة تصميم الإيصال
// ===================================================================
const formatCashierReceipt = (receiptData, t, isRtl) => {
  const phones = [receiptData.customerPhone, receiptData.customerPhone2]
    .filter(Boolean)
    .join(" / ");

  return `
    <div dir="${isRtl ? 'rtl' : 'ltr'}" style="width: 100%; max-width:100%; margin: 0 auto; font-family: Arial, Helvetica, sans-serif; color: #000; padding: 10px;box-sizing: border-box; word-wrap: break-word;">
      
      <style>
        @page { size: auto; margin: 0mm; }
        body { margin: 0; padding: 0; width: 100%; height: 100%; }
        * { box-sizing: border-box; }
        
        .header { text-align: center; margin-bottom: 15px; }
        .header h1 { font-size: 24px; font-weight: bold; margin: 0; text-transform: uppercase; }
        .header p { font-size: 16px; margin: 5px 0 0 0; font-weight: normal; }
        
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
        
        table { width: 100%; font-size: 14px; margin-bottom: 15px; border-collapse: collapse; }
        th { border: 1px solid #000; padding: 8px 4px; text-align: center; background-color: #f0f0f0; font-weight: bold; }
        td { border: none; padding: 8px 4px; text-align: center; }
        
        .item-name { 
          text-align: ${isRtl ? 'right' : 'left'}; 
          direction: ${isRtl ? 'rtl' : 'ltr'}; 
        }
        
        .item-variations { font-size: 12px; margin-top: 2px; font-weight: normal; }
        .item-note { font-size: 12px; margin-top: 2px; font-style: italic; }

        .totals-section { text-align: ${isRtl ? 'left' : 'right'}; font-size: 14px; margin-bottom: 5px; }
        .total-row { margin-bottom: 2px; display: flex; justify-content: space-between; }
        .grand-total { font-size: 18px; font-weight: bold; border-top: 2px solid #000; padding-top: 2px; margin-top: 2px; }
        
        .footer { text-align: center; font-size: 14px; font-weight: bold; }
      </style>

      <div class="header">
        <h1>${receiptData.restaurantName}</h1>
        <p>${receiptData.branchName}</p>
      </div>

      <div class="info-box">
        <div class="info-row">
          <span class="info-label">${t("InvoiceNumber")}:</span>
          <span>${receiptData.invoiceNumber}</span>
        </div>
        <div class="info-row">
          <span class="info-label">${t("Date")}:</span>
          <span dir="ltr">${receiptData.date} ${receiptData.orderTime || ''}</span>
        </div>
        <div class="info-row">
          <span class="info-label">${t("Client")}:</span>
          <span>${receiptData.customerName}</span>
        </div>
        ${phones ? `
        <div class="info-row">
          <span class="info-label">${t("Phone")}:</span>
          <span dir="ltr">${phones}</span>
        </div>` : ''}
        
        ${(receiptData.orderType === t("Delivery") || receiptData.orderType === "Delivery") && receiptData.deliveryMan ? `
        <div class="info-row">
          <span class="info-label">${t("DeliveryMan")}:</span>
          <span>${receiptData.deliveryMan}</span>
        </div>` : ''}
        
        <div class="info-row">
            <span class="info-label">${t("OrderType")}:</span>
            <span>${receiptData.orderType}</span>
        </div>
         <div class="info-row">
            <span class="info-label">${t("Payment")}:</span>
            <span>${receiptData.payment}</span>
        </div>
      </div>

      <div class="address-notes-section">
        ${(receiptData.orderType === t("Delivery") || receiptData.orderType === "Delivery") && receiptData.customerAddress ? `
        <div style="margin-bottom: 10px;">
          <span class="section-title">${t("DeliveryAddress")}:</span>
          <div>${receiptData.customerAddress}</div>
        </div>` : ''}

        ${receiptData.orderNotes ? `
        <div>
          <span class="section-title">${t("Notes")}:</span>
          <div>${receiptData.orderNotes}</div>
        </div>` : ''}
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 40%">${t("Item")}</th>
            <th style="width: 15%">${t("Qty")}</th>
            <th style="width: 20%">${t("Price")}</th>
            <th style="width: 25%">${t("Total")}</th>
          </tr>
        </thead>
        <tbody>
          ${receiptData.items.map(item => {
    const hasAddons = item.addons && item.addons.length > 0;
    const hasExtras = item.extras && item.extras.length > 0;
    const showTotalOnMainRow = !hasAddons && !hasExtras;

    // Determine if the main row is the last row for this item
    const isMainRowLast = !hasAddons && !hasExtras;
    const mainRowStyle = isMainRowLast ? 'border-bottom: 1px solid #000;' : '';

    let rows = `
              <tr>
                <td class="item-name" style="${mainRowStyle}">
                  ${item.name}
                  ${item.variationString ? `<div class="item-variations">${item.variationString}</div>` : ""}
                  ${item.notesString ? `<div class="item-note">${t("Note")}: ${item.notesString}</div>` : ""}
                </td>
                <td style="${mainRowStyle}">${item.qty}</td>
                <td style="${mainRowStyle}">${Number(item.price).toFixed(2)}</td>
                <td style="${mainRowStyle}">${showTotalOnMainRow ? Number(item.total).toFixed(2) : ""}</td>
              </tr>
            `;

    if (hasAddons) {
      item.addons.forEach((addon, index) => {
        const isLastAddon = index === item.addons.length - 1;
        const showTotalHere = isLastAddon && !hasExtras;

        // Determine if this addon row is the last row for the entire item block
        const isItemBlockLast = isLastAddon && !hasExtras;
        const rowStyle = isItemBlockLast ? 'border-bottom: 1px solid #000;' : '';

        rows += `
                <tr>
                  <td class="item-name" style="font-size: 12px; ${isRtl ? 'padding-right: 15px' : 'padding-left: 15px'}; ${rowStyle}">+ ${addon.name}</td>
                  <td style="${rowStyle}">${addon.count > 1 ? addon.count : ''}</td>
                  <td style="${rowStyle}">${Number(addon.price).toFixed(2)}</td>
                  <td style="${rowStyle}">${showTotalHere ? Number(item.total).toFixed(2) : ""}</td>
                </tr>
                `;
      });
    }

    if (hasExtras) {
      item.extras.forEach((extra, index) => {
        const isLastExtra = index === item.extras.length - 1;
        const showTotalHere = isLastExtra;

        // This is always the last block if extras exist, so the last extra is the end of the item block
        const isItemBlockLast = isLastExtra;
        const rowStyle = isItemBlockLast ? 'border-bottom: 1px solid #000;' : '';

        rows += `
                <tr>
                  <td class="item-name" style="font-size: 12px; ${isRtl ? 'padding-right: 15px' : 'padding-left: 15px'}; ${rowStyle}">+ ${extra.name}</td>
                  <td style="${rowStyle}"></td>
                  <td style="${rowStyle}">${Number(extra.price).toFixed(2)}</td>
                  <td style="${rowStyle}">${showTotalHere ? Number(item.total).toFixed(2) : ""}</td>
                </tr>
                `;
      });
    }
    return rows;
  }).join("")}
        </tbody>
      </table>

      <div class="totals-section">
        <div class="total-row">
          <span>${t("TotalProductPrice")}</span>
          <span>${Number(receiptData.subtotal).toFixed(2)}</span>
        </div>
        <div class="total-row">
          <span>${t("Tax")} %:</span>
          <span>${Number(receiptData.tax).toFixed(2)}</span>
        </div>
        ${receiptData.delivery > 0 ? `
        <div class="total-row">
           <span>${t("DeliveryFee")}</span>
           <span>${Number(receiptData.delivery).toFixed(2)}</span>
        </div>` : ""}
        ${receiptData.discount > 0 ? `
        <div class="total-row">
           <span>${t("Discount")}</span>
           <span>-${Number(receiptData.discount).toFixed(2)}</span>
        </div>` : ""}
        <div class="total-row grand-total">
          <span>${t("GrandTotal")}</span>
          <span>${Number(receiptData.total).toFixed(2)}</span>
        </div>
      </div>

      <div class="footer">
        ${t("ThankYouForVisit")}
        <div style="font-size: 10px; margin-top: 5px;">Powered by food2go.online</div>
      </div>
    </div>
  `;
};

// ===================================================================
// 2. المكون الرئيسي
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

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (data?.order) {
      console.log(data.order);
      const order = data.order;

      let productsTotal = 0;
      let addonsTotal = 0;

      const items = order.order_details.map((item) => {
        const product = item.product || {};
        const qty = parseFloat(
          item.count || item.quantity || product.count || 1
        );
        const basePrice = parseFloat(product.price || item.price || 0);

        // Calculate addons for this item
        const itemAddons = item.addons || [];
        const itemExtras = item.extras || [];

        const currentItemAddonsPrice = itemAddons.reduce(
          (sum, a) => sum + parseFloat(a.price || 0) * a.count,
          0
        );
        const currentItemExtrasPrice = itemExtras.reduce(
          (sum, e) => sum + parseFloat(e.price || 0),
          0
        );
        const totalExtrasPerUnit =
          currentItemAddonsPrice + currentItemExtrasPrice;

        // Calculate variations price
        const variationPrice = item.variations?.reduce((acc, v) => {
          return acc + (v.options?.reduce((optAcc, opt) => optAcc + parseFloat(opt.price || 0), 0) || 0);
        }, 0) || 0;

        const finalUnitPrice = basePrice + variationPrice;

        productsTotal += finalUnitPrice * qty;
        addonsTotal += totalExtrasPerUnit * qty;

        const variationOptions = item.variations
          ?.map((v) => {
            return v.options?.map((opt) => opt.name).join(", ");
          })
          .filter(Boolean)
          .join(" - ");

        // Notes from product or item
        const productNotes = product.notes;
        const itemNotes = item.notes;
        const notesString = [productNotes, itemNotes]
          .filter(Boolean)
          .join(" , ");

        return {
          qty,
          name: product.name || item.name || "Item",
          variationString: variationOptions,
          addons: itemAddons,
          extras: itemExtras,
          notesString: notesString,
          price: finalUnitPrice,
          total: (finalUnitPrice + totalExtrasPerUnit) * qty,
        };
      });

      const discount = parseFloat(
        order.total_discount || order.coupon_discount || 0
      );
      const tax = parseFloat(order.total_tax || 0);
      const total = parseFloat(order.amount || 0);

      // Calculate delivery
      // If delivery fee is not explicitly in data, infer it
      const subtotal = productsTotal + addonsTotal;
      let delivery = parseFloat(order.address?.zone?.price || 0);

      const taxPercentage = subtotal > 0 ? tax / subtotal : 0;

      let orderTypeDisplay = t("TakeAway");
      const typeStr = (order.order_type || "").toLowerCase();
      if (typeStr.includes("dine")) orderTypeDisplay = t("DineIn");
      else if (typeStr.includes("delivery")) orderTypeDisplay = t("Delivery");

      const receiptData = {
        restaurantName: t("projectName"),
        branchName: order.branch?.name || "",
        cashierName: order.admin?.name || "-",
        invoiceNumber: order.order_number || order.id,
        date: order.order_date,
        orderTime: order.order_time,
        orderType: orderTypeDisplay,
        source: order.source,
        payment: t(order.payment),

        customerName:
          order.user?.name ||
          `${order.user?.f_name || ""} ${order.user?.l_name || ""} `,
        customerPhone: order.user?.phone || "",
        customerPhone2: order.user?.phone_2 || "",
        customerOrdersCount: order.user?.orders_count || 0,
        customerAddress: order.address?.address || "",
        orderNotes: order.notes || "",
        deliveryMan: order.delivery ? `${order.delivery.f_name || ''} ${order.delivery.l_name || ''} `.trim() : "",

        items,
        productsTotal,
        addonsTotal,
        subtotal,
        tax,
        taxPercentage,
        delivery,
        total,
        discount,
      };

      setInvoiceHtml(formatCashierReceipt(receiptData, t, isRtl));
    }
  }, [data, t, isRtl]);

  const handlePrint = () => {
    const printWindow = window.open("", "", "height=600,width=400");
    if (printWindow) {
      printWindow.document.write("<html><head><title>Print Receipt</title>");
      printWindow.document.write("</head><body>");
      printWindow.document.write(invoiceHtml);
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderLogin />
      </div>
    );
  if (!invoiceHtml) return <div className="mt-10 text-center">No Data</div>;

  return (
    <div className="min-h-screen py-8 bg-gray-100">
      <div className="flex justify-between max-w-md px-4 mx-auto mb-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded shadow"
        >
          <FaArrowLeft /> {t("رجوع")}
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-2 text-white bg-black rounded shadow"
        >
          <FaPrint /> {t("طباعة")}
        </button>
      </div>

      <div className="flex justify-center">
        <div
          style={{
            width: "320px",
            border: "1px solid #eee",
            padding: "10px",
            background: "white",
          }}
          dangerouslySetInnerHTML={{ __html: invoiceHtml }}
        />
      </div>
    </div>
  );
};

export default InvoiceOrderPage;
