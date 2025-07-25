# (🚫 FAILED) `whisper` em tempo real via microfone

Criei esse arquivo pra ir anotando minhas tentativas de rodar o `whisper` em
tempo real, puxando o áudio direto do microfone. Já vou **deixar claro que isso
não funcionou** do jeito que eu esperava, e ainda tem coisa pra testar.

Na minha cabeça, talvez o certo fosse trabalhar direto com o modelo do
`whisper`, sem usar o código oficial da OpenAI. Aquela janela fixa de 30
segundos pode ter atrapalhado real. Pode até ser que precise refinar o modelo pra
rodar liso num esquema _live_.

Mas enfim... isso é só uma ideia. Não fui muito além do que tá descrito aqui
porque quero ver primeiro se esse tipo de conteúdo realmente chama atenção do
pessoal pra eu focar mais tempo pra gerar conteúdo (vídeos, posts, aulas, etc).

---

## (🚫 FAILED) Captura do microfone via `ffmpeg`

Minha primeira tentativa foi capturar o áudio do computador usando o `ffmpeg`.

Pra deixar claro: tô usando o ChatGPT e o Gemini pra me ajudar nas partes que eu
manjo menos, principalmente as coisas mais técnicas de áudio. Além disso, tô
rodando tudo com esse setup aqui (não sei se faz diferença, mas vai que...):

- MacBook Pro 2021
- Chip Apple M1 Max
- 32 GB de RAM
- SSD de 1 TB
- macOS Sequoia 15.5

---

### Listando os dispositivos de áudio

**Obs:** tô testando só no macOS por enquanto.

```sh
# macOS
ffmpeg -hide_banner -f avfoundation -list_devices true -i ""

# Linux
ffmpeg -hide_banner -f alsa -list_devices true -i ""
# ou (às vezes mais confiável)
arecord -l
# ou
arecord --list-devices

# Windows
ffmpeg -hide_banner -list_devices true -f dshow -i dummy
```

No meu caso, a saída foi mais ou menos como a que mostro logo abaixo. Só dei uma
enxugada, tirando os dispositivos que não interessavam (tipo fone, celular,
etc). Também cortei aquele trecho inicial que o ffmpeg cospe sempre.

```txt
➜  Desktop
ffmpeg -hide_banner -f avfoundation -list_devices true -i "" 2>&1

2025-06-18 09:15:21.567 ffmpeg[37312:1839628] WARNING:
Add NSCameraUseContinuityCameraDeviceType to your Info.plist to use AVCaptureDeviceTypeContinuityCamera.

2025-06-18 09:15:21.708 ffmpeg[37312:1839628] WARNING:
AVCaptureDeviceTypeExternal is deprecated for Continuity Cameras.

Please use AVCaptureDeviceTypeContinuityCamera and add NSCameraUseContinuityCameraDeviceType to your Info.plist.

[AVFoundation indev @ 0x153706960] AVFoundation video devices:
[AVFoundation indev @ 0x153706960] [0] Câmera FaceTime HD
[AVFoundation indev @ 0x153706960] [5] Capture screen 0
[AVFoundation indev @ 0x153706960] [6] Capture screen 1
[AVFoundation indev @ 0x153706960] AVFoundation audio devices:
[AVFoundation indev @ 0x153706960] [0] MOTIV Mix Virtual
[AVFoundation indev @ 0x153706960] [1] JBL TUNE125BT FOREBA
[AVFoundation indev @ 0x153706960] [2] Microfone (MacBook Pro)

[in#0 @ 0x600001f5c600] Error opening input: Input/output error

Error opening input file .
Error opening input files: Input/output error
```

A parte importante dessa saída é saber duas coisas: o `[ID]` e o nome do
dispositivo.

Por exemplo, se eu quiser usar o **Microfone (MacBook Pro)**, isso quer dizer
que o ID do dispositivo de áudio que eu vou usar é o `2`.

---

### (🚫 FAILED) Testando a captura de áudio em um `.wav`

