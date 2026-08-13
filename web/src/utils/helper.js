const formatCurrency = (value) => {
    if (value === undefined || value === null) return "$0.00";
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
    }).format(value);
};

const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

export { formatCurrency, formatDate };
