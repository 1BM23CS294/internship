import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-svh flex items-center justify-center p-4">
        <Image
            src="https://images.unsplash.com/photo-1677442135725-341e2124d3e8?q=80&w=2070&auto=format&fit=crop"
            alt="Robotics and AI themed abstract background"
            fill
            className="object-cover -z-10 filter blur-sm brightness-50"
        />
        {children}
    </main>
  );
}
