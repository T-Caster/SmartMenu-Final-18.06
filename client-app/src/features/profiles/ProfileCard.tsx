import React from 'react';
import { Profile } from '../../app/models/profile';
import { Card, Icon, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

interface Props {
    profile:Profile;
}
export default function ProfileCard({profile} : Props){
    return(
        <Card as={Link} to={`/profiles/${profile.username}`}>
            <Image src={profile.image || '/asstes/user.png'} />
            <Card.Content>
                <Card.Header>{profile.displayName}</Card.Header>
                <Card.Description>Bio</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Icon name='user'/>
                
            </Card.Content>
        </Card>
    )
}