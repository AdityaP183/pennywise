import { z } from "zod";
import { Currencies } from "../currencies";

export const UpdateUserCurrencySchema = z.object({
	currency: z.custom((value) => {
		const found = Currencies.find((currency) => currency.name === value);
		if (!found) throw new Error(`Invalid currency ${value}`);
		return value;
	}),
});
