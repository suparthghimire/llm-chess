# ♚ Gemini Plays Chess

♟️ Play chess vs Google Gemini LLM

---

## Tech Stack
- 📐 Framework: NextJS
- 🔠 Language: Typescript
- 🕶️ Styling: Tailwind
- 🤖 LLM: gemini-1.5-flash

---

## Local Setup
- Clone the repo
```bash
git clone
```
- Add .env to server and provide valid values
```bash
cp .env.example .env
```
- Install Dependencies
### Build and Start
```bash
pnpm install
```
- Build the app
```bash
pnpm run build
```
- Start the app
```bash
pnpm start
```

### Dev Env
- Start dev server
```bash
pnpm run dev
```

---

## How does this work?

Here is a sequence describing how the app functions:

**Note**
Human player plays as White and AI (Google Gemini) plays as black. Currently there is no option to play as black as a human. There is no time limit on how long any player can take to play a move. 

1. Human Player plays a move by dragging a piece on board. This generates a [PGN notation](https://en.wikipedia.org/wiki/Portable_Game_Notation) of moves.
2. This notation is sent to api.
3. API creates its own version of the chess game, and generates a prompt for gemini. You can read about prompt generation below in prompt engineering section
4. The generated prompt is sent to Gemini which then sends a PGN response back with a new move.
5. Sometimes Gemini responds with extra characters like * in response. This is cleaned before proceeding to next step.
5. The response from Gemini can be incorrect, this various checks are done to ensure correct move is played.
   a. First, the PGN sent from gemini is validated to be correct.
   b. If the response is incorrect, then system asks gemini for 1 more time to rectify its mistakes. 
   c. If the new response is valid, then proceeds to next step else app returns a random playable move.
6. After getting a valid PGN notation from gemini, app checks if the LLM made correct amount of moves (1 more than the total moves after human played)
7. If number of moves is more than 1 then all other moves are undone and only 1 extra move is added to PGN history.
8. If number of moves are less than 1, then a random playable move is played and PGN history is returned.
10. After all these, final check for correct PGN is done. If PGN is valid, it is retuened else a random move is played and returned.

## Prompt Engineering
The prompt for the LLM is faily simple. The start of prompt has a context about who the LLM is supposed to be, i.e. A chess grandmaster. It then follows with providing the PGN notation to LLM.  Then, a check is done to  see if any black piece is under attack. In that case, New sentence is added to notify LLM about threats to a piece by various other pieces. The threat is provided for only 1 piece based on order of importance, i.e. **K > Q > R > B > N > P**.

> The prompt has a sentence at the end which is always appended to any dynamically generated prompt sentences. This sentence adds a context to only send response in PGN format, not to append or prepend any extra text. LLM might still add new characters sometimes, which will be handled by cleaning functions.

**Here is an example prompt sent:**
*You are a chess grand master. You will be given a game of history of moves in PGN format. You will play as BLACK. You need to respond your next move in PGN notation. Make sure the move is valid, the PGN notation is valid and you are not making an illegal move. IF THE PGN MOVE HISTORY IS EMPTY, IT MEANS YOU NEED TO START THE GAME WITH A MOVE. Here are the history of moves in the match in PGN notation: '1. e4 c5 2. Bb5 a6 3. Bc4 e6 4. Bxe6'. YOUR PAWN AT SQUARE 'f7' IS UNDER ATTACK FROM FOLLOWING: ' Bishop at square e6,'. MAKE SURE THE PAWN IS PROTECTED BY OTHER PIECE. IF NOT, PROTECT THE PAWN BY ANOTHER PIECE SO THAT THE POINT WILL BE SAME AND YOU WILL NOT BE AT A DISADVANTAGE. WHAT IS YOUR NEXT MOVE? ONLY MAKE ONE MOVE AND REPLY WITH FULL PGN HISTORY UPTO YOUR NEXT MOVE. DONT APPEND OR PREPENT ANY EXTRA TEXT TO PGN STRING"*

### Possible Improvements
We can add extra guards to check for various elements like adding the guideline of **Checks, captures, and threats** which basically means: `When you look for your next move, consider checks, captures, and threats`. The first part of this is done as checks is checked when checking for threats for King. The third guideline is also acknowledged by same method. An addition to check for any safe captures can be helpful to guide the model for better move selection.

✅  If you have any suggestion, please feel free to mention it in [Issues Tab](https://github.com/suparthghimire/llm-chess/labels) with the label `Prompt Improvement`. 

❗ Also do create issues for any bugs you find. You might send a PR fixing those bugs as well. That would be very much appreciated.

---

⭐⭐ Don't forget to star the repository! ⭐⭐

