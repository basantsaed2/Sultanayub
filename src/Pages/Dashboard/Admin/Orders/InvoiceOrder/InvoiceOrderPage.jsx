import React, { useEffect, useState } from "react";
import { useGet } from "../../../../../Hooks/useGet";
import { useParams } from "react-router-dom";
import { LoaderLogin } from "../../../../../Components/Components";
import { useTranslation } from "react-i18next";
import { FaPrint, FaArrowLeft } from "react-icons/fa";

// ===================================================================
// 1. دالة تصميم الإيصال (نسخة واضحة بدون Bold زائد)
// ===================================================================
const formatCashierReceipt = (receiptData) => {
  return `
    <div style="width: 100%; margin: 0; font-family: Arial, Helvetica, sans-serif; color: #000; padding: 5px;">
      
      <style>
        @page { size: auto; margin: 0mm; }
        body { margin: 0; padding: 0; }
        
        /* العناوين فقط هي التي ستكون عريضة */
        .header { text-align: center; margin-bottom: 10px; }
        .header h1 { font-size: 22px; font-weight: bold; margin: 0; text-transform: uppercase; }
        .header p { font-size: 12px; margin: 2px 0; font-weight: normal; }
        
        /* النصوص العادية بدون bold لتجنب الاهتزاز */
        .info-section { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px; font-weight: normal; }
        .info-left { text-align: left; }
        .info-right { text-align: right; }
        
        /* رقم الفاتورة مميز */
        .invoice-num { font-size: 16px; font-weight: bold; margin-top: 5px; }
        
        .cashier-line { text-align: left; font-size: 12px; margin-bottom: 8px; border-bottom: 1px solid #000; padding-bottom: 5px; }

        /* الجدول - خط عادي واضح */
        table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 10px; }
        th { border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 5px 2px; text-align: center; font-weight: bold; }
        td { border-bottom: 1px dashed #ccc; padding: 5px 2px; text-align: center; font-weight: normal; }
        .item-name { text-align: right; direction: rtl; padding-right: 5px; }
        
        /* الإجماليات */
        .totals-section { text-align: right; font-size: 12px; margin-bottom: 10px; }
        .total-row { margin-bottom: 4px; display: flex; justify-content: space-between; }
        
        /* الإجمالي النهائي بخط كبير */
        .grand-total { font-size: 18px; font-weight: bold; margin-top: 8px; border-top: 2px solid #000; padding-top: 5px; }
        
        .footer { text-align: center; font-size: 12px; margin-top: 15px; font-weight: normal; }
      </style>

      <div class="header">
        <h1>${receiptData.restaurantName}</h1>
        <p>${receiptData.branchName}</p>
      </div>

      <div class="info-section">
        <div class="info-left">
          <div>Order Type</div>
          <div>Date</div>
          <div>Invoice #</div>
        </div>
        <div class="info-right">
          <div style="font-weight: bold;">${receiptData.orderType}</div>
          <div dir="ltr">${receiptData.date}</div>
          <div class="invoice-num">${receiptData.invoiceNumber}</div>
        </div>
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
          ${receiptData.items.map(item => `
            <tr>
              <td>${item.qty}</td>
              <td class="item-name">${item.name}</td>
              <td>${Number(item.price).toFixed(2)}</td>
              <td>${Number(item.total).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="totals-section">
        <div class="total-row">
          <span>Subtotal</span>
          <span>${Number(receiptData.subtotal).toFixed(2)}</span>
        </div>
        <div class="total-row">
          <span>VAT (${(receiptData.taxPercentage * 100).toFixed(0)}%)</span>
          <span>${Number(receiptData.tax).toFixed(2)}</span>
        </div>
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
  const apiEndpoint = userRole === "branch"
      ? `${apiUrl}/branch/online_order/invoice/${orderId}`
      : `${apiUrl}/admin/order/invoice/${orderId}`;

  const { refetch, loading, data } = useGet({ url: apiEndpoint });
  const [invoiceHtml, setInvoiceHtml] = useState("");

  useEffect(() => { refetch(); }, [refetch]);

  useEffect(() => { 
    if (data?.order) {
        const order = data.order;

        const subtotal = order.order_details?.reduce((sum, item) => {
            const price = parseFloat(item.price || item.product?.price || 0);
            const qty = parseFloat(item.count || item.quantity || 1);
            return sum + (price * qty);
        }, 0) || 0;

        const tax = parseFloat(order.total_tax || 0);
        const total = parseFloat(order.amount || 0);
        const taxPercentage = subtotal > 0 ? (tax / subtotal) : 0;

        let orderTypeDisplay = "Takeaway";
        const typeStr = (order.order_type || '').toLowerCase();
        if (typeStr.includes('dine')) orderTypeDisplay = "Dine In";
        else if (typeStr.includes('delivery')) orderTypeDisplay = "Delivery";

        const receiptData = {
            restaurantName: "food2go", 
            branchName: order.branch?.name || "",
            cashierName: order.admin?.name || "ola", 
            invoiceNumber: order.order_number || order.id,
            date: new Date(order.order_date).toLocaleString('en-US', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', hour12: false
            }),
            orderType: orderTypeDisplay,
            items: order.order_details.map(item => ({
                qty: item.count || item.quantity || 1,
                name: item.product?.name || item.name || "Item",
                price: parseFloat(item.price || item.product?.price || 0),
                total: (parseFloat(item.price || item.product?.price || 0)) * (parseFloat(item.count || item.quantity || 1)),
            })),
            subtotal, tax, taxPercentage, total
        };

        setInvoiceHtml(formatCashierReceipt(receiptData));
    } 
  }, [data]);

  const handlePrint = () => {
      const printWindow = window.open('', '', 'height=600,width=400');
      if (printWindow) {
          printWindow.document.write('<html><head><title>Print Receipt</title>');
          printWindow.document.write('</head><body>');
          printWindow.document.write(invoiceHtml);
          printWindow.document.write('</body></html>');
          printWindow.document.close();
          printWindow.focus();
          
          // زيادة المهلة قليلاً للتأكد من تحميل الخطوط قبل الطباعة
          setTimeout(() => {
              printWindow.print();
              printWindow.close();
          }, 500);
      }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><LoaderLogin /></div>;
  if (!invoiceHtml) return <div className="text-center mt-10">No Data</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto mb-6 px-4 flex justify-between">
        <button onClick={() => window.history.back()} className="flex items-center gap-2 px-4 py-2 bg-white rounded shadow">
          <FaArrowLeft /> {t("رجوع")}
        </button>
        <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded shadow">
          <FaPrint /> {t("طباعة")}
        </button>
      </div>
      
      {/* معاينة الفاتورة */}
      <div className="flex justify-center">
          <div 
            style={{width: '100%', maxWidth: '80mm', border: '1px solid #eee', padding: '10px', background: 'white'}}
            dangerouslySetInnerHTML={{ __html: invoiceHtml }} 
          />
      </div>

    </div>
  );
};

export default InvoiceOrderPage;