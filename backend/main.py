from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
import joblib
import numpy as np
from google.oauth2 import id_token
from google.auth.transport import requests
from typing import Optional, List
from sqlalchemy.orm import Session
from jose import JWTError, jwt
import os

# Internal imports
from database import SessionLocal, init_db, User, Prediction
from auth import verify_password, get_password_hash, create_access_token, SECRET_KEY, ALGORITHM

app = FastAPI(title="Land Price Prediction API with Auth")

# CORS middleware
raw_origins = os.environ.get("ALLOWED_ORIGINS", "*")
if raw_origins == "*":
    origins = ["*"]
    allow_all_origins = True
else:
    # Clean origins: strip spaces and trailing slashes
    origins = [o.strip().rstrip('/') for o in raw_origins.split(",") if o.strip()]
    allow_all_origins = False

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=not allow_all_origins, # Credentials must be False if origins is ["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- AUTH LOGIC ---
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

# --- Pydantic Models ---
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class PredictionRequest(BaseModel):
    url: str
    beds: int
    city: str
    date: str
    size: str
    type: str
    baths: int
    neighborhood: str

class GoogleLoginRequest(BaseModel):
    credential: str

GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com")

class PredictionResponse(BaseModel):
    predicted_price: float
    formatted_price: str

class HistoryResponse(BaseModel):
    id: int
    city: str
    neighborhood: str
    predicted_price: float
    timestamp: str

# --- MODEL LOADING ---
base_dir = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(base_dir, "models", "model.pkl")
ENCODERS_PATH = os.path.join(base_dir, "models", "label_encoders.pkl")
METADATA_PATH = os.path.join(base_dir, "models", "metadata.pkl")

model = None
label_encoders = None
feature_names = None

@app.on_event("startup")
async def startup_event():
    global model, label_encoders, feature_names
    try:
        init_db() # Initialize DB tables
        model = joblib.load(MODEL_PATH)
        label_encoders = joblib.load(ENCODERS_PATH)
        metadata = joblib.load(METADATA_PATH)
        feature_names = metadata['feature_names']
        print("Backend: Model and Database initialized.")
    except Exception as e:
        print(f"Startup error: {e}")
        # We don't want to crash the whole app here, so we log it


# --- AUTH ENDPOINTS ---
@app.post("/register")
async def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    return {"message": "User created successfully"}

@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/google-login", response_model=Token)
async def google_login(request: GoogleLoginRequest, db: Session = Depends(get_db)):
    try:
        # Verify the Google token
        idinfo = id_token.verify_oauth2_token(request.credential, requests.Request(), GOOGLE_CLIENT_ID)
        
        # ID token is valid. Get user info from ID token.
        email = idinfo['email']
        name = idinfo.get('name', email.split('@')[0])
        
        # Check if user exists
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            # Create a new user if not exists
            # We use a random password hash for Google users as they won't use it
            hashed_random = get_password_hash("google_oauth_" + email)
            user = User(username=name, email=email, hashed_password=hashed_random)
            db.add(user)
            db.commit()
            db.refresh(user)
            
        access_token = create_access_token(data={"sub": user.username})
        return {"access_token": access_token, "token_type": "bearer"}
    except ValueError:
        # Invalid token
        raise HTTPException(status_code=400, detail="Invalid Google token")

# --- PREDICTION LOGIC ---
@app.post("/predict", response_model=PredictionResponse)
async def predict(
    request: PredictionRequest, 
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    try:
        data = request.dict()
        features = []
        for feature_name in feature_names:
            value = data.get(feature_name, 0)
            if feature_name in label_encoders:
                encoder = label_encoders[feature_name]
                try:
                    encoded_value = encoder.transform([str(value)])[0]
                except:
                    encoded_value = 0
                features.append(encoded_value)
            else:
                # Handle size string (strip 'sqft' and handle ranges)
                if feature_name == 'size' and isinstance(value, str):
                    try:
                        clean_val = value.lower().replace('sqft', '').strip()
                        if '-' in clean_val:
                            parts = clean_val.split('-')
                            value = (float(parts[0].strip()) + float(parts[1].strip())) / 2
                        else:
                            value = float(clean_val)
                    except:
                        value = 0
                features.append(value)
        
        features_array = np.array([features])
        prediction = model.predict(features_array)[0]
        formatted_price = f"₹{prediction:,.2f}"

        # Save to history if user is logged in
        if current_user:
            new_prediction = Prediction(
                city=request.city,
                neighborhood=request.neighborhood,
                beds=request.beds,
                baths=request.baths,
                size=request.size,
                property_type=request.type,
                predicted_price=float(prediction),
                owner_id=current_user.id
            )
            db.add(new_prediction)
            db.commit()
        
        return PredictionResponse(
            predicted_price=float(prediction),
            formatted_price=formatted_price
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history")
async def get_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    history = db.query(Prediction).filter(Prediction.owner_id == current_user.id).order_by(Prediction.timestamp.desc()).all()
    return [{
        "id": h.id,
        "city": h.city,
        "neighborhood": h.neighborhood,
        "predicted_price": h.predicted_price,
        "timestamp": h.timestamp.strftime("%Y-%m-%d %H:%M:%S")
    } for h in history]

@app.get("/me")
async def read_users_me(current_user: User = Depends(get_current_user)):
    return {"username": current_user.username, "email": current_user.email}

@app.get("/options")
async def get_options():
    import json
    import os
    
    cities = []
    types = []
    mapping = {}
    
    if label_encoders:
        cities = sorted(list(label_encoders['city'].classes_))
        types = sorted(list(label_encoders['type'].classes_))
        
    # Use absolute path for the mapping file
    base_path = os.path.dirname(os.path.abspath(__file__))
    map_path = os.path.join(base_path, "city_neighborhood_map.json")
    
    if os.path.exists(map_path):
        with open(map_path, "r") as f:
            mapping = json.load(f)
            print(f"Backend: Mapping loaded successfully from {map_path}")
    else:
        print(f"Backend: Mapping file NOT found at {map_path}")
            
    return {
        "cities": cities,
        "types": types,
        "neighborhood_mapping": mapping
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
