#!/usr/bin/env python3
import json
import os
import re

def slugify(text):
    text = str(text).lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")

TYPE_CODE_MAP = {
    "Round Liner": "RL",
    "Round Shader": "RS",
    "Round Magnum": "RM",
    "Magnum": "M1"
}

TYPE_LABEL_MAP = {
    "5460": "Round Liner (RL)",
    "5461": "Round Shader (RS)",
    "5462": "Round Magnum (RM)",
    "5463": "Magnum (M1)",
    "Round Liner": "Round Liner (RL)",
    "Round Shader": "Round Shader (RS)",
    "Round Magnum": "Round Magnum (RM)",
    "Magnum": "Magnum (M1)"
}

GAUGE_LABEL_MAP = {
    "13": "#08 Bugpin (0.25mm)",
    "14": "#10 Bugpin (0.30mm)",
    "15": "#12 Standard (0.35mm)",
    "#8 Bugpin": "#08 Bugpin (0.25mm)",
    "#10 Bugpin": "#10 Bugpin (0.30mm)",
    "#12 Standard": "#12 Standard (0.35mm)"
}

SIZE_LABEL_MAP = {
    "5464": "1",
    "5465": "3",
    "5466": "5",
    "5467": "7",
    "5468": "9",
    "5469": "11",
    "5470": "13",
    "5471": "14",
    "5472": "15",
    "5473": "17",
    "5474": "18",
    "5475": "23",
    "5476": "25",
    "5477": "27"
}

GRIP_DIAMETER_MAP = {
    "20": "1\" (25mm Standard)",
    "21": "1.25\" (32mm Ergonomic Fat Grip)"
}

COLOR_MAP = {
    "28": "Matte Black",
    "29": "Anodized Silver"
}

def clean_description_text(raw_text, name):
    if not raw_text:
        return f"{name} - Professional studio grade supply, engineered for precision, endurance, and seamless compatibility."
    text = re.sub(r"\{\{[\s\S]*?\}\}", "", raw_text)
    text = re.sub(r"<[\s\S]*?>", " ", text)
    text = text.replace("&nbsp;", " ").replace("&amp;", "&").replace("&quot;", "\"").replace("&lt;", "<").replace("&gt;", ">")
    text = re.sub(r"\s+", " ", text).strip()
    return text

