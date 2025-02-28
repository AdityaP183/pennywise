"use client";

import { GetBalanceStatsResponseType } from "@/app/api/stats/balance/route";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/utils";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import SkeletonWrapper from "../helper/skeleton-wrapper";
import { TransactionType } from "@/lib/types";
import { CategoryStatsResponseType } from "@/app/api/stats/categories/route";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Progress } from "../ui/progress";

export default function CategoriesStats({
	userSettings,
	from,
	to,
}: {
	userSettings: UserSettings;
	from: Date;
	to: Date;
}) {
	const statsQuery = useQuery<CategoryStatsResponseType>({
		queryKey: ["overview", "stats", "categories", from, to],
		queryFn: () =>
			fetch(
				`/api/stats/categories?from=${DateToUTCDate(
					from
				)}&to=${DateToUTCDate(to)}`
			).then((res) => res.json()),
	});

	const formatter = useMemo(() => {
		return GetFormatterForCurrency(userSettings.currency);
	}, [userSettings.currency]);

	return (
		<div className="flex w-full flex-wrap gap-2 md:flex-nowrap">
			<SkeletonWrapper isLoading={statsQuery.isLoading} fullWidth>
				<CategoriesCard
					data={statsQuery.data || []}
					formatter={formatter}
					type="income"
				/>
			</SkeletonWrapper>
			<SkeletonWrapper isLoading={statsQuery.isLoading} fullWidth>
				<CategoriesCard
					data={statsQuery.data || []}
					formatter={formatter}
					type="expense"
				/>
			</SkeletonWrapper>
		</div>
	);
}

function CategoriesCard({
	data,
	formatter,
	type,
}: {
	data: CategoryStatsResponseType;
	formatter: Intl.NumberFormat;
	type: TransactionType;
}) {
	const filteredData = data.filter((item) => item.type === type);
	const total = filteredData.reduce(
		(acc, item) => acc + (item._sum?.amount || 0),
		0
	);
    console.log(filteredData)

	return (
		<Card className="h-80 w-full col-span-6">
			<CardHeader>
				<CardTitle className="grid grid-flow-row justify-between gap-2 to-muted-foreground md:grid-flow-col">
					{type === "income" ? "Income" : "Expense"} by category
				</CardTitle>
			</CardHeader>

			<div className="flex items-center justify-between gap-2">
				{filteredData.length === 0 && (
					<div className="flex h-60 w-full flex-col items-center justify-center">
						No data for the selected period
						<p className="text-sm text-muted-foreground">
							Try selecting a different period or try adding new{" "}
							{type === "income" ? "incomes" : "expenses"}
						</p>
					</div>
				)}

				{filteredData.length > 0 && (
					<ScrollArea className="h-60 w-full px-4">
						<div className="flex w-full flex-col gap-4 p-4">
							{filteredData.map((item) => {
								const amount = item._sum?.amount || 0;
								const percentage =
									(amount * 100) / (total || amount);

								return (
									<div
										key={item.category}
										className="flex flex-col gap-2"
									>
										<div className="flex items-center justify-between">
											<span className="flex items-center">
												{item.categoryIcon}{" "}
												{item.categoryName}
												<span className="text-muted-foreground text-xs ml-2">
													({percentage.toFixed(0)}%)
												</span>
											</span>

											<span className="text-sm text-muted-foreground">
												{formatter.format(amount)}
											</span>
										</div>

                                        <Progress value={percentage} indicator={type === "income" ? "bg-emerald-500" : "bg-rose-500"} />
									</div>
								);
							})}
						</div>
					</ScrollArea>
				)}
			</div>
		</Card>
	);
}
