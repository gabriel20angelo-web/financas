# -*- coding: utf-8 -*-
"""O Snowbobão: o gato de pelúcia de traços do banco do Entrelinhas, pintado de
neve (pelo branco-creme com sombra morna, olhos de cobre). Usa as poses do
motor do clube sem mexer no banco dele: desenha aqui, em scripts/_snowbobao/.

    py scripts/snowbobao_gato.py            -> todas as poses da lista
    py scripts/snowbobao_gato.py 04 21      -> só essas
Depois: py scripts/assets.py (converte para WebP em public/snowbobao/gato/).
"""
import os, sys
MASC = r"C:\Users\gabri\clube_entrelinhas\mascote"
sys.path.insert(0, MASC)
sys.path.insert(0, os.path.dirname(MASC))
import gato_banco as G
import gato_banco2  # noqa: F401  (registra as poses 27-56 e os gradientes)

# pelo: neve morna; as regiões que no frajola são brancas ficam um tom acima
NEVE = dict(base="#F1EBE2", escuro="#BDAFA3", medio="#DED4C8", claro="#FFFFFF", borda="#9A8B80")
CREME = dict(base="#FFFCF6", escuro="#D9CEC0", medio="#F2EADF", claro="#FFFFFF", borda="#B3A496")
IRIS = "#D9944A"
# os livros do clube (azul, vermelho, verde, roxo) passam para a paleta da Iara:
# vinho, garrafa, cobre e tinta
LIVROS = {"#3F6E8C": "#7E2A36", "#4F67C9": "#3E5A4A", "#C8324F": "#8A2F3B", "#B02A46": "#7A2632",
          "#78B27A": "#B9783F", "#7A3E8E": "#2F3B4F"}

POSES = {
    "01": "sentado", "03": "bolinha-dormindo", "04": "barriga-pra-cima", "05": "sentado-largado",
    "06": "em-pe-comemorando", "07": "de-lado-andando", "11": "lendo", "13": "xicara-de-cafe",
    "15": "com-a-lanterna", "16": "espiando-atras-do-livro", "19": "espiando-de-baixo", "20": "feliz",
    "21": "assustado", "25": "sonolento", "27": "de-oculos", "35": "no-alto-da-pilha",
    "43": "escrevendo", "44": "detetive-de-lupa", "53": "olhando-as-estrelas", "56": "na-caixa",
}
SAIDA = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_snowbobao")

_init = G.Pose.__init__
def _init_neve(self, *a, **k):
    _init(self, *a, **k)
    self.pe, self.pb, self.iris = NEVE, CREME, IRIS
G.Pose.__init__ = _init_neve


def em_neve(svg: str) -> str:
    # no pelo preto os bigodes e a sobrancelha eram claros; na neve viram cinza morno
    svg = svg.replace('stroke="#FFFDF6" stroke-width="1.5"', 'stroke="#8E8076" stroke-width="1.5"')
    svg = svg.replace('stroke="#F6F0E4" stroke-width="7"', 'stroke="#6E5F57" stroke-width="7"')
    for de, para in LIVROS.items():
        svg = svg.replace(de, para)
    return svg.replace("#C9D86A", IRIS)  # o olho que a lupa aumenta


def main(cods):
    from playwright.sync_api import sync_playwright
    os.makedirs(SAIDA, exist_ok=True)
    with sync_playwright() as pw:
        b = pw.chromium.launch()
        pg = b.new_page()
        for cod, nome, grupo, nota, f in G.POSES:
            if cod not in POSES or (cods and cod not in cods):
                continue
            p = G.Pose(cod, nome, grupo, nota, centro=(0, -200))
            f(p)
            svg, w, h = G.montar_svg(p)
            svg = em_neve(svg)
            k = 900 / max(w, h)
            W, H = int(w * k), int(h * k)
            html = ('<!doctype html><html><head><meta charset="utf-8">%s<style>html,body{margin:0;background:transparent}svg{display:block}</style></head><body>%s</body></html>'
                    % (G.fontes_css(), svg.replace('width="%.0f" height="%.0f"' % (w, h), 'width="%d" height="%d"' % (W, H), 1)))
            arq = os.path.join(SAIDA, "_tmp.html")
            open(arq, "w", encoding="utf-8").write(html)
            pg.set_viewport_size({"width": W, "height": H})
            pg.goto("file:///" + arq.replace("\\", "/"))
            pg.wait_for_timeout(400)
            pg.screenshot(path=os.path.join(SAIDA, POSES[cod] + ".png"), omit_background=True)
            open(os.path.join(SAIDA, POSES[cod] + ".svg"), "w", encoding="utf-8").write(svg)
            print(cod, POSES[cod], W, H)
        b.close()
    os.remove(os.path.join(SAIDA, "_tmp.html"))


if __name__ == "__main__":
    main(sys.argv[1:] or None)
