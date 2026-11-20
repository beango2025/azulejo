"""Generate A2 listening MP3s with a Microsoft PT-PT neural voice.

Requires: python -m pip install --user edge-tts
"""
import asyncio
import json
import pathlib
import edge_tts

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "content" / "listening-briefs.json"
OUT = ROOT / "assets" / "audio"
VOICE = "pt-PT-RaquelNeural"
RATE = "-6%"
LIMIT = 2

async def one(item, sem):
    async with sem:
        target = OUT / f"a2-{item['id'].split('.')[1]}.mp3"
        if target.exists() and target.stat().st_size > 20000:
            print("skip", target.name)
            return
        print("generate", target.name)
        communicate = edge_tts.Communicate(item["text"], VOICE, rate=RATE)
        await communicate.save(str(target))
        print("done", target.name, target.stat().st_size)

import asyncio
async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    items = [item for item in json.loads(SRC.read_text(encoding="utf-8")) if item["level"] == "A2"]
    sem = asyncio.Semaphore(LIMIT)
    await asyncio.gather(*(one(item, sem) for item in items))

asyncio.run(main())
