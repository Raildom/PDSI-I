"""Configurações do backend — carrega variáveis de ambiente."""

import os
from pathlib import Path

from dotenv import load_dotenv

_BACKEND_DIR = Path(__file__).resolve().parents[1]
_ROOT_DIR = _BACKEND_DIR.parent

# Prioriza .env.local (não versionado) e mantém fallback para .env
load_dotenv(_ROOT_DIR / ".env.local")
load_dotenv(_ROOT_DIR / ".env")
load_dotenv(_BACKEND_DIR / ".env.local")
load_dotenv(_BACKEND_DIR / ".env")

SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
