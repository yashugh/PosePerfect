from google.cloud import texttospeech

client = texttospeech.TextToSpeechClient.from_service_account_file("Welcome.json")

input_text = texttospeech.SynthesisInput(text = "The correct way to sit is with your feet touching the ground, shoulders square, and back straight")

voice = texttospeech.VoiceSelectionParams(
    language_code = "en-US", 
    ssml_gender = texttospeech.SsmlVoiceGender.NEUTRAL,
)

audio_config = texttospeech.AudioConfig (audio_encoding = texttospeech.AudioEncoding.MP3)

response = client.synthesize_speech(input = input_text, voice = voice, audio_config = audio_config)

with open ("output.mp3", "wb") as out:
    out.write(response.audio_content)
    print('Audio content written to file "output.mp3"')
