"use client";

import { GetBalanceStatsResponseType } from "@/app/api/stats/balance/route";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/utils";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import SkeletonWrapper from "../helper/skeleton-wrapper";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { Card } from "../ui/card";
import CountUp from "react-countup";

export default function StatsCards({
	userSettings,
	from,
	to,
}: {
	userSettings: UserSettings;
	from: Date;
	to: Date;
}) {
	const statsQuery = useQuery<GetBalanceStatsResponseType>({
		queryKey: ["overview", "stats", from, to],
		queryFn: () =>
			fetch(
				`/api/stats/balance?from=${DateToUTCDate(
					from
				)}&to=${DateToUTCDate(to)}`
			).then((res) => res.json()),
	});

	const formatter = useMemo(() => {
		return GetFormatterForCurrency(userSettings.currency);
	}, [userSettings.currency]);

	const income = statsQuery.data?.income || 0;
	const expense = statsQuery.data?.expense || 0;
	const balance = income - expense;

	return (
		<div className="relative flex w-full flex-wrap gap-2 md:flex-nowrap">
			<SkeletonWrapper isLoading={statsQuery.isLoading} fullWidth>
				<StatsCard
					formatter={formatter}
					title="Income"
					value={income}
					icon={
						<TrendingUp className="h-12 w-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10" />
					}
				/>
			</SkeletonWrapper>

			<SkeletonWrapper isLoading={statsQuery.isLoading} fullWidth>
				<StatsCard
					formatter={formatter}
					title="Expense"
					value={expense}
					icon={
						<TrendingDown className="h-12 w-12 items-center rounded-lg p-2 text-red-500 bg-red-400/10" />
					}
				/>
			</SkeletonWrapper>

			<SkeletonWrapper isLoading={statsQuery.isLoading} fullWidth>
				<StatsCard
					formatter={formatter}
					title="Balance"
					value={balance}
					icon={
						<Wallet className="h-12 w-12 items-center rounded-lg p-2 text-violet-500 bg-violet-400/10" />
					}
				/>
			</SkeletonWrapper>
		</div>
	);
}

function StatsCard({
	title,
	value,
	formatter,
	icon,
}: {
	title: string;
	value: number;
	formatter: Intl.NumberFormat;
	icon: React.ReactNode;
}) {
	const fomatFn = useCallback(
		(value: number) => formatter.format(value),
		[formatter]
	);
	return (
		<Card className="flex h-24 w-full items-center gap-2 p-4">
			{icon}
			<div className="flex flex-col items-start gap-0">
				<p className="text-muted-foreground">{title}</p>
				<CountUp
					preserveValue
					redraw={false}
					end={value}
					decimals={2}
					formattingFn={fomatFn}
					className="text-2xl"
				/>
			</div>
		</Card>
	);
}
