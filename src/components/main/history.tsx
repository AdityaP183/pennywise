"use client";

import { Period, TimeFrame } from "@/lib/types";
import { cn, GetFormatterForCurrency } from "@/lib/utils";
import { UserSettings } from "@prisma/client";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import HistoryPeriodSelector from "../helper/history-period-selector";
import { useQuery } from "@tanstack/react-query";
import { HistoryDataResponseType } from "@/app/api/history-data/route";
import SkeletonWrapper from "../helper/skeleton-wrapper";
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import CountUp from "react-countup";

export default function History({
	userSettings,
}: {
	userSettings: UserSettings;
}) {
	const [timeframe, setTimeframe] = useState<TimeFrame>("month");
	const [period, setPeriod] = useState<Period>({
		year: new Date().getFullYear(),
		month: new Date().getMonth(),
	});

	const formatter = useMemo(() => {
		return GetFormatterForCurrency(userSettings.currency);
	}, [userSettings.currency]);

	const historyDataQuery = useQuery<HistoryDataResponseType>({
		queryKey: ["overview", "history", timeframe, period],
		queryFn: () =>
			fetch(
				`/api/history-data?timeframe=${timeframe}&year=${period.year}&month=${period.month}`
			).then((res) => res.json()),
	});

	const dataAvailable =
		historyDataQuery.data && historyDataQuery.data.length > 0;

	return (
		<div className="container mx-auto">
			<h2 className="mt-12 text-3xl font-bold">History</h2>

			<Card className="col-span-12 mt-2 w-full">
				<CardHeader className="gap-2">
					<CardTitle className="grid gird-flow-row gap-2 justify-between md:grid-flow-col">
						<HistoryPeriodSelector
							timeframe={timeframe}
							setTimeframe={setTimeframe}
							period={period}
							setPeriod={setPeriod}
						/>

						<div className="flex h-10 gap-2">
							<Badge
								variant="outline"
								className="flex items-center gap-2 text-sm"
							>
								<div className="h-4 w-4 rounded-full bg-emerald-500" />
								Income
							</Badge>
							<Badge
								variant="outline"
								className="flex items-center gap-2 text-sm"
							>
								<div className="h-4 w-4 rounded-full bg-rose-500" />
								Expense
							</Badge>
						</div>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<SkeletonWrapper isLoading={historyDataQuery.isFetching}>
						{dataAvailable && (
							<ResponsiveContainer width={"100%"} height={300}>
								<BarChart
									height={300}
									data={historyDataQuery.data}
									barCategoryGap={5}
								>
									<defs>
										<linearGradient
											id="incomeBar"
											x1="0"
											x2="0"
											y1="0"
											y2="1"
										>
											<stop
												offset="0"
												stopColor="#10b981"
												stopOpacity={1}
											/>
											<stop
												offset="1"
												stopColor="#10b981"
												stopOpacity={0}
											/>
										</linearGradient>
										<linearGradient
											id="expenseBar"
											x1="0"
											x2="0"
											y1="0"
											y2="1"
										>
											<stop
												offset="0"
												stopColor="#ef4444"
												stopOpacity={1}
											/>
											<stop
												offset="1"
												stopColor="#ef4444"
												stopOpacity={0}
											/>
										</linearGradient>
									</defs>
									<CartesianGrid
										strokeDasharray="5 5"
										strokeOpacity={0.2}
										vertical={false}
									/>
									<XAxis
										stroke="#888888"
										fontSize={12}
										tickLine={false}
										axisLine={false}
										padding={{ left: 5, right: 5 }}
										dataKey={(data) => {
											const { year, month, day } = data;
											const date = new Date(
												year,
												month,
												day || 1
											);
											if (timeframe === "year") {
												return date.toLocaleDateString(
													"default",
													{
														month: "long",
													}
												);
											}
											return date.toLocaleDateString(
												"default",
												{
													day: "2-digit",
												}
											);
										}}
									/>
									<YAxis
										stroke="#888888"
										fontSize={12}
										tickLine={false}
										axisLine={false}
									/>
									<Bar
										dataKey="income"
										label="Income"
										fill="url(#incomeBar)"
										radius={4}
										className="cursor-pointer"
									/>
									<Bar
										dataKey="expense"
										label="Expense"
										fill="url(#expenseBar)"
										radius={4}
										className="cursor-pointer"
									/>
									<Tooltip
										cursor={{ opacity: 0.1 }}
										content={(props) => (
											<CustomTooltip
												{...props}
												formatter={formatter}
											/>
										)}
									/>
								</BarChart>
							</ResponsiveContainer>
						)}
						{!dataAvailable && (
							<Card className="flex h-[300px] flex-col items-center justify-between bg-background">
								No data for the selected period
								<p className="text-sm text-muted-foreground">
									Try selecting a different period or try
									adding new transactions
								</p>
							</Card>
						)}
					</SkeletonWrapper>
				</CardContent>
			</Card>
		</div>
	);
}

function CustomTooltip({ active, payload, formatter }: any) {
	if (!active || !payload || payload.length === 0) return null;

	const data = payload[0].payload;
	const { expense, income } = data;

	return (
		<div className="min-w-[300px] rounded-lg border border-border bg-background p-4">
			<TooltipRow
				formatter={formatter}
				label="Income"
				value={income}
				bgColor="bg-emerald-500"
				textColor="text-emerald-500"
			/>
			<TooltipRow
				formatter={formatter}
				label="Expense"
				value={expense}
				bgColor="bg-rose-500"
				textColor="text-rose-500"
			/>
			<TooltipRow
				formatter={formatter}
				label="Balance"
				value={income - expense}
				bgColor="bg-violet-500"
				textColor="text-violet-500"
			/>
		</div>
	);
}

function TooltipRow({
	label,
	value,
	bgColor,
	textColor,
	formatter,
}: {
	label: string;
	value: number;
	bgColor: string;
	textColor: string;
	formatter: Intl.NumberFormat;
}) {
	return (
		<div className="flex items-center gap-2">
			<div className={cn("h-4 w-4 rounded-full", bgColor)} />
			<div className="flex w-full justify-between">
				<p className="text-sm text-muted-foreground">{label}</p>
				<div className={cn("text-sm font-bold", textColor)}>
					{formatter.format(value)}
				</div>
			</div>
		</div>
	);
}
