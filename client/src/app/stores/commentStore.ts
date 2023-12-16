import { makeAutoObservable, runInAction } from "mobx";
import { ChatComment } from "../../../../API/models/comment";
import { store } from "./store";
import io, {Socket} from 'socket.io-client';

export default class CommentStore {
    comments: ChatComment[] = [];
    socket: Socket | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    createHubConnection = (tableId: string) => {
        const token = store.commonStore.token;
        if (!token) {
            console.error('User token is not available');
            return;
        }
    
        this.socket = io(`http://localhost:5000`, {
            auth: {
                token            
            }
        });
    
        if (this.socket) {
            this.socket.on('connect', () => {
                console.log('Connected to server');
                this.socket?.emit('joinTable', tableId);
            });

            this.socket.on('loadComments', (loadedComments: ChatComment[]) => {
                runInAction(() => {
                    this.clearComments()
                    this.comments = loadedComments
                });
            });
    
            this.socket.on('receiveComment', (comment: ChatComment) => {
                runInAction(() => {
                    this.comments.unshift(comment);
                    console.log(comment);
                });
            });
        }
    }

    stopHubConnection = () => {
        this.socket?.disconnect();
    }

    clearComments = () => {
        this.comments = [];
        this.stopHubConnection();
    }

    addComment = async (values: any) => {
        values.tableId = store.tableStore.selectedTable?.id;
        if (this.socket) { // Check if socket is not null
            this.socket.emit('sendComment', values.tableId, values);
        }
    }
}
