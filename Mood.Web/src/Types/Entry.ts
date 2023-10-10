import Factor from './Factor';

type Entry = {
    Date: Date;
    Rating: number;
    Mood?: string;
    Factors?: Factor[];
    Note?: string;
    };

export default Entry;