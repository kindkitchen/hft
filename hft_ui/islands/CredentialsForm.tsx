import { fromPromise } from "xstate";
import { useActor } from "@xstate/react";

const placeholder = `\
On this line paste your API_KEY.
Here - API_SECRET.
And your PASSPHRASE.\
`;

const whoami_logic = fromPromise(async () => {
  console.log("whoami request start");
  const res = await fetch("/api/auth/whoami")
    .then((r) => r.json())
    .then((j) => j as null | { iam: object });

  console.log(res);

  return res;
});
export default function CredentialsForm() {
  const [whoami, send_to_whoami] = useActor(whoami_logic);

  let content;
  if (whoami.status === "done") {
    content = <pre>{JSON.stringify(whoami.output, null, 2)}</pre>;
  } else if (whoami.status === "active") {
    content = <pre>loading...</pre>;
  }
  return (
    <>
      <textarea
        class="border border-solid border-fuchsia-800 bg-violet-200"
        rows={3}
        cols={30}
        placeholder={placeholder}
      >
      </textarea>
      <hr />
      {content}
    </>
  );
}
