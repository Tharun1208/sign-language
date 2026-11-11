import os
import cv2
import time
import joblib
import numpy as np
import mediapipe as mp
from concurrent.futures import ThreadPoolExecutor
from sklearn.ensemble import RandomForestClassifier, ExtraTreesClassifier
from sklearn.metrics import accuracy_score, classification_report

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "dataset")
TRAIN_DIR = os.path.join(DATASET_DIR, "Training")
TEST_DIR = os.path.join(DATASET_DIR, "Testing")
MODEL_DIR = os.path.join(BASE_DIR, "models")
MODEL_PATH = os.path.join(MODEL_DIR, "sign_model.pkl")

os.makedirs(MODEL_DIR, exist_ok=True)

LABELS = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")

def extract_scale_invariant_features(image_rgb, hands_detector):
    """
    Extracts 63 landmarks with:
    1. Wrist centering (Translation invariance)
    2. Max hand radius normalization (Scale / Distance invariance)
    """
    results = hands_detector.process(image_rgb)
    if not results.multi_hand_landmarks:
        return None
    
    hand = results.multi_hand_landmarks[0]
    wrist = hand.landmark[0]
    
    # 21 landmarks relative to wrist
    raw_coords = []
    for lm in hand.landmark:
        raw_coords.append([lm.x - wrist.x, lm.y - wrist.y, lm.z - wrist.z])
    
    coords = np.array(raw_coords, dtype=np.float32)
    
    # Scale normalization: Hand radius (max euclidean distance from wrist)
    distances = np.linalg.norm(coords, axis=1)
    max_radius = np.max(distances)
    
    if max_radius > 1e-6:
        coords = coords / max_radius
    else:
        return None
    
    return coords.flatten()

def process_image_path(args):
    path, label = args
    img = cv2.imread(path)
    if img is None:
        return None, None
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    # Thread-local detector
    mp_hands = mp.solutions.hands
    with mp_hands.Hands(
        static_image_mode=True,
        max_num_hands=1,
        min_detection_confidence=0.3
    ) as detector:
        feat = extract_scale_invariant_features(rgb, detector)
        if feat is not None:
            return feat, label
    return None, None

def load_dataset_parallel(folder, max_per_class=350, max_workers=12):
    tasks = []
    for label in LABELS:
        class_folder = os.path.join(folder, label)
        if not os.path.isdir(class_folder):
            continue
        files = [
            os.path.join(class_folder, f)
            for f in os.listdir(class_folder)
            if f.lower().endswith((".jpg", ".jpeg", ".png", ".bmp", ".webp"))
        ]
        selected = files[:max_per_class] if max_per_class else files
        for p in selected:
            tasks.append((p, label))
            
    print(f"Loading {len(tasks)} images from {folder} with {max_workers} threads...")
    t0 = time.time()
    
    X = []
    y = []
    
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        results = executor.map(process_image_path, tasks)
        for feat, label in results:
            if feat is not None:
                X.append(feat)
                y.append(label)
                
    t1 = time.time()
    print(f"Extracted {len(X)}/{len(tasks)} valid hands in {t1 - t0:.2f}s")
    return np.array(X, dtype=np.float32), np.array(y)

def augment_landmarks(X, y):
    """
    Applies Hand Mirroring (Horizontal flip X -> -X) and slight noise
    to guarantee Left and Right hand recognition and robust tolerance.
    """
    X_aug = []
    y_aug = []
    
    for feat, label in zip(X, y):
        # 1. Original
        X_aug.append(feat)
        y_aug.append(label)
        
        # 2. Horizontally mirrored (Left Hand / Mirrored webcam)
        # 21 landmarks: [x0, y0, z0, x1, y1, z1, ...]
        mirrored = feat.copy()
        mirrored[0::3] = -mirrored[0::3]  # Negate X coordinates
        X_aug.append(mirrored)
        y_aug.append(label)
        
        # 3. Small jitter noise (+/- 1.5%) for lighting & webcam variation
        noise = np.random.normal(0, 0.015, size=feat.shape).astype(np.float32)
        jittered = feat + noise
        X_aug.append(jittered)
        y_aug.append(label)
        
    return np.array(X_aug, dtype=np.float32), np.array(y_aug)

def main():
    print("=" * 60)
    print("TRAINING HIGH-ACCURACY SCALE & HAND-INVARIANT ASL MODEL")
    print("=" * 60)
    
    # 1. Load Training Data
    X_train_raw, y_train_raw = load_dataset_parallel(TRAIN_DIR, max_per_class=350, max_workers=12)
    
    # 2. Load Testing Data
    X_test, y_test = load_dataset_parallel(TEST_DIR, max_per_class=None, max_workers=12)
    
    print(f"Raw Train samples: {len(X_train_raw)}")
    print(f"Raw Test samples:  {len(X_test)}")
    
    # 3. Augment Train Data (Mirroring + Jitter)
    print("Augmenting training set with Left-Hand Mirroring & Landmark Jitter...")
    X_train, y_train = augment_landmarks(X_train_raw, y_train_raw)
    print(f"Augmented Train samples: {len(X_train)}")
    
    # 4. Train High-Capacity Random Forest Classifier
    print("Training Random Forest Classifier (300 estimators)...")
    model = RandomForestClassifier(
        n_estimators=300,
        max_depth=None,
        min_samples_split=2,
        min_samples_leaf=1,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1
    )
    
    t0 = time.time()
    model.fit(X_train, y_train)
    t1 = time.time()
    print(f"Model trained in {t1 - t0:.2f}s")
    
    # 5. Evaluate on Train and Test
    train_pred = model.predict(X_train)
    train_acc = accuracy_score(y_train, train_pred)
    
    test_pred = model.predict(X_test)
    test_acc = accuracy_score(y_test, test_pred)
    
    print()
    print("=" * 60)
    print(f"TRAIN ACCURACY: {train_acc * 100:.2f}%")
    print(f"TEST ACCURACY:  {test_acc * 100:.2f}%")
    print("=" * 60)
    
    report = classification_report(y_test, test_pred, target_names=LABELS, output_dict=True)
    
    # Per-class metrics
    per_class_metrics = {}
    for label in LABELS:
        if label in report:
            per_class_metrics[label] = {
                "precision": round(report[label]["precision"], 4),
                "recall": round(report[label]["recall"], 4),
                "f1_score": round(report[label]["f1-score"], 4),
                "support": int(report[label]["support"]),
            }
            
    # 6. Save Model Bundle
    bundle = {
        "model": model,
        "labels": LABELS,
        "feature_count": 63,
        "scale_normalized": True,
        "hand_invariant": True,
        "performance": {
            "training_accuracy": float(train_acc),
            "training_accuracy_percent": round(train_acc * 100, 2),
            "test_accuracy": float(test_acc),
            "test_accuracy_percent": round(test_acc * 100, 2),
            "classification_report": report,
            "per_class_metrics": per_class_metrics,
        },
        "metadata": {
            "model_type": "Random Forest Classifier (Scale & Hand Invariant)",
            "algorithm": "Random Forest",
            "n_estimators": 300,
            "feature_count": 63,
            "classes": 26,
            "labels": LABELS,
            "trained_at": time.strftime("%Y-%m-%d %H:%M:%S")
        }
    }
    
    joblib.dump(bundle, MODEL_PATH)
    print(f"Saved new scale-invariant model to {MODEL_PATH}")
    print("DONE!")

if __name__ == "__main__":
    main()
