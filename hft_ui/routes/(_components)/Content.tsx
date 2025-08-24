import { JSX } from "preact/jsx-runtime";
import { Session } from "../../domain/Session.ts";
import { CredentialsForm } from "../(_islands)/CredentialsForm.tsx";

interface ContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  session: Session | null;
}

export function Content({
  session,
}: ContentProps) {
  if (session) {
    return (
      <div class="flex flex-col">
        <CredentialsForm />
      </div>
    );
  }

  return (
    <div>
      <p>Login to application first</p>
    </div>
  );
}
