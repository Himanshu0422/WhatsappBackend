import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 8000;

app.get('/', (req, res)=>{
    res.send('You got something?')
});

app.post('/test', (req, res)=>{
    res.send('Finally got something!')
});

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});