import { Session_tag } from "../../domain/Session.ts";

const Session_key = {
  by_id: (_id: string) => [Session_tag, _id],
  many_by_email: ({ email }: {
    email: string;
  }) => {
    const for_list = [Session_tag, "many_by_email", email];
    return {
      for_list,
      for_save: (_id: string) => [...for_list, _id],
    };
  },
};

export const lib = {
  Session_key,
};
