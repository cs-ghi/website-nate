#!/usr/bin/env bash
# Regenerate thumbs/ — page-1 renders of every blog PDF, used by the Broadsheet
# prototype. Needs poppler (`brew install poppler`).
#
# If the Broadsheet is ever shipped, this becomes a script under
# nate-website/scripts/ writing into src/assets/img/blog-thumbs/ and hooked to
# the prebuild step, next to gen-blog-manifest.js.
set -euo pipefail

dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
pdfs="$dir/../nate-website/src/assets/pdfs/blogs"
out="$dir/thumbs"

command -v pdftoppm >/dev/null || { echo "pdftoppm not found: brew install poppler"; exit 1; }

mkdir -p "$out"
n=0
for f in "$pdfs"/*.pdf; do
  base="$(basename "$f" .pdf)"
  pdftoppm -png -r 50 -f 1 -l 1 -singlefile "$f" "$out/$base"
  n=$((n + 1))
done
echo "gen-thumbs: $n page-1 render(s) -> $out"
