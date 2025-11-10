import { useState, useEffect, useRef } from "react";

const useSpeechRecognition = () => {
      const [listening, setListening] = useState(false);
      const [transcript, setTranscript] = useState("");
      const [error, setError] = useState(null);
      const recognitionRef = useRef(null);

      useEffect(() => {
            if (!("webkitSpeechRecognition" in window)) {
                  setError("Speech recognition not supported in this browser");
                  return;
            }

            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = false; // listen for one sentence at a time
            recognition.interimResults = true;
            recognition.lang = "en-US";

            recognition.onstart = () => setListening(true);
            recognition.onend = () => setListening(false);
            recognition.onerror = (event) => setError(event.error);

            recognition.onresult = (event) => {
                  let finalTranscript = "";
                  for (let i = event.resultIndex; i < event.results.length; i++) {
                        finalTranscript += event.results[i][0].transcript;
                  }
                  setTranscript(finalTranscript);
            };

            recognitionRef.current = recognition;
      }, []);

      const startListening = () => {
            try {
                  recognitionRef.current?.start();
            } catch (err) {
                  console.warn("Recognition already started", err);
            }
      };

      const stopListening = () => {
            recognitionRef.current?.stop();
      };

      return { transcript, listening, error, startListening, stopListening };
};

export default useSpeechRecognition;


// import { useEffect, useRef, useState } from "react";

// /**
//  * useSpeechToText
//  * - Uses the browser Web Speech API (webkitSpeechRecognition fallback)
//  * - Returns: { transcript, listening, startListening, stopListening, error }
//  *
//  * Note: Works in Chrome/Edge/etc. `window.webkitSpeechRecognition` fallback is used.
//  */
// export default function useSpeechToText({ interim = true, continuous = false, lang = "en-US" } = {}) {
//       const recognitionRef = useRef(null);
//       const [listening, setListening] = useState(false);
//       const [transcript, setTranscript] = useState("");
//       const [error, setError] = useState(null);

//       useEffect(() => {
//             const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//             if (!SpeechRecognition) {
//                   setError("Browser does not support Speech Recognition API.");
//                   return;
//             }

//             const recognition = new SpeechRecognition();
//             recognition.interimResults = interim;
//             recognition.continuous = continuous;
//             recognition.lang = lang;

//             recognition.onresult = (event) => {
//                   // Build transcript from all results (interim + final)
//                   let interimTranscript = "";
//                   for (let i = event.resultIndex; i < event.results.length; i++) {
//                         interimTranscript += event.results[i][0].transcript;
//                   }
//                   setTranscript(prev => {
//                         // if continuous false, we replace; if continuous true we append
//                         return continuous ? prev + " " + interimTranscript : interimTranscript;
//                   });
//             };

//             recognition.onerror = (e) => {
//                   console.error("Speech recognition error", e);
//                   setError(e.error || "speech_error");
//                   setListening(false);
//             };

//             recognition.onend = () => {
//                   setListening(false);
//             };

//             recognitionRef.current = recognition;

//             // cleanup
//             return () => {
//                   try {
//                         recognition.onresult = null;
//                         recognition.onend = null;
//                         recognition.onerror = null;
//                         recognitionRef.current && recognitionRef.current.stop();
//                   } catch (e) { }
//             };
//       }, [interim, continuous, lang]);

//       const startListening = () => {
//             const r = recognitionRef.current;
//             if (!r) {
//                   setError("Speech Recognition not available");
//                   return;
//             }
//             setTranscript(""); // fresh start
//             try {
//                   r.start();
//                   setListening(true);
//                   setError(null);
//             } catch (e) {
//                   // start() can throw if already started — ignore
//                   console.warn("start() error:", e);
//             }
//       };

//       const stopListening = () => {
//             const r = recognitionRef.current;
//             if (!r) return;
//             try {
//                   r.stop();
//             } catch (e) {
//                   console.warn("stop() error:", e);
//             }
//             setListening(false);
//       };

//       return { transcript, listening, error, startListening, stopListening, setTranscript };
// }
