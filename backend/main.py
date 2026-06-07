"""
Funerária Saint Luzia — Backend FastAPI (Padrão MVC)
Ponto de entrada da aplicação.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .controllers import (
    auth_controller,
    perfil_controller,
    planos_controller,
    contratacoes_controller,
    falecidos_controller,
    documentos_controller,
    cartoes_controller,
    admin_controller,
    processos_controller,
    super_admin_controller,
)

app = FastAPI(
    title="Saint Luzia API",
    description="API REST para a plataforma de gestão funerária Saint Luzia (Arquitetura MVC)",
    version="1.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_controller.router)
app.include_router(perfil_controller.router)
app.include_router(planos_controller.router)
app.include_router(contratacoes_controller.router)
app.include_router(falecidos_controller.router)
app.include_router(documentos_controller.router)
app.include_router(cartoes_controller.router)
app.include_router(admin_controller.router)
app.include_router(processos_controller.router)
app.include_router(super_admin_controller.router)

@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "Saint Luzia API (MVC)"}
