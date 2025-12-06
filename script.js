const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const saveBtn = document.getElementById("save-btn");
const textArea = document.getElementById("text-area");
const noteList = document.getElementById("notes-list");
const statusText = document.getElementById("status-text");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.interimResults = false;
recognition.lang = "en-IN";

let savedNotes = [];

function loadNotes(){
    const notesFromStorage = localStorage.getItem("notes");
    if(notesFromStorage){
        savedNotes = JSON.parse(notesFromStorage);
        savedNotes.forEach(note => {
            const li = document.createElement("li");
            li.textContent = note;
            noteList.appendChild(li);
        });
    }
}
loadNotes();

recognition.onresult = (e) => {
    console.log("SPEECH RESULT:", e.results);
    const latest = e.results[e.results.length - 1];
    if (latest.isFinal) {
        textArea.value += latest[0].transcript + " ";
    }
};

recognition.onerror = (e) => {
    console.log("ERROR ->", e.error);
};

startBtn.addEventListener("click", () => {
    console.log("START button clicked");
    recognition.start();
    startBtn.disabled = true;
    stopBtn.disabled = false;
    statusText.textContent = "🟢 Listening...";
    statusText.style.color = "green";
});

stopBtn.addEventListener("click", () => {
    recognition.stop();
    startBtn.disabled = false;
    stopBtn.disabled = true;
    statusText.textContent = "🔴 Not Listening";
    statusText.style.color = "red";
});

saveBtn.addEventListener("click", () => {
    const note = textArea.value.trim();
    if (!note){
        alert("Write or speak something before saving.");
        return;
    } 
    const li = document.createElement("li");
    li.textContent = note;
    noteList.appendChild(li);
    savedNotes.push(note);
    localStorage.setItem("notes", JSON.stringify(savedNotes));
    textArea.value = "";
});