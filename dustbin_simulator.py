import firebase_admin
from firebase_admin import credentials, firestore
import time
import random

# --- SETUP ---
cred = credentials.Certificate("serviceAccountKey.json")
try:
    firebase_admin.get_app()
except ValueError:
    firebase_admin.initialize_app(cred)

db = firestore.client()
robot_id = "SAHAAYAK-01"
robot_ref = db.collection('robots').document(robot_id)

print(f"🤖 Upgraded Simulator running for {robot_id}. (Press Ctrl+C to stop)")

# Initial state
battery_level = 100
wet_bin = 0
dry_bin = 0
robot_status = "IDLE"

# --- MAIN LOOP ---
while True:
    try:
        # Simulate state changes
        battery_level = max(0, battery_level - random.uniform(0.1, 0.5))
        robot_status = random.choice(["NAVIGATING", "COLLECTING", "IDLE", "BLOCKED"])
        
        if robot_status == "COLLECTING":
            wet_bin = min(100, wet_bin + random.randint(3, 8))
            dry_bin = min(100, dry_bin + random.randint(2, 6))

        # --- New Alert Logic ---
        health_status = "Operational"
        alert_message = "All systems normal."

        if battery_level < 20:
            health_status = "Warning"
            alert_message = "Battery level is critical. Returning to base."
            robot_status = "RETURNING TO BASE"
        elif wet_bin > 95 or dry_bin > 95:
            health_status = "Critical"
            alert_message = "Bin capacity exceeded. Requires immediate attention."
            robot_status = "BIN FULL"
        elif robot_status == "BLOCKED":
            health_status = "Critical"
            alert_message = "Path is blocked. Manual intervention required."

        # Prepare the data packet
        data = {
            'status': robot_status,
            'battery': round(battery_level, 2),
            'location': firestore.GeoPoint(22.5726 + random.uniform(-0.01, 0.01), 88.3639 + random.uniform(-0.01, 0.01)),
            'wetBinLevel': wet_bin,
            'dryBinLevel': dry_bin,
            'healthStatus': health_status, # New field for alerts
            'alertMessage': alert_message, # New field for alerts
            'lastUpdated': firestore.SERVER_TIMESTAMP
        }

        robot_ref.set(data)
        print(f"✅ Updated {robot_id}: Status={data['status']}, Health={data['healthStatus']}")
        time.sleep(5)

    except KeyboardInterrupt:
        print(f"\n🛑 Simulator stopped.")
        break
    except Exception as e:
        print(f"An error occurred: {e}")
        break