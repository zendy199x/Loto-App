import "@/public/nprogress.css";
import "@/styles/globals.css";
import { createEmotionCache } from "@/utils";
import { CacheProvider } from "@emotion/react";
import type { NextPage } from "next";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import type { ReactElement, ReactNode } from "react";
import { Suspense, useEffect, useState } from "react";
import SEO from "../next-seo.config";
import theme from "@/theme/themeConfig";
import { ConfigProvider } from "antd";

export type NextPageWithLayout<P = unknown> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
      NProgress.start();
    };
    const handleComplete = () => {
      setIsLoading(false);
      NProgress.done();
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router.events]);

  return (
    <main>
      <DefaultSeo {...SEO} />
      <CacheProvider value={clientSideEmotionCache}>
        {getLayout(
          <Suspense>
            <ConfigProvider theme={theme}>
              <Component {...pageProps} />
            </ConfigProvider>
          </Suspense>
        )}
      </CacheProvider>
    </main>
  );
}

export default App;
