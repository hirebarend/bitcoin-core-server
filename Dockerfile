FROM bitcoin/bitcoin:latest

RUN apt-get update && apt-get install -y --no-install-recommends nodejs ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY bitcoin.conf /bitcoin/.bitcoin/bitcoin.conf
COPY main.js /usr/local/bin/main.js
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 8080 8332 8333

CMD ["/usr/local/bin/entrypoint.sh"]
