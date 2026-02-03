import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const linkParam = typeof params.link === "string" ? params.link : "";
  const baseDomain = "https://web-customer.bazarmarket.kg";

  // Validate that the link is allowed (only to our domain)
  let targetUrl = baseDomain;
  if (linkParam) {
    try {
      const url = new URL(linkParam);
      // Only allow redirects to our known domains or subdomains
      if (url.hostname.endsWith("bazarmarket.kg")) {
        targetUrl = linkParam;
      }
    } catch {
      // If linkParam is a relative path, append it to base domain
      if (linkParam.startsWith("/")) {
        targetUrl = `${baseDomain}${linkParam}`;
      }
    }
  }

  // Attempt server-side redirect
  // Note: For Universal Links, server-side redirect (302) often doesn't trigger the app.
  // We provide a fallback UI in case the server-side redirect is intercepted or fails to trigger the app.
  redirect(targetUrl);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4 font-sans text-black">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-500"></div>
        <h1 className="text-xl font-medium">Перенаправляем вас...</h1>
        <p className="max-w-xs text-gray-500">
          Если вы не были перенаправлены автоматически, нажмите кнопку ниже:
        </p>
        <a
          href={targetUrl}
          className="rounded-full bg-emerald-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-emerald-600 active:scale-95"
        >
          Открыть в приложении
        </a>
      </div>
    </div>
  );
}