Antes de tudo, bora garantir que tá tudo funcionando bonitinho. A ideia aqui é
só gravar um `.wav` com o áudio capturado direto do microfone. Ainda não é o
comando final, é só pra testar mesmo.

```sh
# Lembra do meu [2] Microfone (MacBook Pro) -> ID 2
# No comando abaixo, o ":2" representa o dispositivo que eu tô usando
# Resultado: grava um arquivo out.wav com 10 segundos de áudio
ffmpeg -f avfoundation -i ":2" -t 10 -ac 1 -ar 16000 out.wav
```

Ou seja, pra capturar só o **\[2] Microfone (MacBook Pro)**, é só passar `:2` no
argumento `-i`.

Se tu quiser capturar **vídeo e áudio ao mesmo tempo**, o formato vira `V:A`,
onde `V` é o ID do vídeo e `A` o do áudio.

Tipo assim:

```sh
# Captura da Câmera FaceTime HD (ID 0) + Microfone (MacBook Pro) (ID 2)
# Grava um out.mp4 com 10 segundos de vídeo e áudio dos dispositivos 0 e 2
ffmpeg -f avfoundation -framerate 30 -i "0:2" -t 10 out.mp4
```

---

### (🚫 FAILED) O que rolou com o `ffmpeg`?

No meu caso, o `ffmpeg` não funcionou do jeito que eu queria. O áudio ficou todo
picotado, com umas falhas bem esquisitas. Daí pra frente, passei praticamente o
dia inteiro testando várias coisas: mudei o _sample rate_, tentei outros
_codecs_, troquei de microfone, testei outras fontes (até tentei capturar o som
direto do sistema). Nada deu certo.

Minha conclusão: o `avfoundation` no meu macOS não tá se comportando direito.

Testei comandos como esse aqui:

```sh
ffmpeg \
    -thread_queue_size 512 \
    -loglevel debug \
    -f avfoundation \
    -i ":2" \
    -c:a copy \
    -t 10 \
    out.wav \
    -y
```

Esse `-c:a copy` (pra manter o codec de áudio original) foi uma das últimas
tentativas, depois de trocar um monte de outras coisas. E com isso o ffmpeg
revelou que o áudio tava vindo com essas specs:

```
Stream #0:0, 1, 1/1000000: Audio: pcm_f32le, 48000 Hz, mono, flt, 1536 kb/s
```

Eu já tinha testado `pcm_f32le` com `48000 Hz` antes, então... nenhuma surpresa.

Enfim, deixo isso aqui documentado porque, se acontecer contigo também, já te
poupo umas horas de frustração. A única coisa que resolveu o problema de áudio
tremido/picotado foi **usar o `sox`**.

---

## (✅ SUCCESS) `sox` pra capturar o áudio

Na primeira tentativa com `sox`, já rolou de boa, **zero esforço**.

```sh
sox \
    -b 32 \
    -e float \
    -r 16000 \
    -c 1 \
    -d \
    --buffer $((16000*4*10)) \
    out.wav \
    trim 0 10 \
    fade t 1 -0 1
```

Esse comando foi gerado pelo Gemini ou ChatGPT (não lembro). Só pedi um exemplo
que gravasse 10 segundos de áudio com fade-in e fade-out, só pra teste mesmo.

Depois fui testando outras paradas, mas o comando que pretendo usar com o
`whisper` é esse aqui:

```sh
# 🚫 não executa ainda
sox -t \
    coreaudio "Microfone (MacBook Pro)" \
    -b 16 \
    -e signed-integer \
    -r 16000 -c 1 \
    -t raw \
    -
```

Repara que a saída tá indo pro `stdout` (por isso tem esse `-` no fim), não pra
um arquivo. Ou seja, isso aqui é só a base pra integrar com outro processo, tipo
jogar direto no `whisper`.

Eu não entendo muito do `sox` ainda (primeiro uso), mas usei o `ffmpeg` (lá em cima) pra listar
os dispositivos. E aqui é diferente: em vez de usar o ID como no `ffmpeg`, tu
passa o nome do dispositivo, tipo, meu caso: `"Microfone (MacBook Pro)"`.

