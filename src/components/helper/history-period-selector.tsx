"use client";

import { HistoryPeriodType } from "@/app/api/history-periods/route";
import { Period, TimeFrame } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "./skeleton-wrapper";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

export default function HistoryPeriodSelector({
	timeframe,
	period,
	setTimeframe,
	setPeriod,
}: {
	timeframe: TimeFrame;
	period: Period;
	setTimeframe: (timeframe: TimeFrame) => void;
	setPeriod: (period: Period) => void;
}) {
	const historyPeriods = useQuery<HistoryPeriodType>({
		queryKey: ["overview", "history", "periods"],
		queryFn: () => fetch("/api/history-periods").then((res) => res.json()),
        refetchOnWindowFocus: false
	});

	return (
		<div className="flex flex-wrap items-center gap-4">
			<SkeletonWrapper
				isLoading={historyPeriods.isFetching}
				fullWidth={false}
			>
				<Tabs
					value={timeframe}
					onValueChange={(v) => setTimeframe(v as TimeFrame)}
				>
					<TabsList>
						<TabsTrigger value="year">Year</TabsTrigger>
						<TabsTrigger value="month">Month</TabsTrigger>
					</TabsList>
				</Tabs>
			</SkeletonWrapper>

			<div className="flex flex-wrap items-center gap-2">
				<SkeletonWrapper isLoading={historyPeriods.isFetching}>
					<YearSelector
						period={period}
						setPeriod={setPeriod}
						years={historyPeriods.data || []}
					/>
				</SkeletonWrapper>
				{timeframe === "month" && (
					<SkeletonWrapper
						isLoading={historyPeriods.isFetching}
						fullWidth={false}
					>
						<MonthSelector period={period} setPeriod={setPeriod} />
					</SkeletonWrapper>
				)}
			</div>
		</div>
	);
}

function YearSelector({
	period,
	setPeriod,
	years,
}: {
	period: Period;
	setPeriod: (period: Period) => void;
	years: HistoryPeriodType;
}) {
	return (
		<Select
			value={period.year.toString()}
			onValueChange={(v) =>
				setPeriod({ month: period.month, year: parseInt(v) })
			}
		>
			<SelectTrigger className="w-[180px]">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{years.map((year) => (
					<SelectItem key={year} value={year.toString()}>
						{year}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

function MonthSelector({
	period,
	setPeriod,
}: {
	period: Period;
	setPeriod: (period: Period) => void;
}) {
	return (
		<Select
			value={period.month.toString()}
			onValueChange={(v) =>
				setPeriod({ month: period.month, year: parseInt(v) })
			}
		>
			<SelectTrigger className="w-[180px]">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{[...Array(12).keys()].map((month) => {
					const monthStr = new Date(
						period.year,
						month,
						1
					).toLocaleString("default", { month: "long" });

					return (
						<SelectItem key={month} value={month.toString()}>
							{monthStr}
						</SelectItem>
					);
				})}
			</SelectContent>
		</Select>
	);
}
