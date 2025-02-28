import Navbar from "@/components/main/navbar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="relative flex h-screen flex-col">
            <Navbar/>
			<div className="w-full">{children}</div>
		</div>
	);
}
