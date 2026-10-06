"""Rodou uma vez (05/10/2026): troca as cores fixas do módulo antigo por
papéis do tema (var(--pos), var(--neg)…), para cada app pintar do seu jeito.
As cores que a pessoa escolhe (categoria, cartão, caixinha) continuam hex,
porque o código concatena transparência nelas (`c.cor + "22"`)."""
from pathlib import Path
import re

PASTA = Path(__file__).resolve().parent.parent / "src" / "components" / "financas"

HEX = {
    "#10b981": "--pos", "#34d399": "--pos",
    "#ef4444": "--neg", "#f87171": "--neg",
    "#f59e0b": "--alerta", "#d4a017": "--alerta", "#fbbf24": "--alerta",
    "#fb923c": "--aviso", "#ea580c": "--aviso",
    "#60a5fa": "--info", "#a78bfa": "--roxo", "#6b7280": "--neutro",
    "#C84B31": "--orange-500",
}
RGB = {
    "16,185,129": "--pos", "52,211,153": "--pos",
    "239,68,68": "--neg", "248,113,113": "--neg",
    "245,158,11": "--alerta", "251,191,36": "--alerta",
    "251,146,60": "--aviso", "96,165,250": "--info", "107,114,128": "--neutro",
}

def rgba(m):
    papel = RGB.get(m.group(1).replace(" ", ""))
    if not papel:
        return m.group(0)
    pct = round(float(m.group(2)) * 100)
    return f"color-mix(in srgb, var({papel}) {pct}%, transparent)"

for arq in PASTA.glob("*.tsx"):
    t = arq.read_text(encoding="utf-8")
    original = t
    # as paletas de escolha ficam hex (viram as do tema mais adiante)
    protegido = {}
    def guarda(m):
        k = f"__PALETA{len(protegido)}__"
        protegido[k] = m.group(0)
        return k
    t = re.sub(r"const CORES_(CARTAO|CAIXINHA) = \[[^\]]*\];", guarda, t, flags=re.S)
    t = re.sub(r'useState\("#C84B31"\)', guarda, t)
    t = re.sub(r"rgba\(\s*([\d\s,]+?)\s*,\s*(\.?\d*\.?\d+)\s*\)", rgba, t)
    for hx, papel in HEX.items():
        t = re.sub(re.escape(hx) + r"(?![0-9a-fA-F])", f"var({papel})", t, flags=re.I)
    t = t.replace('colorScheme: "dark"', 'colorScheme: "var(--esquema)"')
    for k, v in protegido.items():
        t = t.replace(k, v)
    if t != original:
        arq.write_text(t, encoding="utf-8")
        print("trocado:", arq.name)
