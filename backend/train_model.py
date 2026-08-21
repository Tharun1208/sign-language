import os
import cv2
import joblib
import numpy as np
import mediapipe as mp

from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report
)


# ============================================================
# PATHS
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

DATASET_DIR = os.path.join(
    BASE_DIR,
    "dataset"
)

TRAIN_DIR = os.path.join(
    DATASET_DIR,
    "Training"
)

VALIDATION_DIR = os.path.join(
    DATASET_DIR,
    "Validation"
)

TEST_DIR = os.path.join(
    DATASET_DIR,
    "Testing"
)

MODEL_DIR = os.path.join(
    BASE_DIR,
    "models"
)

MODEL_PATH = os.path.join(
    MODEL_DIR,
    "sign_model.pkl"
)

os.makedirs(
    MODEL_DIR,
    exist_ok=True
)


# ============================================================
# LABELS
# ============================================================

LABELS = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")


# ============================================================
# MEDIAPIPE
# ============================================================

mp_hands = mp.solutions.hands

hands = mp_hands.Hands(
    static_image_mode=True,
    max_num_hands=1,
    min_detection_confidence=0.5
)


# ============================================================
# EXTRACT HAND LANDMARKS
#
# 21 landmarks × 3 coordinates = 63 features
# Coordinates are normalized relative to the wrist.
# ============================================================

def extract_landmarks(image_path):

    image = cv2.imread(image_path)

    if image is None:
        return None

    image_rgb = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2RGB
    )

    results = hands.process(
        image_rgb
    )

    if not results.multi_hand_landmarks:
        return None

    hand = results.multi_hand_landmarks[0]

    wrist = hand.landmark[0]

    features = []

    for landmark in hand.landmark:

        x = landmark.x - wrist.x
        y = landmark.y - wrist.y
        z = landmark.z - wrist.z

        features.extend([
            x,
            y,
            z
        ])

    features = np.array(
        features,
        dtype=np.float32
    )

    # --------------------------------------------------------
    # Safety check
    # --------------------------------------------------------

    if len(features) != 63:
        return None

    return features


# ============================================================
# LOAD DATASET
# ============================================================

def load_dataset(folder):

    X = []
    y = []

    print()
    print("=" * 60)
    print("Loading Dataset")
    print("=" * 60)
    print(folder)
    print()

    total_images = 0
    detected_images = 0

    class_counts = {}

    for label in LABELS:

        label_folder = os.path.join(
            folder,
            label
        )

        if not os.path.isdir(
            label_folder
        ):

            print(
                f"[WARNING] Missing folder: {label}"
            )

            class_counts[label] = {
                "images": 0,
                "detected": 0,
                "skipped": 0
            }

            continue

        files = [
            file
            for file in os.listdir(
                label_folder
            )
            if file.lower().endswith(
                (
                    ".jpg",
                    ".jpeg",
                    ".png",
                    ".bmp",
                    ".webp"
                )
            )
        ]

        detected_for_label = 0

        for filename in files:

            image_path = os.path.join(
                label_folder,
                filename
            )

            total_images += 1

            features = extract_landmarks(
                image_path
            )

            if features is None:
                continue

            X.append(features)
            y.append(label)

            detected_images += 1
            detected_for_label += 1

        skipped_for_label = (
            len(files)
            - detected_for_label
        )

        class_counts[label] = {
            "images": len(files),
            "detected": detected_for_label,
            "skipped": skipped_for_label
        }

        print(
            f"{label}: "
            f"{len(files)} images -> "
            f"{detected_for_label} hands detected"
        )

    skipped_images = (
        total_images
        - detected_images
    )

    print()
    print("-" * 60)

    print(
        f"Total images:     {total_images}"
    )

    print(
        f"Hands detected:   {detected_images}"
    )

    print(
        f"Skipped images:   {skipped_images}"
    )

    print("-" * 60)

    if len(X) == 0:

        raise RuntimeError(
            f"No hand landmarks detected in:\n{folder}"
        )

    return (
        np.array(X),
        np.array(y),
        class_counts,
        total_images,
        detected_images,
        skipped_images
    )


# ============================================================
# MAIN
# ============================================================

