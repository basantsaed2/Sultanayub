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
        
        table, th, td { border: none !important; border-collapse: collapse !important; }

        .header { text-align: center; margin-bottom: 10px; }
        .header h1 { font-size: 22px; font-weight: bold; margin: 0; text-transform: uppercase; }
        .header p { font-size: 15px; margin: 2px 0; font-weight: normal; }
        
        .info-section { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px; font-weight: normal; }
        .info-left { text-align: ${isRtl ? 'right' : 'left'}; }
        .info-right { text-align: ${isRtl ? 'left' : 'right'}; }
        
        .invoice-num { font-size: 16px; font-weight: bold; margin-top: 5px; }
        
        .cashier-line { text-align: ${isRtl ? 'right' : 'left'}; font-size: 12px; margin-bottom: 8px; border-bottom: 1px solid #000; padding-bottom: 5px; }

        table { width: 100%; font-size: 12px; margin-bottom: 10px; }
        th { border-top: 1px solid #000 !important; border-bottom: 1px solid #000 !important; padding: 5px 2px; text-align: center; font-weight: bold; }
        td { padding: 5px 2px; text-align: center; font-weight: normal; }
        
        /* Increased font size for product name */
        .item-name { 
          text-align: ${isRtl ? 'right' : 'left'}; 
          direction: ${isRtl ? 'rtl' : 'ltr'}; 
          padding-right: 5px; 
          font-size: 16px; 
          font-weight: bold; 
        }
        
        .item-variations { 
            font-size: 12px;
            color: #000;
            font-weight: normal;
            margin-top: 2px; 
            line-height: 1.3;
        }

        .item-note {
            font-size: 12px ;
            margin-top: 2px;
            font-weight : normal;
        }

        .totals-section { text-align: ${isRtl ? 'left' : 'right'}; font-size: 12px; margin-bottom: 10px; }
        .total-row { margin-bottom: 4px; display: flex; justify-content: space-between; }
        
        .grand-total { font-size: 18px; font-weight: bold; margin-top: 8px; border-top: 2px solid #000; padding-top: 5px; }
        
        .footer { text-align: center; font-size: 12px; margin-top: 15px; font-weight: normal; padding-bottom: 30px }
        
        .customer-details { font-size: 11px; margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 5px; }
        .customer-row { display: flex; justify-content: space-between; margin-bottom: 2px; }
        
        .address-box { margin-top: 5px; border-top: 1px dotted #000; padding-top: 3px; font-size: 11px; line-height: 1.4; font-weight: bold; }
        .order-notes { margin-top: 5px; border-top: 1px dotted #000; padding-top: 3px; font-size: 12px; font-weight: bold; }
      </style>

      <div class="header">
        <h1>${receiptData.restaurantName}</h1>
        <p>${receiptData.branchName}</p>
      </div>

      <table class="info-table" style="width: 100%; margin-bottom: 8px;">
        <tr>
          <td style="text-align: ${isRtl ? 'right' : 'left'}; width: 40%;">${t("OrderType")}</td>
          <td style="text-align: ${isRtl ? 'left' : 'right'}; font-weight: bold;">${receiptData.orderType}</td>
        </tr>
        <tr>
          <td style="text-align: ${isRtl ? 'right' : 'left'};">${t("Source")}</td>
          <td style="text-align: ${isRtl ? 'left' : 'right'}; font-weight: bold;">${receiptData.source}</td>
        </tr>
        <tr>
          <td style="text-align: ${isRtl ? 'right' : 'left'};">${t("Payment")}</td>
          <td style="text-align: ${isRtl ? 'left' : 'right'}; font-weight: bold; font-size: 18px;">${receiptData.payment}</td>
        </tr>
        <tr>
          <td style="text-align: ${isRtl ? 'right' : 'left'};">${t("Date")}</td>
          <td style="text-align: ${isRtl ? 'left' : 'right'};" dir="ltr">${receiptData.date}</td>
        </tr>
        <tr>
          <td style="text-align: ${isRtl ? 'right' : 'left'};">${t("InvoiceNumber")}</td>
          <td style="text-align: ${isRtl ? 'left' : 'right'};" class="invoice-num">${receiptData.invoiceNumber}</td>
        </tr>
      </table>

      <div class="customer-details">
        <div class="customer-row">
            <span>${t("Client")}:</span>
            <span style="font-weight:bold;">${receiptData.customerName}</span>
        </div>
        ${phones
      ? `
        <div class="customer-row">
            <span>${t("Phone")}:</span>
            <span dir="ltr">${phones}</span>
        </div>`
      : ""
    }
        
        ${(receiptData.orderType === t("Delivery") || receiptData.orderType === "Delivery") && receiptData.customerAddress
      ? `
        <div class="address-box">
            <span style="text-decoration:underline;">${t("DeliveryAddress")}:</span><br/>
            ${receiptData.customerAddress}
        </div>`
      : ""
    }

        ${receiptData.orderNotes
      ? `
        <div class="order-notes">
            <span style="text-decoration:underline;">${t("Notes")}:</span><br/>
            ${receiptData.orderNotes}
        </div>`
      : ""
    }
      </div>

      <div class="cashier-line">
        ${t("Cashier")}: ${receiptData.cashierName}
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 15%">${t("Qty")}</th>
            <th style="width: 45%">${t("Item")}</th>
            <th style="width: 20%">${t("Price")}</th>
            <th style="width: 20%">${t("Total")}</th>
          </tr>
        </thead>
        <tbody>
          ${receiptData.items
      .map(
        (item) => {
          const hasAddons = item.addons && item.addons.length > 0;
          const hasExtras = item.extras && item.extras.length > 0;
          const showTotalOnMainRow = !hasAddons && !hasExtras;

          let rows = `
            <tr>
              <td style="vertical-align: top;">${item.qty}</td>
              <td class="item-name">
                ${item.name}
                ${item.variationString
              ? `<div class="item-variations">${item.variationString}</div>`
              : ""
            }
               ${item.notesString
              ? `<div class="item-note">${t("Note")}: ${item.notesString}</div>`
              : ""
            }
              </td>
              <td style="vertical-align: top;">${Number(item.price).toFixed(
              2
            )}</td>
              <td style="vertical-align: top;">${showTotalOnMainRow ? Number(item.total).toFixed(2) : ""}</td>
            </tr>
          `;

          if (hasAddons) {
            item.addons.forEach((addon, index) => {
              const isLastAddon = index === item.addons.length - 1;
              const showTotalHere = isLastAddon && !hasExtras;
              rows += `
              <tr>
                <td></td>
                <td class="item-name" style="font-size: 14px; font-weight: normal; ${isRtl ? 'padding-right: 15px' : 'padding-left: 15px'}">+ ${addon.name}</td>
                <td style="vertical-align: top;">${Number(addon.price).toFixed(2)}</td>
                <td style="vertical-align: top;">${showTotalHere ? Number(item.total).toFixed(2) : ""}</td>
              </tr>
              `;
            });
          }

          if (hasExtras) {
            item.extras.forEach((extra, index) => {
              const isLastExtra = index === item.extras.length - 1;
              const showTotalHere = isLastExtra;
              rows += `
              <tr>
                <td></td>
                <td class="item-name" style="font-size: 14px; font-weight: normal; ${isRtl ? 'padding-right: 15px' : 'padding-left: 15px'}">+ ${extra.name}</td>
                <td style="vertical-align: top;">${Number(extra.price).toFixed(2)}</td>
                <td style="vertical-align: top;">${showTotalHere ? Number(item.total).toFixed(2) : ""}</td>
              </tr>
              `;
            });
          }

          return rows;
        }
      )
      .join("")}
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

        ${receiptData.delivery > 0
      ? `
        <div class="total-row">
           <span>${t("DeliveryFee")}</span>
           <span>${Number(receiptData.delivery).toFixed(2)}</span>
        </div>`
      : ""
    }
        
        ${receiptData.discount > 0
      ? `
        <div class="total-row">
           <span>${t("Discount")}</span>
           <span>-${Number(receiptData.discount).toFixed(2)}</span>
        </div>`
      : ""
    }
        
        <div class="total-row grand-total">
          <span>${t("GrandTotal")}</span>
          <span>${Number(receiptData.total).toFixed(2)}</span>
        </div>
      </div>

      <div class="footer">
        ${t("ThankYouForVisit")}
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
        orderType: orderTypeDisplay,
        source: order.source,
        payment: t(order.payment),

        customerName:
          order.user?.name ||
          `${order.user?.f_name || ""} ${order.user?.l_name || ""}`,
        customerPhone: order.user?.phone || "",
        customerPhone2: order.user?.phone_2 || "",
        customerOrdersCount: order.user?.orders_count || 0,
        customerAddress: order.address?.address || "",
        orderNotes: order.notes || "",

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
