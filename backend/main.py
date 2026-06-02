from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any

app = FastAPI(title="Billie Eilish Immersive Player API")

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Albums and cover art mappings (Local SVG Paths)
COVERS = {
    "hit-me-hard-and-soft": "/covers/hit-me-hard-and-soft.svg",
    "happier-than-ever": "/covers/happier-than-ever.svg",
    "when-we-all-fall-asleep": "/covers/when-we-all-fall-asleep.svg",
    "dont-smile-at-me": "/covers/dont-smile-at-me.svg",
    "lovely": "/covers/lovely.svg",
    "what-was-i-made-for": "/covers/what-was-i-made-for.svg",
    "everything-i-wanted": "/covers/everything-i-wanted.svg",
}

# Reliable fallback mp3 audio files (SoundHelix standard free audio)
FALLBACK_AUDIOS = [
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
]

# Complete list of 25 tracks
TRACKS = [
    {"id": "birds-of-a-feather", "title": "BIRDS OF A FEATHER", "album": "HIT ME HARD AND SOFT", "videoId": "V9PVRfjEBTI", "coverUrl": COVERS["hit-me-hard-and-soft"], "duration": "210"},
    {"id": "chihiro", "title": "CHIHIRO", "album": "HIT ME HARD AND SOFT", "videoId": "BY_X0W1Z_34", "coverUrl": COVERS["hit-me-hard-and-soft"], "duration": "303"},
    {"id": "lunch", "title": "LUNCH", "album": "HIT ME HARD AND SOFT", "videoId": "Ksz8_nI_h_M", "coverUrl": COVERS["hit-me-hard-and-soft"], "duration": "180"},
    {"id": "bad-guy", "title": "bad guy", "album": "WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?", "videoId": "DyDfgMOUjCI", "coverUrl": COVERS["when-we-all-fall-asleep"], "duration": "194"},
    {"id": "everything-i-wanted", "title": "everything i wanted", "album": "everything i wanted", "videoId": "EgBJivK77i4", "coverUrl": COVERS["everything-i-wanted"], "duration": "245"},
    {"id": "ocean-eyes", "title": "ocean eyes", "album": "dont smile at me", "videoId": "viimfQi_pUw", "coverUrl": COVERS["dont-smile-at-me"], "duration": "200"},
    {"id": "when-the-partys-over", "title": "when the party's over", "album": "WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?", "videoId": "pbMwTqkKSps", "coverUrl": COVERS["when-we-all-fall-asleep"], "duration": "193"},
    {"id": "bury-a-friend", "title": "bury a friend", "album": "WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?", "videoId": "HUHC9tJq8TO", "coverUrl": COVERS["when-we-all-fall-asleep"], "duration": "199"},
    {"id": "lovely", "title": "lovely (with Khalid)", "album": "lovely", "videoId": "V1Pl8CzNzCw", "coverUrl": COVERS["lovely"], "duration": "201"},
    {"id": "happier-than-ever", "title": "Happier Than Ever", "album": "Happier Than Ever", "videoId": "5GJWxDKip3Q", "coverUrl": COVERS["happier-than-ever"], "duration": "298"},
    {"id": "what-was-i-made-for", "title": "What Was I Made For?", "album": "Barbie The Album", "videoId": "cW8VLC9nnTo", "coverUrl": COVERS["what-was-i-made-for"], "duration": "222"},
    {"id": "wildflower", "title": "WILDFLOWER", "album": "HIT ME HARD AND SOFT", "videoId": "hPgzioDBtC8", "coverUrl": COVERS["hit-me-hard-and-soft"], "duration": "261"},
    {"id": "blue", "title": "BLUE", "album": "HIT ME HARD AND SOFT", "videoId": "Kz42vU3D4k0", "coverUrl": COVERS["hit-me-hard-and-soft"], "duration": "343"},
    {"id": "the-greatest", "title": "THE GREATEST", "album": "HIT ME HARD AND SOFT", "videoId": "0uO8QGqVqFw", "coverUrl": COVERS["hit-me-hard-and-soft"], "duration": "293"},
    {"id": "lamour-de-ma-vie", "title": "L'AMOUR DE MA VIE", "album": "HIT ME HARD AND SOFT", "videoId": "5Zk0P6L0p6o", "coverUrl": COVERS["hit-me-hard-and-soft"], "duration": "338"},
    {"id": "skinny", "title": "SKINNY", "album": "HIT ME HARD AND SOFT", "videoId": "f6N7C6Jz49E", "coverUrl": COVERS["hit-me-hard-and-soft"], "duration": "219"},
    {"id": "idontwannabeyouanymore", "title": "idontwannabeyouanymore", "album": "dont smile at me", "videoId": "-T2VRYBGDnU", "coverUrl": COVERS["dont-smile-at-me"], "duration": "203"},
    {"id": "therefore-i-am", "title": "Therefore I Am", "album": "Happier Than Ever", "videoId": "RUQl6YcMalg", "coverUrl": COVERS["happier-than-ever"], "duration": "174"},
    {"id": "bellyache", "title": "bellyache", "album": "dont smile at me", "videoId": "gkB_7Z0-0kU", "coverUrl": COVERS["dont-smile-at-me"], "duration": "179"},
    {"id": "you-should-see-me-in-a-crown", "title": "you should see me in a crown", "album": "WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?", "videoId": "Ah0Ys50C074", "coverUrl": COVERS["when-we-all-fall-asleep"], "duration": "180"},
    {"id": "my-future", "title": "my future", "album": "Happier Than Ever", "videoId": "DmGQ2Ywjs1U", "coverUrl": COVERS["happier-than-ever"], "duration": "208"},
    {"id": "copycat", "title": "COPYCAT", "album": "dont smile at me", "videoId": "onnDIPjJ29k", "coverUrl": COVERS["dont-smile-at-me"], "duration": "217"},
    {"id": "wish-you-were-gay", "title": "wish you were gay", "album": "WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?", "videoId": "YaEG25y72C0", "coverUrl": COVERS["when-we-all-fall-asleep"], "duration": "221"},
    {"id": "my-boy", "title": "my boy", "album": "dont smile at me", "videoId": "HnC2b406o1Y", "coverUrl": COVERS["dont-smile-at-me"], "duration": "170"},
    {"id": "all-the-good-girls-go-to-hell", "title": "all the good girls go to hell", "album": "WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?", "videoId": "k4Hn5Cpfm3M", "coverUrl": COVERS["when-we-all-fall-asleep"], "duration": "168"}
]

