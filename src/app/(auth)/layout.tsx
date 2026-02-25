import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-svh flex items-center justify-center p-4">
        <Image
            src="https://images.unsplash.com/photo-1677442135729-a882b4355594?q=80&w=1932&auto=format&fit=crop"
            alt="Abstract robotics design background"
            fill
            className="object-cover -z-10 filter blur-md brightness-[.4]"
        />
        {children}
    </main>
  );
}
