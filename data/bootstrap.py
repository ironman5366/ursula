#!/usr/bin/env python3
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

DATA_DIR = Path(os.environ["OL_DATA_DUMP_PATH"])
assert DATA_DIR.exists(), f"Open library data directory {DATA_DIR} does not exist"

POSTGRES_CONN_URL = os.environ["POSTGRES_CONN_URL"]
