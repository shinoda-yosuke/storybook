#!/usr/bin/env bash
# WARP を通らない場所（GitHub のランナー）から開いても、中身が見えないことを確かめる。
# Cloudflare Access は、ログインへ回す（302）か、その場で断る（403）
set -euo pipefail

url="$1"
headers="$(mktemp)"
body="$(mktemp)"
read -r status location < <(curl -s -D "$headers" -o "$body" -w '%{http_code} %{redirect_url}\n' "$url")
echo "$url -> $status ${location%%\?*}"
grep -iE '^(server|cf-ray|content-type|cf-access[^:]*|cf-mitigated):' "$headers" || true
sed -E 's/<[^>]+>/ /g; s/[[:space:]]+/ /g' "$body" | cut -c1-300
echo

case "$status" in
  302)
    [[ "$location" == *".cloudflareaccess.com/"* ]] && exit 0
    ;;
  401 | 403)
    exit 0
    ;;
esac

echo "::error::$url が Cloudflare Access で守られていない（WARP なしで開けてしまう）"
exit 1
