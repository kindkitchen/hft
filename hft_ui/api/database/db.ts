import { openKvToolbox } from "@kitsonk/kv-toolbox";
import { DAY } from "@std/datetime";
import { Session, Session_tag } from "../../domain/Session.ts";

const kv = await openKvToolbox();

export const db = {
  create_session,
  session_by_id,
  many_sessions_by_email,
};

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

async function create_session(email: string): Promise<Session> {
  const _id = crypto.randomUUID();
  const session = Session({ email, _id });
  const options = {
    expireIn: 2 * DAY,
  };

  await Promise.all([
    kv.db.set(Session_key.by_id(_id), session, options),
    kv.db.set(
      Session_key.many_by_email({ email }).for_save(_id),
      session,
      options,
    ),
  ]);

  return session;
}

async function session_by_id(_id: string): Promise<Session | null> {
  const res = await kv.get<Session>(Session_key.by_id(_id));

  return res.value || null;
}

async function many_sessions_by_email(email: string): Promise<Session[]> {
  const res = kv.list<Session>({
    prefix: Session_key.many_by_email({ email }).for_list,
  });

  const sessions: Session[] = [];

  for await (const entry of res) {
    sessions.push(entry.value);
  }

  return sessions;
}
