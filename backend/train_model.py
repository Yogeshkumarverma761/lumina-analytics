import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import os

# Dataset path
DATASET_PATH = r"C:\Users\priya\.cache\kagglehub\datasets\shubhammkumaar\real-estate-listings-and-prices-in-india-2025\versions\1\real_estate_dataset.csv"
MODEL_DIR = "backend/models"

def load_and_explore_data():
    """Load and explore the dataset"""
    df = pd.read_csv(DATASET_PATH)
    print("Dataset Shape:", df.shape)
    print("\nColumn Names:")
    print(df.columns.tolist())
    print("\nFirst few rows:")
    print(df.head())
    print("\nData Types:")
    print(df.dtypes)
    print("\nMissing Values:")
    print(df.isnull().sum())
    print("\nBasic Statistics:")
    print(df.describe())
    return df

def preprocess_data(df):
    """Preprocess the dataset"""
    # Make a copy
    df = df.copy()
    
    # Identify target column (assuming it's 'price' or similar)
    # We'll need to check the actual column names
    print("\nAll columns:", df.columns.tolist())
    
    # Drop rows with missing target values
    # Assuming 'price' is the target - we'll adjust after seeing the data
    target_col = None
    for col in df.columns:
        if 'price' in col.lower():
            target_col = col
            break
    
    if target_col is None:
        print("Warning: Could not find price column. Using last column as target.")
        target_col = df.columns[-1]
    
    print(f"\nUsing '{target_col}' as target column")
    
    # Drop rows with missing target
    df = df.dropna(subset=[target_col])
    
    # Separate features and target
    X = df.drop(columns=[target_col])
    y = df[target_col]
    
    # Handle missing values in features
    # For numeric columns, fill with median
    numeric_cols = X.select_dtypes(include=[np.number]).columns
    for col in numeric_cols:
        X[col].fillna(X[col].median(), inplace=True)
    
    # For categorical columns, fill with mode
    categorical_cols = X.select_dtypes(include=['object']).columns
    for col in categorical_cols:
        X[col].fillna(X[col].mode()[0] if not X[col].mode().empty else 'Unknown', inplace=True)
    
    # Encode categorical variables
    label_encoders = {}
    for col in categorical_cols:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col].astype(str))
        label_encoders[col] = le
    
    return X, y, label_encoders, target_col

def train_model(X, y):
    """Train the Random Forest model"""
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train model
    print("\nTraining Random Forest model...")
    model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print(f"\nModel Performance:")
    print(f"Mean Absolute Error: {mae:,.2f}")
    print(f"R² Score: {r2:.4f}")
    
    return model, X.columns.tolist()

def save_artifacts(model, label_encoders, feature_names, target_col):
    """Save model and encoders"""
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    # Save model
    joblib.dump(model, f"{MODEL_DIR}/model.pkl")
    print(f"\nModel saved to {MODEL_DIR}/model.pkl")
    
    # Save encoders
    joblib.dump(label_encoders, f"{MODEL_DIR}/label_encoders.pkl")
    print(f"Label encoders saved to {MODEL_DIR}/label_encoders.pkl")
    
    # Save feature names and target column
    metadata = {
        'feature_names': feature_names,
        'target_column': target_col
    }
    joblib.dump(metadata, f"{MODEL_DIR}/metadata.pkl")
    print(f"Metadata saved to {MODEL_DIR}/metadata.pkl")

if __name__ == "__main__":
    print("="*50)
    print("STEP 1: Loading and Exploring Data")
    print("="*50)
    df = load_and_explore_data()
    
    print("\n" + "="*50)
    print("STEP 2: Preprocessing Data")
    print("="*50)
    X, y, label_encoders, target_col = preprocess_data(df)
    
    print("\n" + "="*50)
    print("STEP 3: Training Model")
    print("="*50)
    model, feature_names = train_model(X, y)
    
    print("\n" + "="*50)
    print("STEP 4: Saving Artifacts")
    print("="*50)
    save_artifacts(model, label_encoders, feature_names, target_col)
    
    print("\n" + "="*50)
    print("TRAINING COMPLETE!")
    print("="*50)
