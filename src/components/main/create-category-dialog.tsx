"use client";

import { TransactionType } from "@/lib/types";
import {
	CreateCategorySchema,
	CreateCategorySchemaType,
} from "@/lib/schema/category";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { CircleOff, Loader2, PlusSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Picker from "@emoji-mart/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCategory } from "@/actions/categories";
import { Category } from "@prisma/client";
import { toast } from "sonner";
import { useTheme } from "next-themes";

export default function CreateCategoryDialog({
	type,
	onSuccessCallback,
}: {
	type: TransactionType;
	onSuccessCallback: (category: Category) => void;
}) {
	const [open, setOpen] = useState(false);
	const [emojiData, setEmojiData] = useState(null);
	const querClient = useQueryClient();
    const {resolvedTheme} = useTheme();

	const form = useForm<CreateCategorySchemaType>({
		resolver: zodResolver(CreateCategorySchema),
		defaultValues: {
			name: "",
			icon: "",
			type: type,
		},
	});

	const { mutate, isPending, error } = useMutation({
		mutationFn: CreateCategory,
		onSuccess: async (data: Category) => {
			form.reset({
				name: "",
				icon: "",
				type,
			});

			toast.success(`Category ${data.name} created successfully`, {
				id: "create-category",
			});

			onSuccessCallback(data);

			await querClient.invalidateQueries({ queryKey: ["categories"] });

			setOpen((prev) => !prev);
		},
		onError: () =>
			toast.error("Failed to create category", { id: "create-category" }),
	});

	const onSubmit = useCallback(
		(values: CreateCategorySchemaType) => {
			toast.loading("Creating category...", { id: "create-category" });
			mutate(values);
		},
		[mutate]
	);

	useEffect(() => {
		fetch("/emoji-data.json") // Fetching emoji data from a JSON file
			.then((res) => res.json())
			.then((data) => setEmojiData(data));
	}, []);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant={"ghost"}
					className="flex items-center border-separate justify-start rounded-none border-b px-3 py-3 text-muted-foreground"
				>
					<PlusSquare className="mr-2 h-4 w-4" />
					Create new
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						Create{" "}
						<span
							className={cn(
								type === "income"
									? "text-emerald-500"
									: "text-rose-500"
							)}
						>
							{type}
						</span> {" "}
						category
					</DialogTitle>
					<DialogDescription>
						{error
							? error.message
							: "Categories are used to group your transactions."}
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-8"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormDescription>
										Set a name for the category
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="icon"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Icon</FormLabel>
									<FormControl>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant="outline"
													className="h-[100px] w-full"
												>
													{form.watch("icon") ? (
														<div className="flex flex-col items-center gap-2">
															<span
																className="text-5xl"
																role="img"
															>
																{field.value}
															</span>
															<p className="text-xs text-muted-foreground">
																Click to change
															</p>
														</div>
													) : (
														<div className="flex flex-col items-center gap-2">
															<CircleOff className="h-[48px] w-[48px]" />
															<p className="text-xs text-muted-foreground">
																Click to set an
																icon
															</p>
														</div>
													)}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-full">
												<Picker
													data={emojiData}
                                                    theme={resolvedTheme}
													onEmojiSelect={(emoji: {
														native: string;
													}) => {
														field.onChange(
															emoji.native
														);
													}}
												/>
											</PopoverContent>
										</Popover>
									</FormControl>
									<FormDescription>
										Set an icon for the category
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
				<DialogFooter>
					<DialogClose asChild>
						<Button
							type="button"
							variant={"secondary"}
							onClick={() => form.reset()}
						>
							Cancel
						</Button>
					</DialogClose>
					<Button
						disabled={isPending}
						onClick={form.handleSubmit(onSubmit)}
					>
						{isPending ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : (
							"Create"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
