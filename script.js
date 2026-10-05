/* =========================================================================
   WEB DICE ROLLER SCRIPT
   All random numbers come from the remote Node.js RESTful API.
   On page load the server is woken up asynchronously and the dice are rolled.
   ========================================================================= */

// ---------- Configuration ----------
// Change this to the URL of your Azure Node.js server after deploying it (no trailing slash).
// Use http://localhost:3000 when running the server on your own computer.
const API_BASE_URL = 'https://abdul-dice-roller-api-hwd6gbdsbvcjfuhe.westus3-01.azurewebsites.net'

// ---------- Element references ----------
const dieFields = [
	document.getElementById('die1'),
	document.getElementById('die2'),
	document.getElementById('die3'),
	document.getElementById('die4'),
	document.getElementById('die5')
]

const totalField = document.getElementById('total')
const rollButton = document.getElementById('rollButton')
const resetButton = document.getElementById('resetButton')
const corsButton = document.getElementById('corsButton')
const serverStatus = document.getElementById('serverStatus')
const messageStatus = document.getElementById('messageStatus')

// ---------- Status messages ----------
function showServerStatus(text, isError) {
	serverStatus.textContent = text
	serverStatus.className = isError ? 'status-error' : ''
}

function showMessage(text, isError) {
	messageStatus.textContent = text
	messageStatus.className = isError ? 'status-error' : ''
}

// ---------- wakeServer() ----------
// Asynchronously calls a remote API so a sleeping Azure server starts up.
async function wakeServer() {
	showServerStatus('Server: waking up...', false)
	try {
		const response = await fetch(`${API_BASE_URL}/api/wake`)
		if (!response.ok) {
			throw new Error(`HTTP status ${response.status}`)
		}
		showServerStatus('Server: awake', false)
	} catch (error) {
		showServerStatus(`Server: could not be reached (${error.message})`, true)
	}
}

// ---------- rollDice() ----------
// Asks the server for five random dice and displays the results and the total.
async function rollDice() {
	showMessage('Rolling the dice on the server...', false)
	try {
		const response = await fetch(`${API_BASE_URL}/api/roll`)
		if (!response.ok) {
			throw new Error(`HTTP status ${response.status}`)
		}
		const result = await response.json()

		for (let i = 0; i < dieFields.length; i++) {
			dieFields[i].value = result.dice[i]
		}
		totalField.value = result.total
		showMessage('The server rolled the dice.', false)
	} catch (error) {
		showMessage(`Could not roll the dice (${error.message})`, true)
	}
}

// ---------- resetDice() ----------
// Clears the dice fields and resets the total to 0, without reloading the page.
function resetDice() {
	for (let i = 0; i < dieFields.length; i++) {
		dieFields[i].value = ''
	}
	totalField.value = '0'
	showMessage('', false)
}

// ---------- demonstrateCorsFailure() ----------
// Calls a server API that does not send CORS headers. When this page is on a different
// origin than the server, the browser blocks the response and fetch() fails.
async function demonstrateCorsFailure() {
	showMessage('Calling an API that does not allow cross-origin requests...', false)
	try {
		const response = await fetch(`${API_BASE_URL}/api/cors-failure`)
		const result = await response.json()
		showMessage(`No CORS failure (same origin as the server): ${result.message}`, false)
	} catch (error) {
		showMessage(
			'CORS failure: the browser blocked the request because the server did not send ' +
			'an Access-Control-Allow-Origin header. Details are in the browser console.',
			true
		)
	}
}

// ---------- Event listeners ----------
rollButton.addEventListener('click', rollDice)
resetButton.addEventListener('click', resetDice)
corsButton.addEventListener('click', demonstrateCorsFailure)

// ---------- Automatic first roll on page load ----------
// Both calls are asynchronous, so the page stays responsive while the server wakes up.
window.onload = function () {
	wakeServer()
	rollDice()
	rollButton.focus()
}
