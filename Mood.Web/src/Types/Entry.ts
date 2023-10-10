import Factor from './Factor';

type Entry = {
    Date: Date;
    Rating: number;
    Quality?: string;
    Factors?: Factor[];
    Note?: string;
    };

export default Entry;