#!/usr/bin/env bash
# ==============================================================================
# Sava Storefront Manager (TanStack Start SSR)
# Runs on Port 3005
# ==============================================================================

set -eo pipefail

ACTION=${1:-status}
PORT="3005"
DIR="/Volumes/samsung2tb980pro/project/savageneedles-migration-to-saleor-and-tanstack"
LOG_FILE="$DIR/.logs/sava-storefront.log"
PID_FILE="$DIR/.logs/sava-storefront.pid"

mkdir -p "$DIR/.logs"

start_storefront() {
  echo "🚀 [Sava Storefront] Starting SSR server on port $PORT..."

  if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
    echo "✅ Storefront is already running (PID: $(cat "$PID_FILE"))"
    return 0
  fi

  PIDS=$(lsof -ti :"$PORT" 2>/dev/null || true)
  if [ -n "$PIDS" ]; then
    echo "⚠️ Port $PORT already in use by PID(s): $PIDS. Killing..."
    kill -9 $PIDS 2>/dev/null || true
    sleep 1
  fi

  (
    cd "$DIR"
    export PORT="$PORT"
    export NODE_ENV="production"
    export SALEOR_API_ENDPOINT="http://localhost:8005/graphql/"
    export SALEOR_CHANNEL="default-channel"
    nohup node server.mjs > "$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"
  )

  echo "⏳ Waiting for Storefront on http://127.0.0.1:$PORT..."
  for i in {1..20}; do
    if curl -s "http://127.0.0.1:$PORT/healthz" >/dev/null 2>&1 || nc -z 127.0.0.1 "$PORT" 2>/dev/null; then
      echo "✅ Sava Storefront is healthy & running on http://localhost:$PORT! (PID: $(cat "$PID_FILE"))"
      return 0
    fi
    sleep 1
  done

  echo "⚠️ Storefront did not respond within 20s. Check logs: $LOG_FILE"
  tail -n 20 "$LOG_FILE"
  return 1
}

stop_storefront() {
  echo "🛑 [Sava Storefront] Stopping SSR server..."
  if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    kill "$PID" 2>/dev/null || true
    rm -f "$PID_FILE"
  fi
  PIDS=$(lsof -ti :"$PORT" 2>/dev/null || true)
  if [ -n "$PIDS" ]; then
    kill -9 $PIDS 2>/dev/null || true
  fi
  echo "✅ Storefront stopped."
}

status_storefront() {
  echo "📊 [Sava Storefront] Status (Port $PORT):"
  if curl -s "http://127.0.0.1:$PORT/healthz" >/dev/null 2>&1 || nc -z 127.0.0.1 "$PORT" 2>/dev/null; then
    echo "  🟢 Running on http://localhost:$PORT"
  else
    echo "  🔴 Stopped"
  fi
}

case "$ACTION" in
  start)
    start_storefront
    ;;
  stop)
    stop_storefront
    ;;
  restart)
    stop_storefront
    sleep 1
    start_storefront
    ;;
  status)
    status_storefront
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|status}"
    exit 1
    ;;
esac
