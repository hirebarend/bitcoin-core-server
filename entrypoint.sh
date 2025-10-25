#!/usr/bin/env bash
set -euo pipefail

node /usr/local/bin/main.js &

exec bitcoind -conf=/bitcoin/.bitcoin/bitcoin.conf
