import { observer } from 'mobx-react-lite';
import { Fragment } from 'react';
import { Header,Grid} from "semantic-ui-react";
import { useStore } from '../../../app/stores/store';
import TableListItem from './TableListItem';

export default observer(function TableList() {
    const { tableStore } = useStore();
    const { groupedTables } = tableStore;


    return (
        <>
            {groupedTables.map(([group, tables]) => (
                <Grid key={group} columns={3} divided >
                    {tables.map(table => (
                        <TableListItem key={table.id} table={table} />
                    ))}
                </Grid>
            ))}
        </>

    )
})
