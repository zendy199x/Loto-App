import { DefaultSeoProps } from "next-seo";

const config: DefaultSeoProps = {
  defaultTitle: "Loto | JS Team",
  titleTemplate: "%s | JS Team",
  description: "Loto | JS Team | Company Trip 2023",
  canonical: "https://loto-app-js.vercel.app",
  openGraph: {
    type: "website",
    url: "https://loto-app-js.vercel.app",
    siteName: "Loto | JS Team",
  },
  twitter: {
    handle: "@handle",
    site: "@site",
    cardType: "summary_large_image",
  },
};

export default config;
