import { useState } from 'react';
import { useSelector } from 'react-redux';
import { TextField, List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton } from '@mui/material';
import { Message } from '../../redux/slices/chat.slice';  // action creators from Redux slices
import SendIcon from '@mui/icons-material/Send';
import Paper from '@mui/material/Paper';
import './chat.styles.css';

interface ChatProps {
    parentSendQuestion: (question: string) => void;
}

const Chat = (props: ChatProps) => {
    const messages = useSelector((state: any) => state.chat.messages);
    const [input, setInput] = useState('');
    const sendQuestion = () => {
        props.parentSendQuestion(input);
        setInput('');
    };

    return (
        <Paper className="chat-paper" elevation={3}>
            <List sx={{ flexGrow: 1, overflowY: 'auto', mb: 1 }}>
            {
                messages.map((msg: Message, idx: number) => (
                    <ListItem key={idx} alignItems="flex-start" 
                            sx={{ justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    <ListItemAvatar>
                        <Avatar sx={{ bgcolor: msg.role === 'user' ? 'primary.main' : 'secondary.main' }}>
                        {msg.role === 'user' ? '👩' : '🤖'}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                        primary={msg.text} 
                        primaryTypographyProps={{ 
                        align: msg.role === 'user' ? 'right' : 'left',
                        color: msg.role === 'user' ? 'text.primary' : 'secon</Avatar>dary.light'
                        }} 
                    />
                    </ListItem>
                ))
            }
            </List>
            <div style={{ display: 'flex' }}>
                <TextField 
                    fullWidth 
                    variant="outlined" 
                    placeholder="Ask a question..." 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    onKeyDown={(e) => { if(e.key === 'Enter') sendQuestion(); }} 
                />
                <IconButton color="secondary" onClick={sendQuestion} sx={{ ml: 1 }}>
                    <SendIcon />
                </IconButton>
            </div>
        </Paper>

        
    );
};

export default Chat;