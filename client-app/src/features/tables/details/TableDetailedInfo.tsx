import { observer } from 'mobx-react-lite';
import React from 'react'
import {Segment, Grid, Icon} from 'semantic-ui-react'
import {Table} from "../../../app/models/table";
import { format } from "date-fns";


interface Props {
    table: Table
}

export default observer(function TableDetailedInfo({table}: Props) {
    return (
        <Segment.Group>
            <Segment attached='top'>
                <Grid>
                    <Grid.Column width={1}>
                        <Icon size='large' color='teal' name='info'/>
                    </Grid.Column>
                    <Grid.Column width={15}>
                        <p>description</p>
                    </Grid.Column>
                </Grid>
            </Segment>
            <Segment attached>
                <Grid verticalAlign='middle'>
                    <Grid.Column width={1}>
                        <Icon name='calendar' size='large' color='teal'/>
                    </Grid.Column>
                    <Grid.Column width={15}>
            <span>
              {format(table.date!, 'dd MMM yyy h:mm aa')}
            </span>
                    </Grid.Column>
                </Grid>
            </Segment>
            <Segment attached>
                <Grid verticalAlign='middle'>
                    <Grid.Column width={1}>
                        <Icon name='marker' size='large' color='teal'/>
                    </Grid.Column>
                    <Grid.Column width={11}>
                        <span>Nazareth</span>
                    </Grid.Column>
                </Grid>
            </Segment>
        </Segment.Group>
    )
})
