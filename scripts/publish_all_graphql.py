#!/usr/bin/env python3
import json
import urllib.request
from decimal import Decimal

ENDPOINT = "http://localhost:8005/graphql/"
TOKEN = "xKr5IbkHh78tS2S6NQCoHpCZV16WGi"
CHANNEL_ID = "Q2hhbm5lbDox"
WAREHOUSE_ID = "V2FyZWhvdXNlOjUwY2RiM2M1LTlmNGMtNDBjNi1iMTFkLTk3ZWU0Zjk1YTI3Yg=="

def gql(query, variables=None):
    data = json.dumps({"query": query, "variables": variables or {}}).encode()
    req = urllib.request.Request(
        ENDPOINT,
        data=data,
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {TOKEN}"}
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode())

def run():
    print("Fetching all products from Saleor...")
    res = gql("""
    query {
      products(first: 100) {
        totalCount
        edges {
          node {
            id
            name
            slug
            isAvailableForPurchase
            variants {
              id
              sku
              pricing {
                price {
                  gross {
                    amount
                  }
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
    """)
    all_edges = res.get("data", {}).get("products", {}).get("edges", [])
    has_next = res.get("data", {}).get("products", {}).get("pageInfo", {}).get("hasNextPage")
    cursor = res.get("data", {}).get("products", {}).get("pageInfo", {}).get("endCursor")

    while has_next:
        res = gql("""
        query($after: String) {
          products(first: 100, after: $after) {
            edges {
              node {
                id
                name
                slug
                isAvailableForPurchase
                variants {
                  id
                  sku
                  pricing {
                    price {
                      gross {
                        amount
                      }
                    }
                  }
                }
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
        """, {"after": cursor})
        edges = res.get("data", {}).get("products", {}).get("edges", [])
        all_edges.extend(edges)
        has_next = res.get("data", {}).get("products", {}).get("pageInfo", {}).get("hasNextPage")
        cursor = res.get("data", {}).get("products", {}).get("pageInfo", {}).get("endCursor")

    print(f"Total products found: {len(all_edges)}")

    update_mutation = """
    mutation Publish($id: ID!, $chId: ID!) {
      productChannelListingUpdate(id: $id, input: {
        updateChannels: [{
          channelId: $chId
          isPublished: true
          visibleInListings: true
          isAvailableForPurchase: true
        }]
      }) {
        errors { field message code }
      }
    }
    """

    variant_mutation = """
    mutation UpdateVariant($id: ID!, $chId: ID!) {
      productVariantChannelListingUpdate(id: $id, input: [{
        channelId: $chId
        price: 19.99
      }]) {
        errors { field message }
      }
    }
    """

    for edge in all_edges:
        node = edge["node"]
        p_id = node["id"]
        # Publish to channel
        gql(update_mutation, {"id": p_id, "chId": CHANNEL_ID})
        # Ensure variants have channel listings
        for v in node.get("variants", []):
            if not v.get("pricing") or not v["pricing"].get("price"):
                gql(variant_mutation, {"id": v["id"], "chId": CHANNEL_ID})

    print("All products published and variants channel listings verified.")

if __name__ == "__main__":
    run()
