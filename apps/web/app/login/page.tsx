import Link from "next/link";
import { AuthForm } from "./auth-form";

export default function LoginPage() {
  return (
    <main className="mx-auto grid min-h-screen max-w-6xl place-items-center px-6 py-10">
      <div className="grid w-full gap-8 lg:grid-cols-[1fr_0.8fr]">
        <section className="flex flex-col justify-center">
          <Link href="/" className="mb-8 text-sm text-[var(--muted)] hover:text-white">
            ← 返回首页
          </Link>
          <p className="mb-3 text-xs tracking-[0.22em] text-[var(--accent)] uppercase">AgentOS</p>
          <h1 className="mb-5 max-w-xl font-serif text-4xl leading-tight lg:text-5xl">
            回到你的作品，继续把灵感变成可复用的设定。
          </h1>
          <p className="max-w-xl leading-7 text-[var(--muted)]">
            登录状态保存在 HttpOnly Session Cookie 中，不会写入浏览器 localStorage。
          </p>
        </section>

        <AuthForm />
      </div>
    </main>
  );
}
