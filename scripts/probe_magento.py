#!/usr/bin/env python3
import os
import sys
import json
import time
import hmac
import hashlib
import base64
import urllib.request
import urllib.parse
from urllib.error import HTTPError, URLError

def load_config():
    home = os.environ.get('HOME', os.path.expanduser('~'))
    env_path = os.path.join(home, '.ssh', '.env.sava')
    if not os.path.exists(env_path):
        raise FileNotFoundError(f"Config file not found at {env_path}")

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
        "base_url": base_url,
        "consumer_key": consumer_key,
        "consumer_secret": consumer_secret,
        "access_token": access_token,
        "access_token_secret": access_token_secret
    }

def generate_oauth1_header(method, url_str, query_params, config):
    parsed = urllib.parse.urlparse(url_str)
    clean_url = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"

    nonce = os.urandom(16).hex()
    timestamp = str(int(time.time()))

    oauth_params = {
        'oauth_consumer_key': config['consumer_key'],
        'oauth_nonce': nonce,
        'oauth_signature_method': 'HMAC-SHA256',
        'oauth_timestamp': timestamp,
        'oauth_token': config['access_token'],
        'oauth_version': '1.0'
    }

    all_params = {}
    if parsed.query:
        for k, v in urllib.parse.parse_qsl(parsed.query, keep_blank_values=True):
            all_params[k] = v
    if query_params:
        all_params.update(query_params)
    all_params.update(oauth_params)

    encoded_pairs = []
    for k in sorted(all_params.keys()):
        encoded_k = urllib.parse.quote(str(k), safe='')
        encoded_v = urllib.parse.quote(str(all_params[k]), safe='')
        encoded_pairs.append(f"{encoded_k}={encoded_v}")
    param_string = '&'.join(encoded_pairs)

    base_string = '&'.join([
        method.upper(),
        urllib.parse.quote(clean_url, safe=''),
        urllib.parse.quote(param_string, safe='')
    ])

    signing_key = f"{urllib.parse.quote(config['consumer_secret'], safe='')}&{urllib.parse.quote(config['access_token_secret'], safe='')}"
    signature = base64.b64encode(
        hmac.new(signing_key.encode('utf-8'), base_string.encode('utf-8'), hashlib.sha256).digest()
    ).decode('utf-8')

    oauth_params['oauth_signature'] = signature

    header_parts = [
        f'{urllib.parse.quote(k, safe="")}="{urllib.parse.quote(v, safe="")}"'
        for k, v in sorted(oauth_params.items())
    ]
    return f"OAuth {', '.join(header_parts)}"

