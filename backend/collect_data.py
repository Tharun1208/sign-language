import os
import csv
import time
import cv2
import mediapipe as mp

# =========================================================
# SIGN LANGUAGE ALPHABET DATA COLLECTOR
# =========================================================

DATASET_DIR = "dataset"

# Number of samples for each alphabet
SAMPLES_PER_LETTER = 200

# A-Z
LETTERS = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")


# =========================================================
# CREATE DATASET FOLDERS
# =========================================================

os.makedirs(DATASET_DIR, exist_ok=True)

for letter in LETTERS:
    os.makedirs(
        os.path.join(DATASET_DIR, letter),
        exist_ok=True
    )


# =========================================================
# MEDIAPIPE
# =========================================================

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.7
)


# =========================================================
# WEBCAM
# =========================================================

cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("=" * 60)
    print("ERROR: Could not open webcam.")
    print("=" * 60)
    print("Check whether your webcam is connected.")
    exit()


cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)


# =========================================================
# GET EXISTING SAMPLE COUNT
# =========================================================

def get_existing_samples(letter):

    folder = os.path.join(
        DATASET_DIR,
        letter
    )

    if not os.path.exists(folder):
        return 0

    files = [
        file
        for file in os.listdir(folder)
        if file.endswith(".csv")
    ]

    return len(files)


# =========================================================
# EXTRACT HAND LANDMARKS
# =========================================================

def extract_landmarks(hand_landmarks):

    landmarks = []

    for landmark in hand_landmarks.landmark:

        landmarks.append(landmark.x)
        landmarks.append(landmark.y)
        landmarks.append(landmark.z)

    return landmarks


# =========================================================
# SAVE SAMPLE
# =========================================================

def save_sample(letter, sample_number, landmarks):

    folder = os.path.join(
        DATASET_DIR,
        letter
    )

    filename = os.path.join(
        folder,
        f"sample_{sample_number:04d}.csv"
    )

    with open(
        filename,
        "w",
        newline=""
    ) as file:

        writer = csv.writer(file)

        writer.writerow(landmarks)

    return filename


# =========================================================
# HEADER
# =========================================================

print()
print("=" * 65)
print("              SignAI Alphabet Data Collector")
print("=" * 65)
print()
print("Collecting A-Z sign language alphabet data.")
print()
print(f"Samples per letter: {SAMPLES_PER_LETTER}")
print(f"Total letters: {len(LETTERS)}")
print(
    f"Total possible samples: "
    f"{len(LETTERS) * SAMPLES_PER_LETTER}"
)
print()
print("Controls:")
print("Q = Quit")
print("ESC = Quit")
print("=" * 65)


# =========================================================
# MAIN PROGRAM
# =========================================================

