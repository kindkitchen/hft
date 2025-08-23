import { JSX } from "preact/jsx-runtime";

interface ContentContainerProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children: JSX.Element | JSX.Element[];
}

export function ContentContainer(
  { children, className, ...props }: ContentContainerProps,
) {
  return (
    <div
      class={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${
        className ?? ""
      } flex flex-col items-center justify-center`}
      {...props}
    >
      {children}
    </div>
  );
}
