import { Link } from 'react-router-dom';
import { Button, Icon, Item, Label, Segment } from 'semantic-ui-react';
import { Table } from '../../../app/models/table';
import React from 'react';
import { format } from "date-fns";
import TableListItemAtendee from './TableListItemAtendee';
interface Props {
    table : Table
}
export default function TableListItem({table}:Props) {
//this file for display the table image and details from the home screen
    return (
       <Segment.Group>
        <Segment>
            {table.isCancelled &&
                <Label attached='top' color='red' content='Cancelled' style={{textAlign:'center'}} />
            }
            <Item.Group>
                <Item>
                    <Item.Image style={{marginBottom:3}} size='tiny' circular 
                        src={table.host?.image || '/assets/user.png'}/>
                    <Item.Content>
                        <Item.Header as={Link} to={`/tables/${table.id}`}>
                            {table.number}
                            </Item.Header>
                            <Item.Description style={{width:'90%'}}>Table Opened By <Link to={`/profiles/${table.hostUsername}`}>{table.host?.displayName}</Link></Item.Description>
                            {table.isHost && ( 
                                <Item.Description style={{width:'100%'}}>
                                    <Label basic color='orange'>
                                        You are Opened this table
                                    </Label>
                                </Item.Description>
                            )}
                            {table.isGoing && !table.isHost && ( 
                                <Item.Description>
                                    <Label basic color='green'>
                                        You are inside this table
                                    </Label>
                                </Item.Description>
                            )}
                    </Item.Content>
                </Item>
            </Item.Group>
        </Segment>
        <Segment>
            <span>
                <Icon name='clock'/>{format(table.date!, 'dd MMM yyyy h:mm aa')}
                <Icon name='marker'/>
            </span>
        </Segment>
        <Segment secondary>
             <TableListItemAtendee attendees = {table.attendees!}/>
        </Segment>
        <Segment clearing>
            <span>description here</span>
            <Button 
                as={Link} to={`/tables/${table.id}`}
                color='teal'
                floated='right'
                content='View'
                
                />
        </Segment>
       </Segment.Group>
    )
}