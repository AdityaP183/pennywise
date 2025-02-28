"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, buttonVariants } from "../ui/button";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "../helper/theme-toggle";
import { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { MenuIcon } from "lucide-react";

export default function Navbar() {
	return (
		<>
			<DesktopNav />
			<MobileNav />
		</>
	);
}

const items = [
	{ label: "Dashboard", link: "/" },
	{ label: "Transactions", link: "/transactions" },
	{ label: "Manage", link: "/manage" },
];

function DesktopNav() {
	return (
		<div className="hidden md:block border-separate border-b bg-background">
			<nav className="container mx-auto flex items-center justify-between px-8">
				<div className="flex h-[80px] min-h-[60px] items-center gap-x-4 justify-between">
					{/* Logo */}
					<div className="flex items-center gap-2">
						<Image
							src="/logo.svg"
							alt="Logo"
							width={30}
							height={30}
						/>
						<span className="text-2xl font-extrabold">
							Pennywise
						</span>
					</div>

					{/* Items */}
					<div className="flex h-full">
						{items.map((item) => (
							<NavItem
								key={item.label}
								label={item.label}
								link={item.link}
							/>
						))}
					</div>
				</div>

				<div className="flex items-center gap-2">
					<ThemeToggle />
					<UserButton />
				</div>
			</nav>
		</div>
	);
}

function MobileNav() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="block border-separate bg-background md:hidden">
			<nav className="container mx-auto flex items-center justify-between px-8">
				<Sheet open={isOpen} onOpenChange={setIsOpen}>
					<SheetTrigger asChild>
						<Button variant={"ghost"} size="icon">
							<MenuIcon />
						</Button>
					</SheetTrigger>
					<SheetContent
						className="w-[400px] sm:w-[540px]"
						side="left"
					>
						<SheetTitle hidden>Mobile Navigation</SheetTitle>
						<div className="flex items-center gap-4">
							<Image
								src="/logo.svg"
								alt="Logo"
								width={40}
								height={40}
							/>
							<span className="text-2xl font-extrabold">
								Pennywise
							</span>
						</div>

						<div className="flex flex-col gap-1 pt-4">
							{items.map((item) => (
								<NavItem
									key={item.label}
									label={item.label}
									link={item.link}
									onClick={() => setIsOpen((prev) => !prev)}
								/>
							))}
						</div>
					</SheetContent>
				</Sheet>
				<div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
					<ThemeToggle />
					<UserButton />
				</div>
			</nav>
		</div>
	);
}

function NavItem({
	label,
	link,
	onClick,
}: {
	label: string;
	link: string;
	onClick?: () => void;
}) {
	const pathname = usePathname();
	const isCurrentPath = pathname === link;

	return (
		<div className="relative flex items-center">
			<Link
				href={link}
				className={cn(
					buttonVariants({
						variant: "ghost",
					}),
					"w-full justify-start text-lg text-muted-foreground hover:text-foreground",
					isCurrentPath && "text-foreground"
				)}
				onClick={() => onClick && onClick()}
			>
				{label}
			</Link>
			{isCurrentPath && (
				<div className="absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block" />
			)}
		</div>
	);
}
