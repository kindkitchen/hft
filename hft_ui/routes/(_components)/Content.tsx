import { JSX } from "preact/jsx-runtime";
import { Session } from "../../domain/Session.ts";

interface ContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  session: Session | null;
}

export function Content({
  session,
}: ContentProps) {
  if (session) {
    return (
      <div class="flex flex-col">
        <h4>Your credentials:</h4>
        <textarea class="bg-slate-200 rounded-b-sm" rows={3} cols={30}>
        </textarea>
      </div>
    );
  }

  return (
    <div>
      <p>Login to application first</p>
    </div>
  );
}
