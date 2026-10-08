import { auth } from "@/auth";
import ProductExplorer from "@/components/ProductExplorer";
import { AuthButton } from "@/components/AuthButton";

export default async function Home() {
  const session = await auth();
  const isLoggedIn = Boolean(session?.user);

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-zinc-900 dark:text-white">
              Shop Studio
            </span>
          </div>
          <div>
            <AuthButton
              isLoggedIn={isLoggedIn}
              userName={session?.user?.name}
              userImage={session?.user?.image}
            />
          </div>
        </div>
      </header>

      <ProductExplorer />
    </div>
  );
}