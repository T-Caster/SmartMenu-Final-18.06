import { HubConnection } from "@microsoft/signalr";
import { ChatRequest } from "../models/request";
import { makeAutoObservable } from "mobx";

export default class RequestStore{
    requests: ChatRequest[] = [];
    hubCommection: HubConnection | null = null;

    constructor(){
        makeAutoObservable(this);
    }


    
}