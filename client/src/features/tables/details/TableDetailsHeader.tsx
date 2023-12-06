import { observer } from 'mobx-react-lite';
import React from 'react'
import { Link } from 'react-router-dom';
import {Button, Header, Item, Segment, Image, Label} from 'semantic-ui-react'
import {Table} from "../../../app/models/table";
import { format } from "date-fns";
import { useStore } from '../../../app/stores/store';


const tableImageStyle = {
    filter: 'brightness(30%)'
};

const tableImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

interface Props {
    table: Table
}

export default observer (function TableDetailedHeader({table}: Props) {
    const {tableStore:{updateAttendance,loading,cancelTableToggle}} = useStore();
    return (
        <Segment.Group>
            <Segment basic attached='top' style={{padding: '0'}}>
                {table.isCancelled && 
                    <Label style={{position:'absolute', zIndex:1000, left:-14, top:20}}
                         ribbon color='red' content='Cancelled' />
                }
                <Image src={`/assets/categoryImages/sale.jpg`} fluid style={tableImageStyle}/>
                <Segment style={tableImageTextStyle} basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={table.number}
                                    style={{color: 'white'}}
                                />
                                <p>{format(table.date!, 'dd MMM yyyy')}</p>
                                <p>
                                    Opened by <strong><Link to={`/profile/${table.host?.username}`}>{table.host?.displayName}</Link></strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached='bottom'>
                {table.isHost ? (
                    <>
                        <Button
                            color={table.isCancelled ? 'green' : 'red'}
                            floated='left'
                            basic
                            content={table.isCancelled ? 'Re-Open Table' : 'Cancel table'}
                            onClick={cancelTableToggle}
                            loading={loading}
                        />
                        <Button as={Link}
                            disabled ={table.isCancelled}
                            to={`/manage/${table.id}`}
                            color='orange'
                            floated='right'>
                            Manage Table
                        </Button>
                    </>
                    
                ) : table.isGoing ? (
                    <Button loading={loading} onClick={updateAttendance}>Cancel attendance</Button>
                ) : (
                    <Button 
                        disabled ={table.isCancelled}
                        loading={loading} onClick={updateAttendance} 
                        color='teal'>Join Table
                    </Button>
                )}        
            </Segment>
        </Segment.Group>
    )
})
