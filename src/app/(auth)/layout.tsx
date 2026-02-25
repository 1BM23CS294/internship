import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-svh flex items-center justify-center p-4">
        <Image
            src="https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=2070&auto=format&fit=crop"
            alt="Abstract robotics background"
            fill
            className="object-cover -z-10 filter blur-sm brightness-100"
        />
        {children}
    </main>
  );
}
