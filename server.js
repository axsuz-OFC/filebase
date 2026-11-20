require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.static('public')); // ඔයාගේ index.html, style.css, script.js මේ folder එකේ තියන්න

// Supabase config
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Multer setup (memory storage)
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const file = req.file;
    // unique file name එකක් හදමු
    const fileName = `${Date.now()}-${file.originalname}`;

    // Supabase Storage එකට upload කරන්න
    const { data, error } = await supabase.storage
      .from('uploads') // Supabase එකේ 'uploads' කියලා bucket එකක් හදලා තියෙන්න ඕන
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) throw error;

    // Public URL එක ගන්න
    const { data: urlData } = supabase.storage
      .from('uploads')
      .getPublicUrl(fileName);

    res.json({ url: urlData.publicUrl });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Frontend එක serve කරන්න (static files)
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));