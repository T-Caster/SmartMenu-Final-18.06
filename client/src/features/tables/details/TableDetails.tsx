import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {Grid} from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from '../../../app/stores/store';
import TableDetailedChat from "./TableDetailedChat";
import TableDetailedInfo from "./TableDetailedInfo";
import TableDetailedSidebar from "./TableDetailedSidebar";
import TableDetailedHeader from "./TableDetailsHeader";

export default observer(function TableDetails() {
    const {tableStore} = useStore();
    const {selectedTable: table, loadTable, loadingInitial, clearSelectedTable} = tableStore;
    const {id} = useParams();

    useEffect(() => {
        if (id) loadTable(id);
        return() => clearSelectedTable();
    }, [id, loadTable,clearSelectedTable])

    if (loadingInitial || !table) return <LoadingComponent />;

    return (
        <Grid>
            <Grid.Column width={10}>
                <TableDetailedHeader table={table}/>
                <TableDetailedInfo table={table}/>
                <TableDetailedChat tableId={table.id} table={table}/>
            </Grid.Column>
            <Grid.Column width={6}>
                <TableDetailedSidebar table ={table}/>
            </Grid.Column>
        </Grid>
    )
})