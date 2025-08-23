import { define } from "../utils.ts";
import { Content } from "./(_components)/Content.tsx";

export default define.page(function Home(ctx) {
  const session = ctx.state.session;
  return <Content session={session} />;
});
