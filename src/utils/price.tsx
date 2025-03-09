/**
 * Returns a formatted price string based on the amount, currency, and quantity of a product.
 *
 * This function uses the Intl.NumberFormat object to create a number formatter that formats the amount according to the currency and locale.
 * The function also checks if the currency is a zero-decimal currency, meaning that it does not use fractional units, such as Japanese yen or Korean won.
 * If it is a zero-decimal currency, the function does not divide the amount by 100. Otherwise, it does so to convert the amount from cents to dollars.
 * The function then multiplies the amount by the quantity and rounds it to two decimal places. The function returns the formatted price as a string.
 *
 * @module utils
 * @function formatPrice
 * @param number amount - The amount of the product in cents.
 * @param string currency - The currency of the product, such as "USD" or "JPY".
 * @param number quantity - The quantity of the product.
 * @returns string - The formatted price of the product with the currency symbol and two decimal places.
 *
 * @example
 * // returns "$20.00"
 * formatPrice(10, "USD", 2);
 *
 * @see {@link https://github.com/stripe-samples/checkout-one-time-payments|Checkout One-Time Payments Sample Code}
 */
export const formatPrice = (
	amount: number,
	currency: string,
	quantity: number
): string => {
	const numberFormat = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
		currencyDisplay: "symbol",
	});
	const parts = numberFormat.formatToParts(amount);
	let zeroDecimalCurrency = true;
	for (let part of parts) {
		if (part.type === "decimal") {
			zeroDecimalCurrency = false;
		}
	}
	amount = zeroDecimalCurrency ? amount : amount / 100;
	const total = (quantity * amount).toFixed(2);
	return total;
};