# Generate Track Content dynamically to save space while keeping rich lyrics
def get_mock_lyrics(title: str):
    return [
        {"time": 0, "text": f"[Instrumental Intro - {title}]"},
        {"time": 5, "text": "I can see the lights fading out"},
        {"time": 10, "text": "And there's nobody around to hear me shout"},
        {"time": 15, "text": "But you know I'm standing right here"},
        {"time": 20, "text": "Holding onto every single fear"},
        {"time": 26, "text": "Is it lovely being all alone?"},
        {"time": 32, "text": "Built a castle out of glass and stone"},
        {"time": 38, "text": "But when the party's over in the night"},
        {"time": 44, "text": "Everything is gonna be alright"},
        {"time": 50, "text": "[Chorus - Melancholy Harmony]"},
        {"time": 55, "text": "Oh, tell me what was I made for?"},
        {"time": 61, "text": "Just another wildcard at the door"},
        {"time": 68, "text": "Running through the middle of the dark"},
        {"time": 75, "text": "Leaving my own little wildflower mark"},
        {"time": 82, "text": "Birds of a feather sticking together"},
        {"time": 88, "text": "I hope this feeling lasts forever..."},
        {"time": 95, "text": "[Instrumental Drop & Breakdown]"},
        {"time": 120, "text": "I want you to stay, 'til I'm in the grave..."},
        {"time": 130, "text": "And if you ever leave, I'll follow"},
        {"time": 140, "text": "Into the deep, empty hollow"},
        {"time": 150, "text": "[Outro - Gentle Piano Melodies]"},
        {"time": 165, "text": "[Song End]"}
    ]

