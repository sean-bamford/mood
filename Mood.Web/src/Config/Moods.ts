interface Moods {
  [key: string]: string[];
}

const Moods: Moods = {
  Happy: ["Content", "Playful", "Excited"],
  Angry: ["Frustrated", "Mad", "Bitter"],
  Neutral: ["Calm", "Detached", "Numb"],
  Sad: ["Lonely", "Down", "Upset"],
  Fearful: ["Anxious", "Scared", "Unsettled"],
  Bad: ["Stressed", "Sick", "Bored"]
};

export default Moods;
