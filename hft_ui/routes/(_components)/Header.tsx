import { JSX } from "preact/jsx-runtime";
import { Session } from "../../domain/Session.ts";
import { Link } from "../../ui_primitives/Link.tsx";

interface HeaderProps extends JSX.HTMLAttributes<HTMLDivElement> {
  session: Session | null;
}

export function Header({
  session,
}: HeaderProps) {
  let AuthButton: JSX.Element;
  if (session) {
    AuthButton = (
      <Link
        variant="outline"
        href="/api/auth/logout"
      >
        Logout
      </Link>
    );
  } else {
    AuthButton = (
      <Link variant="outline" href="/api/auth/sign-in/google">
        Login
      </Link>
    );
  }

  return (
    <div class="p-2 flex justify-center">
      {AuthButton}
    </div>
  );
}
