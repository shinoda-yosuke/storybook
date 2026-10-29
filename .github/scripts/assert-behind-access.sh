#!/usr/bin/env bash
# WARP を通らない場所（GitHub のランナー）から開くと、
# Cloudflare Access のログインへ回されることを確かめる
set -euo pipefail

url="$1"
read -r status location < <(curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' "$url")
echo "$url -> $status $location"

if [[ "$status" != "302" || "$location" != *".cloudflareaccess.com/"* ]]; then
  echo "::error::$url が Cloudflare Access で守られていない（WARP なしで開けてしまう）"
  exit 1
fi
