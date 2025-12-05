# Running the project

`cd` to `backend`, then create a file .env file and add this to it: 

```
OPENAI_API_KEY=your_open_ai_key
```

Editing `your_open_ai_key` with your api key 


then run
```
fastapi dev main.py
```

In another terminal, `cd ..`, then `cd frontend` and run
```
npm run dev
```

Open [http://localhost:3000/](http://localhost:3000/) to use the app
