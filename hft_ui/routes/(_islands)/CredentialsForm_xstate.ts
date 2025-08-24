import { Effect } from "effect";
import { assertEvent, assign, setup } from "xstate";
import { effect_to_promise_logic } from "../../util/xstate.ts";

const REGEX_ONLY_THREE_LINES = /\s*\S+\s+\S+\s+\S+\s*/;
const MakeSubmitActor = effect_to_promise_logic(() =>
  Effect.gen(function* () {
    console.log("TODO: Submitting...");
  })
);

export const machine = setup({
  types: {
    context: {} as {
      credentials: string;
      ready_to_submit: boolean;
      errors_related_to_format_of_the_content: string[];
      errors_from_prev_response: string[];
    },
    events: {} as {
      type: "change";
      content: string;
    } | { type: "submit" },
  },
  actions: {
    clear_errors_related_to_the_format_of_the_content: assign({
      errors_related_to_format_of_the_content: [],
    }),
    assign_content: assign(({ event }) => {
      assertEvent(event, "change");
      const { content } = event;

      return {
        credentials: content,
      };
    }),
    validate_content: assign(({ event }) => {
      assertEvent(event, "change");
      const { content } = event;
      const errors = [];
      if (!REGEX_ONLY_THREE_LINES.test(content)) {
        errors.push(
          "You should paste on new line each of the API_KEY, API_SECRET and PASSPHRASE",
        );
      }
      return {
        errors_related_to_format_of_the_content: errors,
      };
    }),
  },
  guards: {
    is_no_errors_related_to_the_content_format: (
      { context: { errors_related_to_format_of_the_content } },
    ) => errors_related_to_format_of_the_content.length > 0,
    is_new_content_empty: ({ event }) => {
      assertEvent(event, "change");
      const { content } = event;

      return content.length === 0;
    },
  },
  actors: {
    MakeSubmit: MakeSubmitActor.logic,
  },
}).createMachine({
  context: () => {
    return {
      credentials: "",
      errors_related_to_format_of_the_content: [],
      errors_from_prev_response: [],
      ready_to_submit: false,
    };
  },
  initial: "Interaction_with_user",
  states: {
    Interaction_with_user: {
      type: "parallel",
      states: {
        Processing_user_input: {
          on: {
            change: {
              actions: [
                "assign_content",
              ],
            },
          },
        },
        Processing_errors: {
          initial: "Inactive",
          states: {
            Inactive: {},
            Validation: {
              always: [
                {
                  target: "Show_errors_related_to_format_of_the_content",
                  guard: "is_no_errors_related_to_the_content_format",
                },
                {
                  target: "Content_ready_to_be_submitted",
                  actions: [
                    "clear_errors_related_to_the_format_of_the_content",
                  ],
                },
              ],
            },
            Show_errors_related_to_format_of_the_content: {
              initial: "Delay",
              states: {
                Delay: {
                  after: {
                    1000: "Show",
                  },
                },
                Show: {},
              },
            },
            Content_ready_to_be_submitted: {
              on: {
                submit: {
                  target: "#Submitting_state",
                },
              },
            },
          },
          on: {
            change: [
              {
                target: ".Inactive",
                guard: "is_new_content_empty",
                actions: [
                  "clear_errors_related_to_the_format_of_the_content",
                ],
              },
              {
                target: ".Validation",
                actions: "validate_content",
              },
            ],
          },
        },
      },
    },
    Submitting: {
      id: "Submitting_state",
      invoke: {
        src: "MakeSubmit",
        input: () => {
          return { args: [] };
        },
        onDone: "Done",
        onError: {
          target: "Interaction_with_user",
          actions: assign({}),
        },
      },
    },
    Done: {
      type: "final",
    },
  },
});
