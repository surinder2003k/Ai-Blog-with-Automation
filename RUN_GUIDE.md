# AI Blog - Project Run Guide 🚀

Bhai, is guide ko follow kar aur tera project ekdum mast chalega.

## 1. Prerequisites (Zaroori cheezein)
*   **Node.js**: Tere system mein Node installed hona chahiye.
*   **VS Code**: Code dekhne aur terminal chalane ke liye.

## 2. Setup Process

### Step A: Dependencies Install Karien
Pahle terminal khol aur ye command chala (agar pehle nahi kiya):
```bash
npm install
```

### Step B: Environment Variables Check Karien
Maine `.env.local` file pehle se set kar di hai. Isme:
*   **Clerk**: Auth ke liye.
*   **MongoDB**: Data save karne ke liye.
*   **Groq**: AI generation ke liye.

### Step C: MongoDB Whitelisting (Most Important!)
Agar project connect nahi ho raha, toh:
1.  [MongoDB Atlas](https://cloud.mongodb.com/) par login kar.
2.  **Network Access** mein jaa.
3.  **Add IP Address** click kar aur `0.0.0.0/0` add kar de (ya apna current IP).

## 3. Project Run Kaise Karein?

Terminal mein bas ye command chala:
```bash
npm run dev
```

Ab browser mein is link ko open kar:
👉 **[http://localhost:3000](http://localhost:3000)**

## 4. Dashboard Aur AI Features
*   **Login**: `/sign-in` par jaakar account bana ya login kar.
*   **Create Post**: Dashboard mein jaakar "Create Post" select kar.
*   **AI generation**: Prompt daal aur "Generate with AI" button daba.

---
**Kuch issue aaye toh terminal check karna ya mujhse puchna!**
