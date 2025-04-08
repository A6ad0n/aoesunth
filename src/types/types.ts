export interface TickData {
    INSTRUMENT: string;
    PRICE: number;
    PRICE_FLAG: string;
    PRICE_LAST_UPDATE_TS: number;
}

export interface SortConfig {
    key: keyof TickData; 
    direction: 'asc' | 'desc';
}