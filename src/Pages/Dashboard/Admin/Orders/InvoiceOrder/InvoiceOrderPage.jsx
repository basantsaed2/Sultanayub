import React, { useEffect, useState } from "react";
import { useGet } from "../../../../../Hooks/useGet";
import { useParams } from "react-router-dom";
import { LoaderLogin } from "../../../../../Components/Components";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const InvoiceOrderPage = () => {
  const user = useSelector((state) => state.user);
  const { orderId } = useParams();
  const { t, i18n } = useTranslation();

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const {
    refetch: refetchInvoiceOrder,
    loading: loadingInvoiceOrder,
    data: dataInvoiceOrder,
  } = useGet({ url: `${apiUrl}/admin/order/invoice/${orderId}` });

  const [invoiceData, setInvoiceData] = useState([]);

  useEffect(() => {
    refetchInvoiceOrder(); // Refetch data when the component mounts
  }, [refetchInvoiceOrder]);

  useEffect(() => {
    if (dataInvoiceOrder && dataInvoiceOrder.order) {
      setInvoiceData(dataInvoiceOrder.order);
    }
    console.log("dataInvoiceOrder", dataInvoiceOrder); // Refetch data when the component mounts
  }, [dataInvoiceOrder]);
  useEffect(() => {
    console.log("orderId", orderId); // Refetch data when the component mounts
  }, [orderId]);

  let totalAddonPrice = 0;
  let totalItemPrice = 0;

  return (
    <>
      {invoiceData.length === 0 ? (
        <div>
          <LoaderLogin />
        </div>
      ) : (
        <div className="w-2/4 p-6 mx-auto mb-20 font-sans text-black">
          {/* Header */}
          <div className="mb-4 text-center">
            <h1 className="text-lg font-TextFontSemiBold">
              {invoiceData?.user.name}
            </h1>
            <p className="text-sm">
              {invoiceData?.branch?.name || "-"}
              {invoiceData?.branch?.address || "-"}
            </p>
            <p className="text-sm">
              {t("Phone")} : {invoiceData?.branch?.phone || "-"}
            </p>
            <hr className="my-2" />
          </div>

          {/* Order Information */}
          <div className="mb-4 text-sm">
            <p>
              <strong>{t("OrderID")} : </strong> {invoiceData.id}{" "}
              &nbsp;&nbsp;&nbsp;
              <strong>{t("Date")}: </strong> {invoiceData?.order_date || "-"},{" "}
              {invoiceData?.date || "-"}
            </p>
            <p>
               <strong>{t("CustomerName")} : </strong>{" "}
              {invoiceData?.user?.f_name || "-"}{" "}
              {invoiceData?.user?.l_name || "-"}
            </p>
            <p>
               <strong>{t("Phone")} : </strong> {invoiceData?.user?.phone || "-"}
            </p>
            <p>
               <strong>{t("Address")} : </strong> {invoiceData?.address?.address || "-"}
            </p>
          </div>

          {/* Items Table */}
          {invoiceData.order_details.map((item, index) => (
            <div className="border-b-2 border-gray-500" key={index}>
              <div className="mb-2 text-center">
                <strong>Product Num({index + 1})</strong>
              </div>
              <table className="w-full mb-4 text-sm border-2 border-collapse border-black">
                <thead>
                  <tr>
                    <th className="p-2 border border-black">{t("QTY")}</th>
                    <th className="p-2 border border-black">{t("DESC")}</th>
                    <th className="p-2 border border-black">{t("Price")}</th>
                    <th className="p-2 border border-black">{t("Count")}</th>
                  </tr>
                </thead>
                <tbody>
                  {item.product.map((itemProduct, indexProduct) => (
                    <tr key={`product-${itemProduct.id}-${indexProduct}`}>
                      <td className="p-2 text-center border border-black">
                        {indexProduct + 1}
                      </td>
                      <td className="p-2 text-center border border-black">
                        {itemProduct.product.name}
                      </td>
                      <td className="p-2 text-center border border-black">
                        {itemProduct.product.price}
                      </td>
                      <td className="p-2 text-center border border-black">
                        {itemProduct.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mb-2 text-center">
                <strong>Addons Num({index + 1})</strong>
              </div>
              <table className="w-full mb-4 text-sm border-2 border-collapse border-black">
                <thead>
                  <tr>
                     <th className="p-2 border border-black">{t("QTY")}</th>
                    <th className="p-2 border border-black">{t("DESC")}</th>
                    <th className="p-2 border border-black">{t("Price")}</th>
                    <th className="p-2 border border-black">{t("Count")}</th>
                  </tr>
                </thead>
                <tbody>
                  {item.addons.map((itemAddons, indexAddons) => (
                    <tr key={itemAddons.addon.id}>
                      <td className="p-2 text-center border border-black">
                        {indexAddons + 1}
                      </td>
                      <td className="p-2 text-center border border-black">
                        {itemAddons.addon.name}
                      </td>
                      <td className="p-2 text-center border border-black">
                        {itemAddons.addon.price}
                      </td>
                      <td className="p-2 text-center border border-black">
                        {itemAddons.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mb-2 text-center">
                <strong>Excludes Num({index + 1})</strong>
              </div>
              <table className="w-full mb-4 text-sm border-2 border-collapse border-black">
                <thead>
                  <tr>
                           <th className="p-2 border border-black">{t("QTY")}</th>
                    <th className="p-2 border border-black">{t("DESC")}</th>
                  </tr>
                </thead>
                <tbody>
                  {item.excludes.map((itemExclude, indexExclude) => (
                    <tr key={itemExclude.id}>
                      <td className="p-2 text-center border border-black">
                        {indexExclude + 1}
                      </td>
                      <td className="p-2 text-center border border-black">
                        {itemExclude.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mb-2 text-center">
                <strong>Extras Num({index + 1})</strong>
              </div>
              <table className="w-full mb-4 text-sm border-2 border-collapse border-black">
                <thead>
                  <tr>
                        <th className="p-2 border border-black">{t("QTY")}</th>
                    <th className="p-2 border border-black">{t("DESC")}</th>
                    <th className="p-2 border border-black">{t("Price")}</th>
                  </tr>
                </thead>
                <tbody>
                  {item.extras.map((itemExtra, indexExtra) => (
                    <tr key={itemExtra.id}>
                      <td className="p-2 text-center border border-black">
                        {indexExtra + 1}
                      </td>
                      <td className="p-2 text-center border border-black">
                        {itemExtra.name}
                      </td>
                      <td className="p-2 text-center border border-black">
                        {itemExtra.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mb-2 text-center">
                <strong>Variations Num({index + 1})</strong>
              </div>
              {item.variations.map((item, indexItem) => (
                <div key={item.variation.id}>
                  <div className="mb-2 text-center">
                    <strong>Variation({indexItem + 1})</strong>
                  </div>
                  <table className="w-full mb-4 text-sm border-2 border-collapse border-black">
                    <thead>
                      <tr>
                        {/* <th className="p-2 border border-black">QTY</th> */}
                 <th className="p-2 border border-black">{t("Name")}</th>
                        <th className="p-2 border border-black">{t("Type")}</th>
                        <th className="p-2 border border-black">{t("Max")}</th>
                        <th className="p-2 border border-black">{t("Min")}</th>
                        {/* <th className="p-2 border border-black">Point</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {/* <td className="p-2 text-center border border-black">{indexItem + 1}</td> */}
                        <td className="p-2 text-center border border-black">
                          {item.variation.name || "-"}
                        </td>
                        <td className="p-2 text-center border border-black">
                          {item.variation.type || "-"}
                        </td>
                        <td className="p-2 text-center border border-black">
                          {item.variation.max || "0"}
                        </td>
                        <td className="p-2 text-center border border-black">
                          {item.variation.min || "0"}
                        </td>
                        {/* <td className="p-2 text-center border border-black">{item.variation.point || '0'}</td> */}
                      </tr>
                    </tbody>
                  </table>

                  {item.options.map((option, indexOption) => (
                    <div key={option.id}>
                      <div className="mb-2 text-center">
                        <strong>Option({indexOption + 1})</strong>
                      </div>

                      <table className="w-full mb-4 text-sm border-2 border-collapse border-black">
                        <thead>
                          <tr>
                           <th className="p-2 border border-black">{t("QTY")}</th>
                            <th className="p-2 border border-black">{t("Name")}</th>
                            <th className="p-2 border border-black">{t("Price")}</th>
                            <th className="p-2 border border-black">{t("Points")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-2 text-center border border-black">
                              {indexOption + 1}
                            </td>
                            <td className="p-2 text-center border border-black">
                              {option.name || "-"}
                            </td>
                            <td className="p-2 text-center border border-black">
                              {option.price || "0"}
                            </td>
                            <td className="p-2 text-center border border-black">
                              {option.points || "0"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}

          {/* Summary */}
          <div className="mb-4 text-sm">
            <p>
              {invoiceData.order_details.forEach((orderDetail) => {
                // Sum extras prices
                orderDetail.extras.forEach((extraItem) => {
                  totalItemPrice += extraItem.price;
                });

                // Sum product prices (price * count)
                orderDetail.product.forEach((productItem) => {
                  totalItemPrice +=
                    productItem.product.price * productItem.count;
                });

                // Sum variations' options prices
                // orderDetail.variations.forEach((variation) => {
                //   variation.options.forEach((optionItem) => {
                //     totalItemPrice += optionItem.price;
                //   });
                // });
              })}

              {/* Display total items price */}
              <strong>{t("ItemsPrice")}: </strong>
              {totalItemPrice}
            </p>
            <p>
              <strong>{t("Tax/VAT")}: </strong> {invoiceData?.total_tax || 0}
            </p>
            <div>
              {invoiceData.order_details.map((orderDetail, detailIndex) => (
                <div key={detailIndex}>
                  {orderDetail.addons.map((addonItem, addonIndex) => {
                    // Add the price of each addon to the total
                    totalAddonPrice += addonItem.addon.price * addonItem.count;
                    return;
                  })}
                </div>
              ))}

              {/* console.log('first', first) */}

              {/* Display the total addon price */}
              {/* <div> */}
              <strong>{t("Addons Price")}: </strong>{totalAddonPrice}
              {totalAddonPrice}
              {/* </div> */}
            </div>
            <p>
              <strong>{t("Subtotal")}:: </strong>{" "}
              {invoiceData?.amount + invoiceData?.total_tax + totalAddonPrice}
            </p>
            <p>
              <strong>{t("ExtraDiscount")}: </strong>{" "}
              {invoiceData?.total_discount || 0}
            </p>
            <p>
              <strong>{t("CouponDiscount")}: </strong>{" "}
              {invoiceData?.coupon_discount || 0}
            </p>
            <p>
             <strong>{t("DeliveryFee")}: </strong>{" "}
              {invoiceData?.address?.zone?.price || 0}
            </p>
            <p className="text-lg semibold">
              <strong>{t("Total")}: </strong>
              {invoiceData?.amount}
            </p>
          </div>

          {/* Footer */}
          <div className="text-sm text-center">
              <p>{t("THANKYOU")}</p>
            <p>{t("copyrightreceived")} {invoiceData.user.name} {t("Food")}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default InvoiceOrderPage;
