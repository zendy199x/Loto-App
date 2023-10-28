import { DefaultSeoProps } from "next-seo";

const config: DefaultSeoProps = {
  defaultTitle: "Loto | JS Team",
  titleTemplate: "%s | JS Team",
  description: "Loto | JS Team",
  canonical: "",
  openGraph: {
    type: "website",
    url: "",
    siteName: "Loto | JS Team",
  },
  twitter: {
    handle: "@handle",
    site: "@site",
    cardType: "summary_large_image",
  },
};

export default config;
