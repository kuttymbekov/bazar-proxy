"use client";

import { useState, useRef, useCallback, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

// --- Types & Constants ---
type MobilePlatform = "ios" | "android" | "unknown";

const REDIRECT_TIMEOUT_MS = 2000;
const DEFAULT_IMAGE_SRC = "/images/image.png";
const PROD_DOMAIN = "web-customer.bazarmarket.kg";
const WEB_BASE_URL = `https://${PROD_DOMAIN}`;
const APP_STORE_URL = "https://apps.apple.com/us/app/bazar-market/id6748224863";
const PLAY_MARKET_URL =
  "https://play.google.com/store/apps/details?id=kz.bazarmarket.customer";

// --- Utils ---
function getStoreCta(platform: MobilePlatform) {
  const isIOS = platform === "ios";
  return {
    href: isIOS ? APP_STORE_URL : PLAY_MARKET_URL,
    storeLabel: isIOS ? "App Store" : "Google Play",
  };
}

// --- Hooks ---
function useSmartRedirect({
  targetUrl,
  storeUrl,
  fallbackUrl,
}: {
  targetUrl: string;
  storeUrl: string;
  fallbackUrl: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const appOpened = useRef(false);

  const handleDownload = useCallback(() => {
    window.location.href = storeUrl;
  }, [storeUrl]);

  const handleRedirect = useCallback(() => {
    setIsLoading(true);
    appOpened.current = false;

    function onVisibilityChange() {
      if (document.visibilityState === "hidden") {
        appOpened.current = true;
        setIsLoading(false);
        cleanup();
      }
    }

    function onPageHide() {
      appOpened.current = true;
      setIsLoading(false);
      cleanup();
    }

    function cleanup() {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", onPageHide);
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", onPageHide, { once: true });

    setTimeout(() => {
      cleanup();
      if (!appOpened.current) {
        setIsLoading(false);
        window.location.href = fallbackUrl;
      }
    }, REDIRECT_TIMEOUT_MS);

    window.open(targetUrl, "_self");
  }, [targetUrl, fallbackUrl]);

  return { handleRedirect, handleDownload, isLoading };
}

// --- UI Components ---
const LoadingSpinner = () => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        width: "40px",
        height: "40px",
        border: "4px solid #f3f3f3",
        borderTop: "4px solid #f97316", // Оранжевый цвет Bazar Market
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

function ProxyPageContent() {
  const searchParams = useSearchParams();
  const link = searchParams.get("link") || "";

  const [platform, setPlatform] = useState<MobilePlatform>("unknown");

  useEffect(() => {
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/i.test(ua)) setPlatform("ios");
    else if (/Android/i.test(ua)) setPlatform("android");
    else setPlatform("unknown");
  }, []);

  const targetUrl = `bazarmarket://${PROD_DOMAIN}${link}`;
  const fallbackUrl = `${WEB_BASE_URL}${link}`;
  const { href: storeUrl } = getStoreCta(platform);

  const { handleRedirect, handleDownload, isLoading } = useSmartRedirect({
    targetUrl,
    storeUrl,
    fallbackUrl,
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100dvh",
        position: "relative",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {isLoading && <LoadingSpinner />}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          padding: "8px 16px",
          textAlign: "center",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <div
          style={{
            position: "relative",
            height: "384px",
            width: "100%",
            overflow: "hidden",
          }}
        >
          {/** Не забудьте перенести /images/image.png в папку public нового проекта **/}
          <Image
            src={DEFAULT_IMAGE_SRC}
            alt="Bazar Market app"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>

        <div>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              margin: "0 0 16px 0",
            }}
          >
            Все что нужно
          </h1>
          <p
            style={{
              maxWidth: "75%",
              margin: "0 auto",
              fontSize: "0.875rem",
              color: "#71717a",
            }}
          >
            Лучшие цены. Ты покупаешь прямо у продавцов — без посредников!
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            width: "100%",
            marginTop: "16px",
          }}
        >
          <button
            onClick={handleRedirect}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "12px 24px",
              backgroundColor: "#f97316",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1.125rem",
              fontWeight: 500,
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            У меня уже есть приложение
          </button>

          <button
            onClick={handleDownload}
            style={{
              width: "100%",
              padding: "12px 24px",
              backgroundColor: "transparent",
              color: "inherit",
              border: "1px solid #e4e4e7",
              borderRadius: "8px",
              fontSize: "1.125rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Скачать
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    // Suspense обязателен для useSearchParams в Next 13+ App Router
    <Suspense fallback={<LoadingSpinner />}>
      <ProxyPageContent />
    </Suspense>
  );
}
