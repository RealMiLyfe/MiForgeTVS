import json
import requests
import sys

def load_api_key():
    with open("/opt/milyfe/secrets/payment-keys.json") as f:
        keys = json.load(f)
    return keys.get("gocardless", {}).get("api_key")

def create_payment_with_gocardless(vendor_name, amount, description):
    api_key = load_api_key()
    if not api_key:
        print(json.dumps({"error": "GoCardless API key not found"}), file=sys.stderr)
        return None

    url = "https://api.gocardless.com/payments"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "payments": [
            {
                "amount": amount,
                "currency": "USD",
                "description": description,
                "links": {
                    "mandate": "MD00000000000000"  # Replace with actual mandate ID
                }
            }
        ]
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        if response.status_code == 201:
            return response.json().get("data", [{}])[0].get("id")
        else:
            print(json.dumps({"error": f"GoCardless API error: {response.status_code}"}), file=sys.stderr)
            return None
    except requests.RequestException as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        return None
