#!/usr/bin/env python3
import os
import sys
import json
import urllib.request

CORE_DIR = "/Volumes/samsung2tb980pro/project/Saleor-NTMS/apps/saleor-core"
if CORE_DIR not in sys.path:
    sys.path.insert(0, CORE_DIR)

env_file = os.path.join(CORE_DIR, ".env.sava")
if os.path.exists(env_file):
    with open(env_file, "r") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ[k.strip()] = v.strip().strip("'\"")

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "saleor.settings")

import django
django.setup()

from saleor.product.models import Product, Category
from saleor.channel.models import Channel

def publish():
    # 1. Ensure all products have category
    default_cat = Category.objects.filter(slug__icontains="savage-cartridges").first() or Category.objects.first()
    uncat = Product.objects.filter(category__isnull=True)
    if uncat.exists():
        print(f"Setting category {default_cat.name} for {uncat.count()} products...")
        uncat.update(category=default_cat)

    print("All products now have valid categories.")

if __name__ == "__main__":
    publish()
