---
title: 'Hackers roubaram senhas com litellm (Pacote de IA do Python)'
description:
  'Supply chain attack no litellm: o pacote foi comprometido para roubar
  credenciais. Entenda o que houve e como verificar se você'
date: 2026-03-26T08:31:44-03:00
author: 'Otávio Miranda'
---

# Verificação de supply chain attack: litellm

O pacote `litellm` versão 1.82.8 foi comprometido com um arquivo `.pth`
malicioso (`litellm_init.pth`) que rouba credenciais. Os comandos abaixo
verificam se você tem o pacote instalado em qualquer lugar da sua máquina.

Referência:
[https://github.com/BerriAI/litellm/issues/24512](https://github.com/BerriAI/litellm/issues/24512)

> **Observação**: ainda estou escrevendo este conteúdo. Só estou
> disponibilizando os comandos primeiro pelo fato do caso ser urgente.

---

## Passo a passo

Aqui vai um passo a passo o mais rápido que consegui criar para te ajudar.

**Verificar instalação global via pip**

Checa se o nome `litellm` aparece nos pacotes instalados do pip do sistema.

```bash
pip list 2>/dev/null | grep -i litellm
pip3 list 2>/dev/null | grep -i litellm
```

**Verificar via import direto**

Tenta importar o módulo, se der ModuleNotFoundError, está limpo.

```bash
python3 -c "import litellm; print(litellm.__version__, litellm.__file__)"
```

**Verificar via uv (se usar)**

Mesma lógica do pip, mas pra quem usa `uv` como gerenciador.

```bash
uv pip list 2>/dev/null | grep -i litellm
```

**Varrer todos os ambientes virtuais em `.venv`**

Busca o pacote dentro de site-packages de qualquer .venv no diretório atual.

```bash
find . -path "*/.venv/*/site-packages/litellm*" 2>/dev/null
```

**Buscar em arquivos de dependência**

Verifica se litellm está declarado em qualquer arquivo de dependência do
projeto.

```bash
grep -ri "litellm" --include="requirements*.txt" \
                   --include="pyproject.toml" \
                   --include="uv.lock" \
                   --include="poetry.lock" \
                   --include="Pipfile*" \
                   --include="setup.py" \
                   --include="setup.cfg" .
```

**Buscar imports no código-fonte**

Verifica se algum .py do projeto importa litellm (ignorando .venv e
`__pycache__`).

```bash
grep -rE --include="*.py" -l "import litellm|from litellm" . \
  | grep -v ".venv" | grep -v "__pycache__"
```

**Buscar o arquivo .pth malicioso**

O ataque injeta um `litellm_init.pth` que o Python executa automaticamente ao
iniciar. Esse é o artefato mais crítico, se existir, a máquina está
comprometida.

```bash
find . -name "litellm_init.pth" 2>/dev/null
```

---

Se todos os comandos voltarem vazios ou com erro de import, você está limpo.
