import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import RootProvider from "@/components/providers/root-providers";
import { Toaster } from "@/components/ui/sonner";

const nunito = Nunito({
	variable: "--font-nunito-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "PennyWise",
	description: "Track your budget effortlessly with PennyWise.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html
				lang="en"
				className="dark"
				style={{
					colorScheme: "dark",
				}}
			>
				<link
					rel="shortcut icon"
					href="/logo.svg"
					type="image/x-icon"
				/>
				<body className={`${nunito.variable} antialiased`}>
					<Toaster richColors />
					<RootProvider>{children}</RootProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
