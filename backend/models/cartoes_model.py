from ..config.deps import get_supabase
from ..config import env
from io import BytesIO
import httpx
import os

class CartoesModel:
    @staticmethod
    def _execute(query, action: str):
        try:
            result = query.execute()
        except Exception as e:
            raise Exception(f"{action}: {str(e)}")
        if result is None:
            raise Exception(f"{action}: resposta vazia do Supabase")
        err = getattr(result, "error", None)
        if err:
            raise Exception(f"{action}: {err}")
        return result

    @staticmethod
    def _first_row(result):
        data = getattr(result, "data", None)
        if isinstance(data, list):
            return data[0] if data else None
        return data

    @staticmethod
    def get_por_usuario(user_id: str):
        sb = get_supabase()
        query = sb.table("cartoes_luto").select("*").eq("user_id", user_id).limit(1)
        result = CartoesModel._execute(query, "consulta cartoes_luto por usuario")
        return CartoesModel._first_row(result)

    @staticmethod
    def criar(payload: dict):
        sb = get_supabase()
        query = sb.table("cartoes_luto").insert(payload)
        return CartoesModel._execute(query, "criar cartao")

    @staticmethod
    def atualizar(cartao_id: str, user_id: str, update_data: dict):
        sb = get_supabase()
        query = (
            sb.table("cartoes_luto")
            .update(update_data)
            .eq("id", cartao_id)
            .eq("user_id", user_id)
        )
        return CartoesModel._execute(query, "atualizar cartao")

    @staticmethod
    def get_por_slug(slug: str):
        sb = get_supabase()
        query = (
            sb.table("cartoes_luto")
            .select("*, falecidos(nome, data_nascimento, data_falecimento)")
            .eq("slug", slug)
            .limit(1)
        )
        result = CartoesModel._execute(query, "consulta cartoes_luto por slug")
        return CartoesModel._first_row(result)

    @staticmethod
    def get_publico(slug: str):
        sb = get_supabase()
        query = (
            sb.table("cartoes_luto")
            .select("titulo, mensagem, slug, falecidos(nome, data_nascimento, data_falecimento)")
            .eq("slug", slug)
            .eq("publicado", True)
            .limit(1)
        )
        result = CartoesModel._execute(query, "consulta cartao publico")
        return CartoesModel._first_row(result)

    @staticmethod
    def upload_storage(file_name: str, file_content: bytes, content_type: str):
        sb = get_supabase()
        result = sb.storage.from_("cartoes").upload(
            file_name,
            file_content,
            file_options={"content-type": content_type},
        )
        if result is None:
            raise Exception("upload storage: resposta vazia do Supabase")
        err = getattr(result, "error", None)
        if err:
            raise Exception(f"upload storage: {err}")
        return result

    @staticmethod
    def gerar_imagem_cartao(data: dict) -> BytesIO:
        from PIL import Image, ImageDraw, ImageFont
        w, h = 1080, 1350
        img = Image.new("RGB", (w, h), color=(35, 35, 45))
        draw = ImageDraw.Draw(img)
        def load_font(size: int) -> ImageFont.ImageFont:
            candidates = [
                "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf",
                "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
                "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf",
                "/usr/share/fonts/truetype/freefont/FreeSerif.ttf",
            ]
            for path in candidates:
                if os.path.exists(path):
                    return ImageFont.truetype(path, size)
            return ImageFont.load_default()

        ft = load_font(86)
        fs = load_font(36)
        fm = load_font(36)
        ff = load_font(24)

        def wrap_text(text: str, max_width: int, font: ImageFont.ImageFont) -> list[str]:
            words = text.split()
            lines: list[str] = []
            cur = ""
            for word in words:
                trial = f"{cur} {word}".strip()
                bb = draw.textbbox((0, 0), trial, font=font)
                if bb[2] - bb[0] <= max_width:
                    cur = trial
                else:
                    if cur:
                        lines.append(cur)
                    cur = word
            if cur:
                lines.append(cur)
            return lines

        draw.rectangle([(20, 20), (w-20, h-20)], outline=(180, 160, 130), width=2)
        cx = w // 2
        draw.text((cx-10, 90), "+", fill=(200, 180, 150), font=fs)

        foto_path = data.get("foto_path")
        if foto_path and env.SUPABASE_URL:
            try:
                url = f"{env.SUPABASE_URL}/storage/v1/object/public/cartoes/{foto_path}"
                resp = httpx.get(url, timeout=5)
                if resp.status_code == 200:
                    foto = Image.open(BytesIO(resp.content)).convert("RGB")
                    side = min(foto.size)
                    left = (foto.width - side) // 2
                    top = (foto.height - side) // 2
                    foto = foto.crop((left, top, left + side, top + side)).resize((280, 280))
                    mask = Image.new("L", (280, 280), 0)
                    mask_draw = ImageDraw.Draw(mask)
                    mask_draw.ellipse((0, 0, 280, 280), fill=255)
                    img.paste(foto, (cx - 140, 170), mask)
            except Exception:
                pass

        titulo = data.get("titulo", "")
        title_lines = wrap_text(titulo, 800, ft)[:2]
        title_y = 520 if foto_path else 240
        for line in title_lines:
            bb = draw.textbbox((0, 0), line, font=ft)
            draw.text(((w-(bb[2]-bb[0]))//2, title_y), line, fill=(240, 235, 220), font=ft)
            title_y += 74

        def fmt_br(date_str: str) -> str:
            if not date_str:
                return ""
            parts = date_str.split("-")
            if len(parts) == 3:
                return f"{parts[2]}/{parts[1]}/{parts[0]}"
            return date_str

        falecido = data.get("falecidos")
        if isinstance(falecido, list):
            falecido = falecido[0] if falecido else None
        if isinstance(falecido, dict):
            nasc = fmt_br(falecido.get("data_nascimento", "") or "")
            fal = fmt_br(falecido.get("data_falecimento", "") or "")
            dt = ""
            if nasc or fal:
                dt = f"{nasc}  -  {fal}" if nasc and fal else (nasc or fal)
            if dt:
                bb2 = draw.textbbox((0, 0), dt, font=fs)
                draw.text(((w-(bb2[2]-bb2[0]))//2, h - 360), dt, fill=(180, 170, 150), font=fs)

        draw.line([(140, h - 320), (w-140, h - 320)], fill=(120, 100, 80), width=1)

        msg = data.get("mensagem", "")
        if msg:
            lines = wrap_text(msg, 820, fm)[:9]
            y = h - 300
            for line in lines:
                bb3 = draw.textbbox((0, 0), line, font=fm)
                draw.text(((w-(bb3[2]-bb3[0]))//2, y), line, fill=(200, 195, 180), font=fm)
                y += 38

        draw.line([(140, h-220), (w-140, h-220)], fill=(120, 100, 80), width=1)
        footer = "Saint Luzia · Homenagens"
        bb4 = draw.textbbox((0, 0), footer, font=ff)
        draw.text(((w-(bb4[2]-bb4[0]))//2, h-120), footer, fill=(120, 110, 100), font=ff)

        buf = BytesIO()
        img.save(buf, format="PNG", quality=95)
        buf.seek(0)
        return buf
