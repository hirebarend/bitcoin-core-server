const http = require("http");

const LISTEN_PORT = parseInt(process.env.PORT || "8080", 10);
const TARGET_HOST = process.env.RPC_HOST || "127.0.0.1";
const TARGET_PORT = parseInt(process.env.RPC_PORT || "8332", 10);

function buildHeaderFromIncommingMessage(incommingMessage) {
  const headers = { ...incommingMessage.headers };

  headers["host"] = `${TARGET_HOST}:${TARGET_PORT}`;

  delete headers["accept-encoding"];

  return headers;
}

const server = http.createServer((incommingMessage, serverResponse) => {
  const options = {
    headers: buildHeaderFromIncommingMessage(incommingMessage),
    hostname: TARGET_HOST,
    method: incommingMessage.method,
    path: incommingMessage.url,
    port: TARGET_PORT,
  };

  const upstreamClientRequest = http.request(options, (incommingMessage) => {
    serverResponse.writeHead(
      incommingMessage.statusCode || 502,
      incommingMessage.headers
    );

    incommingMessage.pipe(serverResponse, { end: true });
  });

  upstreamClientRequest.on("error", (err) => {
    const body = JSON.stringify({
      ok: false,
      error: err.message,
      target: `${TARGET_HOST}:${TARGET_PORT}`,
    });

    serverResponse.writeHead(200, { "Content-Type": "application/json" });

    serverResponse.end(body);
  });

  incommingMessage.pipe(upstreamClientRequest, { end: true });
});

server.keepAliveTimeout = 65_000;
server.headersTimeout = 70_000;

server.listen(LISTEN_PORT, () => {
  console.log(
    `Proxy listening on :${LISTEN_PORT}, forwarding to http://${TARGET_HOST}:${TARGET_PORT}`
  );
});