while True:

    print()
    print("=" * 65)
    print("AVAILABLE ALPHABETS")
    print("=" * 65)

    for index, letter in enumerate(
        LETTERS,
        start=1
    ):

        existing = get_existing_samples(letter)

        if existing >= SAMPLES_PER_LETTER:
            status = "COMPLETED"
        else:
            status = (
                f"{existing}/{SAMPLES_PER_LETTER}"
            )

        print(
            f"{index:2}. {letter} ({status})"
        )

    print()
    print("Enter 1-26 to select alphabet.")
    print("Enter Q to quit.")

    choice = input(
        "\nEnter alphabet number: "
    ).strip().upper()


    # =====================================================
    # QUIT
    # =====================================================

    if choice == "Q":
        break


    # =====================================================
    # VALIDATE INPUT
    # =====================================================

    try:

        choice_number = int(choice)

    except ValueError:

        print()
        print("Invalid input.")
        print("Enter a number between 1 and 26.")
        continue


    if choice_number < 1 or choice_number > 26:

        print()
        print("Invalid alphabet number.")
        continue


    # =====================================================
    # SELECT LETTER
    # =====================================================

    selected_letter = LETTERS[
        choice_number - 1
    ]


    # =====================================================
    # EXISTING DATA
    # =====================================================

    existing_samples = get_existing_samples(
        selected_letter
    )

    if existing_samples >= SAMPLES_PER_LETTER:

        print()
        print(
            f"Letter {selected_letter} "
            f"already has {SAMPLES_PER_LETTER} samples."
        )

        continue


    start_sample = existing_samples + 1

    remaining_samples = (
        SAMPLES_PER_LETTER
        - existing_samples
    )


    # =====================================================
    # COLLECTION INFORMATION
    # =====================================================

    print()
    print("=" * 65)
    print(
        f"COLLECTING LETTER: {selected_letter}"
    )
    print("=" * 65)

    print(
        f"Existing samples : {existing_samples}"
    )

    print(
        f"Remaining samples: {remaining_samples}"
    )

    print()
    print(
        f"Show the sign-language letter "
        f"'{selected_letter}' to the camera."
    )

    print()
    print("Keep your hand clearly visible.")
    print("Move your hand slightly between samples.")
    print("Starting in 3 seconds...")


    # =====================================================
    # COUNTDOWN
    # =====================================================

    for countdown in range(3, 0, -1):

        ret, frame = cap.read()

        if not ret:
            continue

        frame = cv2.flip(
            frame,
            1
        )

        cv2.putText(
            frame,
            f"LETTER {selected_letter}",
            (180, 80),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.2,
            (255, 255, 255),
            3
        )

        cv2.putText(
            frame,
            str(countdown),
            (290, 280),
            cv2.FONT_HERSHEY_SIMPLEX,
            5,
            (0, 255, 0),
            8
        )

        cv2.imshow(
            "SignAI - Alphabet Data Collector",
            frame
        )

        key = cv2.waitKey(1000) & 0xFF

        if key == ord("q") or key == 27:

            cap.release()
            cv2.destroyAllWindows()
            hands.close()
            exit()


    # =====================================================
    # COLLECT SAMPLES
    # =====================================================

    sample_number = start_sample

    collected_this_session = 0

    last_save_time = 0


    while sample_number <= SAMPLES_PER_LETTER:

        ret, frame = cap.read()

        if not ret:

            print(
                "WARNING: Could not read webcam."
            )

            continue


        # -------------------------------------------------
        # MIRROR CAMERA
        # -------------------------------------------------

        frame = cv2.flip(
            frame,
            1
        )


        # -------------------------------------------------
        # CONVERT BGR TO RGB
        # -------------------------------------------------

        rgb_frame = cv2.cvtColor(
            frame,
            cv2.COLOR_BGR2RGB
        )


        # -------------------------------------------------
        # MEDIAPIPE PROCESSING
        # -------------------------------------------------

        results = hands.process(
            rgb_frame
        )

        hand_detected = False


        # -------------------------------------------------
        # HAND DETECTED
        # -------------------------------------------------

        if results.multi_hand_landmarks:

            hand_detected = True

            hand_landmarks = (
                results.multi_hand_landmarks[0]
            )


            # -------------------------------------------------
            # DRAW HAND LANDMARKS
            # -------------------------------------------------

            mp_drawing.draw_landmarks(
                frame,
                hand_landmarks,
                mp_hands.HAND_CONNECTIONS
            )


            # -------------------------------------------------
            # EXTRACT 63 FEATURES
            # -------------------------------------------------

            landmarks = extract_landmarks(
                hand_landmarks
            )


            if len(landmarks) == 63:

                current_time = time.time()


                # Prevent duplicate frames
                if current_time - last_save_time >= 0.1:

                    save_sample(
                        selected_letter,
                        sample_number,
                        landmarks
                    )

                    print(
                        f"[{selected_letter}] "
                        f"Sample "
                        f"{sample_number}/"
                        f"{SAMPLES_PER_LETTER} saved"
                    )

                    sample_number += 1

                    collected_this_session += 1

                    last_save_time = current_time


        # =================================================
        # CAMERA UI
        # =================================================

        cv2.rectangle(
            frame,
            (0, 0),
            (640, 110),
            (20, 20, 20),
            -1
        )


        # -------------------------------------------------
        # LETTER
        # -------------------------------------------------

        cv2.putText(
            frame,
            f"LETTER: {selected_letter}",
            (20, 35),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (255, 255, 255),
            2
        )


        # -------------------------------------------------
        # PROGRESS
        # -------------------------------------------------

        cv2.putText(
            frame,
            (
                f"SAMPLES: "
                f"{sample_number - 1}/"
                f"{SAMPLES_PER_LETTER}"
            ),
            (20, 70),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 255, 0),
            2
        )


        # -------------------------------------------------
        # HAND STATUS
        # -------------------------------------------------

        if hand_detected:

            cv2.putText(
                frame,
                "HAND DETECTED",
                (390, 35),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.55,
                (0, 255, 0),
                2
            )

        else:

            cv2.putText(
                frame,
                "SHOW YOUR HAND",
                (390, 35),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.55,
                (0, 0, 255),
                2
            )


        # -------------------------------------------------
        # INSTRUCTION
        # -------------------------------------------------

        cv2.putText(
            frame,
            "Press Q to stop",
            (390, 75),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.5,
            (255, 255, 255),
            1
        )


        # -------------------------------------------------
        # DISPLAY CAMERA
        # -------------------------------------------------

        cv2.imshow(
            "SignAI - Alphabet Data Collector",
            frame
        )


        # -------------------------------------------------
        # KEYBOARD
        # -------------------------------------------------

        key = cv2.waitKey(1) & 0xFF

        if key == ord("q") or key == 27:

            print()
            print("Collection stopped.")

            break


    # =====================================================
    # LETTER COMPLETED
    # =====================================================

    if sample_number > SAMPLES_PER_LETTER:

        print()
        print("=" * 65)
        print(
            f"LETTER {selected_letter} COMPLETED"
        )
        print("=" * 65)

        print(
            f"Total samples: "
            f"{SAMPLES_PER_LETTER}"
        )

        print(
            f"Collected this session: "
            f"{collected_this_session}"
        )

        print("=" * 65)


# =========================================================
# CLEANUP
# =========================================================

cap.release()

cv2.destroyAllWindows()

hands.close()


# =========================================================
# FINAL MESSAGE
# =========================================================

print()
print("=" * 65)
print("        SignAI Data Collection Finished")
print("=" * 65)

print()
print("Dataset location:")

print(
    os.path.abspath(DATASET_DIR)
)

print()
print("Next step:")
print("Train the A-Z recognition model.")

print("=" * 65)