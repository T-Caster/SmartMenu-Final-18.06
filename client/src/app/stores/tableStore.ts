import { makeAutoObservable, runInAction } from "mobx";
import { Table, TableFormValues } from "../models/table";
import agent from "../api/agent";
import { v4 as uuid } from 'uuid';
import { format } from "date-fns";
import { store } from "./store";
import { Profile } from "../models/profile";
import { profileEnd } from "console";

export default class TableStore {
    tableRegistry = new Map<string, Table>();
    selectedTable: Table | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this)
    }
    get groupedTables(){
        return(
            Object.entries(
                this.tablesByDate.reduce((tables,table)=>{
                    const date = format(table.date!, 'dd MMM yyyy');
                    tables[date] = tables[date] ? [...tables[date],table] : [table];
                    return tables; 
                },{} as {[key:string]: Table[]})
            )
        )
    }

    get tablesByDate() {
        return Array.from(this.tableRegistry.values()).sort((a, b) =>
            a.date!.getTime() - b.date!.getTime());
    }

    loadTables = async () => {
        this.loadingInitial=true;
        try {
            const tables = await agent.Tables.list();
            tables.forEach(table => {
                this.setTable(table);
            })
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    loadTable = async (id: string) => {
        let table = this.getTable(id);
        if (table) {
            this.selectedTable = table;
            return table;
        }
        else {
            this.setLoadingInitial(true);
            try {
                table = await agent.Tables.details(id);
                this.setTable(table);
                runInAction(() => this.selectedTable = table);
                this.setLoadingInitial(false);
                return table;
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    private setTable = (table: Table) => {
        const user = store.userStore.user;
        if(user){
            table.isGoing = table.attendees!.some( 
                a => a.username === user.username
            )
            table.isHost = table.hostUsername === user.username;
            table.host = table.attendees?.find(x => x.username === table.hostUsername);
        }
        table.date = new Date(table.date!)
        this.tableRegistry.set(table.id, table);
    }

    private getTable = (id: string) => {
        return this.tableRegistry.get(id);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createTable = async (table: TableFormValues) => {
        const user = store.userStore.user;
        const attendee = new Profile(user!);
        try {
            await agent.Tables.create(table);
            const newTable = new Table(table);
            newTable.hostUsername = user?.username;
            newTable.attendees = [attendee];
            this.setTable(newTable);
            runInAction(() => {
                this.selectedTable = newTable;
            })
        } catch (error) {
            console.log(error);
        }
    }

    updateTable = async (table: TableFormValues) => {
        try {
            await agent.Tables.update(table)
            runInAction(() => {
                if(table.id){
                    let updatedTable = {... this.getTable(table.id),...table}
                    this.tableRegistry.set(table.id, updatedTable as Table);
                    this.selectedTable = updatedTable as Table;
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    deleteTable = async (id: string) => {
        this.loading = true;
        try {
            await agent.Tables.delete(id);
            runInAction(() => {
                this.tableRegistry.delete(id);
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })


        }
    }
//this is the method we need to update the attendance for a user
    updateAttendance = async() => {
        const user = store.userStore.user;
        this.loading = true;

        try {
            await agent.Tables.attend(this.selectedTable!.id)
            runInAction(() => {
                //We're going to remove the attendee object if they're cancelling their place
                if(this.selectedTable?.isGoing)
                {
                    this.selectedTable.attendees = 
                        this.selectedTable.attendees?.filter(a=> a.username !== user?.username)
                    this.selectedTable.isGoing = false;   
                } else {
                    // going to add an attendee object if they're joining an table
                    const attendee = new Profile(user!);
                    this.selectedTable?.attendees?.push(attendee);
                    this.selectedTable!.isGoing = true;
                }
                this.tableRegistry.set(this.selectedTable!.id, this.selectedTable!)
            })
        } catch (error) {
            console.log(error);
        }finally{
            runInAction(() => this.loading =false);
        }
    }
    cancelTableToggle = async () => {
        this.loading = true;
        try {
            await agent.Tables.attend(this.selectedTable!.id);
            runInAction(() => {
                this.selectedTable!.isCancelled = !this.selectedTable?.isCancelled;
                this.tableRegistry.set(this.selectedTable!.id, this.selectedTable!);
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }
    clearSelectedTable = () => {
        this.selectedTable = undefined;
    }
}