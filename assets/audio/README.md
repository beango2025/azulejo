# A2 listening audio

`a2-1.mp3` … `a2-10.mp3` are neural European Portuguese readings generated with
Microsoft Edge TTS voice **pt-PT-RaquelNeural** at `-6%` rate.

These are **not human studio recordings**. They are a deliberate interim upgrade over
browser speech synthesis for the A2 exam and listening pages. Replace them with a
professional PT-PT voice actor before scaling paid acquisition.

Regenerate:

```bash
python -m pip install --user edge-tts
python tools/generate-a2-audio.py
```
