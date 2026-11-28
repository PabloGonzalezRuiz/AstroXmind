"""Genera una narración Piper y sus marcas temporales a partir del HTML compilado.

Requiere piper-tts y ffmpeg. El modelo ONNX queda fuera del repositorio.
"""
import json
import pathlib
import subprocess
import sys
import wave
import tempfile

from piper import PiperVoice
import onnxruntime

onnxruntime.disable_telemetry_events()

html, model, output = sys.argv[1:]
texts = json.loads(subprocess.check_output(['node', 'scripts/extract-reading.mjs', html]))
voice = PiperVoice.load(model)
destination = pathlib.Path(output)
destination.mkdir(parents=True, exist_ok=True)
cues = []
rate = voice.config.sample_rate
pause = int(rate * 0.18)
frames = 0
with tempfile.TemporaryDirectory() as temp:
    wav_path = pathlib.Path(temp) / 'reading.wav'
    with wave.open(str(wav_path), 'wb') as wav:
        wav.setparams((1, 2, rate, 0, 'NONE', 'not compressed'))
        for i, text in enumerate(texts):
            start = frames / rate
            for chunk in voice.synthesize(text.replace('–', ' a ')):
                data = chunk.audio_int16_bytes
                wav.writeframesraw(data)
                frames += len(data) // 2
            wav.writeframesraw(b'\x00\x00' * pause)
            frames += pause
            cues.append({'text': text, 'start': round(start, 4), 'end': round(frames / rate, 4)})
            if i % 20 == 0:
                print(f'{i + 1}/{len(texts)}', flush=True)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(wav_path), '-codec:a', 'libmp3lame', '-b:a', '48k', str(destination / 'narracion.mp3')], check=True)
(destination / 'marcas.json').write_text(json.dumps(cues, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'{len(cues)} frases, {frames / rate:.1f} segundos')
