const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const { runInNewContext } = require("vm");

//Initialize variables
const employees = [];

//Create and push employees to employee array based on role
function createEmployee(role, info) {
	switch (role) {
		case "Manager":
			let newMgr = new Manager(info.managerName, info.managerID, info.managerEmail, info.managerOffice);
			employees.push(newMgr);
			break
		case "Engineer":
			let newEng = new Engineer(info.engineerName, info.engineerID, info.engineerEmail, info.engineerGithub);
			employees.push(newEng);
			break;
		case "Intern":
			let newInt = new Intern(info.internName, info.internID, info.internEmail, info.internSchool);
			employees.push(newInt);
			break;
		default:
			break;
	}
}
//User prompt for Intern info; initiated by running 'node app.js' in CLI
function requestManagerInfo() {
	inquirer.prompt([
		{
			type: "input",
			message: "What is the team manager' name?",
			name: "managerName"
		},
		{
			type: "input",
			message: "What is the team manager's ID?",
			name: "managerID"
		},
		{
			type: "input",
			message: "What is the team manager's email?",
			name: "managerEmail"
		},
		{
			type: "input",
			message: "What is the team manager's office number?",
			name: "managerOffice"
		}
	]).then(function (response) {
		createEmployee("Manager", response);
		employeeMenu();
	})
}

//User prompt for Engineer info; initiated by selecting Engineer from the Employee menu
function requestEngineerInfo() {
	inquirer.prompt([
		{
			type: "input",
			message: "What is your engineer's name?",
			name: "engineerName"
		},
		{
			type: "input",
			message: "What is your engineer's ID?",
			name: "engineerID"
		},
		{
			type: "input",
			message: "What is your engineer's email?",
			name: "engineerEmail"
		},
		{
			type: "input",
			message: "What is your engineer's Github?",
			name: "engineerGithub"
		}
	]).then(function (response) {
		createEmployee("Engineer", response);
		employeeMenu();
	})
}

//User prompt for Intern info; initiated by selecting Intern from the Employee menu
function requestInternInfo() {
	inquirer.prompt([
		{
			type: "input",
			message: "What is your intern's name?",
			name: "internName"
		},
		{
			type: "input",
			message: "What is your intern's ID?",
			name: "internID"
		},
		{
			type: "input",
			message: "What is your intern's email?",
			name: "internEmail"
		},
		{
			type: "input",
			message: "What is your intern's school?",
			name: "internSchool"
		}
	]).then(function (response) {
		createEmployee("Intern", response);
		employeeMenu();
	})
}

//Prompt to select which type of user to create; initiated after creating any type of employee
function employeeMenu() {
	inquirer.prompt([
		{
			type: "list",
			message: "Which type of team member would you like to add?",
			name: "teamMember",
			choices: ["Engineer", "Intern", "Create Super Team"]
		}
	]).then(function (choice) {
		switch (choice.teamMember) {
			case "Engineer":
				requestEngineerInfo();
				break;
			case "Intern":
				requestInternInfo()
				break;
			case "Create Super Team":
				console.log("Compiling Team Roster...");
				generateHTML();
				break;
			default:
				console.log("Invalid choice!");
				break;
		}
	});
}

//Created folder structure and file based on inputs; initiated after exiting employeeMenu();
function generateHTML() {
	//check for output directory and create it if it doesn't exist
	if (!fs.existsSync(OUTPUT_DIR)) {
		console.log("HERE");
		fs.mkdirSync(OUTPUT_DIR);
	}
	//write file to output path
	fs.writeFile(outputPath, render(employees), function (err) {
		if (err) {
			throw err;
		}
	})
}

//Initiates app asynchronously
async function init() {
	await requestManagerInfo();
}

init();