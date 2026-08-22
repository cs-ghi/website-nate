#!/usr/bin/env bash
# Serve the prototype gallery. Runs from anywhere.
#
#   ./_prototypes/serve.sh          # port 8777
#   ./_prototypes/serve.sh 9000     # another port
#
# Ctrl-C to stop. Nothing here is built or deployed.
set -euo pipefail

dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
port="${1:-8777}"

if lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port $port is already serving something:"
  echo "  http://localhost:$port/"
  echo "Pass a different port to start a second one: $0 $((port + 1))"
  exit 0
fi

url="http://localhost:$port/"
echo "Prototypes -> $url"
echo "  blog redesign: ${url}blog-redesign.html   (tabs, or keys 0-4)"
echo

command -v open >/dev/null && (sleep 1 && open "$url" >/dev/null 2>&1 &)
exec python3 -m http.server "$port" --directory "$dir"
