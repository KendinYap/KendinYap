import { Configuration, OpenAIApi } from 'openai';
import connectToDatabase from '../../lib/db';
import Question from '../../models/Question';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { questionText, category } = req.body;

  if (!questionText) return res.status(400).json({ error: 'Soru boş olamaz' });

  try {
    await connectToDatabase();

    // AI’den cevap al
    const completion = await openai.createChatCompletion({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Sen bir teknik tamir asistanısın. Kısa ve faydalı cevaplar ver.' },
        { role: 'user', content: questionText },
      ],
    });

    const aiAnswer = completion.data.choices[0].message.content;

    // Veritabanına kaydet
    const question = new Question({
      questionText,
      category,
      aiAnswer,
    });
    await question.save();

    res.status(200).json({ aiAnswer, questionId: question._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
}
