# Voice Architecture

Voice is an optional P1 input convenience.

- Recording starts only after a user gesture and shows an active indicator.
- Audio is bounded by duration and size, sent to a server transcription route, and discarded after the transcript response.
- The transcript is editable and must be explicitly submitted through the same redaction and validation boundary as typed text.
- Replay never pretends to transcribe audio.
- If voice is unavailable, the complete product remains usable by keyboard and text.

