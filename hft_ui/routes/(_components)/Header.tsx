import { JSX } from "preact/jsx-runtime";
import { Session } from "../../domain/Session.ts";

interface HeaderProps extends JSX.HTMLAttributes<HTMLDivElement> {
  session: Session | null;
}

export function Header({
  session,
}: HeaderProps) {
  if (session) {
    return (
      <div class="flex flex-row-reverse pr-4">
        <a href="/api/auth/logout">Logout</a>
      </div>
    );
  }

  return (
    <div>
      <a href="/api/auth/sign-in/google">Login</a>
    </div>
  );
}
