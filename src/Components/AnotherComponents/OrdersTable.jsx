// Components/AnotherComponents/OrdersTable.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const OrdersTable = ({
  orders,
  showCheckbox = false,
  selectedOrders = [],
  onSelectOrder,
  onSelectAll,
  allSelected = false
}) => {
  const { t } = useTranslation();

  if (!orders || orders.length === 0) {
    return <p className="text-center py-10 text-xl text-gray-500">{t('No orders found')}</p>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <table className="w-full min-w-max">
        <thead className="bg-gray-50">
          <tr>
            {showCheckbox && (
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAll}
                  className="w-5 h-5 text-mainColor rounded focus:ring-mainColor"
                />
              </th>
            )}
            <th className="px-6 py-4 text-left text-sm font-bold text-thirdColor">{t('Order ID')}</th>
            <th className="px-6 py-4 text-left text-sm font-bold text-thirdColor">{t('Order Number')}</th>
            <th className="px-6 py-4 text-left text-sm font-bold text-thirdColor">{t('Customer')}</th>
            <th className="px-6 py-4 text-left text-sm font-bold text-thirdColor">{t('Phone')}</th>
            <th className="px-6 py-4 text-left text-sm font-bold text-thirdColor">{t('Address')}</th>
            <th className="px-6 py-4 text-left text-sm font-bold text-thirdColor">{t('Amount')}</th>
            <th className="px-6 py-4 text-left text-sm font-bold text-thirdColor">{t('Date')}</th>
            <th className="px-6 py-4 text-left text-sm font-bold text-thirdColor">{t('Time')}</th>
            <th className="px-6 py-4 text-left text-sm font-bold text-thirdColor">{t('Branch')}</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b hover:bg-gray-50">
              {showCheckbox && (
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => onSelectOrder(order.id)}
                    className="w-5 h-5 text-mainColor rounded focus:ring-mainColor"
                  />
                </td>
              )}
              <td className="px-6 py-4 font-medium">{order.id}</td>
              <td className="px-6 py-4 font-mono text-mainColor">{order.order_number}</td>
              <td className="px-6 py-4">{order.user?.name || '-'}</td>
              <td className="px-6 py-4">{order.user?.phone || '-'}</td>
              <td className="px-6 py-4 max-w-xs truncate" title={order.address?.address}>
                {order.address?.address || '-'}
              </td>
              <td className="px-6 py-4 font-semibold">{order.amount} EGP</td>
              <td className="px-6 py-4">{order.date}</td>
              <td className="px-6 py-4">{order.time}</td>
              <td className="px-6 py-4">{order.branch}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;