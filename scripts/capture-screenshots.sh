#!/usr/bin/env bash
# Captures the README screenshots from the running app: the Maestro flow in .maestro/ signs up,
# adds tasks and opens Settings, once in light and once in dark appearance, on the simulator you
# name. Nothing is drawn by hand; every image in docs/images comes from this script.
#
# The README images come from a Release build talking to the production server, which has no
# development overlays:
#
#   npm run build && npm run serve    # in one terminal: the API on http://127.0.0.1:3000
#   EXPO_PUBLIC_API_URL=http://127.0.0.1:3000 npx expo run:ios --configuration Release
#   SIMULATOR_UDID=<udid> API_URL=http://127.0.0.1:3000 npm run screenshots
#
# A development build works too (`npm run ios`, then leave API_URL unset).
#
# The simulator should use English (Settings > General > Language & Region). The script turns off
# password AutoFill on it (see scripts/maestro/disable-password-autofill.yaml) and overrides the
# status bar (9:41, full battery) while it runs.
set -euo pipefail

: "${SIMULATOR_UDID:?Set SIMULATOR_UDID to the simulator to use (xcrun simctl list devices)}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/docs/images"
WORK="$ROOT/.maestro/output/capture"
WIDTH=430

command -v maestro >/dev/null || { echo "Install Maestro: https://docs.maestro.dev/getting-started/installing-maestro" >&2; exit 1; }
API_URL="${API_URL:-http://localhost:8081}"
curl -fsS "$API_URL/api/health" >/dev/null || { echo "No API at $API_URL; start the server first" >&2; exit 1; }

restore() {
  xcrun simctl status_bar "$SIMULATOR_UDID" clear || true
  xcrun simctl ui "$SIMULATOR_UDID" appearance light || true
}
trap restore EXIT

mkdir -p "$OUT"
rm -rf "$WORK"
maestro --udid "$SIMULATOR_UDID" test "$ROOT/scripts/maestro/disable-password-autofill.yaml"
xcrun simctl status_bar "$SIMULATOR_UDID" override --time 9:41 --batteryState charged --batteryLevel 100 \
  --wifiBars 3 --cellularMode notSupported

for appearance in light dark; do
  xcrun simctl ui "$SIMULATOR_UDID" appearance "$appearance"
  maestro --udid "$SIMULATOR_UDID" test --test-output-dir "$WORK/$appearance" -e "SHOTS=$appearance" \
    "$ROOT/.maestro/sign-up-and-tasks.yaml"
  for screen in sign-in tasks settings; do
    shot=$(find "$WORK/$appearance" -name "$screen.png" | head -n 1)
    [ -n "$shot" ] || { echo "No $screen.png from the $appearance run" >&2; exit 1; }
    sips --resampleWidth "$WIDTH" "$shot" --out "$OUT/$screen-$appearance.png" >/dev/null
    echo "wrote docs/images/$screen-$appearance.png"
  done
done