---

## (🤔 SUCCESS?) `whisper` live, ou quase

Aqui é onde começo a achar que talvez eu precise refinar o modelo ou até usar
ele "cru", sem passar pelo código oficial da OpenAI (`whisper`).

Fiz um código bem porquinho, só pra **ver se ia funcionar**. A ideia era: se
desse certo, aí sim eu refinava tudo com calma.

Considera isso aqui como um _MVP_ na versão `0.0.0alpha` mesmo.

```python
# pyright: basic
import asyncio

import numpy as np
import whisper
from scipy.io import wavfile

MODEL = whisper.load_model("turbo")


async def recorder(queue, counter, buffer, chunk_size, sr=16000, duration=5):
    print("🗣️ Recording started")

    proc = await asyncio.create_subprocess_exec(
        "sox",
        "-t",
        "coreaudio",
        "Microfone (MacBook Pro)",
        "-b",
        "16",
        "-e",
        "signed-integer",
        "-r",
        "16000",
        "-c",
        "1",
        "-t",
        "raw",
        "-",  # raw para facilitar o corte
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.DEVNULL,
    )

    while True:
        data = await proc.stdout.read(chunk_size)
        if not data:
            break
        buffer += data

        chunk_byte_size = sr * 2 * duration

        if len(buffer) >= chunk_byte_size:
            audio_chunk = buffer[:chunk_byte_size]
            buffer = buffer[chunk_byte_size:]

            audio_np = np.frombuffer(audio_chunk, np.int16).astype(np.float32) / 32768.0
            await queue.put(audio_np)

            wavfile.write(
                f"media/debug_{counter}.wav",
                16000,
                audio_np,
            )

            print(f"🗣️ Chunk {counter} ends \n")
            counter += 1


async def transcriber(queue):
    prefix = ""
    while True:
        print("💬 Whisper started")

        audio = await queue.get()
        audio = whisper.pad_or_trim(audio)

        mel = whisper.log_mel_spectrogram(audio, n_mels=MODEL.dims.n_mels).to(
            MODEL.device
        )

        options = whisper.DecodingOptions(
            language="en",
            temperature=0,
            beam_size=1,
            patience=0,
            without_timestamps=True,
            prompt=None,
            prefix=None,
        )
        result = whisper.decode(
            MODEL,
            mel,
            options,
        )

        prefix = result.text
        print("💬", result.text, "\n")
        queue.task_done()


async def main():
    from pathlib import Path
    from shutil import rmtree

    media = Path("media")
    rmtree(media)
    media.mkdir(exist_ok=True)

    queue = asyncio.Queue()
    counter = 0
    buffer = b""
    chunk_size = 4096

    await asyncio.gather(
        recorder(queue, counter, buffer, chunk_size, 16000, 30), transcriber(queue)
    )


if __name__ == "__main__":
    asyncio.run(main())
```

Nesse código eu uso `asyncio` justamente pra não travar tudo enquanto o
`whisper` tá transcrevendo. A ideia é deixar o processo rodando em paralelo:
enquanto uma parte grava, a outra já vai transcrevendo em tempo real.

Também uso o `scipy.io.wavfile` pra salvar os áudios em _chunks_, do mesmo
jeitinho que o `whisper` recebe. Isso ajuda no debug: depois eu junto esses
arquivos e escuto como ficou o áudio real que foi processado.

A função `recorder` é quem inicia o `sox` com o microfone que escolhi e roda um
loop que fica monitorando a quantidade de bytes acumulados. Essa contagem é
baseada no tamanho que cada trecho de áudio teria, considerando a duração que
defini.

```python
# Sample rate (16000) * Sample Width (2 bytes) * duração (ex: 5s)
chunk_byte_size = sr * 2 * duration
```

