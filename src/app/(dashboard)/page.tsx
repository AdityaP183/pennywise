import CreateTransactionDialog from "@/components/main/create-transaction-dialog";
import History from "@/components/main/history";
import Overview from "@/components/main/overview";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/primsa";
import { currentUser } from "@clerk/nextjs/server";
import { CircleMinus, HandCoins } from "lucide-react";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
	const user = await currentUser();
	if (!user) redirect("/sign-in");

	const userSettings = await prisma.userSettings.findUnique({
		where: {
			userId: user.id,
		},
	});
	if (!userSettings) redirect("/wizard");

	return (
		<div className="h-full">
			<div className="border-b bg-card">
				<div className="mx-auto container flex flex-wrap items-center justify-between gap-6 py-8 ">
					<p className="text-3xl font-bold">
						Welcome, {user.firstName} 👋
					</p>

					<div className="flex items-center gap-3">
						<CreateTransactionDialog
							trigger={
								<Button
									variant={"outline"}
									className="bg-emerald-950 hover:bg-emerald-900 border-emerald-500"
								>
									<HandCoins />
									New Income
								</Button>
							}
							type="income"
						/>

						<CreateTransactionDialog
							trigger={
								<Button
									variant={"outline"}
									className="bg-rose-950 hover:bg-rose-900 border-rose-500"
								>
									<CircleMinus />
									New Expense
								</Button>
							}
							type="expense"
						/>
					</div>
				</div>
			</div>

            <Overview userSettings={userSettings} />
            <History userSettings={userSettings} />
		</div>
	);
}
