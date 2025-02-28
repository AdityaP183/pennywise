export const Currencies = [
    {
        name: "USD",
        symbol: "$",
        locale: "en-US",
    },
    {
        name: "INR",
        symbol: "₹",
        locale: "en-IN",
    },
    {
        name: "EUR",
        symbol: "€",
        locale: "de-DE",
    },
    {
        name: "GBP",
        symbol: "£",
        locale: "en-GB",
    },
    {
        name: "JPY",
        symbol: "¥",
        locale: "ja-JP",
    },
];

export type Currency = typeof Currencies[number];
