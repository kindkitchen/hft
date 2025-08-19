import { define } from "../utils.ts";

export default define.page(function Home(ctx) {
  const placeholder = `\
API_KEY
API_PASS
API_PHRASE\
`;

  return (
    <div class="px-4 py-8 mx-auto min-h-screen">
      {ctx.state.session
        ? (
          <form>
            <textarea rows={3} placeholder={placeholder} class="w-[400px]">
            </textarea>
          </form>
        )
        : (
          <i>
            <pre>Login first to be able create your bot.</pre>
          </i>
        )}
    </div>
  );
});
