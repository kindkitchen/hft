import { openKvToolbox } from "@kitsonk/kv-toolbox";
import { DAY } from "@std/datetime";
import { Session, Session_tag } from "./domain/Session.ts";

const kv = await openKvToolbox();

export const db = {
  create_session,
  session_by_id,
};

async function create_session(email: string): Promise<Session> {
  const _id = crypto.randomUUID();
  const session = Session({ email, _id });

  await kv.db.set([Session_tag, session._id], session, {
    expireIn: 2 * DAY,
  });

  return session;
}

async function session_by_id(_id: string): Promise<Session | null> {
  const res = await kv.get<Session>([Session_tag, _id]);

  return res.value || null;
}
