import CredentialsForm from "../islands/CredentialsForm.tsx";
import { define } from "../utils.ts";

export default define.page(function Home(ctx) {
  return (
    <div>
      <CredentialsForm />
    </div>
  );
});