Quando o tamanho do `buffer` atinge esse `chunk_byte_size`, a gente corta
exatamente até ali. Esses são os bytes crus do trecho de áudio que vai pra
transcrição. Em seguida, o `buffer` é atualizado pra remover esse pedaço
processado e guardar qualquer sobra, que vai ser usada no próximo ciclo.

Esse loop aqui embaixo é o coração da gravação. Ele fica rodando enquanto o
`sox` tá mandando dados pela `stdout`.

```python
while True:
    # captura o que vem do sox
    data = await proc.stdout.read(chunk_size)
    if not data:
        break
    # joga no buffer
    buffer += data

    # calcula quantos bytes correspondem à duration configurada
    chunk_byte_size = sr * 2 * duration

    # se o buffer já tiver o tamanho certo pra um trecho de áudio completo
    if len(buffer) >= chunk_byte_size:
        # pegamos só o pedaço que interessa
        audio_chunk = buffer[:chunk_byte_size]
        # e atualizamos o buffer, removendo o que já usamos
        buffer = buffer[chunk_byte_size:]
```

Aí, com esse `audio_chunk` em mãos, é só converter pra um formato que o
`whisper` entenda e jogar isso na `queue`, que o `transcriber` vai processar
depois:

```python
audio_np = np.frombuffer(audio_chunk, np.int16).astype(np.float32) / 32768.0
await queue.put(audio_np)
```

Esse `.frombuffer(...).astype(...) / 32768.0` basicamente transforma os bytes
crus em um array de `float32` com valores normalizados entre -1 e 1, que é o
formato que o `whisper` espera.

Como eu queria ver exatamente o que o `whisper` também "tava enxergando", salvei
cada trecho de áudio assim:

```python
wavfile.write(
    f"media/debug_{counter}.wav",
    16000,
    audio_np,
)
```

Usei esse `counter` só pra gerar arquivos separados, tipo: `debug_0.wav`,
`debug_1.wav`, `debug_2.wav`, e por aí vai.

Depois juntei tudo com o `ffmpeg`:

```sh
ffmpeg -f concat -safe 0 -i input.txt -c copy out.wav
```

E o arquivo `input.txt` fica assim:

```
file 'debug_0.wav'
file 'debug_1.wav'
file 'debug_2.wav'
```

Até esse ponto, tava tudo fluindo lindamente. Eu já tava achando que ia dar bom.
Mas... o resultado final foi bem mais ou menos.

---

### (🤔 SUCCESS?) os problemas!

É aqui que entra o `whisper` de verdade. Testei um monte de coisas pra tentar
deixar tudo o mais rápido possível, e, claro, sem perder precisão na
transcrição.

Dá uma olhada nos comentários que deixei no código. Logo mais abaixo eu explico
outras coisas que descobri no caminho.

Essa é a função `transcriber`, que fica rodando enquanto tem coisa na fila
(`queue`). Comentei bastante no código, mas aqui vai uma visão geral com uns
complementos:

```python
async def transcriber(queue):
    prefix = ""  # USEI ISSO DE DUAS FORMAS DIFERENTES, SEM SUCESSO
    while True:
        print("💬 Whisper started")

        # Pega o áudio cru da fila
        audio = await queue.get()

        # Isso aqui é um pé no saco: não importa o tamanho real do áudio,
        # o whisper sempre espera cerca de 30s.
        #
        # Se for menor, ele preenche o resto com zeros (silêncio).
        # Se for maior, ele corta o que passa dos 30s.
        #
        # IMPORTANTE: não tem como passar áudios de durações diferentes
        # usando o código da OpenAI, porque o modelo foi treinado assim.
        audio = whisper.pad_or_trim(audio)

        # O whisper não "ouve" o som, ele transforma em imagem.
        # É um gráfico do som chamado espectrograma (Mel logarítmico).
        # Já expliquei isso num vídeo, é bem de boa de entender.
        mel = whisper.log_mel_spectrogram(audio, n_mels=MODEL.dims.n_mels).to(
            MODEL.device
        )

        options = whisper.DecodingOptions(
            # Último teste: inglês (en)
            # Mas 90% dos testes foram em português (pt), com áudios limpos,
            # de vídeos do YouTube com gente falando claro, sem gíria nem ruído.
            language="en",

            # Tentei deixar mais rápido usando o modo "greedy"
            # Também expliquei isso no outro vídeo
            temperature=0,
            beam_size=1,
            patience=0,  # isso aqui nem faz nada, foi mais no desespero

            # Desativei os timestamps pra ver se o modelo ficava mais leve,
            # focando só na transcrição mesmo
            without_timestamps=True,

            # Aquele prefixo lá de cima... tentei usar nessas duas opções aqui
            # (prompt e prefix). O modelo entrou em loop e fiquei bolado.
            # Desisti de usar.
            prompt=None,
            prefix=None,
        )

        # E aqui é onde rola a transcrição de fato
        result = whisper.decode(MODEL, mel, options)

        prefix = result.text
        print("💬", result.text, "\n")
        queue.task_done()
```

