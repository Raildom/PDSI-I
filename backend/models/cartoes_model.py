from ..config.deps import get_supabase
from io import BytesIO

class CartoesModel:
    @staticmethod
    def get_por_usuario(user_id: str):
        sb = get_supabase()
        return sb.table("cartoes_luto").select("*").eq("user_id", user_id).maybe_single().execute()

    @staticmethod
    def criar(payload: dict):
        sb = get_supabase()
        return sb.table("cartoes_luto").insert(payload).execute()

    @staticmethod
    def atualizar(cartao_id: str, user_id: str, update_data: dict):
        sb = get_supabase()
        return sb.table("cartoes_luto").update(update_data).eq("id", cartao_id).eq("user_id", user_id).execute()

    @staticmethod
    def get_por_slug(slug: str):
        sb = get_supabase()
        return sb.table("cartoes_luto").select("*, falecidos(nome, data_nascimento, data_falecimento)").eq("slug", slug).maybe_single().execute()

    @staticmethod
    def get_publico(slug: str):
        sb = get_supabase()
        return sb.table("cartoes_luto").select("titulo, mensagem, slug, falecidos(nome, data_nascimento, data_falecimento)").eq("slug", slug).eq("publicado", True).maybe_single().execute()

    @staticmethod
    def gerar_imagem_cartao(data: dict) -> BytesIO:
        from PIL import Image, ImageDraw, ImageFont
        w, h = 800, 1100
        img = Image.new("RGB", (w, h), color=(35, 35, 45))
        draw = ImageDraw.Draw(img)
        try:
            ft = ImageFont.truetype("arial.ttf", 42)
            fs = ImageFont.truetype("arial.ttf", 20)
            fm = ImageFont.truetype("arial.ttf", 18)
            ff = ImageFont.truetype("arial.ttf", 14)
        except OSError:
            ft = fs = fm = ff = ImageFont.load_default()

        draw.rectangle([(20, 20), (w-20, h-20)], outline=(180, 160, 130), width=2)
        cx = w // 2
        draw.text((cx-10, 100), "✝", fill=(200, 180, 150), font=ft)

        titulo = data.get("titulo", "")
        bb = draw.textbbox((0, 0), titulo, font=ft)
        draw.text(((w-(bb[2]-bb[0]))//2, 200), titulo, fill=(240, 235, 220), font=ft)

        falecido = data.get("falecidos")
        if falecido:
            nasc = falecido.get("data_nascimento", "") or ""
            fal = falecido.get("data_falecimento", "") or ""
            dt = f"★ {nasc}  —  ✝ {fal}" if nasc and fal else nasc or fal
            if dt:
                bb2 = draw.textbbox((0, 0), dt, font=fs)
                draw.text(((w-(bb2[2]-bb2[0]))//2, 280), dt, fill=(180, 170, 150), font=fs)

        draw.line([(100, 340), (w-100, 340)], fill=(120, 100, 80), width=1)

        msg = data.get("mensagem", "")
        if msg:
            words, lines, cur = msg.split(), [], ""
            for word in words:
                if len(cur + " " + word) <= 45:
                    cur = (cur + " " + word).strip()
                else:
                    if cur: lines.append(cur)
                    cur = word
            if cur: lines.append(cur)
            y = 400
            for line in lines:
                bb3 = draw.textbbox((0, 0), line, font=fm)
                draw.text(((w-(bb3[2]-bb3[0]))//2, y), line, fill=(200, 195, 180), font=fm)
                y += 30

        draw.line([(100, h-200), (w-100, h-200)], fill=(120, 100, 80), width=1)
        footer = "Saint Luzia · Homenagens"
        bb4 = draw.textbbox((0, 0), footer, font=ff)
        draw.text(((w-(bb4[2]-bb4[0]))//2, h-100), footer, fill=(120, 110, 100), font=ff)

        buf = BytesIO()
        img.save(buf, format="PNG", quality=95)
        buf.seek(0)
        return buf
