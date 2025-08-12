#!/bin/bash
echo "🚀 Starting Resume Parser API..."
cd "$(dirname "$0")"
export PYTHONPATH=$(pwd):$PYTHONPATH
uvicorn main:app --host 0.0.0.0 --port 8000 --reload