import { subtle } from "node:crypto";

const algorithm_name = "RSA-OAEP";
const text = {
  encode: (input?: string) => {
    const te = new TextEncoder();
    return te.encode.call(te, input);
  },
  decode: (input?: AllowSharedBufferSource) => {
    const de = new TextDecoder();
    return de.decode.call(de, input);
  },
};
const { privateKey, publicKey } = await subtle.generateKey(
  {
    name: algorithm_name,
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: { name: "SHA-256" },
  },
  true,
  ["encrypt", "decrypt"],
);

console.log("public:", publicKey);
console.log("private:", privateKey);

const message = "Hello world!";

const cipher = await subtle.encrypt(
  algorithm_name,
  publicKey,
  text.encode(message),
);

console.log("message:", message);
console.log("cipher:", text.decode(cipher));

const decrypted = await subtle.decrypt(
  algorithm_name,
  privateKey,
  cipher,
);

console.log("decrypted:", text.decode(decrypted));
