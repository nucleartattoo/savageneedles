#!/usr/bin/env python3
import os
import sys
import base64

CORE_DIR = "/Volumes/samsung2tb980pro/project/Saleor-NTMS/apps/saleor-core"
if CORE_DIR not in sys.path:
    sys.path.insert(0, CORE_DIR)

# Load Sava environment
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

from saleor.account.models import User, Group, Address
from saleor.permission.models import Permission
from saleor.site.models import SiteSettings
from saleor.channel.models import Channel
from saleor.warehouse.models import Warehouse
from saleor.shipping.models import ShippingZone, ShippingMethod, ShippingMethodChannelListing
from saleor.shipping import ShippingMethodType
from saleor.tax import TaxCalculationStrategy
from saleor.tax.models import TaxConfiguration

def init():
    print("=" * 60)
    print("🛠️  INITIALIZING SAVA (SAVAGE NEEDLES) DEDICATED SALEOR CORE")
    print("=" * 60)

    # 1. Site Settings
    site = SiteSettings.objects.first()
    if site:
        site.enable_account_confirmation_by_email = False
        site.save()
        print("✅ Disabled email account confirmation")

    # 2. Permission Group: Full Access
    group, _ = Group.objects.get_or_create(name="Full Access")
    all_perms = Permission.objects.filter(content_type__app_label__in=[
        "account", "app", "attribute", "channel", "checkout", "csv", "discount",
        "giftcard", "invoice", "menu", "order", "page", "payment", "permission",
        "plugins", "product", "shipping", "site", "tax", "warehouse", "webhook"
    ])
    group.permissions.set(all_perms)
    group.save()
    print(f"✅ Created 'Full Access' group with {all_perms.count()} permissions")

    # 3. Superuser accounts
    users = [
        ("admin@savageneedles.com", "Sava2026!"),
        ("admin@example.com", "admin"),
    ]
    for email, pw in users:
        u, created = User.objects.get_or_create(
            email=email,
            defaults={"is_active": True, "is_confirmed": True, "is_staff": True, "is_superuser": True}
        )
        u.set_password(pw)
        u.is_active = True
        u.is_confirmed = True
        u.is_staff = True
        u.is_superuser = True
        u.save()
        u.groups.add(group)
        print(f"✅ Admin ready: {email} (superuser=True, Full Access)")

    # 4. Default Channel
    channel, ch_created = Channel.objects.get_or_create(
        slug="default-channel",
        defaults={
            "name": "Savage Needles",
            "currency_code": "USD",
            "default_country": "US",
            "is_active": True,
        }
    )
    TaxConfiguration.objects.update_or_create(
        channel=channel,
        defaults={"tax_calculation_strategy": TaxCalculationStrategy.FLAT_RATES, "charge_taxes": True}
    )
    print(f"✅ Default Channel: {channel.name} ({channel.slug}) - Flat Rates Tax")

    # Also create sava-channel alias
    channel_sava, _ = Channel.objects.get_or_create(
        slug="sava-channel",
        defaults={
            "name": "Savage Needles Store",
            "currency_code": "USD",
            "default_country": "US",
            "is_active": True,
        }
    )
    TaxConfiguration.objects.update_or_create(
        channel=channel_sava,
        defaults={"tax_calculation_strategy": TaxCalculationStrategy.FLAT_RATES, "charge_taxes": True}
    )

    # 5. Warehouse
    wh_address, _ = Address.objects.get_or_create(
        company_name="Savage Needles LLC",
        street_address_1="1200 S Main St",
        city="Los Angeles",
        country_area="CA",
        postal_code="90015",
        country="US",
        phone="+12135550188",
    )
    wh, _ = Warehouse.objects.get_or_create(
        slug="sava-main-hub",
        defaults={
            "name": "Savage Needles LA Hub",
            "address": wh_address,
        }
    )
    wh.channels.add(channel, channel_sava)
    wh.save()
    print(f"✅ Warehouse: {wh.name} ({wh.slug}) bound to channels")

    # 6. Shipping Zone & Methods
    zone, _ = ShippingZone.objects.get_or_create(
        name="Sava US Domestic",
        defaults={
            "countries": ["US"],
        }
    )
    zone.channels.add(channel, channel_sava)
    zone.warehouses.add(wh)
    zone.save()

    methods_data = [
        ("UPS Standard Ground", 15.00),
        ("UPS 2nd Day Air", 35.00),
        ("Free Priority Shipping (Orders $150+)", 0.00),
    ]

    for name, price in methods_data:
        m, _ = ShippingMethod.objects.get_or_create(
            name=name,
            shipping_zone=zone,
            defaults={"type": ShippingMethodType.PRICE_BASED}
        )
        for ch in [channel, channel_sava]:
            ShippingMethodChannelListing.objects.update_or_create(
                shipping_method=m,
                channel=ch,
                defaults={
                    "price_amount": price,
                    "currency": "USD",
                }
            )
        print(f"✅ Shipping Method: {name} -> ${price:.2f} USD")

    # 7. Create App for API token access
    from saleor.app.models import App
    app, _ = App.objects.get_or_create(
        name="Sava Storefront App",
        defaults={"is_active": True, "type": "local"}
    )
    app.permissions.set(all_perms)
    app.save()

    token_obj = app.tokens.first()
    if not token_obj:
        created_token = app.tokens.create(name="Default Token")
        token_str = created_token[0] if isinstance(created_token, tuple) else getattr(created_token, 'auth_token', str(created_token))
    else:
        token_str = getattr(token_obj, 'auth_token', str(token_obj.token_last_4))

    # Base64 warehouse global id for GraphQL
    wh_gid = base64.b64encode(f"Warehouse:{wh.id}".encode()).decode()

    print("=" * 60)
    print("🎉 SAVA DEDICATED SALEOR CORE READY!")
    print(f"   Auth Token  : {token_str}")
    print(f"   Warehouse ID: {wh_gid}")
    print("=" * 60)

    # Save to local .env
    env_content = f"""SALEOR_API_ENDPOINT=http://localhost:8005/graphql/
SALEOR_APP_TOKEN={token_str}
SALEOR_CHANNEL=default-channel
SALEOR_CURRENCY=USD
SALEOR_WAREHOUSE_ID={wh_gid}
PORT=3005
"""
    local_env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
    with open(local_env_path, "w") as f:
        f.write(env_content)
    print(f"✅ Saved environment to {local_env_path}")

    return {
        "channel_id": channel.id,
        "token": token_str,
        "warehouse_id": wh_gid
    }

if __name__ == "__main__":
    init()
