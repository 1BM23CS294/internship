import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-svh flex items-center justify-center p-4">
        <Image
            src="https://storage.googleapis.com/aif-stg-testing-images/background.png"
            alt="AI brain analyzing resume and job market data"
            fill
            className="object-cover -z-10 filter blur-sm brightness-50"
        />
        {children}
    </main>
  );
}
