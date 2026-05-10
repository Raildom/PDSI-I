from pydantic import BaseModel

class ProcessoUpdate(BaseModel):
    concluido: bool