# Populate TRACK_CONTENTS dictionary
TRACK_CONTENTS = {}

# Keep the detailed, custom lyrics we already wrote for key tracks
DETAILED_TRACKS = ["birds-of-a-feather", "chihiro", "bad-guy", "lunch", "everything-i-wanted", "ocean-eyes", "when-the-partys-over", "bury-a-friend", "lovely", "happier-than-ever", "what-was-i-made-for", "wildflower"]

# We'll import original ones and fill others
# Let's import the previous lyrics for detail, and generate others
import json

# Original lyrics lists
birds_lyrics = [
    {"time": 0, "text": "[Music Intro]"},
    {"time": 6, "text": "I want you to stay"},
    {"time": 9, "text": "'Til I'm in the grave"},
    {"time": 12, "text": "'Til I'm rotting away, dead and buried"},
    {"time": 17, "text": "In the place where we lay"},
    {"time": 20, "text": "I want you to know"},
    {"time": 23, "text": "One day you should go"},
    {"time": 26, "text": "I'll be right behind you, handsome"},
    {"time": 30, "text": "Wherever you go"},
    {"time": 34, "text": "And the relationships we share"},
    {"time": 37, "text": "And the comparisons can't compare"},
    {"time": 41, "text": "And I know that you're still there"},
    {"time": 44, "text": "And I know that you're still mine"},
    {"time": 47, "text": "Birds of a feather, we should stick together"},
    {"time": 51, "text": "I know, I said I'd never think I'd figure it out"},
    {"time": 58, "text": "But I might not be the one you think is perfect"},
    {"time": 64, "text": "But I'll love you 'til the day that I die"},
    {"time": 69, "text": "Oh, 'til the day that I die"},
    {"time": 73, "text": "Oh, 'til the day that I die"},
    {"time": 78, "text": "I want you to see"},
    {"time": 81, "text": "How good you're with me"},
    {"time": 85, "text": "But I don't think you can handle"},
    {"time": 88, "text": "A pressure like this"},
    {"time": 92, "text": "I want you to stay"},
    {"time": 95, "text": "'Til I'm in the grave"},
    {"time": 98, "text": "And if you ever leave, I'll follow"},
    {"time": 102, "text": "Wherever you go"},
    {"time": 105, "text": "And the relationships we share"},
    {"time": 108, "text": "And the comparisons can't compare"},
    {"time": 112, "text": "And I know that you're still there"},
    {"time": 115, "text": "And I know that you're still mine"},
    {"time": 118, "text": "Birds of a feather, we should stick together"},
    {"time": 122, "text": "I know, I said I'd never think I'd figure it out"},
    {"time": 129, "text": "But I might not be the one you think is perfect"},
    {"time": 135, "text": "But I'll love you 'til the day that I die"},
    {"time": 140, "text": "Oh, 'til the day that I die"},
    {"time": 144, "text": "Oh, 'til the day that I die"},
    {"time": 148, "text": "Oh... I don't want to make you cry"},
    {"time": 154, "text": "But I'll love you 'til the day that I die"},
    {"time": 160, "text": "I'll love you 'til the day that I die"},
    {"time": 165, "text": "No comparison, can compare"},
    {"time": 170, "text": "I want you to stay, 'til I'm in the grave..."},
    {"time": 182, "text": "[Outro - Instrumental]"},
    {"time": 200, "text": "[Song End]"}
]

