import Image from "next/image";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="relative flex h-screen flex-col items-center justify-center">
			<div className="flex items-center gap-4">
				<Image src="/logo.svg" alt="Logo" width={45} height={45} />
                <span className="text-3xl font-extrabold">Pennywise</span>
			</div>
			<div className="mt-12">{children}</div>
		</div>
	);
}
