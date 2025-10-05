import firebase_admin
from firebase_admin import credentials, firestore
import time
import random

# --- SETUP ---
# This looks for the key file in the same folder
try:
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)
except Exception as e:
    print(f"Error initializing Firebase: {e}")
    print("Please make sure 'serviceAccountKey.json' is in the same folder as this script.")
    exit()

db = firestore.client()
robot_id = "SAHAAYAK-01"
robot_ref = db.collection('robots').document(robot_id)

print(f"🤖 Simulating Robot: {robot_id}. Sending data to Firestore... (Press Ctrl+C to stop)")

# Initial state of the robot
battery_level = 100
wet_bin = 0
dry_bin = 0

# --- MAIN LOOP ---
while True:
    try:
        # Simulate battery drain and bin filling
        battery_level = max(0, battery_level - random.uniform(0.1, 0.5))
        if battery_level < 15:
            robot_status = "RETURNING TO BASE"
        else:
            robot_status = random.choice(["NAVIGATING", "COLLECTING", "IDLE"])
        
        if robot_status == "COLLECTING":
            wet_bin = min(100, wet_bin + random.randint(2, 5))
            dry_bin = min(100, dry_bin + random.randint(1, 4))

        data = {
            'status': robot_status,
            'battery': round(battery_level, 2),
            'location': firestore.GeoPoint(22.5726 + random.uniform(-0.01, 0.01), 88.3639 + random.uniform(-0.01, 0.01)),
            'wetBinLevel': wet_bin,
            'dryBinLevel': dry_bin,
            'lastUpdated': firestore.SERVER_TIMESTAMP
        }

        robot_ref.set(data)

        print(f"✅ Updated {robot_id}: Status={data['status']}, Battery={data['battery']}%")

        time.sleep(5)

    except KeyboardInterrupt:
        print(f"\n🛑 Simulator for {robot_id} stopped.")
        break
    except Exception as e:
        print(f"An error occurred: {e}")
        break