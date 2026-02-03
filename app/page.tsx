"use client";

import { useEffect, useState, use } from "react";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function Home({ searchParams }: PageProps) {
  const params = use(searchParams);
  const [targetUrl, setTargetUrl] = useState(
    "https://web-customer.bazarmarket.kg",
  );
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    const linkParam = typeof params.link === "string" ? params.link : "";
    const baseDomain = "https://web-customer.bazarmarket.kg";
    let finalUrl = baseDomain;

    if (linkParam) {
      if (linkParam.startsWith("http")) {
        try {
          const url = new URL(linkParam);
          if (url.hostname.endsWith("bazarmarket.kg")) {
            finalUrl = linkParam;
          }
        } catch (e) {
          console.error("Invalid URL:", e);
        }
      } else if (linkParam.startsWith("/")) {
        finalUrl = `${baseDomain}${linkParam}`;
      }
    }

    setTargetUrl(finalUrl);

    // Try to redirect automatically
    // This is often blocked by in-app browsers if not triggered by a click,
    // but we try it anyway as a first attempt.
    window.location.href = finalUrl;

    // After a short delay, stop showing the loader and show the manual button
    const timer = setTimeout(() => {
      setIsRedirecting(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [params.link]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6 font-sans text-black">
      <div className="flex w-full max-w-sm flex-col items-center gap-8 text-center">
        {isRedirecting ? (
          <>
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-gray-100 border-t-emerald-500"></div>
            <h1 className="text-2xl font-bold tracking-tight">
              Переходим в приложение...
            </h1>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <h1 className="text-2xl font-bold tracking-tight">
                Открыть в приложении?
              </h1>
              <p className="text-gray-500 text-lg">
                Если приложение не открылось автоматически, нажмите на кнопку
                ниже:
              </p>
            </div>

            <a
              href={targetUrl}
              className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-emerald-500 px-8 py-5 text-xl font-bold text-white transition-all hover:bg-emerald-600 active:scale-95 shadow-lg shadow-emerald-200"
            >
              Открыть Bazar Market
            </a>

            <p className="text-sm text-gray-400">
              Вы будете перенаправлены на сайт bazarmarket.kg
            </p>
          </>
        )}
      </div>
    </div>
  );
}
