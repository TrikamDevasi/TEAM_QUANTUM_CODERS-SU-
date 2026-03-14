import dotenv from 'dotenv';
dotenv.config();

import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`[SkillSense AI] Backend running on http://localhost:${PORT}`);
    console.log(`[SkillSense AI] API health: http://localhost:${PORT}/api/health`);
});
