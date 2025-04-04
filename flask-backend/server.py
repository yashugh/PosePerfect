from flask import Flask, request, jsonify
import cv2
import numpy as np
import mediapipe as mp
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=True)

@app.route("/api/posture", methods=["POST"])
def analyze_pose():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image_file = request.files["image"]
    file_bytes = np.frombuffer(image_file.read(), np.uint8)
    image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    results = pose.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))

    if not results.pose_landmarks:
        return jsonify({
            "pose": "No human detected",
            "correct": False,
            "suggestion": "Please try again with a clearer image."
        })

    landmarks = results.pose_landmarks.landmark
    left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER]
    right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER]
    left_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP]
    right_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP]

    shoulder_diff = abs(left_shoulder.y - right_shoulder.y)
    hip_diff = abs(left_hip.y - right_hip.y)

    is_aligned = shoulder_diff < 0.05 and hip_diff < 0.05

    return jsonify({
        "pose": "Standing",
        "correct": is_aligned,
        "suggestion": "Great posture!" if is_aligned else "Straighten your back and align your shoulders."
    })

@app.route("/", methods=["GET"])
def home():
    return "<h2>✅ PosePerfect Flask Backend is Running!</h2>"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5006)

