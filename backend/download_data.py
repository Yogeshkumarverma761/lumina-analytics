import kagglehub
import os

def download_dataset():
    # Download latest version
    path = kagglehub.dataset_download("shubhammkumaar/real-estate-listings-and-prices-in-india-2025")
    print("Path to dataset files:", path)
    return path

if __name__ == "__main__":
    download_dataset()
