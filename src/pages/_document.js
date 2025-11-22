import { Html, Head, Main, NextScript } from "next/document";
import { titleFont, bodyFont } from "../theme/fonts";

export default function Document() {
  return (
    <Html className={`${titleFont.variable} ${bodyFont.variable}`} lang="en">
    <Head />
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
  );
}
