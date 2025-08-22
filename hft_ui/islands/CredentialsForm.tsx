export default function CredentialsForm() {
  return (
    <>
      <textarea
        class="border border-solid border-fuchsia-800 bg-violet-200"
        rows={3}
        cols={30}
        placeholder={`\
On this line paste your API_KEY.
Here - API_SECRET.
And your PASSPHRASE.\
`}
      >
      </textarea>
    </>
  );
}
