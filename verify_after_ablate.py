import pickle
import numpy as np
from sklearn.metrics import accuracy_score, classification_report

print("=" * 60)
print("  ablate_AI - Verification (AFTER Unlearning)")
print("=" * 60)

with open("trained_model.pkl", "rb") as f:
    payload = pickle.load(f)

model   = payload["model"]
scaler  = payload["scaler"]
X_test  = payload["X_test"]
y_test  = payload["y_test"]
before  = payload["accuracy"]

X_test_s = scaler.transform(X_test)
y_pred   = model.predict(X_test_s)
after    = accuracy_score(y_test, y_pred)
delta    = after - before

print("")
print("  [BEFORE ABLATE]  Accuracy : " + str(before))
print("  [AFTER  ABLATE]  Accuracy : " + str(round(after, 4)))
print("  [CHANGE]         Delta    : " + str(round(delta, 4)))
print("")

if delta > 0.01:
    print("  Accuracy IMPROVED after unlearning!")
elif delta < -0.01:
    print("  Accuracy DROPPED after unlearning.")
else:
    print("  Accuracy is roughly the same.")

print("")
print(classification_report(y_test, y_pred, target_names=["Class 0", "Class 1"]))
print("=" * 60)
