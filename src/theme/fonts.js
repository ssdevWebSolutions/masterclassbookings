import localFont from "next/font/local";

export const titleFont = localFont({
  src: [
    {
      path: "../../public/fonts/college-bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--title-font",
});

export const bodyFont = localFont({
  src: [
    {
      path: "../../public/fonts/inter-regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--body-font",
});
