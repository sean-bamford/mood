import { Time } from "neo4j-driver";

type Factor = {
    "Name": string;
    "Duration"?: number;
    "Quality"?: number;
    "Intake"?: number;
    "Cutoff Time"?: Time;
    "Level"?: number;
}

export default Factor;
