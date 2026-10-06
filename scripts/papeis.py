"""Texturas de papel dos dois apps (claro e escuro), com o gerador do Clube Entrelinhas
(clube_entrelinhas/papel.py), sem escurecer a borda. Depois:
- as manchas grandes descem (todas nos cartões, onde fica o número; parte na
  página), porque repetidas no ladrilho viram desenho;
- o ladrilho é costurado com a própria cópia deslocada pela metade, para
  repetir sem emenda e sem o espelho que formava losangos.

    py scripts/papeis.py
"""
from pathlib import Path
import sys
import tempfile
from PIL import Image, ImageFilter
import numpy as np

sys.path.insert(0, r"C:\Users\gabri\clube_entrelinhas")
import papel as P  # noqa: E402

P.CACHE = tempfile.mkdtemp()
PUB = Path(__file__).resolve().parent.parent / "public"

# (app, nome, cor, força, fibras, pintas, relevo)
PAPEIS = [
    ("inari", "washi", "#F2EBDC", 1.5, 2.2, 0.5, 0.30),
    ("inari", "cartao", "#F8F4EA", 1.0, 1.4, 0.35, 0.18),
    ("inari", "noite", "#13211F", 1.6, 2.0, 0.6, 0.30),
    # Inari à noite: a mata escura e o cartão de breu
    ("inari", "washi-noite", "#0E1715", 2.2, 3.0, 0.5, 0.28),
    ("inari", "cartao-noite", "#16211E", 2.0, 2.6, 0.4, 0.22),
    # Snowbobão: o papel antigo e a vela do site da Iara Loren
    ("snowbobao", "pergaminho", "#F2E9DD", 1.6, 2.4, 0.6, 0.30),
    ("snowbobao", "marfim", "#FFFCF7", 1.0, 1.5, 0.35, 0.18),
    ("snowbobao", "vela", "#15100E", 2.4, 3.2, 0.6, 0.30),
    ("snowbobao", "breu", "#0E0C0B", 2.2, 3.0, 0.5, 0.28),
    ("snowbobao", "couro", "#1A1412", 1.6, 2.2, 0.3, 0.2),
]

def sem_manchas(img: Image.Image, manter: float) -> Image.Image:
    """Separa o grão (alta frequência) das manchas (baixa) e devolve só uma fração delas."""
    a = np.asarray(img, np.float32)
    baixa = np.asarray(img.filter(ImageFilter.GaussianBlur(22)), np.float32)
    media = a.reshape(-1, 3).mean(0)
    out = (a - baixa) + media + (baixa - media) * manter
    return Image.fromarray(out.clip(0, 255).astype(np.uint8))


def costura(img: Image.Image) -> Image.Image:
    """Mistura a textura com ela mesma deslocada pela metade: as bordas viram miolo e casam."""
    a = np.asarray(img, np.float32)
    h, w = a.shape[:2]
    b = np.roll(a, (h // 2, w // 2), axis=(0, 1))
    y = np.minimum(np.arange(h), h - 1 - np.arange(h)) / (h / 2)
    x = np.minimum(np.arange(w), w - 1 - np.arange(w)) / (w / 2)
    peso = np.clip(np.minimum.outer(y, x) * 2.2, 0, 1)[..., None]
    return Image.fromarray((a * peso + b * (1 - peso)).clip(0, 255).astype(np.uint8))


# quanto das manchas grandes fica: página com um pouco, cartão e faixa quase nada
MANTER = {"washi": 0.45, "cartao": 0.0, "noite": 0.6, "washi-noite": 0.12, "cartao-noite": 0.0,
          "pergaminho": 0.45, "marfim": 0.0, "vela": 0.6, "breu": 0.12, "couro": 0.0}

SO = set(sys.argv[1:])
for app, nome, cor, forca, fibras, pintas, relevo in PAPEIS:
    if SO and nome not in SO:
        continue
    arq = P.papel(640, 640, cor, seed=7, forca=forca, fibras=fibras, pintas=pintas, borda=0, relevo=relevo,
                  nome=f"{app}-{nome}.png")
    tile = costura(sem_manchas(Image.open(arq).convert("RGB"), MANTER[nome]))
    destino = PUB / app / "papel" / f"{nome}.webp"
    destino.parent.mkdir(parents=True, exist_ok=True)
    tile.save(destino, "WEBP", quality=80, method=6)
    print(destino.relative_to(PUB), destino.stat().st_size // 1024, "KB")
