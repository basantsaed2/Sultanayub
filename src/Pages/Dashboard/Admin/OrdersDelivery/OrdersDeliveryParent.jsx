// DeliveryManOrdersParent.jsx
import React, { useState } from 'react';
import AllOrdersDeliveryTab from './AllOrdersDeliveryTab';
import CurrentOrdersTab from './CurrentOrdersTab';
import FailedOrdersTab from './FailedOrdersTab';
import { useTranslation } from 'react-i18next';

const TABS = {
  ALL: 'all',
  CURRENT: 'current',
  FAILED: 'failed',
};

const OrdersDeliveryParent = () => {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState(TABS.ALL);

  return (
    <div className="p-2 md:p-6 pb-32">
      <h1 className="text-xl md:text-xl font-bold text-thirdColor mb-6">
        {t('All Orders Delivery')}
      </h1>

      {/* Tabs - Always visible */}
      <div className="flex border-b mb-6 overflow-x-auto">
        {[
          { key: TABS.ALL, label: t('All Orders') },
          { key: TABS.CURRENT, label: t('Current Orders') },
          { key: TABS.FAILED, label: t('Returned / Failed') },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-3 font-bold text-lg whitespace-nowrap border-b-4 transition ${activeTab === tab.key
              ? 'border-mainColor text-mainColor'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === TABS.ALL && <AllOrdersDeliveryTab />}
        {activeTab === TABS.CURRENT && <CurrentOrdersTab />}
        {activeTab === TABS.FAILED && <FailedOrdersTab />}
      </div>
    </div>
  );
};

export default OrdersDeliveryParent;