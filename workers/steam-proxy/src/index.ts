export interface Env {
  STEAM_API_KEY: string;
}

const JSON_HEADERS = {
  "content-type": "application/json; charset=UTF-8",
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,OPTIONS",
  "access-control-allow-headers": "content-type"
};

const respondJson = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: JSON_HEADERS
  });

const respondError = (message: string, status = 500) =>
  respondJson(
    {
      error: message
    },
    status
  );

const fetchJson = async (url: string) => {
  const response = await fetch(url, { method: "GET" });
  if (!response.ok) {
    throw new Error(`Upstream request failed (${response.status} ${response.statusText})`);
  }

  return response.json();
};

const handleMostPlayed = async (env: Env) => {
  const query = env.STEAM_API_KEY ? `?key=${encodeURIComponent(env.STEAM_API_KEY)}` : "";
  const data = await fetchJson(
    `https://api.steampowered.com/ISteamChartsService/GetMostPlayedGames/v1/${query}`
  );
  return respondJson(data);
};

const handleTopReleases = async () => {
  const data = await fetchJson(
    "https://store.steampowered.com/api/featuredcategories?cc=KR&l=koreana"
  );
  const items = Array.isArray(data?.top_releases?.items) ? data.top_releases.items : [];
  const itemIds = items.map((item: { id: number }) => ({ appid: item.id }));

  // Keep response shape compatible with existing frontend code.
  return respondJson({
    response: {
      pages: [{ item_ids: itemIds }]
    }
  });
};

const handleGameDetails = async (appid: string) => {
  const gameId = Number(appid);
  if (!Number.isFinite(gameId) || gameId <= 0) {
    return respondError("Invalid appid.", 400);
  }

  const data = await fetchJson(
    `https://store.steampowered.com/api/appdetails?appids=${gameId}&cc=KR&l=koreana`
  );
  return respondJson(data);
};

const handleGenre = async (tag: string) => {
  const decodedTag = decodeURIComponent(tag);
  const encodedTag = encodeURIComponent(decodedTag);
  const data = await fetchJson(
    `https://store.steampowered.com/api/storesearch/?term=${encodedTag}&l=koreana&cc=KR`
  );
  const apps = Array.isArray(data?.items)
    ? data.items
        .filter((item: { type?: string }) => item.type === "app")
        .map((item: { id: number; name: string; tiny_image?: string }) => ({
        appid: item.id,
        name: item.name,
        header_image: item.tiny_image ?? ""
      }))
    : [];

  // Keep response shape compatible with existing frontend code.
  return respondJson({
    applist: {
      apps
    }
  });
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: JSON_HEADERS
      });
    }

    if (request.method !== "GET") {
      return respondError("Method not allowed.", 405);
    }

    const { pathname } = new URL(request.url);

    try {
      if (pathname === "/api/most-played-games") {
        return await handleMostPlayed(env);
      }

      if (pathname === "/api/top-releases") {
        return await handleTopReleases();
      }

      if (pathname.startsWith("/api/game-details/")) {
        const appid = pathname.replace("/api/game-details/", "");
        return await handleGameDetails(appid);
      }

      if (pathname.startsWith("/api/genre/")) {
        const tag = pathname.replace("/api/genre/", "");
        return await handleGenre(tag);
      }

      return respondError("Not found.", 404);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown Worker error";
      return respondError(message, 502);
    }
  }
};
