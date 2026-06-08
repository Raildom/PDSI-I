"""
Ponto de entrada serverless para a Vercel.
A Vercel detecta este arquivo e serve o app FastAPI como função Python.
"""
import sys
import os

# Garante que a raiz do projeto está no path para que `backend` seja importável
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.main import app  # noqa: F401 — exportado para a Vercel
