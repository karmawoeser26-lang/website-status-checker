exports.handler = async function (event) {
  const requestedUrl = event.queryStringParameters?.url;

  if (!requestedUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        status: "unknown"
      })
    };
  }

  let url = requestedUrl.trim();

  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  try {
    new URL(url);
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({
        status: "unknown"
      })
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "WebsiteStatusChecker/1.0"
      }
    });

    clearTimeout(timeout);

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: response.ok ? "up" : "down",
        httpStatus: response.status
      })
    };
  } catch {
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: "down"
      })
    };
  }
};
