import React, { useEffect, useState } from "react";
import { useGet } from "../../../../../Hooks/useGet";
import { useParams } from "react-router-dom";
import { LoaderLogin } from "../../../../../Components/Components";
import { useTranslation } from "react-i18next";
import { FaPrint, FaArrowLeft } from "react-icons/fa";

// ===================================================================
// 1. دالة تصميم الإيصال
// ===================================================================
const formatCashierReceipt = (receiptData) => {
  const phones = [receiptData.customerPhone, receiptData.customerPhone2]
    .filter(Boolean)
    .join(" / ");

  return `
    <div style="width: 100%; max-width:100%; margin: 0 auto; font-family: Arial, Helvetica, sans-serif; color: #000; padding: 10px;box-sizing: border-box; word-wrap: break-word;">
      
      <style>
        @page { size: auto; margin: 0mm; }
        body { margin: 0; padding: 0; width: 100%; height: 100%; }
        * { box-sizing: border-box; }
        
        table, th, td { border: none !important; border-collapse: collapse !important; }

        .header { text-align: center; margin-bottom: 10px; }
        .header h1 { font-size: 22px; font-weight: bold; margin: 0; text-transform: uppercase; }
        .header p { font-size: 12px; margin: 2px 0; font-weight: normal; }
        
        .info-section { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px; font-weight: normal; }
        .info-left { text-align: left; }
        .info-right { text-align: right; }
        
        .invoice-num { font-size: 16px; font-weight: bold; margin-top: 5px; }
        
        .cashier-line { text-align: left; font-size: 12px; margin-bottom: 8px; border-bottom: 1px solid #000; padding-bottom: 5px; }

        table { width: 100%; font-size: 12px; margin-bottom: 10px; }
        th { border-top: 1px solid #000 !important; border-bottom: 1px solid #000 !important; padding: 5px 2px; text-align: center; font-weight: bold; }
        td { padding: 5px 2px; text-align: center; font-weight: normal; }
        
        /* Increased font size for product name */
        .item-name { 
          text-align: right; 
          direction: rtl; 
          padding-right: 5px; 
          font-size: 18px; 
          font-weight: bold; 
        }
        
        .item-variations { 
            font-size: 14px;
            color: #000;
            font-weight: bold;
            margin-top: 2px; 
            line-height: 1.3;
        }

        .item-note {
            font-size: 12px ;
            margin-top: 2px;
            font-weight : normal;
        }

        .totals-section { text-align: right; font-size: 12px; margin-bottom: 10px; }
        .total-row { margin-bottom: 4px; display: flex; justify-content: space-between; }
        
        .grand-total { font-size: 18px; font-weight: bold; margin-top: 8px; border-top: 2px solid #000; padding-top: 5px; }
        
        .footer { text-align: center; font-size: 12px; margin-top: 15px; font-weight: normal; padding-bottom: 30px }
        
        .customer-details { font-size: 11px; margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 5px; }
        .customer-row { display: flex; justify-content: space-between; margin-bottom: 2px; }
        
        .address-box { margin-top: 5px; border-top: 1px dotted #000; padding-top: 3px; font-size: 11px; line-height: 1.4; font-weight: bold; }
      </style>

      <div class="header">
        <h1>${receiptData.restaurantName}</h1>
        <p>${receiptData.branchName}</p>
      </div>

      <div class="info-section">
        <div class="info-left">
          <div>Order Type</div>
          <div>Source</div>
          <div>Payment</div>
          <div>Date</div>
          <div>Invoice #</div>
        </div>
        <div class="info-right">
          <div style="font-weight: bold;">${receiptData.orderType}</div>
          <div style="font-weight: bold;">${receiptData.source}</div>
          <div style="font-weight: bold; font-size : 18px">${
            receiptData.payment
          }</div>
          <div dir="ltr">${receiptData.date}</div>
          <div class="invoice-num">${receiptData.invoiceNumber}</div>
        </div>
      </div>

      <div class="customer-details">
        <div class="customer-row">
            <span>Client:</span>
            <span style="font-weight:bold;">${receiptData.customerName}</span>
        </div>
        ${
          phones
            ? `
        <div class="customer-row">
            <span>Phone:</span>
            <span dir="ltr">${phones}</span>
        </div>`
            : ""
        }
        
        ${
          receiptData.orderType === "Delivery" && receiptData.customerAddress
            ? `
        <div class="address-box">
            <span style="text-decoration:underline;">Delivery Address:</span><br/>
            ${receiptData.customerAddress}
        </div>`
            : ""
        }
      </div>

      <div class="cashier-line">
        Cashier: ${receiptData.cashierName}
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 15%">Qty</th>
            <th style="width: 45%">Item</th>
            <th style="width: 20%">Price</th>
            <th style="width: 20%">Total</th>
          </tr>
        </thead>
        <tbody>
          ${receiptData.items
            .map(
              (item) => `
            <tr>
              <td style="vertical-align: top;">${item.qty}</td>
              <td class="item-name">
                ${item.name}
                ${
                  item.variationString
                    ? `<div class="item-variations">${item.variationString}</div>`
                    : ""
                }
                ${
                  item.addonsString
                    ? `<div class="item-variations">+ ${item.addonsString}</div>`
                    : ""
                }
               ${
                 item.notesString
                   ? `<div class="item-note">Note: ${item.notesString}</div>`
                   : ""
               }

              </td>
              <td style="vertical-align: top;">${Number(item.price).toFixed(
                2
              )}</td>
              <td style="vertical-align: top;">${Number(item.total).toFixed(
                2
              )}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>

      <div class="totals-section">
        <div class="total-row">
          <span>Total Product Price</span>
          <span>${Number(receiptData.productsTotal).toFixed(2)}</span>
        </div>
        
        ${
          receiptData.addonsTotal > 0
            ? `
        <div class="total-row">
          <span>Total Extras/Addons</span>
          <span>${Number(receiptData.addonsTotal).toFixed(2)}</span>
        </div>`
            : ""
        }

        <div class="total-row">
          <span>Tax</span>
          <span>${Number(receiptData.tax).toFixed(2)}</span>
        </div>

        ${
          receiptData.delivery > 0
            ? `
        <div class="total-row">
           <span>Delivery Fees</span>
           <span>${Number(receiptData.delivery).toFixed(2)}</span>
        </div>`
            : ""
        }
        
        ${
          receiptData.discount > 0
            ? `
        <div class="total-row">
           <span>Discount</span>
           <span>-${Number(receiptData.discount).toFixed(2)}</span>
        </div>`
            : ""
        }
        
        <div class="total-row grand-total">
          <span>Grand Total</span>
          <span>${Number(receiptData.total).toFixed(2)}</span>
        </div>
      </div>

      <div class="footer">
        شكراً لزيارتكم
      </div>
    </div>
  `;
};

// ===================================================================
// 2. المكون الرئيسي
// ===================================================================
const InvoiceOrderPage = () => {
  const { orderId } = useParams();
  const { t } = useTranslation();

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const userRole = localStorage.getItem("role") || "admin";
  const apiEndpoint =
    userRole === "branch"
      ? `${apiUrl}/branch/online_order/invoice/${orderId}`
      : `${apiUrl}/admin/order/invoice/${orderId}`;

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
          (sum, a) => sum + parseFloat(a.price || 0),
          0
        );
        const currentItemExtrasPrice = itemExtras.reduce(
          (sum, e) => sum + parseFloat(e.price || 0),
          0
        );
        const totalExtrasPerUnit =
          currentItemAddonsPrice + currentItemExtrasPrice;

        productsTotal += basePrice * qty;
        addonsTotal += totalExtrasPerUnit * qty;

        const variationOptions = item.variations
          ?.map((v) => {
            return v.options?.map((opt) => opt.name).join(", ");
          })
          .filter(Boolean)
          .join(" - ");

        const addonsNames = item.addons?.map((a) => a.name).join(", ");

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
          addonsString: addonsNames,
          notesString: notesString,
          price: basePrice,
          total: (basePrice + totalExtrasPerUnit) * qty,
        };
      });

      const discount = parseFloat(
        order.total_discount || order.coupon_discount || 0
      );
      const tax = parseFloat(order.total_tax || 0);
      const total = parseFloat(order.amount || 0);

      // Calculate delivery
      // If delivery fee is not explicitly in data, infer it
      // Total = (Products + Addons) + Tax + Delivery - Discount
      const subtotal = productsTotal + addonsTotal;
      let delivery = total - (subtotal + tax - discount);
      delivery = Math.round(delivery * 100) / 100;
      if (delivery < 0) delivery = 0;

      const taxPercentage = subtotal > 0 ? tax / subtotal : 0;

      let orderTypeDisplay = "Takeaway";
      const typeStr = (order.order_type || "").toLowerCase();
      if (typeStr.includes("dine")) orderTypeDisplay = "Dine In";
      else if (typeStr.includes("delivery")) orderTypeDisplay = "Delivery";

      const receiptData = {
        restaurantName: t("projectName"),
        branchName: order.branch?.name || "",
        cashierName: order.admin?.name || "-",
        invoiceNumber: order.order_number || order.id,
        date: new Date(order.order_date).toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        orderType: orderTypeDisplay,
        source: order.source,
        payment: order.payment,

        customerName:
          order.user?.name ||
          `${order.user?.f_name || ""} ${order.user?.l_name || ""}`,
        customerPhone: order.user?.phone || "",
        customerPhone2: order.user?.phone_2 || "",
        customerOrdersCount: order.user?.orders_count || 0,
        customerAddress: order.address?.address || "",

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

      setInvoiceHtml(formatCashierReceipt(receiptData));
    }
  }, [data]);

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
