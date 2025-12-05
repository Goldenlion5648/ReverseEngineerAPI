"use client"
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea"
import { useCallback, useState, useEffect } from "react";
import DropFileInput from "@/components/DropFileInput";
import { Button } from "@/components/ui/button";


export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [curlResult, setCurlResult] = useState('')
  const [apiDescription, setApiDescription] = useState('')
  const [isRequestActive, setIsRequestActive] = useState(false);

  const [copyClicked, setCopyClicked] = useState(false)

  const onFileChange = (newFile: File) => {
    setFile(newFile);
  }

  const runReverseAPI = async () => {
    setIsRequestActive(true)
    setCurlResult('')
    let fileText = await file?.text();
    console.log("sending request")
    const response = await fetch("http://localhost:8000/api/reverse-api",
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          har_data: fileText,
          api_description: apiDescription
        })
      }
    )
    const newCurlResult = await response.json()
    setIsRequestActive(false)
    setCurlResult(newCurlResult["response"].replaceAll(" -H ", "\\\n  -H "))

  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-black dark:to-zinc-900 font-sans">
      <main className="w-full max-w-3xl rounded-3xl bg-white/80 dark:bg-zinc-950/70 backdrop-blur-xl shadow-2xl p-10 sm:p-14">
        <div className="flex flex-col items-center sm:items-start gap-8">

          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 text-center sm:text-left">
            Upload your .har file below:
          </h1>

          <div className="w-full">
            <DropFileInput
              onFileChange={(files) => onFileChange(files)}
            />
          </div>

          <Textarea
            placeholder="Describe the API you want to reverse engineer."
            onChange={(e) => setApiDescription(e.target.value)}
            className="w-full rounded-xl border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 shadow-sm focus:ring-2 focus:ring-red-400/40 focus:border-red-400 transition"
          />
          
          {
            (file != null && apiDescription != '' && isRequestActive == false) ? (<Button
              onClick={runReverseAPI}
              color="red"
              aria-label="Submit"
              className="rounded-xl px-6 py-3 text-lg font-medium shadow-md hover:shadow-lg transition active:scale-95"
            >
              Get curl command
            </Button>) : (<Button
              aria-label="Submit"
              disabled
              className="
                rounded-xl px-6 py-3 text-lg font-medium 
                bg-zinc-400 dark:bg-zinc-700 
                text-white
                shadow-none
                opacity-60
                cursor-not-allowed
                flex items-center gap-2
              "
            >
              Get curl command
            </Button>
            )
          }
          {isRequestActive === true && (
            <p>
              Request received!
            </p>
          )}
          {
            curlResult !== '' && (
              <div className="w-full mt-8">
                <label className="block mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Generated cURL Command:
                </label>

                <div className="
                      relative
                      rounded-lg
                      bg-zinc-900 text-zinc-100
                      dark:bg-zinc-800
                      p-4
                      font-mono text-sm
                      shadow-md
                      overflow-x-auto    // horizontal scroll for long lines
                      max-h-[400px]      // optional max height to prevent excessive growth
                      overflow-y-auto    // vertical scroll if max height is exceeded
                      wrap-break-word        // wrap long words if needed
                      whitespace-pre-wrap
                    ">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(curlResult)
                      setCopyClicked(true)
                    }}
                    className="
                      sticky top-2 right-2
                      z-10
                      text-xs
                      px-2 py-1
                      rounded-md
                      bg-zinc-700 hover:bg-zinc-600
                      transition
                      text-white
                      float-right
                    "
                  >
                    {copyClicked ? "Copied!" : "Copy"}
                  </button>

                  {curlResult}
                </div>
              </div>
            )
          }


        </div>
      </main>
    </div>

  );
}
