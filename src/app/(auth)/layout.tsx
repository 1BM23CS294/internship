import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-svh flex items-center justify-center p-4">
        <Image
            src="https://images.unsplash.com/photo-1620712943543-285f7267a84a?q=80&w=2069&auto=format&fit=crop"
            alt="Abstract technology background"
            fill
            className="object-cover -z-10 filter blur-sm brightness-75"
        />
        {children}
    </main>
  );
}
