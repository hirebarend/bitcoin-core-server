FROM bitcoin/bitcoin:latest

COPY bitcoin.conf /bitcoin/.bitcoin/bitcoin.conf

EXPOSE 8332 8333

CMD ["bitcoind", "-conf=/bitcoin/.bitcoin/bitcoin.conf"]
