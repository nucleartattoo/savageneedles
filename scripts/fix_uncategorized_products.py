#!/usr/bin/env python3
import os
import sys

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

from saleor.product.models import Product, ProductChannelListing, ProductVariant, ProductVariantChannelListing, Category
from saleor.channel.models import Channel
from saleor.warehouse.models import Warehouse, Stock
from decimal import Decimal

def fix():
    channel = Channel.objects.get(slug="default-channel")
    warehouse = Warehouse.objects.filter(slug="sava-main-hub").first() or Warehouse.objects.first()
    default_cat = Category.objects.filter(slug__icontains="savage-cartridges").first() or Category.objects.first()

    print(f"Assigning fallback category: {default_cat.name} ({default_cat.slug})")

    uncategorized = Product.objects.filter(category__isnull=True)
    count = uncategorized.count()
    print(f"Found {count} uncategorized products. Updating...")

    for p in uncategorized:
        p.category = default_cat
        p.save(update_fields=["category"])

    all_prods = Product.objects.all()
    print(f"Publishing all {all_prods.count()} products to {channel.slug}...")

    published_count = 0
    variant_listing_count = 0
    stock_count = 0

    for p in all_prods:
        ProductChannelListing.objects.update_or_create(
            product=p,
            channel=channel,
            defaults={
                "is_published": True,
                "visible_in_listings": True,
                "is_available_for_purchase": True,
            }
        )
        published_count += 1

        for v in p.variants.all():
            ProductVariantChannelListing.objects.update_or_create(
                variant=v,
                channel=channel,
                defaults={
                    "price_amount": Decimal("19.99") if v.channel_listings.count() == 0 else v.channel_listings.first().price_amount or Decimal("19.99"),
                    "currency": "USD",
                }
            )
            variant_listing_count += 1

            if warehouse:
                Stock.objects.update_or_create(
                    product_variant=v,
                    warehouse=warehouse,
                    defaults={"quantity": 100}
                )
                stock_count += 1

    print(f"✅ Finished! Published: {published_count}, Variants Listed: {variant_listing_count}, Stocks Updated: {stock_count}")

if __name__ == "__main__":
    fix()
