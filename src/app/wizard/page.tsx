import CurrencySelectBox from "@/components/helper/currency-select-box";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function WizardPage() {
	const user = await currentUser();
	if (!user) redirect("/sign-in");

	return (
		<div className="container flex max-w-2xl flex-col items-center justify-between gap-4">
			<div className="flex items-center gap-4 mb-10">
				<Image src="/logo.svg" alt="Logo" width={50} height={50} />
				<span className="text-4xl font-extrabold">Pennywise</span>
			</div>

			<div>
				<h1 className="text-center text-3xl">
					Welcome,{" "}
					<span className="ml-2 font-bold">{user.firstName}! 👋</span>
				</h1>
				<h2 className="mt-4 text-center text-muted-foreground text-base font-semibold">
					Let's get started by setting up your prefered currency
				</h2>
				<h3 className="mt-2 text-center text-muted-foreground text-sm">
					You can change these settings at any time
				</h3>
			</div>

			<Separator />

			<Card className="w-full">
				<CardHeader>
					<CardTitle>Currency</CardTitle>
					<CardDescription>
						Set your prefered currency for transactions
					</CardDescription>
				</CardHeader>
				<CardContent>
					<CurrencySelectBox />
				</CardContent>
			</Card>

			<Separator />

			<div className="w-full flex items-center justify-end">
				<Button asChild>
					<Link href="/">I'm done! Take me to dashboard</Link>
				</Button>
			</div>
		</div>
	);
}