def main():

    print()
    print("=" * 70)
    print("              SignAI A-Z MODEL TRAINING")
    print("=" * 70)

    print()
    print("Training folder:")
    print(TRAIN_DIR)

    print()
    print("Validation folder:")
    print(VALIDATION_DIR)

    print()
    print("Testing folder:")
    print(TEST_DIR)


    # ========================================================
    # TRAINING DATA
    # ========================================================

    (
        X_train,
        y_train,
        train_class_counts,
        train_total,
        train_detected,
        train_skipped
    ) = load_dataset(
        TRAIN_DIR
    )

    print()
    print(
        f"Training samples: {len(X_train)}"
    )


    # ========================================================
    # VALIDATION DATA
    # ========================================================

    (
        X_validation,
        y_validation,
        validation_class_counts,
        validation_total,
        validation_detected,
        validation_skipped
    ) = load_dataset(
        VALIDATION_DIR
    )

    print()
    print(
        f"Validation samples: "
        f"{len(X_validation)}"
    )


    # ========================================================
    # TESTING DATA
    # ========================================================

    (
        X_test,
        y_test,
        test_class_counts,
        test_total,
        test_detected,
        test_skipped
    ) = load_dataset(
        TEST_DIR
    )

    print()
    print(
        f"Testing samples: "
        f"{len(X_test)}"
    )


    # ========================================================
    # DATASET SUMMARY
    # ========================================================

    dataset_statistics = {

        "classes": len(LABELS),

        "labels": LABELS,

        "training": {
            "total_images": train_total,
            "detected_images": train_detected,
            "skipped_images": train_skipped,
            "usable_samples": len(X_train),
            "class_counts": train_class_counts
        },

        "validation": {
            "total_images": validation_total,
            "detected_images": validation_detected,
            "skipped_images": validation_skipped,
            "usable_samples": len(X_validation),
            "class_counts": validation_class_counts
        },

        "testing": {
            "total_images": test_total,
            "detected_images": test_detected,
            "skipped_images": test_skipped,
            "usable_samples": len(X_test),
            "class_counts": test_class_counts
        },

        "total_images": (
            train_total
            + validation_total
            + test_total
        ),

        "total_usable_samples": (
            len(X_train)
            + len(X_validation)
            + len(X_test)
        )
    }


    print()
    print("=" * 70)
    print("DATASET SUMMARY")
    print("=" * 70)

    print(
        f"Classes:              {len(LABELS)}"
    )

    print(
        f"Training images:      {train_total}"
    )

    print(
        f"Validation images:    {validation_total}"
    )

    print(
        f"Testing images:       {test_total}"
    )

    print(
        f"Total images:         "
        f"{dataset_statistics['total_images']}"
    )

    print(
        f"Usable samples:       "
        f"{dataset_statistics['total_usable_samples']}"
    )


    # ========================================================
    # TRAIN RANDOM FOREST
    # ========================================================

    print()
    print("=" * 70)
    print("TRAINING RANDOM FOREST")
    print("=" * 70)

    model = RandomForestClassifier(

        n_estimators=300,

        random_state=42,

        n_jobs=-1,

        class_weight="balanced"

    )

    model.fit(
        X_train,
        y_train
    )

    print()
    print("Random Forest training completed.")


    # ========================================================
    # TRAINING ACCURACY
    # ========================================================

    print()
    print("=" * 70)
    print("TRAINING ACCURACY")
    print("=" * 70)

    train_predictions = model.predict(
        X_train
    )

    training_accuracy = accuracy_score(
        y_train,
        train_predictions
    )

    print(
        f"Training Accuracy: "
        f"{training_accuracy * 100:.2f}%"
    )


    # ========================================================
    # VALIDATION
    # ========================================================

    print()
    print("=" * 70)
    print("VALIDATION")
    print("=" * 70)

    validation_predictions = model.predict(
        X_validation
    )

    validation_accuracy = accuracy_score(
        y_validation,
        validation_predictions
    )

    print(
        f"Validation Accuracy: "
        f"{validation_accuracy * 100:.2f}%"
    )


    # ========================================================
    # TEST
    # ========================================================

    print()
    print("=" * 70)
    print("TESTING")
    print("=" * 70)

    test_predictions = model.predict(
        X_test
    )

    test_accuracy = accuracy_score(
        y_test,
        test_predictions
    )

    print(
        f"Test Accuracy: "
        f"{test_accuracy * 100:.2f}%"
    )


    # ========================================================
    # CLASSIFICATION REPORT
    # ========================================================

    print()
    print("=" * 70)
    print("CLASSIFICATION REPORT")
    print("=" * 70)

    report = classification_report(
        y_test,
        test_predictions,
        labels=LABELS,
        zero_division=0,
        output_dict=True
    )

    print(
        classification_report(
            y_test,
            test_predictions,
            labels=LABELS,
            zero_division=0
        )
    )


    # ========================================================
    # PER-CLASS ACCURACY
    # ========================================================

    per_class_metrics = {}

    for label in LABELS:

        if label in report:

            per_class_metrics[label] = {

                "precision": round(
                    float(
                        report[label]["precision"]
                    ),
                    4
                ),

                "recall": round(
                    float(
                        report[label]["recall"]
                    ),
                    4
                ),

                "f1_score": round(
                    float(
                        report[label]["f1-score"]
                    ),
                    4
                ),

                "support": int(
                    report[label]["support"]
                )
            }


    # ========================================================
    # MODEL METADATA
    # ========================================================

    model_metadata = {

        "model_type":
            "Random Forest Classifier",

        "algorithm":
            "Random Forest",

        "n_estimators":
            300,

        "random_state":
            42,

        "class_weight":
            "balanced",

        "feature_count":
            int(X_train.shape[1]),

        "landmarks":
            21,

        "coordinates_per_landmark":
            3,

        "feature_description":
            "MediaPipe hand landmarks normalized relative to wrist",

        "classes":
            len(LABELS),

        "labels":
            LABELS
    }


    # ========================================================
    # PERFORMANCE
    # ========================================================

    performance = {

        "training_accuracy":
            round(
                float(training_accuracy),
                6
            ),

        "training_accuracy_percent":
            round(
                float(
                    training_accuracy * 100
                ),
                2
            ),

        "validation_accuracy":
            round(
                float(validation_accuracy),
                6
            ),

        "validation_accuracy_percent":
            round(
                float(
                    validation_accuracy * 100
                ),
                2
            ),

        "test_accuracy":
            round(
                float(test_accuracy),
                6
            ),

        "test_accuracy_percent":
            round(
                float(
                    test_accuracy * 100
                ),
                2
            ),

        "classification_report":
            report,

        "per_class_metrics":
            per_class_metrics
    }


    # ========================================================
    # SAVE MODEL
    # ========================================================

    model_data = {

        # Actual trained model
        "model":
            model,

        # Labels
        "labels":
            LABELS,

        # Feature information
        "feature_count":
            int(X_train.shape[1]),

        # Dataset information
        "dataset":
            dataset_statistics,

        # Model information
        "metadata":
            model_metadata,

        # Performance information
        "performance":
            performance

    }


    print()
    print("=" * 70)
    print("SAVING MODEL")
    print("=" * 70)

    joblib.dump(
        model_data,
        MODEL_PATH
    )

    print()
    print(
        "Model saved successfully:"
    )

    print(
        MODEL_PATH
    )


    # ========================================================
    # FINAL SUMMARY
    # ========================================================

    print()
    print("=" * 70)
    print("FINAL MODEL SUMMARY")
    print("=" * 70)

    print(
        f"Algorithm:            "
        f"Random Forest"
    )

    print(
        f"Trees:                "
        f"300"
    )

    print(
        f"Features:             "
        f"{X_train.shape[1]}"
    )

    print(
        f"Classes:              "
        f"{len(LABELS)}"
    )

    print(
        f"Training Accuracy:    "
        f"{training_accuracy * 100:.2f}%"
    )

    print(
        f"Validation Accuracy:  "
        f"{validation_accuracy * 100:.2f}%"
    )

    print(
        f"Test Accuracy:        "
        f"{test_accuracy * 100:.2f}%"
    )

    print()
    print(
        "Dataset:"
    )

    print(
        f"  Training:           {train_total}"
    )

    print(
        f"  Validation:         {validation_total}"
    )

    print(
        f"  Testing:            {test_total}"
    )

    print(
        f"  Total:              "
        f"{dataset_statistics['total_images']}"
    )

    print()
    print("=" * 70)
    print("TRAINING COMPLETED SUCCESSFULLY")
    print("=" * 70)
    print()


# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":

    main()