Tentei detalhar bastante nos comentários do código acima, mas ainda tem umas
coisas importantes que vale comentar.

Primeiro: **não consegui usar nenhum modelo acima do `medium`**. O motivo é
simples, o tempo de transcrição ficava maior do que a janela de tempo que eu
escolhi.

Tipo assim: com o modelo `turbo` e uma janela de 2 segundos, o `whisper` levava
uns 10 segundos (ou mais!) pra cuspir a transcrição. Ou seja, **não dava
tempo**. Não tinha como rodar em tempo real desse jeito. Pode ser limitação do
meu hardware também? Pode. Mas o fato é que não rolou.

Os modelos que **se saíram melhor** nesse esquema foram o `tiny` e o `base`.
Ambos ainda são imprecisos, mas se eu tivesse que escolher um, ficaria com o
`base`. O `tiny`, cara... entra em loop com uma facilidade absurda, qualquer
coisa repete, embanana, e vira um samba do sussurrador doido.

Sobre os tempos, testei com várias janelas diferentes:

- ⚠️ **1s, 2s, 3s, 4s:** sem chance. O modelo não entende nada, e em poucos
  ciclos já começa a repetir as coisas.
- ⚠️ **5s a 9s:** até vai, mas ainda rola loop e perda de qualidade em alguns
  momentos.
- ✅ **10s a 30s:** aqui a coisa começou a funcionar de verdade. Foi a faixa que
  deu o melhor resultado.

Percebeu o paradoxo? Eu queria uma parada em _tempo real_, mas só começou a
ficar usável a partir dos 10 segundos de áudio por vez. Foi aí que me bateu a
real: talvez só role se eu refinar o modelo e usar um código customizado, sem
depender da implementação padrão do `whisper`.

Todos esses testes foram feitos usando exatamente o código oficial da OpenAI.
Nada modificado no core do modelo.

---

## Conclusão geral

Desse jeito que mostrei até aqui, pra mim **não rola usar o `whisper` com
precisão em tempo real**. Pelo menos foi essa a conclusão que cheguei depois de
tudo isso.

Mas ó: foi uma experiência massa. Aprendi muita coisa que eu nem fazia ideia,
principalmente sobre áudio, e me diverti bastante fuçando esse modelo.

Tô deixando tudo documentado aqui porque pode ser que te ajude a ir mais fundo
no modelo, ou até mexer no código do `whisper` pra tentar um resultado melhor
que o meu.

Outra opção que eu _não testei_, mas pode valer muito a pena, seria usar o
[`whisper.cpp`](https://github.com/ggerganov/whisper.cpp) (versão C++) ou o
[`faster-whisper`](https://github.com/guillaumekln/faster-whisper), que é uma
implementação otimizada em Python com base no CTranslate2.

Valeu demais se tu leu até aqui! Tomara que eu tenha te ajudado ou feito você
perder menos tempo se fosse testar tudo isso que testei.

**Obs:** escrevi esse texto com `markdown`, se quiser baixar:

- [Baixar esse texto em `markdown`](TEXT.md)

Bye 👋!!!

---