def api_request(endpoint, query_params=None, config=None, auth_mode="bearer"):
    if query_params is None:
        query_params = {}

    url = f"{config['base_url']}/rest/V1/{endpoint.lstrip('/')}"
    if query_params:
        query_str = urllib.parse.urlencode(query_params)
        full_url = f"{url}?{query_str}"
    else:
        full_url = url

    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    if auth_mode == "bearer":
        headers['Authorization'] = f"Bearer {config['access_token']}"
    else:
        headers['Authorization'] = generate_oauth1_header('GET', full_url, query_params, config)

    req = urllib.request.Request(full_url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = resp.read().decode('utf-8')
            return resp.status, json.loads(data)
    except HTTPError as e:
        body = e.read().decode('utf-8')
        try:
            parsed_err = json.loads(body)
        except Exception:
            parsed_err = body
        return e.code, parsed_err
    except URLError as e:
        return 0, str(e.reason)

def check_auth_mode(config):
    print("Testing Bearer Token authentication...")
    status, res = api_request("store/websites", config=config, auth_mode="bearer")
    if status == 200:
        print("  -> Bearer Token authentication succeeded!")
        return "bearer"

    print(f"  -> Bearer Token returned HTTP {status}. Testing OAuth 1.0a (HMAC-SHA256)...")
    status_oauth, res_oauth = api_request("store/websites", config=config, auth_mode="oauth")
    if status_oauth == 200:
        print("  -> OAuth 1.0a authentication succeeded!")
        return "oauth"

    raise RuntimeError(
        f"Authentication failed. Bearer returned {status} ({res}), OAuth returned {status_oauth} ({res_oauth})"
    )

def main():
    print("=========================================================")
    print("   Sava (savageneedles.com) Magento 2 Inspection Probe   ")
    print("=========================================================\n")

    config = load_config()
    print(f"Target Store URL : {config['base_url']}")
    print(f"Consumer Key     : {config['consumer_key'][:8]}...")
    print(f"Access Token     : {config['access_token'][:8]}...")
    print("Loaded credentials from ~/.ssh/.env.sava\n")

    auth_mode = check_auth_mode(config)

    report = {
        "generated_at": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
        "store_url": config["base_url"],
        "auth_mode": auth_mode,
        "store_info": {},
        "categories": {},
        "products": {},
        "attribute_sets": [],
        "sample_products": []
    }

    # 1. Store configs
    print("\n[1/5] Fetching Store & Currency Configuration...")
    status, websites = api_request("store/websites", config=config, auth_mode=auth_mode)
    if status == 200:
        print(f"  Websites count: {len(websites)}")
        for w in websites:
            print(f"    - ID: {w.get('id')}, Code: {w.get('code')}, Name: {w.get('name')}")
        report["store_info"]["websites"] = websites

    status, store_views = api_request("store/storeViews", config=config, auth_mode=auth_mode)
    if status == 200:
        print(f"  Store Views count: {len(store_views)}")
        for sv in store_views:
            print(f"    - ID: {sv.get('id')}, Code: {sv.get('code')}, Name: {sv.get('name')}, Active: {sv.get('is_active')}")
        report["store_info"]["store_views"] = store_views

    status, configs = api_request("store/storeConfigs", config=config, auth_mode=auth_mode)
    if status == 200 and configs:
        c = configs[0]
        print(f"  Default Currency: {c.get('base_currency_code')}")
        print(f"  Timezone        : {c.get('timezone')}")
        print(f"  Weight Unit     : {c.get('weight_unit')}")
        report["store_info"]["store_configs"] = configs

    # 2. Categories
    print("\n[2/5] Fetching Category Tree...")
    status, cat_tree = api_request("categories", config=config, auth_mode=auth_mode)
    if status == 200:
        def count_nodes(node):
            count = 1
            for child in node.get("children_data", []):
                count += count_nodes(child)
            return count

        def print_tree(node, depth=0):
            indent = "  " * depth
            active_str = "✓" if node.get("is_active") else "✗"
            print(f"{indent}[{active_str}] ID: {node.get('id')} - {node.get('name')} (products: {node.get('product_count', 0)})")
            for child in node.get("children_data", []):
                print_tree(child, depth + 1)

        total_cats = count_nodes(cat_tree)
        print(f"  Total Category Nodes: {total_cats}")
        print("  Category Hierarchy Preview:")
        print_tree(cat_tree, depth=2)
        report["categories"] = {
            "total_nodes": total_cats,
            "tree": cat_tree
        }
    else:
        print(f"  Failed to fetch categories: {status} - {cat_tree}")

    # 3. Attribute Sets
    print("\n[3/5] Fetching Product Attribute Sets...")
    status, attr_sets = api_request("products/attribute-sets/sets/list", {
        "searchCriteria[pageSize]": "50"
    }, config=config, auth_mode=auth_mode)
    if status == 200:
        items = attr_sets.get("items", [])
        print(f"  Attribute Sets count: {len(items)}")
        for s in items:
            print(f"    - Set ID: {s.get('attribute_set_id')}, Name: {s.get('attribute_set_name')}")
        report["attribute_sets"] = items
    else:
        print(f"  Failed to fetch attribute sets: {status}")

    # 4. Total Products
    print("\n[4/5] Counting Total Products...")
    status, prod_res = api_request("products", {
        "searchCriteria[pageSize]": "1",
        "searchCriteria[currentPage]": "1"
    }, config=config, auth_mode=auth_mode)
    if status == 200:
        total_count = prod_res.get("total_count", 0)
        print(f"  Total Products in Catalog: {total_count}")
        report["products"]["total_count"] = total_count
    else:
        print(f"  Failed to count products: {status}")

    # 5. Product types breakdown & sample
    print("\n[5/5] Sampling Products & Types...")
    status, sample_res = api_request("products", {
        "searchCriteria[pageSize]": "10",
        "searchCriteria[currentPage]": "1"
    }, config=config, auth_mode=auth_mode)
    if status == 200:
        items = sample_res.get("items", [])
        print(f"  Sampled {len(items)} products:")
        for p in items:
            print(f"    - SKU: {p.get('sku')}, Type: {p.get('type_id')}, Name: {p.get('name')}, Price: ${p.get('price')}")
        report["sample_products"] = items

    out_file = "artifacts/sava_probe_report.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Audit complete! Report saved to {out_file}")

if __name__ == "__main__":
    main()
