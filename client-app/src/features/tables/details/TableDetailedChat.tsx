import { Formik, Form, Field, FieldProps } from 'formik';
import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Segment, Header, Comment, Loader, Dropdown } from 'semantic-ui-react'
import MyTextArea from '../../../app/common/form/MyTextArea';
import { useStore } from '../../../app/stores/store';
import * as Yup from 'yup';
import { formatDistanceToNow } from 'date-fns';
import { Table } from '../../../app/models/table';

interface Props {
    tableId: string;
    table : Table;
}

export default observer(function ActivityDetailedChat({ tableId,table }: Props) {
    const { commentStore } = useStore();
    const[value,setValue] = useState('');
    const options = [
        {
          label: "Apple",
          value: "apple",
        },
        {
          label: "Mango",
          value: "mango",
        },
        {
          label: "Banana",
          value: "banana",
        },
        {
          label: "Pineapple",
          value: "pineapple",
        },
      ];
      function handleSelect(event: { target: { value: React.SetStateAction<string>; }; }) {
        setValue(event.target.value)
      }

useEffect(() => {
    if (tableId) {
        commentStore.createHubConnection(tableId);
    }
    return () => {
        commentStore.clearComments();
    }
}, [commentStore, tableId]);

return (
<>
    <Segment
        textAlign='center'
        attached='top'
        inverted
        color='teal'
        style={{ border: 'none' }}
    >
    <Header>Orders</Header>
    </Segment>
    <Segment attached clearing>
        <Formik
            onSubmit={(values, { resetForm }) =>
                commentStore.addComment(values).then(() => resetForm())}
            initialValues={{ body: '' }}
            validationSchema={Yup.object({
                body: Yup.string().required()
            })}
        >
    {({ isSubmitting, isValid, handleSubmit }) => (
    <Form className='ui form'>
        <Field name='body'>  
            {(props: FieldProps) => (
                <div style={{ position: 'relative' }}>
                    <Loader active={isSubmitting} />
                    <textarea
                        placeholder='Enter your comment (Enter to submit, SHIFT + Enter for new line)'
                        rows={2}
                        {...props.field }
                        onKeyPress={e => {
                            if(table.isGoing) {
                                if (e.key === 'Enter' && e.shiftKey) {
                                    return;
                                }
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    isValid && handleSubmit();
                                }
                            }                                                                                       
                        }}
                    />
                </div>
            )}
        </Field>
    </Form>
            )}
        </Formik>
        <Comment.Group>
            {commentStore.comments.map(comment => (
                <Comment key={comment.id}>
                    <Comment.Avatar src={comment.image || '/assets/user.png'} />
                    <Comment.Content>
                        <Comment.Author as={Link} to={`/profiles/${comment.username}`}>{comment.displayName}</Comment.Author>
                        <Comment.Metadata>
                            <div>{formatDistanceToNow(comment.createdAt)} ago</div>
                        </Comment.Metadata>
                        <Comment.Text style={{ whiteSpace: 'pre-wrap' }}>{comment.body}</Comment.Text>
                    </Comment.Content>
                </Comment>
            ))}
        </Comment.Group>
    </Segment>

    <Segment
        textAlign='center'
        attached='top'
        inverted
        color='blue'
        style={{ border: 'none' }}
    >
    <Header>Requests</Header>
    </Segment>
    <Segment attached clearing>
        <Formik
            onSubmit={(values, { resetForm }) =>
                commentStore.addComment(values).then(() => resetForm())}
            initialValues={{ body: '' }}
            validationSchema={Yup.object({
                body: Yup.string().required()
            })}
        >
            {({ isSubmitting, isValid, handleSubmit }) => (
                <Form className='ui form'>
                <Field name='body'>  
                {(props: FieldProps) => (                          
                    <div style={{ position: 'relative' }}>
                     <select onChange={handleSelect}>
                        {options.map((option) => (
                            <option value={option.value}>{option.label}</option>
                        ))}
                        
                    </select>
                   
                    <textarea 
                                                            
                        
                        {...props.field}
                        onKeyPress={e => {
                            if(table.isGoing) {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    isValid && handleSubmit();
                                }
                            }                                                                                       
                        }}
                    > 
                    </textarea>                                   
                    </div>
                )}
                </Field>
                </Form>
            )}
        </Formik>
        
    </Segment>



    </>

    )
})