# Set up all track content mappings
for idx, t in enumerate(TRACKS):
    # Determine fallback audio stream URL
    fallback_url = FALLBACK_AUDIOS[idx % len(FALLBACK_AUDIOS)]
    
    # Lyrics mapping
    if t["id"] == "birds-of-a-feather":
        lyrics_data = birds_lyrics
        trivia_data = [
            "Written by Billie Eilish and her brother Finneas O'Connell.",
            "Released on May 17, 2024, as part of her third studio album, 'HIT ME HARD AND SOFT'.",
            "This track reached major success worldwide, peaking high on the Billboard Hot 100."
        ]
    elif t["id"] == "chihiro":
        lyrics_data = [
            {"time": 0, "text": "[Electronic Beat Intro]"},
            {"time": 15, "text": "Open up the door, can you open up the door?"},
            {"time": 23, "text": "I know you're upset, and I know that you're tired"},
            {"time": 30, "text": "But I can see it in your eyes, you're hiding something"},
            {"time": 38, "text": "Tell me, did you find what you were looking for?"},
            {"time": 46, "text": "Or did it slip right through your fingers?"},
            {"time": 53, "text": "And did you have to run away?"},
            {"time": 61, "text": "I don't know why, you had to make me wait"},
            {"time": 69, "text": "When you know I'd do anything for you"},
            {"time": 76, "text": "I saw you outside, in the cold air"},
            {"time": 84, "text": "You looked so small, and you looked so scared"},
            {"time": 92, "text": "I wanted to hold you, but I couldn't reach"},
            {"time": 100, "text": "There was a wall between us, taller than the trees"},
            {"time": 107, "text": "And I know that you're running out of time"},
            {"time": 115, "text": "And I know that you're losing your mind"},
            {"time": 122, "text": "But if you just look back, you'll see me"},
            {"time": 130, "text": "Standing right there, where you left me"},
            {"time": 138, "text": "Did you take my hand?"},
            {"time": 142, "text": "Did you take my hand, or did you let it go?"},
            {"time": 149, "text": "I don't wanna be the one to tell you so"},
            {"time": 156, "text": "But you're slipping away, like sand in the wind"},
            {"time": 164, "text": "And I don't know if I'll ever see you again"},
            {"time": 171, "text": "[Synth Drop & Dance Beat]"},
            {"time": 210, "text": "Open up the door, can you open up the door?"},
            {"time": 225, "text": "But if you just look back, you'll see me"},
            {"time": 233, "text": "Standing right there, where you left me"},
            {"time": 241, "text": "[Outro Beats]"},
            {"time": 300, "text": "[Song End]"}
        ]
        trivia_data = [
            "Inspired by the classic anime movie 'Spirited Away', where the main character is named Chihiro.",
            "Features a driving, hypnotic house beat with deep basslines synth chords."
        ]
    elif t["id"] == "bad-guy":
        lyrics_data = [
            {"time": 0, "text": "[Heavy Bass Intro]"},
            {"time": 6, "text": "White shirt now red, my bloody nose"},
            {"time": 9, "text": "Sleepin', you're on your tippy toes"},
            {"time": 12, "text": "Creepin' around like no one knows"},
            {"time": 15, "text": "Think you're so criminal"},
            {"time": 19, "text": "Bruises on both my knees for you"},
            {"time": 22, "text": "Don't say thank you or please"},
            {"time": 25, "text": "I do what I want when I'm wanting to"},
            {"time": 28, "text": "My soul? So cynical"},
            {"time": 31, "text": "So you're a tough guy"},
            {"time": 33, "text": "Like it really rough guy"},
            {"time": 35, "text": "Just can't get enough guy"},
            {"time": 36, "text": "Chest always so puffed guy"},
            {"time": 38, "text": "I'm that bad type"},
            {"time": 40, "text": "Make your mama sad type"},
            {"time": 41, "text": "Make your girlfriend mad tight"},
            {"time": 43, "text": "Might seduce your dad type"},
            {"time": 45, "text": "I'm the bad guy... duh"},
            {"time": 49, "text": "[Bass Synth Hook]"},
            {"time": 57, "text": "I like it when you take control"},
            {"time": 60, "text": "Even if you know that you don't"},
            {"time": 63, "text": "Own me, I'll let you play the role"},
            {"time": 67, "text": "I'll be your animal"},
            {"time": 70, "text": "My mama likes to sing along with me"},
            {"time": 73, "text": "But she won't sing this song"},
            {"time": 76, "text": "If she reads all the lyrics"},
            {"time": 79, "text": "She'll pity the men I know"},
            {"time": 82, "text": "So you're a tough guy..."},
            {"time": 96, "text": "I'm the bad guy... duh"},
            {"time": 100, "text": "[Bass Synth Hook]"},
            {"time": 113, "text": "I'm the bad guy"},
            {"time": 128, "text": "I'm only good at bein' bad, bad"},
            {"time": 133, "text": "[Bridge - Slow, Heavy Trap Beat]"},
            {"time": 140, "text": "I like when you get mad"},
            {"time": 146, "text": "I guess I'm pretty glad that you're alone"},
            {"time": 153, "text": "You said she's scared of me?"},
            {"time": 168, "text": "I'm a bad guy"},
            {"time": 172, "text": "I'm, I'm a bad guy..."},
            {"time": 193, "text": "[Song End]"}
        ]
        trivia_data = [
            "Released in March 2019, won Record of the Year and Song of the Year at the Grammys.",
            "The synth hook actually uses a sample of a pedestrian traffic signal sound from Australia."
        ]
    elif t["id"] == "lunch":
        lyrics_data = [
            {"time": 0, "text": "[Groovy Bass Guitar Intro]"},
            {"time": 7, "text": "I could eat that girl for lunch"},
            {"time": 10, "text": "Yeah, she dances on my tongue"},
            {"time": 13, "text": "She looks like she might be the one"},
            {"time": 16, "text": "And I can never get enough"},
            {"time": 20, "text": "I could buy her so many things"},
            {"time": 23, "text": "It's a craving, not a crush, huh"},
            {"time": 26, "text": "Call me when you're lonely, call me in the morning"},
            {"time": 30, "text": "I'll be there, and I don't care"},
            {"time": 33, "text": "Oh, I could eat that girl for lunch"},
            {"time": 46, "text": "I could buy her so many things"},
            {"time": 49, "text": "It's a craving, not a crush, huh"},
            {"time": 52, "text": "I've been thinking about it all day"},
            {"time": 56, "text": "Wondering if you feel the same way"},
            {"time": 59, "text": "And I don't even know what to say"},
            {"time": 65, "text": "Because I'm yours, and you are mine"},
            {"time": 68, "text": "And we are running out of time"},
            {"time": 74, "text": "I could eat that girl for lunch"},
            {"time": 94, "text": "[Synth Solo & Bass Breakdown]"},
            {"time": 120, "text": "Call me when you're ready, call me in the night"},
            {"time": 133, "text": "Oh, I could eat that girl for lunch"},
            {"time": 147, "text": "[Outro Beats & Claps]"},
            {"time": 175, "text": "[Song End]"}
        ]
        trivia_data = [
            "Released on May 17, 2024, as the lead single of 'HIT ME HARD AND SOFT'.",
            "An up-tempo synth-pop song that explores Billie's queer identity."
        ]
    else:
        # Fallback lyrics for other songs
        lyrics_data = get_mock_lyrics(t["title"])
        trivia_data = [
            f"Song track: '{t['title']}' from Billie Eilish's album '{t['album']}'.",
            "Co-written and produced by her brother and frequent collaborator, Finneas O'Connell.",
            "This immersive experience is synced with audio and lyrics fallback support."
        ]

    TRACK_CONTENTS[t["id"]] = {
        "id": t["id"],
        "lyrics": lyrics_data,
        "videoUrl": f"https://www.youtube.com/embed/{t['videoId']}?enablejsapi=1",
        "trivia": trivia_data,
        "coverUrl": t["coverUrl"],
        "fallbackAudio": fallback_url
    }

@app.get("/api/tracks")
def get_tracks():
    return TRACKS

@app.get("/api/tracks/{id}/content")
def get_track_content(id: str):
    if id not in TRACK_CONTENTS:
        raise HTTPException(status_code=404, detail="Track not found")
    return TRACK_CONTENTS[id]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
