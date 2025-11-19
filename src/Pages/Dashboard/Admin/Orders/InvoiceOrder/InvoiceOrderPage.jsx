import React, { useEffect, useState, useRef } from "react";
import { useGet } from "../../../../../Hooks/useGet";
import { useParams } from "react-router-dom";
import { LoaderLogin } from "../../../../../Components/Components";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FaPrint, FaArrowLeft } from "react-icons/fa";

// --- دالة تصميم الفاتورة (High Quality Receipt) ---
const generateReceiptHTML = (data) => {
  if (!data) return "";

  // تنسيق العملة
  const fmt = (num) => parseFloat(num || 0).toFixed(2);
  
  // التواريخ
  const dateObj = new Date(data.order_date || new Date());
  const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const dateStr = dateObj.toLocaleDateString('en-GB');

  // البيانات
  const orderId = data.id || '---';
  const customerName = `${data.user?.f_name || ''} ${data.user?.l_name || ''}`.trim() || 'عميل';
  const customerPhone = data.user?.phone || '';
  const branchName = data.branch?.name || 'بيتزا نور, فلمنج';
  const address = data.branch?.address || 'الإسكندرية';

  // الحسابات
  const delivery = parseFloat(data.address?.zone?.price || 0);
  const tax = parseFloat(data.total_tax || 0);
  const total = parseFloat(data.amount || 0);

  // تحضير المنتجات (نفس ترتيب الصورة: السعر يسار، الاسم وسط، الكمية يمين)
  const itemsHTML = (data.order_details || []).map(item => {
    const itemTotal = (item.product?.price || 0) * (item.product?.count || 1);
    const options = [...(item.variations || []), ...(item.addons || []), ...(item.extras || [])];
    
    // تجميع الإضافات تحت الاسم
    const optionsHTML = options.length > 0 
      ? `<div class="item-opts">${options.map(o => o.name || o.addon?.name).join('<br>')}</div>` 
      : '';

    return `
      <div class="item-row">
        <div class="col-price">
          <span class="currency">EGP</span>
          <span class="val">${fmt(itemTotal)}</span>
        </div>
        
        <div class="col-name">
          <div class="prod-name">${item.product?.name}</div>
          ${optionsHTML}
        </div>

        <div class="col-qty">${item.product?.count || 1}</div>
      </div>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>Order #${orderId}</title>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;800;900&display=swap" rel="stylesheet">
      <style>
        @page { size: 80mm auto; margin: 0; }
        body {
          margin: 0; padding: 0;
          width: 80mm;
          background: #fff;
          font-family: 'Cairo', sans-serif;
          color: #000;
          -webkit-print-color-adjust: exact;
        }
        .container {
          width: 72mm; /* هامش أمان للطابعة */
          margin: 0 auto;
          padding: 5mm 0;
        }
        
        /* Utility Classes */
        .flex { display: flex; justify-content: space-between; align-items: flex-start; }
        .center { text-align: center; }
        .right { text-align: right; }
        .left { text-align: left; }
        .bold { font-weight: 700; }
        .extra-bold { font-weight: 900; }
        
        /* Header Icons Section */
        .header-icons {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 5px;
          padding: 0 5px;
        }
        .icon-col { width: 30%; text-align: center; }
        .icon-circle {
          width: 40px; height: 40px;
          border: 3px solid #000;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 5px;
        }
        .icon-circle.dashed { border-style: dashed; }
        
        /* Separator with Text */
        .sep-text {
          text-align: center;
          border-bottom: 1px solid #000;
          line-height: 0.1em;
          margin: 10px 0 15px;
        }
        .sep-text span {
          background: #fff;
          padding: 0 10px;
          font-size: 10px;
          font-weight: 600;
        }

        /* Warnings */
        .warning-box {
          text-align: center;
          margin-bottom: 10px;
        }
        .warning-ar { font-size: 14px; font-weight: 800; margin-bottom: 2px; }
        .warning-en { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #333; }

        /* Order ID Section */
        .order-info-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-top: 1px dashed #000;
          border-bottom: 1px solid #000;
          padding: 10px 0;
          margin-bottom: 10px;
        }
        .big-id {
          font-size: 48px; /* رقم ضخم */
          font-weight: 900;
          line-height: 0.8;
          letter-spacing: -2px;
          width: 40%;
          text-align: left; /* كما في الصورة */
          font-family: sans-serif;
        }
        .cust-details {
          width: 60%;
          text-align: right;
          font-size: 11px;
          line-height: 1.4;
          padding-right: 5px;
        }

        /* Items Table Layout - Matches Image exactly */
        .item-row {
          display: flex;
          align-items: flex-start;
          margin-bottom: 8px;
          padding-bottom: 8px;
          /* border-bottom: 1px dashed #ccc; optional */ 
        }
        .col-price {
          width: 20%;
          text-align: left;
          direction: ltr;
          font-weight: 700;
          font-size: 14px;
          line-height: 1.1;
        }
        .col-price .currency { font-size: 9px; display: block; font-weight: 600; color: #555; }
        
        .col-name {
          width: 65%;
          text-align: right;
          padding-right: 5px;
        }
        .prod-name { font-size: 13px; font-weight: 800; }
        .item-opts { font-size: 11px; color: #444; margin-top: 2px; }
        
        .col-qty {
          width: 15%;
          text-align: right;
          font-size: 16px;
          font-weight: 800;
        }

        /* Totals */
        .totals-area {
          background: #f8f8f8;
          padding: 10px 5px;
          border-top: 1px solid #000;
          margin-top: 5px;
        }
        .total-line {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .grand-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 22px;
          font-weight: 900;
          border-top: 2px solid #000;
          border-bottom: 2px solid #000;
          padding: 5px 0;
          margin-top: 8px;
        }

        /* Footer Info */
        .meta-footer {
          display: flex;
          justify-content: space-between;
          margin: 15px 0;
          font-size: 12px;
          font-weight: 700;
          border-bottom: 1px dashed #000;
          padding-bottom: 10px;
        }

        /* Brand Footer */
        .brand-footer { text-align: center; }
        .thanks { font-size: 18px; font-weight: 800; margin-bottom: 5px; }
        .address { font-size: 11px; font-weight: 600; color: #333; line-height: 1.4; }

      </style>
    </head>
    <body>
      <div class="container">
        
        <div class="header-icons">
          <div class="icon-col">
            <div class="icon-circle">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </div>
          </div>
          
          <div class="icon-col" style="width:40%; padding-top:5px;">
            <div style="font-size: 10px; font-weight:700;">استلام في</div>
            <div style="font-size: 14px; font-weight:900; line-height:1;">${timeStr}</div>
            <div style="font-size: 12px; font-weight:900; margin-top:2px;">HURRIER</div>
          </div>

          <div class="icon-col">
            <div class="icon-circle dashed">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div style="font-size: 9px; font-weight:800;">مدفوع مسبقاً</div>
          </div>
        </div>

        <div class="sep-text"><span>مجموعة</span></div>

        <div class="warning-box">
          <div class="warning-ar">طلب الخدمة - ليست فاتورة</div>
          <div class="warning-en">REQUEST - NOT AN INVOICE</div>
        </div>

        <div class="order-info-row">
          <div class="big-id">#${orderId}</div>
          <div class="cust-details">
            <div class="bold" style="font-size:12px;">${customerName}</div>
            <div style="direction:ltr; margin:2px 0;">Phone: ${customerPhone}</div>
            <div class="extra-bold">علامة مميزة: علي الترام</div>
          </div>
        </div>

        <div style="margin-bottom: 15px;">
          ${itemsHTML}
        </div>

        <div class="totals-area">
          ${delivery > 0 ? `
          <div class="total-line">
             <span>EGP ${fmt(delivery)}</span>
             <span>رسوم التوصيل</span>
          </div>` : ''}
          
          ${tax > 0 ? `
          <div class="total-line">
             <span>EGP ${fmt(tax)}</span>
             <span>رسوم الخدمة</span>
          </div>` : ''}

          <div class="grand-total">
            <span style="font-family:sans-serif;">EGP ${fmt(total)}</span>
            <span>المجموع</span>
          </div>
        </div>

        <div class="meta-footer">
          <div style="direction:ltr;">${dateStr} ${timeStr}</div>
          <div>
             <span style="font-size:10px; font-weight:500;">رقم الطلب</span>
             <span style="font-size:14px;">${orderId}</span>
          </div>
        </div>

        <div class="brand-footer">
          <div class="thanks">شكراً لطلبك</div>
          <div class="thanks" style="font-size:16px;">${branchName}</div>
          <div class="address">
            ${address}<br>
            الإسكندرية, Governorate
          </div>
        </div>

      </div>
    </body>
    </html>
  `;
};

const InvoiceOrderPage = () => {
  const { orderId } = useParams();
  const { t } = useTranslation();
  
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const userRole = localStorage.getItem("role") || "admin";
  const apiEndpoint = userRole === "branch"
      ? `${apiUrl}/branch/online_order/invoice/${orderId}`
      : `${apiUrl}/admin/order/invoice/${orderId}`;

  const { refetch, loading, data } = useGet({ url: apiEndpoint });
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => { refetch(); }, [refetch]);
  useEffect(() => { if (data?.order) setInvoiceData(data.order); }, [data]);

  const handlePrint = () => {
    const htmlContent = generateReceiptHTML(invoiceData);
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      // انتظار قصير لضمان تحميل الخطوط
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><LoaderLogin /></div>;
  if (!invoiceData) return <div className="text-center mt-10">No Data</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8 font-sans text-gray-900">
      
      {/* Header Buttons */}
      <div className="max-w-md mx-auto mb-6 px-4 flex justify-between">
        <button onClick={() => window.history.back()} className="flex items-center gap-2 px-4 py-2 bg-white rounded shadow hover:bg-gray-50">
          <FaArrowLeft /> {t("رجوع")}
        </button>
        <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded shadow hover:bg-gray-800">
          <FaPrint /> {t("طباعة الفاتورة")}
        </button>
      </div>

      {/* Screen Preview (مجرد عرض للشاشة يشبه الفاتورة) */}
      <div className="max-w-[80mm] mx-auto bg-white shadow-xl p-4 border-t-4 border-black">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold">{invoiceData.branch?.name || "بيتزا نور"}</h2>
          <p className="text-sm text-gray-500">معاينة الفاتورة</p>
        </div>
        
        <div className="border-b-2 border-dashed border-gray-300 my-4"></div>
        
        <div className="flex justify-between items-center mb-4">
            <span className="text-4xl font-black">#{invoiceData.id}</span>
            <div className="text-right text-xs">
                <p className="font-bold">{invoiceData.user?.f_name}</p>
                <p>{new Date(invoiceData.order_date).toLocaleTimeString()}</p>
            </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded text-center">
            <p className="text-sm font-bold text-gray-600">الإجمالي</p>
            <p className="text-3xl font-black mt-1">{parseFloat(invoiceData.amount).toFixed(2)} EGP</p>
        </div>

        <button onClick={handlePrint} className="w-full mt-6 bg-black text-white py-3 font-bold rounded hover:opacity-90">
            طباعة الآن
        </button>
      </div>

    </div>
  );
};

export default InvoiceOrderPage;