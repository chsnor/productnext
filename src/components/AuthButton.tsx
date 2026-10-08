import { signIn, signOut } from "@/auth";
import Image from "next/image";
import { LogIn, LogOut } from "lucide-react";

type AuthButtonProps = {
  isLoggedIn: boolean;
  userName?: string | null;
  userImage?: string | null;
};

export function AuthButton({ isLoggedIn, userName, userImage }: AuthButtonProps) {
  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full py-1.5 px-3 shadow-sm">
        {userImage ? (
          <Image
            src={userImage}
            alt={userName ?? "User"}
            width={28}
            height={28}
            className="rounded-full ring-1 ring-zinc-200 dark:ring-zinc-700"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center text-xs font-bold">
            {(userName ?? "U").slice(0, 1).toUpperCase()}
          </div>
        )}
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
          {userName ?? "ผู้ใช้งาน"}
        </span>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 px-2.5 py-1 rounded-full transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            ออกจากระบบ
          </button>
        </form>
      </div>
    );
  }

  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/" });
      }}
    >
      <button
        type="submit"
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 shadow-sm transition"
      >
        <LogIn className="w-4 h-4" />
        เข้าสู่ระบบด้วย Google
      </button>
    </form>
  );
}
