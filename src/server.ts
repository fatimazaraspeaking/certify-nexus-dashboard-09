
import express from 'express';
import cors from 'cors';
import { feedbackMiddleware } from './middleware';

const app = express();

app.use(cors());
app.use(express.json());

// Feedback endpoint
app.post('/api/feedback', feedbackMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
