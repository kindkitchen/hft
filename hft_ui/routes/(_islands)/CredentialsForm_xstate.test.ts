import { machine } from "./CredentialsForm_xstate.ts";
import { createActor } from "xstate";

const actor = createActor(machine);

actor.subscribe((snapshot) => {
  console.log(snapshot.value);
});

actor.start();

actor.send({ type: "change", content: "Hello world!" });

await new Promise((resolve) => setTimeout(resolve, 2000));

actor.send({ type: "change", content: "Hello world!" });

actor.send({ type: "submit" });
actor.send({
  type: "change",
  content: `
  first_line
  second_line

  third_line

  
  `,
});

actor.send({ type: "submit" });
