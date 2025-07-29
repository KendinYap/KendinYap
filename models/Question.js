import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  questionText: String,
  category: String,
  createdAt: { type: Date, default: Date.now },
  aiAnswer: String,
  solved: { type: Boolean, default: false },
});

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema);
