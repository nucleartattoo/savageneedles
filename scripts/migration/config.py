import os
from pathlib import Path

# Zero-dependency simple .env loader
def load_dotenv():
    env_file = Path(".env")
    if env_file.exists():
        with open(env_file, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    k = k.strip()
                    v = v.strip().strip("'\"")
                    if k and k not in os.environ:
                        os.environ[k] = v

load_dotenv()

def load_magento_config():
    home = os.environ.get('HOME', os.path.expanduser('~'))
    env_path = os.path.join(home, '.ssh', '.env.sava')
    if not os.path.exists(env_path):
        raise FileNotFoundError(f"Magento credentials not found at {env_path}")

    with open(env_path, 'r', encoding='utf-8') as f:
        raw_lines = [line.strip() for line in f if line.strip()]

    base_url = "https://www.savageneedles.com"
    consumer_key = ""
    consumer_secret = ""
    access_token = ""
    access_token_secret = ""

    for i, line in enumerate(raw_lines):
        line_clean = line.lower()
        if "website url" in line_clean or line_clean.startswith("url "):
            parts = line.split()
            for p in parts:
                if p.startswith("http://") or p.startswith("https://"):
                    base_url = p.rstrip('/')
        elif line_clean == "consumer key" and i + 1 < len(raw_lines):
            consumer_key = raw_lines[i + 1]
        elif line_clean == "consumer secret" and i + 1 < len(raw_lines):
            consumer_secret = raw_lines[i + 1]
        elif line_clean == "access token" and i + 1 < len(raw_lines):
            access_token = raw_lines[i + 1]
        elif line_clean == "access token secret" and i + 1 < len(raw_lines):
            access_token_secret = raw_lines[i + 1]

    return {
        "base_url": base_url.rstrip('/'),
        "consumer_key": consumer_key,
        "consumer_secret": consumer_secret,
        "access_token": access_token,
        "access_token_secret": access_token_secret,
    }

def load_saleor_config():
    return {
        "api_endpoint": os.environ.get(
            "SALEOR_API_ENDPOINT",
            "http://localhost:8005/graphql/"
        ),
        "app_token": os.environ.get("SALEOR_APP_TOKEN", ""),
        "channel": os.environ.get("SALEOR_CHANNEL", "default-channel"),
        "currency": os.environ.get("SALEOR_CURRENCY", "USD"),
        "warehouse_id": os.environ.get("SALEOR_WAREHOUSE_ID", ""),
    }
