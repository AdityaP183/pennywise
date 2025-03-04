"use client";

import { UserSettings } from "@prisma/client";
import { differenceInDays, startOfMonth } from "date-fns";
import { useState } from "react";
import { DateRangePicker } from "../ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { toast } from "sonner";
import StatsCards from "./statscards";
import CategoriesStats from "./categories-stats";

export default function Overview({
	userSettings,
}: {
	userSettings: UserSettings;
}) {
	const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
		from: startOfMonth(new Date()),
		to: new Date(),
	});

	return (
		<>
			<div className="container mx-auto flex flex-wrap items-end justify-between gap-2 py-6">
				<h2 className="text-3xl font-bold">Overview</h2>
				<div className="flex items-center gap-3">
					<DateRangePicker
						initialCompareFrom={dateRange.from}
						initialCompareTo={dateRange.to}
						showCompare={false}
						onUpdate={(values) => {
							const { from, to } = values.range;
							if (!from || !to) return;
							if (
								differenceInDays(to, from) > MAX_DATE_RANGE_DAYS
							) {
								toast.error(
									`Date range must be less than ${MAX_DATE_RANGE_DAYS} days!`
								);
								return;
							}
							setDateRange({ from, to });
						}}
					/>
				</div>
			</div>
			<div className="flex container w-full flex-col gap-2 mx-auto">
				<StatsCards
					userSettings={userSettings}
					from={dateRange.from}
					to={dateRange.to}
                    />
                <CategoriesStats
					userSettings={userSettings}
					from={dateRange.from}
					to={dateRange.to}
                />
			</div>
		</>
	);
}
