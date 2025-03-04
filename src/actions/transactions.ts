"use server";

import { prisma } from "@/lib/primsa";
import {
	CreateTransactionSchema,
	CreateTransactionSchemaType,
} from "@/lib/schema/transaction";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateTransaction(form: CreateTransactionSchemaType) {
	const parsedBody = CreateTransactionSchema.safeParse(form);
	if (!parsedBody.success) throw new Error("bad request");

	const user = await currentUser();
	if (!user) redirect("/sign-in");

	const { amount, description, date, category, type } = parsedBody.data;
	const categoryRow = await prisma.category.findFirst({
		where: { name: category, userId: user.id },
	});
	if (!categoryRow) throw new Error("category not found");

	await prisma.$transaction([
		// Create user transaction
		prisma.transaction.create({
			data: {
				userId: user.id,
				amount,
				description: description || "",
				date,
				type,
				category: categoryRow.id,
				categoryIcon: categoryRow.icon,
			},
		}),

		// Update monthly history table
		prisma.monthHistory.upsert({
            where: {
                day_month_year_userId: {
                    userId: user.id,
					day: date.getUTCDate(),
					month: date.getUTCMonth(),
					year: date.getUTCFullYear(),
				},
			},
			create: {
				userId: user.id,
				day: date.getUTCDate(),
				month: date.getUTCMonth(),
				year: date.getUTCFullYear(),
				expense: type === "expense" ? amount : 0,
				income: type === "income" ? amount : 0,
			},
			update: {
                expense: {
                    increment: type === "expense" ? amount : 0,
				},
				income: {
                    increment: type === "income" ? amount : 0,
				},
			},
		}),

        // Update yearly history table
		prisma.yearHistory.upsert({
			where: {
				month_year_userId: {
					userId: user.id,
					month: date.getUTCMonth(),
					year: date.getUTCFullYear(),
				},
			},
			create: {
				userId: user.id,
				month: date.getUTCMonth(),
				year: date.getUTCFullYear(),
				expense: type === "expense" ? amount : 0,
				income: type === "income" ? amount : 0,
			},
			update: {
				expense: {
					increment: type === "expense" ? amount : 0,
				},
				income: {
					increment: type === "income" ? amount : 0,
				},
			},
		}),
	]);
}
