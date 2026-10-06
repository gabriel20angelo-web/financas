"""Prepara as figuras dos dois apps a partir dos bancos de cada identidade.

Inari (raposa): copia as WebP do site da Raposa Analítica.
Livro-caixa (gatos): converte as poses do frajola e os elementos recortados
do Clube Entrelinhas para WebP menores, e as texturas de papel do clube.
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
CLUBE = Path(r"C:\Users\gabri\OneDrive\Desktop\Clube do Livro Entrelinhas - artes")
POSES = CLUBE / "Mascote - banco de poses" / "png (fundo transparente)"
ELEMENTOS = CLUBE / "Elementos recortados"
TEXTURAS = Path(r"C:\Users\gabri\clube_entrelinhas\texturas")

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

GATOS = ["01_sentado", "03_bolinha_dormindo", "06_em_pe_comemorando", "07_de_lado_andando", "11_lendo",
         "14_cartaz_em_branco", "16_espiando_atras_do_livro", "17_pendurado_na_borda", "19_espiando_de_baixo",
         "20_feliz", "21_assustado", "25_sonolento", "27_de_oculos", "35_no_alto_da_pilha",
         "36_comendo_docinhos", "40_bola_de_cristal", "41_tirando_cartas", "42_brincando_com_novelo",
         "43_escrevendo", "44_detetive_de_lupa", "52_teve_uma_ideia", "53_olhando_as_estrelas",
         "56_na_caixa", "59_rosto_de_bastet", "60_corujinha_de_ouro"]

ENFEITES = {
    "1 Lacres e selos": ["lacre_vinho_lua", "lacre_estrelas_douradas", "lacre_coracoes", "lacre_laco_rosa"],
    "2 Astros": ["estrela_dourada_8_longa", "brilho_dourado_1", "brilho_dourado_2", "lua_dourada_rosto"],
    "6 Luz e mistério": ["ampulheta", "lanterna_pendurada_1"],
    "9 Rendas": ["renda_festonada_jade", "renda_festonada_rosa", "renda_delicada_ouro"],
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

    # Livro-caixa
    for n in GATOS:
        webp(POSES / f"{n}.png", PUB / "livro-caixa" / "gato" / f"{n.split('_', 1)[1].replace('_', '-')}.webp", 520)
    for pasta, nomes in ENFEITES.items():
        for n in nomes:
            webp(ELEMENTOS / pasta / f"{n}.png", PUB / "livro-caixa" / "enfeite" / f"{n.replace('_', '-')}.webp", 360)
    bastet = Image.open(POSES / "59_rosto_de_bastet.png").convert("RGBA")
    icone("#C799AA", bastet, PUB / "livro-caixa", escala=0.8, papel=TEXTURAS / "papel3_600x600_C799AA_3_2_2.6_1_0.14_0.32.png")

    total = sum(f.stat().st_size for f in PUB.rglob("*") if f.is_file())
    print(f"ok: {sum(1 for f in PUB.rglob('*') if f.is_file())} arquivos, {total // 1024} KB")


if __name__ == "__main__":
    main()