def generate_catalog():
    print("Generating professional Sava storefront catalog with tattoo domain metadata...")

    with open("artifacts/extracted/categories.json", "r", encoding="utf-8") as f:
        cat_tree = json.load(f)

    with open("artifacts/extracted/products.json", "r", encoding="utf-8") as f:
        products_raw = json.load(f)

    # 1. Categories
    TOP_CATEGORY_SLUG_MAP = {
        "98": "savage-cartridges",
        "50": "papa-products",
        "96": "papa-machines",
        "97": "papa-cartridges",
        "51": "cartridge-grips",
        "93": "papa-power-supply",
        "78": "cheyenne",
        "70": "papa-accessories",
        "77": "papa-stencil",
        "94": "papa-apparel",
    }

    categories = {}
    def walk_categories(node, parent_id=None):
        cid = str(node.get("id"))
        name = node.get("name", "").strip()
        slug = TOP_CATEGORY_SLUG_MAP.get(cid) or slugify(name) or f"category-{cid}"
        children_data = node.get("children_data", [])
        child_ids = [str(c.get("id")) for c in children_data]
        categories[cid] = {
            "id": cid,
            "name": name,
            "slug": slug,
            "parent_id": str(parent_id) if parent_id else None,
            "product_count": node.get("product_count", 0),
            "is_active": node.get("is_active", True),
            "children_ids": child_ids
        }
        for child in children_data:
            walk_categories(child, parent_id=cid)

    walk_categories(cat_tree)

    # Deduplicate slugs
    slug_counts = {}
    for cid, cat in categories.items():
        if cat["id"] in ("1", "2"):
            continue
        base_slug = cat["slug"]
        if base_slug in slug_counts:
            slug_counts[base_slug] += 1
            cat["slug"] = f"{base_slug}-{cid}"
        else:
            slug_counts[base_slug] = 1

    # 2. Process Products
    child_to_parent = {}
    for p in products_raw:
        if p.get("type_id") == "configurable":
            for child in p.get("_configurable_children", []):
                child_to_parent[child.get("id")] = p.get("id")

    catalog_products = []

    for p in products_raw:
        pid = p.get("id")
        sku = p.get("sku")
        name = p.get("name", "").strip()
        type_id = p.get("type_id")
        price = float(p.get("price") or 0.0)

        if type_id == "simple" and pid in child_to_parent:
            continue

        cat_ids = []
        description = ""
        for attr in p.get("custom_attributes", []):
            code = attr.get("attribute_code")
            if code == "category_ids":
                cat_ids = [str(x) for x in attr.get("value", [])]
            elif code == "description":
                description = attr.get("value", "")

        if not cat_ids:
            cat_ids = ["98"]

        clean_text = clean_description_text(description, name)
        short_desc = clean_text[:220]

        image_url = ""
        gallery_images = []
        for m in p.get("media_gallery_entries", []):
            f = m.get("file", "")
            if f:
                full_img = f"https://www.savageneedles.com/media/catalog/product{f}"
                gallery_images.append(full_img)
                if not image_url:
                    image_url = full_img

        # Process Variants & Domain Specific Attributes
        variants = []
        is_needle_matrix = (sku == "BNC-03" or "Needle Cartridges" in name)

        if type_id == "configurable":
            for child in p.get("_configurable_children", []):
                c_sku = child.get("sku")
                c_name = child.get("name", c_sku)
                c_price = float(child.get("price") or price)
                c_attrs = {a["attribute_code"]: str(a["value"]) for a in child.get("custom_attributes", [])}

                var_obj = {
                    "id": f"var-{child.get('id')}",
                    "sku": c_sku,
                    "name": c_name,
                    "price": c_price,
                    "in_stock": True,
                    "stock_quantity": 100,
                    "attributes": {}
                }

                # If Savage Needle Cartridge
                if is_needle_matrix:
                    parts = [x.strip() for x in c_name.split("-")]
                    # Format: Savage Tattoo Needle Cartridges-[Type]-[Size]-[Gauge]
                    if len(parts) >= 4:
                        n_type = parts[1]
                        n_size = parts[2]
                        n_gauge = parts[3]
                        n_code_type = TYPE_CODE_MAP.get(n_type, n_type[:2].upper())

                        # Standard tattoo code: e.g. 1007RM, 1203RL
                        g_num = "12"
                        if "10" in n_gauge:
                            g_num = "10"
                        elif "8" in n_gauge or "08" in n_gauge:
                            g_num = "08"
                        
                        s_formatted = n_size.zfill(2)
                        standard_code = f"{g_num}{s_formatted}{n_code_type}"

                        var_obj["code"] = standard_code
                        var_obj["needle_type"] = n_type
                        var_obj["needle_type_code"] = n_code_type
                        var_obj["gauge"] = GAUGE_LABEL_MAP.get(n_gauge, n_gauge)
                        var_obj["gauge_raw"] = n_gauge
                        var_obj["size"] = n_size
                        var_obj["size_display"] = f"{s_formatted}{n_code_type}"
                        var_obj["attributes"] = {
                            "Type": TYPE_LABEL_MAP.get(n_type, n_type),
                            "Gauge": GAUGE_LABEL_MAP.get(n_gauge, n_gauge),
                            "Size": n_size
                        }
                else:
                    # Papa Grips or Power Supplies
                    if "choose_a_grip_diameter" in c_attrs:
                        val = c_attrs["choose_a_grip_diameter"]
                        label = GRIP_DIAMETER_MAP.get(val, f"{val}\" Grip")
                        var_obj["attributes"]["Grip Diameter"] = label
                        var_obj["label"] = label
                    if "critical_power_color" in c_attrs or "color" in c_attrs:
                        val = c_attrs.get("critical_power_color") or c_attrs.get("color")
                        label = COLOR_MAP.get(val, "Standard")
                        var_obj["attributes"]["Color"] = label
                        var_obj["label"] = label
                    if not var_obj["attributes"]:
                        var_obj["label"] = c_name

                variants.append(var_obj)
        else:
            variants.append({
                "id": f"var-{pid}",
                "sku": sku,
                "name": name,
                "price": price if price > 0 else 19.99,
                "in_stock": True,
                "stock_quantity": 100,
                "attributes": {}
            })

        if price == 0 and variants and variants[0]["price"] > 0:
            price = variants[0]["price"]
        if price == 0:
            price = 19.99

        p_slug = f"{slugify(name)}-{pid}"

        # Clean Configurable Options for UI
        raw_options = p.get("_configurable_options", [])
        clean_options = []
        for opt in raw_options:
            opt_label = opt.get("label", "").strip()
            clean_vals = []
            for v in opt.get("values", []):
                v_idx = str(v.get("value_index"))
                display_label = v_idx
                if opt_label.lower() == "type":
                    display_label = TYPE_LABEL_MAP.get(v_idx, v_idx)
                elif opt_label.lower() == "gauge":
                    display_label = GAUGE_LABEL_MAP.get(v_idx, v_idx)
                elif opt_label.lower() == "size":
                    display_label = SIZE_LABEL_MAP.get(v_idx, v_idx)
                elif "grip" in opt_label.lower():
                    display_label = GRIP_DIAMETER_MAP.get(v_idx, f"{v_idx}\"")
                elif "color" in opt_label.lower():
                    display_label = COLOR_MAP.get(v_idx, v_idx)
                
                clean_vals.append({
                    "index": v_idx,
                    "label": display_label
                })

            clean_options.append({
                "id": str(opt.get("id", "")),
                "attribute_id": str(opt.get("attribute_id", "")),
                "label": opt_label,
                "values": clean_vals
            })

        prod_record = {
            "id": str(pid),
            "sku": sku,
            "name": name,
            "slug": p_slug,
            "type": type_id,
            "is_needle_matrix": is_needle_matrix,
            "price": price,
            "special_price": None,
            "description": clean_text,
            "short_description": short_desc,
            "image": image_url,
            "gallery": gallery_images,
            "category_ids": cat_ids,
            "options": clean_options,
            "children": variants,
            "variants": variants,
            "is_visible_individually": True,
            "is_available": True,
        }

        catalog_products.append(prod_record)

    clean_categories = [
        c for c in categories.values()
        if c["id"] not in ("1", "2") and (c["product_count"] > 0 or c["children_ids"])
    ]

    payload = {
        "brand": {
            "name": "Savage Needles",
            "tagline": "Precision Tattoo Needles & Papa Supply",
            "currency": "USD",
            "total_products": len(catalog_products),
            "total_categories": len(clean_categories),
            "saleor_endpoint": "http://localhost:8005/graphql/",
            "saleor_channel": "default-channel"
        },
        "categories": clean_categories,
        "products": catalog_products
    }

    out_file = "src/data/catalog.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)

    print(f"✅ Generated {out_file} with domain-specific tattoo attributes for {len(catalog_products)} products!")

if __name__ == "__main__":
    generate_catalog()
