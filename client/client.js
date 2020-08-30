const socket = io("http://localhost:3000");

const username = prompt("Please enter a username:");
socket.emit("username", username);

function startGame() {
socket.emit("start_game");
document.getElementById("gameplay").style.display = "block";
}

function writeLine() {
let input = document.getElementById("input_line");
socket.emit("write_line", input.value);
input.value = "";
}

socket.on("users", (users) => {
document.getElementById("users").textContent = "Current Users: " + users;
})

socket.on("game_state", (state_json) => {
let state = JSON.parse(state_json);
console.log("state: " + state.debug);

if (state.ended) {
    document.getElementById("round").textContent = `Game ended. Check out your stories below!`;
} else {
    document.getElementById("round").textContent = `Round ${state.round} of ${state.totalRounds}`;
}

if (state.prevLine != null) {
    document.getElementById("prev_line").textContent = `Previous line: ${state.prevLine.line}`;
}

if (state.waiting) {
    document.getElementById("waiting").textContent = `Waiting for other users to submit lines...`;
} else {
    document.getElementById("waiting").textContent = "";
}
})

socket.on("game_end", (stories_json) => {
let stories = JSON.parse(stories_json);
console.log(stories);
let stories_lines = stories.map(story => story.lines.map(line => line.line).join("\n")).join("\n\n");
document.getElementById("stories").textContent = stories_lines;
})
