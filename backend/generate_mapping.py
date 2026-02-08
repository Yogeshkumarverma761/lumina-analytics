import pandas as pd
import json
import os

csv_path = r'C:\Users\priya\.cache\kagglehub\datasets\shubhammkumaar\real-estate-listings-and-prices-in-india-2025\versions\1\real_estate_dataset.csv'

if os.path.exists(csv_path):
    df = pd.read_csv(csv_path)
    # Clean data: strip spaces and remove NaNs
    df['city'] = df['city'].astype(str).str.strip()
    df['neighborhood'] = df['neighborhood'].astype(str).str.strip()
    
    mapping = {}
    for city, group in df.groupby('city'):
        mapping[city] = sorted([str(x) for x in group['neighborhood'].unique() if str(x).lower() != 'nan'])
    
    output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'city_neighborhood_map.json')
    with open(output_path, 'w') as f:
        json.dump(mapping, f)
    print(f"Mapping saved to {output_path}")
else:
    print("CSV not found.")
