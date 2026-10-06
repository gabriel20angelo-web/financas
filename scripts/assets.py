"""Prepara as figuras dos dois apps a partir dos bancos de cada identidade.

Inari (raposa): copia as WebP do site da Raposa Analítica.
Snowbobão (o gato da Iara Loren): converte para WebP as poses desenhadas por
scripts/snowbobao_gato.py (o gato de pelúcia de traços, pintado de neve).
Também gera os ícones de cada app (192, 512 e 180 para o iPhone).

Rodar de novo só quando mudar a lista abaixo:
    py scripts/assets.py
"""
from pathlib import Path
import shutil
from PIL import Image, ImageDraw

RAIZ = Path(__file__).resolve().parent.parent
PUB = RAIZ / "public"
RAPOSA = Path(r"C:\Users\gabri\RaposaAnalitica\public\raposa")
SNOW = RAIZ / "scripts" / "_snowbobao"

INARI = {
    "fig": ["raposa-inari", "raposa-anotando", "raposa-olhando-lua", "raposa-daruma", "raposa-noren",
            "raposa-pescando", "raposa-tigela", "raposa-dormindo", "raposa-dormindo-lua", "raposa-trotando",
            "raposa-wagasa", "kitsune-espiando", "perfil-kitsune-oculos", "raposa-so-a-cauda",
            "raposa-por-cima", "kitsune-tronco", "raposa-lanterna"],
    "obj": ["tunel-de-torii", "ema", "omamori", "daruma", "montanha", "chochin", "omikuji", "torii", "sensu"],
    "cenario": ["inverno", "outono", "primavera", "verao"],
    "mascara": ["kin", "shiro"],
    "kamon": ["raposa", "raposa-claro", "ginkgo-claro", "lua-nuvem-claro"],
}



def webp(origem: Path, destino: Path, lado_max: int, q: int = 82):
    im = Image.open(origem)
    im = im.convert("RGBA") if im.mode in ("RGBA", "LA", "P") else im.convert("RGB")
    im.thumbnail((lado_max, lado_max), Image.LANCZOS)
    destino.parent.mkdir(parents=True, exist_ok=True)
    im.save(destino, "WEBP", quality=q, method=6)


def icone(fundo, figura: Image.Image, destino_base: Path, escala=0.72, papel: Path | None = None):
    for lado, nome in [(512, "icone-512.png"), (192, "icone-192.png"), (180, "apple-touch-icon.png")]:
        base = Image.new("RGBA", (lado, lado), fundo)
        if papel:
            textura = Image.open(papel).convert("RGBA").resize((lado, lado), Image.LANCZOS)
            base.alpha_composite(textura)
        fig = figura.copy()
        fig.thumbnail((int(lado * escala), int(lado * escala)), Image.LANCZOS)
        base.alpha_composite(fig, ((lado - fig.width) // 2, (lado - fig.height) // 2))
        base.convert("RGB").save(destino_base / nome)


def main():
    # Inari
    for pasta, nomes in INARI.items():
        for n in nomes:
            orig = RAPOSA / pasta / f"{n}.webp"
            dest = PUB / "inari" / pasta / f"{n}.webp"
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(orig, dest)
    shutil.copy2(RAPOSA / "mascara-34-240.webp", PUB / "inari" / "mascara-34.webp")
    # ícone: máscara de ouro sobre a noite da mata, com aro de ouro
    mascara = Image.open(RAPOSA / "mascara" / "kin.webp").convert("RGBA")
    icone("#13211F", mascara, PUB / "inari", escala=0.74)
    for nome in ["icone-512.png", "icone-192.png", "apple-touch-icon.png"]:
        p = PUB / "inari" / nome
        im = Image.open(p).convert("RGB")
        d = ImageDraw.Draw(im)
        m = im.width * 0.045
        d.ellipse([m, m, im.width - m, im.height - m], outline="#D7A441", width=max(2, im.width // 90))
        im.save(p)

    # Snowbobão
    for png in sorted(SNOW.glob("[!_]*.png")):
        webp(png, PUB / "snowbobao" / "gato" / f"{png.stem}.webp", 520)
    # ícone: o rosto do frajola (o alto da pose sentada) no pergaminho, com aro vinho
    sentado = Image.open(SNOW / "sentado.png").convert("RGBA")
    rosto = sentado.crop((0, 0, sentado.width, int(sentado.height * 0.56)))
    icone("#F2E9DD", rosto, PUB / "snowbobao", escala=0.8, papel=PUB / "snowbobao" / "papel" / "pergaminho.webp")
    for nome in ["icone-512.png", "icone-192.png", "apple-touch-icon.png"]:
        p = PUB / "snowbobao" / nome
        im = Image.open(p).convert("RGB")
        d = ImageDraw.Draw(im)
        m = im.width * 0.045
        d.ellipse([m, m, im.width - m, im.height - m], outline="#6E212B", width=max(2, im.width // 90))
        im.save(p)

    total = sum(f.stat().st_size for f in PUB.rglob("*") if f.is_file())
    print(f"ok: {sum(1 for f in PUB.rglob('*') if f.is_file())} arquivos, {total // 1024} KB")


if __name__ == "__main__":
    main()
