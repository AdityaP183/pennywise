import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Currencies } from "./currencies";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function DateToUTCDate(date: Date) {
	return new Date(
		Date.UTC(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
			date.getHours(),
			date.getMinutes(),
			date.getSeconds(),
			date.getMilliseconds()
		)
	);
}

export function GetFormatterForCurrency(currency: string) {
	const locale = Currencies.find((c) => c.name === currency)?.locale;
	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency,
	});
}
