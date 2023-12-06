import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Grid, GridRow } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import TableList from "./TableList";

export default observer(function TableDashboard() {
    const {tableStore} = useStore();
    const {loadTables, tableRegistry} = tableStore;

    useEffect(() => {
        if (tableRegistry.size <= 1) loadTables();
    }, [loadTables])
  
    if (tableStore.loadingInitial) return <LoadingComponent content='Loading tables...' />
    
    return (
        <Grid columns={3} divided>  
            <Grid.Row >            
                    <TableList />
            </Grid.Row>          
        </Grid>
    )
})