import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/ToastProvider";

const Settings = () => {
  const { user: authUser, updateProfile } = useAuth();
  const toast = useToast();

  const [profileData, setProfileData] = useState({
    name: authUser?.name || authUser?.fullName || "User",
    email: authUser?.email || "user@signai.com",
    phone: authUser?.phone || "",
    age: authUser?.age || "",
    university: authUser?.university || "",
    bio: authUser?.bio || "",
  });

  const [profileImage, setProfileImage] = useState(
    authUser?.picture ||
      authUser?.profileImage ||
      authUser?.image ||
      localStorage.getItem("signai-profile-image") ||
      null
  );

  const [ttsRate, setTtsRate] = useState(() => Number(localStorage.getItem("signai-tts-rate")) || 1.0);
  const [ttsPitch, setTtsPitch] = useState(() => Number(localStorage.getItem("signai-tts-pitch")) || 1.0);
  const [autoTTS, setAutoTTS] = useState(() => localStorage.getItem("signai-auto-tts") === "true");

  const [confidenceThreshold, setConfidenceThreshold] = useState(
    () => Number(localStorage.getItem("signai-conf-threshold")) || 65
  );
  const [holdDuration, setHoldDuration] = useState(
    () => Number(localStorage.getItem("signai-hold-duration")) || 1200
  );

  const testSpeechText = (text) => {
    if (!("speechSynthesis" in window) || !text) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = ttsRate;
      utterance.pitch = ttsPitch;
      window.speechSynthesis.speak(utterance);
    } catch {
      /* ignore */
    }
  };

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (authUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate the profile form from the session
      setProfileData({
        name: authUser.name || authUser.fullName || "",
        email: authUser.email || "",
        phone: authUser.phone || "",
        age: authUser.age || "",
        university: authUser.university || "",
        bio: authUser.bio || "",
      });
      if (authUser.picture || authUser.profileImage) {
        setProfileImage(authUser.picture || authUser.profileImage);
      }
    }
  }, [authUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    setSavedSuccess(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
      localStorage.setItem("signai-profile-image", reader.result);
      toast.success("Profile photo updated. Save to keep the change.", "Photo ready");
    };
    reader.readAsDataURL(file);
    setSavedSuccess(false);
  };

  const testSpeech = () => {
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("SignAI voice synthesis is active and configured.");
      utterance.rate = ttsRate;
      utterance.pitch = ttsPitch;
      window.speechSynthesis.speak(utterance);
    } catch {
      /* ignore */
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setErrorMessage("");
    setSavedSuccess(false);

    const persistLocal = () => {
      localStorage.setItem("signai-tts-rate", ttsRate);
      localStorage.setItem("signai-tts-pitch", ttsPitch);
      localStorage.setItem("signai-auto-tts", String(autoTTS));
      localStorage.setItem("signai-conf-threshold", confidenceThreshold);
      localStorage.setItem("signai-hold-duration", holdDuration);
    };

    try {
      await updateProfile({
        name: profileData.name,
        phone: profileData.phone,
        age: profileData.age,
        university: profileData.university,
        bio: profileData.bio,
        profileImage,
      });

      persistLocal();
      setSavedSuccess(true);
      toast.success("Profile and preferences saved.", "Settings saved");
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      console.error("Save error:", err);
      localStorage.setItem("signai-user", JSON.stringify(profileData));
      persistLocal();
      setSavedSuccess(true);
      toast.warn("Profile saved locally. The server could not be reached.", "Saved locally");
      setTimeout(() => setSavedSuccess(false), 3500);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="stack" style={{ gap: "var(--space-6)", paddingBottom: "var(--space-8)" }}>
        <div className="page-head" style={{ marginBottom: 0 }}>
          <div>
            <span className="eyebrow">Your workspace</span>
            <h1 className="mt-2">Settings</h1>
            <p>Manage your profile, voice synthesis and sign recognition preferences.</p>
          </div>

          <button onClick={handleSaveAll} disabled={isSaving} className="btn btn-primary">
            {isSaving ? "Saving changes…" : "Save all preferences"}
          </button>
        </div>

        <AnimatePresence>
          {savedSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="alert alert-ok"
              role="status"
            >
              <b>Settings saved</b>
              All settings and profile information saved successfully.
            </motion.div>
          )}

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="alert alert-err"
              role="alert"
            >
              <b>Something went wrong</b>
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-2" style={{ alignItems: "start" }}>
          <div className="card">
            <div className="section-head" style={{ marginBottom: "var(--space-4)" }}>
              <div>
                <h3 style={{ marginBottom: 0 }}>Profile</h3>
                <p>Shown on shared transcripts and the sidebar</p>
              </div>
              <span className="badge badge-pri">Account</span>
            </div>

            <div className="row" style={{ marginBottom: "20px" }}>
              <div className="avatar avatar-lg" style={{ overflow: "hidden", padding: 0, flex: "none" }}>
                {profileImage ? (
                  <img src={profileImage} alt="Profile avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  profileData.name?.[0]?.toUpperCase() || "U"
                )}
              </div>

              <div>
                <label className="btn btn-ghost btn-sm" style={{ cursor: "pointer", display: "inline-block" }}>
                  Change photo
                  <input type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
                </label>
                <p className="hint">Upload an avatar image (JPEG, PNG).</p>
              </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
              <div className="field">
                <label className="label" htmlFor="profile-name">Full name</label>
                <input id="profile-name" type="text" name="name" value={profileData.name} onChange={handleInputChange} className="input" placeholder="e.g. Alex Mercer" />
              </div>

              <div className="field">
                <label className="label" htmlFor="profile-email">Email address</label>
                <input id="profile-email" type="email" name="email" disabled value={profileData.email} className="input" />
              </div>

              <div className="field">
                <label className="label" htmlFor="profile-phone">Phone number</label>
                <input id="profile-phone" type="tel" name="phone" value={profileData.phone} onChange={handleInputChange} className="input" placeholder="+1 (555) 000-0000" />
              </div>

              <div className="field">
                <label className="label" htmlFor="profile-age">Age</label>
                <input id="profile-age" type="number" name="age" value={profileData.age} onChange={handleInputChange} className="input" placeholder="e.g. 24" />
              </div>

              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label className="label" htmlFor="profile-university">University / Organisation</label>
                <input id="profile-university" type="text" name="university" value={profileData.university} onChange={handleInputChange} className="input" placeholder="e.g. MIT / Stanford University" />
              </div>

              <div className="field" style={{ gridColumn: "1 / -1", marginBottom: 0 }}>
                <label className="label" htmlFor="profile-bio">Bio / Notes</label>
                <textarea id="profile-bio" name="bio" rows="3" value={profileData.bio} onChange={handleInputChange} className="textarea" placeholder="Tell us about yourself or your learning goals…" />
              </div>
            </div>
          </div>

          <div className="stack" style={{ gap: "var(--space-6)" }}>
            <div className="card">
              <div className="row row-between">
                <div>
                  <h3 style={{ marginBottom: 0 }}>Text to speech</h3>
                  <p className="hint" style={{ marginTop: 4 }}>Voice used by captions and conversation mode</p>
                </div>
                <button onClick={testSpeech} className="btn btn-ghost btn-sm">Test audio</button>
              </div>

              <div className="stack" style={{ gap: "20px", marginTop: "16px" }}>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label className="label" htmlFor="tts-rate">
                    Speech rate: {ttsRate}x <span className="text-muted fw-medium">{ttsRate < 1 ? "Slower" : ttsRate > 1 ? "Faster" : "Normal"}</span>
                  </label>
                  <input id="tts-rate" type="range" min="0.5" max="1.8" step="0.1" value={ttsRate} onChange={(e) => setTtsRate(Number(e.target.value))} className="slider" />
                </div>

                <div className="field" style={{ marginBottom: 0 }}>
                  <label className="label" htmlFor="tts-pitch">
                    Speech pitch: {ttsPitch}x <span className="text-muted fw-medium">{ttsPitch < 1 ? "Lower" : ttsPitch > 1 ? "Higher" : "Normal"}</span>
                  </label>
                  <input id="tts-pitch" type="range" min="0.5" max="1.5" step="0.1" value={ttsPitch} onChange={(e) => setTtsPitch(Number(e.target.value))} className="slider" />
                </div>

                <label className="toggle">
                  <input type="checkbox" checked={autoTTS} onChange={(e) => setAutoTTS(e.target.checked)} />
                  <span className="track" />
                  <span>Automatically speak recognized signs aloud</span>
                </label>
              </div>
            </div>

            <div className="card">
              <div className="section-head" style={{ marginBottom: "var(--space-3)" }}>
                <div>
                  <h3 style={{ marginBottom: 0 }}>Recognition engine</h3>
                  <p>Filtering and lock timing</p>
                </div>
                <span className="badge badge-info">Local only</span>
              </div>

              <div className="stack" style={{ gap: "20px", marginTop: "16px" }}>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label className="label" htmlFor="confidence-threshold">
                    Confidence threshold: {confidenceThreshold}% <span className="text-muted fw-medium">Strictness</span>
                  </label>
                  <input id="confidence-threshold" type="range" min="50" max="95" value={confidenceThreshold} onChange={(e) => setConfidenceThreshold(Number(e.target.value))} className="slider" />
                  <p className="hint">Predictions with lower confidence are filtered out to prevent false positives.</p>
                </div>

                <div className="field" style={{ marginBottom: 0 }}>
                  <label className="label" htmlFor="hold-duration">
                    Hold duration: {holdDuration / 1000}s <span className="text-muted fw-medium">Lock time</span>
                  </label>
                  <input id="hold-duration" type="range" min="800" max="2500" step="100" value={holdDuration} onChange={(e) => setHoldDuration(Number(e.target.value))} className="slider" />
                  <p className="hint">Duration required to hold a sign before it automatically locks into sentences.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
