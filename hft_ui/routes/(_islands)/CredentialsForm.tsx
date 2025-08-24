// @ts-types="npm:@xstate/react"
import { useActor } from "@xstate/react";
import { machine } from "./CredentialsForm_xstate.ts";

export function CredentialsForm() {
  const [snapshot, send] = useActor(machine);
  const {
    credentials,
  } = snapshot.context;

  return (
    <div class="max-w-xs flex flex-col">
      <textarea
        class="textarea-password"
        rows={10}
        cols={40}
        value={credentials}
        onChange={(ev: any) => {
          send({
            type: "change",
            content: ev.target.value,
          });
        }}
      >
      </textarea>
      {snapshot.context.errors_from_prev_response && (
        <div class="bg-amber-200">
          <label>Problems after previous attempt:</label>
          <ul>
            {snapshot.context.errors_from_prev_response.map(
              (error) => {
                return (
                  <li key={error}>
                    <p>
                      {error}
                    </p>
                  </li>
                );
              },
            )}
          </ul>
        </div>
      )}
      {snapshot.matches({
          Interaction_with_user: {
            Processing_errors: {
              Show_errors_related_to_format_of_the_content: "Show",
            },
          },
        })
        ? (
          <div class="bg-red-400">
            <label>Problems after previous attempt:</label>
            <ul>
              {snapshot.context.errors_related_to_format_of_the_content.map(
                (error) => {
                  return (
                    <li key={error}>
                      <p>
                        {error}
                      </p>
                    </li>
                  );
                },
              )}
            </ul>
          </div>
        )
        : snapshot.matches({
          Interaction_with_user: {
            Processing_errors: {
              Show_errors_related_to_format_of_the_content: "Delay",
            },
          },
        }) &&
          <pre>Checking format...</pre>}
    </div>
  );
}
