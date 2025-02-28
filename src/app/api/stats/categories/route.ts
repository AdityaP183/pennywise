import { prisma } from "@/lib/primsa";
import { OverviewQuerySchema } from "@/lib/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
	const user = await currentUser();
	if (!user) redirect("/sign-in");

	const { searchParams } = new URL(request.url);
	const from = searchParams.get("from");
	const to = searchParams.get("to");

	const queryParams = OverviewQuerySchema.safeParse({ from, to });
	if (!queryParams.success) throw new Error(queryParams.error.message);

	const stats = await getCategoriesStats(
		user.id,
		queryParams.data.from,
		queryParams.data.to
	);

	return Response.json(stats);
}

export type CategoryStatsResponseType = Awaited<
	ReturnType<typeof getCategoriesStats>
>;

async function getCategoriesStats(userId: string, from: Date, to: Date) {
	const stats = await prisma.transaction.groupBy({
		by: ["type", "category", "categoryIcon"],
		where: {
			userId,
			date: {
				gte: from,
				lte: to,
			},
		},
		_sum: {
			amount: true,
		},
		orderBy: {
			_sum: {
				amount: "desc",
			},
		},
	});

	const categories = await prisma.category.findMany({
		where: {
			userId,
			id: { in: stats.map((s) => s.category) }, // ✅ Match `id` instead of `name`
		},
		select: {
			id: true,
			name: true,
			icon: true,
			type: true,
		},
	});

	// Merge category names correctly using `id`
	const mergedStats = stats.map((stat) => ({
		...stat,
		categoryName:
			categories.find((c) => c.id === stat.category)?.name || "Unknown",
		categoryIcon:
			categories.find((c) => c.id === stat.category)?.icon || "",
	}));

	return mergedStats;
}
