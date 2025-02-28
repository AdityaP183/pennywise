"use client";

import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Drawer,
	DrawerContent,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Currencies, Currency } from "@/lib/currencies";
import { useMutation, useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "./skeleton-wrapper";
import { UserSettings } from "@prisma/client";
import { UpdateUserCurrency } from "@/actions/user-settings";
import { toast } from "sonner";

export default function CurrencySelectBox() {
	const [open, setOpen] = React.useState(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const [selectedOption, setSelectedOption] = React.useState<Currency | null>(
		null
	);

	const userSettings = useQuery<UserSettings>({
		queryKey: ["userSettings"],
		queryFn: () => fetch("/api/user-settings").then((res) => res.json()),
	});

	const userCurrencyUpdateMutation = useMutation({
		mutationFn: UpdateUserCurrency,
	});

	const selectOption = React.useCallback(
		(value: Currency | null) => {
			if (!value) {
				toast.error("Please select a currency");
				return;
			}

			toast.loading("Updating currency...", {
				id: "update-currency",
			});

			userCurrencyUpdateMutation.mutate(value.name, {
				onSuccess: (data: UserSettings) => {
					toast.success("Currency updated successfully", {
						id: "update-currency",
					});
					setSelectedOption(
						Currencies.find((c) => c.name === data.currency) || null
					);
				},
				onError: () => {
					toast.error("Failed to update currency", {
						id: "update-currency",
					});
				},
			});
		},
		[userCurrencyUpdateMutation]
	);

	React.useEffect(() => {
		if (!userSettings.data) return;
		if (userSettings.data) {
			setSelectedOption(
				Currencies.find(
					(priority) => priority.name === userSettings.data.currency
				) || null
			);
		}
	}, [userSettings.data]);

	if (isDesktop) {
		return (
			<SkeletonWrapper isLoading={userSettings.isFetching}>
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							className="w-full justify-start"
							disabled={userCurrencyUpdateMutation.isPending}
						>
							{selectedOption ? (
								<>
									{selectedOption.symbol}{" "}
									{selectedOption.name}
								</>
							) : (
								<>Set Currency</>
							)}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-[200px] p-0" align="start">
						<OptionList
							setOpen={setOpen}
							setSelectedOption={selectOption}
						/>
					</PopoverContent>
				</Popover>
			</SkeletonWrapper>
		);
	}

	return (
		<SkeletonWrapper isLoading={userSettings.isFetching}>
			<Drawer open={open} onOpenChange={setOpen}>
				<DrawerTrigger asChild>
					<Button
						variant="outline"
						className="w-full justify-start"
						disabled={userCurrencyUpdateMutation.isPending}
					>
						{selectedOption ? (
							<>
								{selectedOption.symbol} {selectedOption.name}
							</>
						) : (
							<>Set Currency</>
						)}
					</Button>
				</DrawerTrigger>
				<DrawerContent>
					<DrawerTitle hidden>Select currency</DrawerTitle>
					<div className="mt-4 border-t">
						<OptionList
							setOpen={setOpen}
							setSelectedOption={selectOption}
						/>
					</div>
				</DrawerContent>
			</Drawer>
		</SkeletonWrapper>
	);
}

function OptionList({
	setOpen,
	setSelectedOption,
}: {
	setOpen: (open: boolean) => void;
	setSelectedOption: (status: Currency | null) => void;
}) {
	return (
		<Command>
			<CommandInput placeholder="Filter currency..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup>
					{Currencies.map((currency) => (
						<CommandItem
							key={currency.name}
							value={currency.name}
							onSelect={(value: string) => {
								setSelectedOption(
									Currencies.find(
										(priority) => priority.name === value
									) || null
								);
								setOpen(false);
							}}
						>
							{currency.name}
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</Command>
	);
}
