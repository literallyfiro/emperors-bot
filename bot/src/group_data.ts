export interface GroupData {
    __language_code?: string
    settings: {
        maxEmperorsPerUser: number;
        emperorCooldown: number;
    }
    emperors: {
        [name: string]: {
            picture: string;
            takenBy: number | undefined;

        } | undefined;
    }
    nextDayTmstmp: number;
}