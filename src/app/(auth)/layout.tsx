import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-svh flex items-center justify-center p-4">
        <Image
            src="https://images.unsplash.com/photo-1620712943543-285f7266c8da?q=80&w=2070&auto=format&fit=crop"
            alt="Robotics technology background"
            fill
            className="object-cover -z-10 filter blur-md brightness-[.4]"
        />
        {children}
    </main>
  );
}
