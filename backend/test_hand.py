import cv2
import mediapipe as mp

# =========================================================
# MEDIAPIPE
# =========================================================

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.6,
    min_tracking_confidence=0.6
)

# =========================================================
# CAMERA
# =========================================================

cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("ERROR: Could not open webcam")
    exit()

print("=" * 60)
print("        SignAI Hand Gesture Test")
print("=" * 60)
print()
print("Show your hand to the camera.")
print("Press Q to quit.")
print()

while True:

    ret, frame = cap.read()

    if not ret:
        print("Could not read camera.")
        break

    # Mirror camera
    frame = cv2.flip(frame, 1)

    # Convert BGR -> RGB
    rgb = cv2.cvtColor(
        frame,
        cv2.COLOR_BGR2RGB
    )

    # MediaPipe
    results = hands.process(rgb)

    # =====================================================
    # HAND DETECTED
    # =====================================================

    if results.multi_hand_landmarks:

        hand_landmarks = results.multi_hand_landmarks[0]

        # Draw hand
        mp_drawing.draw_landmarks(
            frame,
            hand_landmarks,
            mp_hands.HAND_CONNECTIONS
        )

        # Status
        cv2.putText(
            frame,
            "HAND DETECTED",
            (20, 50),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 255, 0),
            2
        )

        # Print 21 landmarks
        print(
            "Hand detected - 21 landmarks"
        )

    else:

        cv2.putText(
            frame,
            "NO HAND DETECTED",
            (20, 50),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 0, 255),
            2
        )

    # =====================================================
    # INSTRUCTIONS
    # =====================================================

    cv2.putText(
        frame,
        "Show your hand | Press Q to quit",
        (20, 90),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.6,
        (255, 255, 255),
        2
    )

    # Show camera
    cv2.imshow(
        "SignAI - Hand Gesture Test",
        frame
    )

    # Quit
    key = cv2.waitKey(1) & 0xFF

    if key == ord("q"):
        break


# =========================================================
# CLEANUP
# =========================================================

cap.release()
cv2.destroyAllWindows()
hands.close()

print()
print("Camera test completed.")