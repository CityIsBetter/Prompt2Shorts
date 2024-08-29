# Prompt2Shorts

**Prompt2Shorts** is an innovative application that generates short-form content by transforming prompts into full scripts, voice-over audio, and relevant videos. Designed for creators who want to quickly produce engaging content, Prompt2Shorts integrates advanced AI and APIs to automate the creation process.

## Features

- **Script Generation:** Utilizes Nous: Hermes 3 AI to convert prompts into well-structured scripts.
- **Voice Over Audio:** Generates high-quality voice-over audio using Express Voic AI.
- **Video Retrieval:** Fetches relevant video clips from Pexels API based on the generated script.
- **Video Editing:** Provides an editing interface for users to customize and compile their final video with transitions and captions.

## Technologies Used

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Script Generation:** Nous: Hermes 3 AI
- **Audio Generation:** Express Voic AI
- **Video Retrieval:** Pexels API

## Usage Example
![screenshot](./public/ss.png)
## Getting Started

### Prerequisites

- Node.js
- Yarn or npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/CityIsBetter/Prompt2Shorts.git
   cd Prompt2Shorts
   ```

2. Install dependencies:

   ```bash
   yarn install
   # or
   npm install
   ```

3. Create a `.env` file in the root directory and add your API keys:

   ```env
   NEXT_PUBLIC_OPENROUTER_API_TOKEN=your_openrouter_api_token
   NEXT_PUBLIC_PLAY_SECRET=your_play_ht_secret
   NEXT_PUBLIC_PLAY_USER_ID=your_play_ht_user_id
   NEXT_PUBLIC_RAPIDAPI_KEY=your_rapidapi_key
   ```

4. Start the development server:

   ```bash
   yarn dev
   # or
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000` to see the app in action.

## Usage

1. **Enter Prompt:** Input a prompt to generate a script.
2. **Script Generation:** The AI generates a script based on the provided prompt.
3. **Voice Over:** The app generates a voice-over audio file for the script.
4. **Video Retrieval:** Fetches and displays relevant video clips based on the script.

## API Integration

### Nous: Hermes 3 AI

Used for generating scripts from prompts. I used this model using OpenRouter API. Ensure you have the API key and endpoint configured in your `.env` file.

### Express Voic AI

Generates voice-over audio from scripts. I used this model using RapidAPI API. API key and endpoint should be set in the `.env` file. Check out Play HT text-to-speech AI, it is more realistic but the freeium version has very less credits.

### Pexels API

Fetches video clips relevant to the generated script. API key must be included in the `.env` file.

## Future Additions

- **More Video Options:** Integrate additional video sources for a wider variety of content.
- **Final Video Compilation:** Automatically compile the final video with synchronized audio, video clips, and captions.
- **Advanced Video Editor:** Implement a robust video editor allowing users to manually adjust video clips, add effects, and fine-tune their final content.

## Contributing

We welcome contributions to improve Prompt2Shorts! Please fork the repository and submit a pull request. Ensure that your code adheres to the existing style and includes tests where applicable.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

Thank you for using Prompt2Shorts!
