import { define } from "../utils.ts";
import { ContentContainer } from "./(_components)/ContentContainer.tsx";
import { Header } from "./(_components)/Header.tsx";

export default define.layout(({ Component, state }) => {
  return (
    <>
      <Header session={state.session} />
      <ContentContainer>
        <Component />
      </ContentContainer>
    </>
  );
});
