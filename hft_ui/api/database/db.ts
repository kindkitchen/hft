import { openKvToolbox } from "@kitsonk/kv-toolbox";
import { DAY } from "@std/datetime";
import { Session } from "../../domain/Session.ts";
import { lib } from "./lib.ts";

export const db = {
  create_session,
  session_by_id,
  many_sessions_by_email,
};

const kv = await openKvToolbox();
const {
  Session_key,
} = lib;

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
