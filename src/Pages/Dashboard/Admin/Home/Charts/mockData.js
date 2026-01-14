// Utility to generate representative mock data for the dashboard
export const generateMockDashboardData = () => {
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    const threeHourIntervals = [
        "00:00 - 03:00", "03:00 - 06:00", "06:00 - 09:00", "09:00 - 12:00",
        "12:00 - 15:00", "15:00 - 18:00", "18:00 - 21:00", "21:00 - 00:00"
    ];

    return {
        kpis: {
            activeOrders: 42,
            activeAmount: 1250.50,
            occupiedTables: 12,
            offlineCashiers: 2
        },
        timeSeries: {
            labels: threeHourIntervals,
            orders: [10, 5, 8, 45, 85, 120, 95, 30],
            netSales: [450, 200, 350, 2100, 4200, 5800, 4100, 1200],
            netPayments: [400, 180, 300, 1900, 3900, 5400, 3800, 1100],
            returns: [0, 0, 5, 20, 45, 60, 30, 10],
            discounts: [10, 5, 15, 80, 150, 220, 140, 40]
        },
        orderTypes: {
            labels: hours.slice(10, 22), // Focus on peak hours
            dineIn: [5, 8, 15, 20, 12, 10, 18, 25, 30, 20, 15, 10],
            delivery: [10, 12, 10, 15, 20, 25, 30, 35, 25, 20, 15, 12],
            takeaway: [8, 10, 12, 8, 10, 15, 12, 10, 8, 12, 10, 8]
        },
        hourlySales: {
            labels: hours,
            orders: Array.from({ length: 24 }, () => Math.floor(Math.random() * 50))
        },
        topProducts: {
            labels: ["Triple Burger", "Chicken Wrap", "Pizza Margherita", "Caesar Salad", "French Fries"],
            values: [4500, 3800, 3200, 2100, 1800]
        },
        topPayments: {
            labels: ["Cash", "Credit Card", "Online", "Wallet"],
            values: [45, 35, 15, 5]
        },
        topBranches: {
            labels: ["Main City", "West Mall", "Airport", "Downtown"],
            values: [40, 30, 20, 10]
        }
    };
};
