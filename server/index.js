const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());


mongoose.connect('mongodb+srv://AdarshKumar:7903848803@cluster0.bpglqqv.mongodb.net/telegramData', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const initDataSchema = new mongoose.Schema({
  id: Number,
  title: String,
  user: Object,
  receiver: Object,
  chat: Object,
  timestamp: { type: Date, default: Date.now },
});


const InitData = mongoose.model('InitData', initDataSchema);


app.post('/api/store', async (req, res) => {
  try {
    console.log('Received Data:', req.body);

    const newData = new InitData(req.body);
    await newData.save();
    
    console.log('Data successfully saved to MongoDB:', newData);

    res.status(201).json({ message: 'Data saved successfully', data: newData });
  } catch (error) {
    console.error('Error saving data:', error); 
    res.status(500).json({ error: 'Failed to save data' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
