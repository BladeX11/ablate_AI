"""
ablate_test_model.py
====================
A real trained model with noisy/sensitive data embedded.
Run this BEFORE submitting to ablate_AI to get baseline accuracy.
Then run again AFTER unlearning to compare.

Steps:
  1. Run this file → note the accuracy
  2. Submit trained_model.pkl to ablate_AI
  3. Run verify_after_ablate.py → compare accuracy
"""

import numpy as np
import pickle
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler

np.random.seed(42)

print("=" * 60)
print("  ablate_AI — Real Trained Model (BEFORE Unlearning)")
print("=" * 60)

# ── Step 1: Generate clean dataset ──────────────────────────────
X, y = make_classification(
    n_samples=2000,
    n_features=15,
    n_informative=8,
    n_redundant=3,
    n_classes=2,
    random_state=42
)

# ── Step 2: Inject sensitive/noisy rows (simulates dirty data) ──
# These are the rows ablate_AI should "unlearn"
n_sensitive = 150
sensitive_X = np.random.uniform(-5, 5, size=(n_sensitive, X.shape[1]))
sensitive_y = np.zeros(n_sensitive, dtype=int)  # all labelled class 0 (wrong)

# Poison 40% of them with flipped labels
flip_idx = np.random.choice(n_sensitive, size=60, replace=False)
sensitive_y[flip_idx] = 1

X_dirty = np.vstack([X, sensitive_X])
y_dirty = np.concatenate([y, sensitive_y])

print(f"\n  Total samples     : {len(X_dirty)}")
print(f"  Clean samples     : {len(X)}")
print(f"  Sensitive/noisy   : {n_sensitive}")
print(f"  Features          : {X.shape[1]}")

# ── Step 3: Train on dirty data ─────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X_dirty, y_dirty, test_size=0.25, random_state=42
)

scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s  = scaler.transform(X_test)

model = LogisticRegression(max_iter=500, C=1.0, random_state=42)
model.fit(X_train_s, y_train)

y_pred = model.predict(X_test_s)
acc    = accuracy_score(y_test, y_pred)

print(f"\n{'─'*60}")
print(f"  [BEFORE ABLATE]  Accuracy : {acc:.4f} ({acc*100:.2f}%)")
print(f"{'─'*60}")
print()
print(classification_report(y_test, y_pred, target_names=["Class 0", "Class 1"]))

# ── Step 4: Save model + scaler + test data ──────────────────────
payload = {
    "model"      : model,
    "scaler"     : scaler,
    "X_test"     : X_test,
    "y_test"     : y_test,
    "accuracy"   : round(acc, 4),
    "n_samples"  : len(X_dirty),
    "n_sensitive": n_sensitive,
    "target"     : "sensitive_rows_class0_poisoned"
}

with open("trained_model.pkl", "wb") as f:
    pickle.dump(payload, f)

print("✅  Model saved → trained_model.pkl")
print()
print("  Next steps:")
print("  1. Submit trained_model.pkl to ablate_AI")
print("  2. Set target = 'sensitive_rows_class0_poisoned'")
print("  3. Run verify_after_ablate.py to check new accuracy")
print("=" * 60)
