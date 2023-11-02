import Factor from './Factor';

export type Entry = {
    Date: Date;
    Rating: number;
    Mood?: string;
    Factors?: Factor[];
    Note?: string;
    };

export interface ViewEntry extends Entry {
    Viewing?: boolean;
}
