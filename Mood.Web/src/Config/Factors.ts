interface Factors {
    [key: string]: string[];
  }

const Factors: Factors = {
    "Sleep": ["Duration",  "Quality"],
    "Diet": ["Quality"],
    "Weather": ["Description"],
    "Social Connection": ["Quality"],
    "Sunlight Exposure": ["Duration"],
    "Caffeine": ["Intake", "Cutoff Time"],
    "Exercise": ["Type", "Quality"],
    "Illness": ["Intensity"],
    "Energy": ["Level"],
    "Stress": ["Level"],
    "Social Media Use": ["Duration"]
}
export default Factors;