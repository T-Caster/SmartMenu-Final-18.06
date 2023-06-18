import { Profile } from "./profile";

export interface Table {
    id: string;
    date: Date | null;
    number:number;
    hostUsername?:string;
    isCancelled?:boolean;
    isGoing:boolean;
    isHost:boolean;
    host?:Profile;
    attendees:Profile[];
}
export class Table implements Table {
    constructor(init?:TableFormValues){
     Object.assign(this, init);   
    }
}
export class TableFormValues{
    id?: string = undefined;
    number:number = 0;
    date: Date| null = null;

    constructor(table?: TableFormValues){
        if(table) {
            this.id = table.id;
            this.date = table.date;
            this.number = table.number;
        }
    }
}