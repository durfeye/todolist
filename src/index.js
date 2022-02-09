import { format, addDays } from 'date-fns';
import './style.css';

//makes vars for storages
let mainTasksStorage;
let projectsArrStorage;

//get todays date and 7 days later date
const date = new Date();
const todaysDateFormated = format(date, "yyyy-MM-dd");
const nextWeekDate = addDays(date, 7);
const nextWeekDateFormated = format(nextWeekDate, "yyyy-MM-dd");

//making array for our main tasks - inbox, today and 7 days
let mainTasks = [];

//making array for our projects
let projectsArr = [];

//function which checks if storage exists and if not makes empty ones
const ifStorageExists = () => {
    if (localStorage.getItem('mainTasks') && localStorage.getItem('projectsArr')) {
        return;
    }
    else if (localStorage.getItem('mainTasks') && !localStorage.getItem('projectsArr')) {
        localStorage.setItem('projectsArr', JSON.stringify(projectsArr));
    }
    else if (localStorage.getItem('projectsArr') && !localStorage.getItem('mainTasks')) {
        localStorage.setItem('mainTasks', JSON.stringify(mainTasks));
    }
    else {
        localStorage.setItem('mainTasks', JSON.stringify(mainTasks));
        localStorage.setItem('projectsArr', JSON.stringify(projectsArr));
    }
    mainTasksStorage = JSON.parse(localStorage.getItem('mainTasks'));
    projectsArrStorage = JSON.parse(localStorage.getItem('projectsArr'));
}

//check if storages exists on site load
window.onload = ifStorageExists();

//save in storage
const saveInStorage = () => {
    localStorage.setItem('mainTasks', JSON.stringify(mainTasks));
    localStorage.setItem('projectsArr', JSON.stringify(projectsArr));
}

//get from storage
const getFromStorage = () => {
    mainTasksStorage = JSON.parse(localStorage.getItem('mainTasks'));
    projectsArrStorage = JSON.parse(localStorage.getItem('projectsArr'));
    mainTasks = mainTasksStorage;
    projectsArr = projectsArrStorage;
}
getFromStorage();

//get error msg under information in taskbox if taskdesc = ''
let errorMsg = document.querySelector('.errorMsg');

//class which makes new tasks and adds it to array
class baseTasks {
    constructor(name, importance, date) {
        this.name = name;
        this.importance = importance;
        this.date = date;
    }
    addToArray(newTask) {
        mainTasks.push(newTask);
        saveInStorage();
    }
}

//class which makes new projects and adds it to array
class projects {
    constructor(name, projectTasks) {
        this.name = name;
        this.projectTasks = projectTasks;
    }
    addToArray(newProject) {
        projectsArr.push(newProject);
        saveInStorage();
    }
}

//class which makes new tasks and adds it to user projects array
class usersProjectTask {
    constructor(name, importance, date) {
        this.name = name;
        this.importance = importance;
        this.date = date;
    }
    addToArray(newTask) {
        let actualProjectName = document.querySelector('.actualProjectName');
        const actualProject = projectsArr.find(element => element.name == actualProjectName.textContent);
        actualProject.projectTasks.push(newTask);
        saveInStorage();
    }
}

//declare button which finally adds task to array
const addTaskBoxBtn = document.querySelector('.addTaskBoxBtn');

//function which takes data from addTaskBox and put it into mainTask array
addTaskBoxBtn.addEventListener('click', () => {
    let taskDesc = document.querySelector('.taskDesc').value;
    let taskImportance = document.querySelector('.taskImportance').value;
    let taskDate = document.querySelector('.taskBoxDate').value;
    let actualProjectName = document.querySelector('.actualProjectName');
    let newTask;
    if (actualProjectName.textContent == 'Inbox'
        || actualProjectName.textContent == 'Today'
        || actualProjectName.textContent == 'Next 7 Days') {
        newTask = new baseTasks(taskDesc, taskImportance, taskDate);
    }
    else {
        newTask = new usersProjectTask(taskDesc, taskImportance, taskDate);
    }
    if (taskDesc != '') {
        errorMsg.style.display = 'none';
        newTask.addToArray(newTask);
        actualTaskList();
    }
    else {
        errorMsg.style.display = 'block';
    }
});

//get addProjectBtn and projectbuttonbox
const addProjectBtn = document.querySelector('.addProjectBtn');
const addNewProjectBtn = document.querySelector('.addNewProjectBtn');

//add functions to project button
addProjectBtn.addEventListener('click', () => {
    const addProjectBox = document.querySelector('.addProjectBox');
    const addProjectIcon = document.querySelector('.addProjectIcon');
    const projectErrorMsg = document.querySelector('.projectErrorMsg');
    if (addProjectBox.style.display == 'none') {
        addProjectBox.style.display = 'flex';
        addProjectIcon.classList.remove('fa-plus');
        addProjectIcon.classList.add('fa-minus');
    }
    else if (addProjectBox.style.display == 'flex') {
        addProjectBox.style.display = 'none';
        addProjectIcon.classList.remove('fa-minus');
        addProjectIcon.classList.add('fa-plus');
        projectErrorMsg.style.display = 'none';
    }
});

//function which adds new project
addNewProjectBtn.addEventListener('click', () => {
    let projectName = document.querySelector('.addProjectName');
    let projectErrorMsg = document.querySelector('.projectErrorMsg');
    let projectTasks = [];
    const actualProject = projectsArr.find(element => element.name == projectName.value);
    if (projectName.value != 'Inbox'
        && projectName.value != 'Today'
        && projectName.value != 'Next 7 Days'
        && projectName.value != ''
        && !actualProject) {
        let newProject = new projects(projectName.value, projectTasks);
        newProject.addToArray(newProject);
        showActualProjectsList(projectsArr);
        projectErrorMsg.style.display = 'none';
        console.log(projectsArr);
    }
    else {
        projectErrorMsg.style.display = 'flex';
    }
    projectName.value = ''
});

//function which makes single task
const makeTaskElement = ((
    graphicTask, taskHead, taskName, taskImportantLvl,
    dateBox, taskDueTo, noDate, operationBtns,
    deleteTaskBtn, editTaskBtn
) => {
    const makeGraphicTask = () => {
        const actualBaseTasks = document.querySelector('.actualTasks')
        graphicTask = document.createElement('article');
        graphicTask.classList.add('task');
        actualBaseTasks.appendChild(graphicTask);
    }
    const makeTaskHead = (singleTask) => {
        taskHead = document.createElement('div');
        taskHead.classList.add('taskHead');
        taskName = document.createElement('input');
        taskName.classList.add('taskName');
        taskName.disabled = true;
        taskName.value = singleTask.name;
    }
    const makeTaskImportancy = (singleTask) => {
        taskImportantLvl = document.createElement('i');
        taskImportantLvl.classList.add('fas', 'fa-circle', 'taskImportance');
        if (singleTask.importance == 'Low') {
            taskImportantLvl.style.color = 'green';
        }
        else if (singleTask.importance == 'Medium') {
            taskImportantLvl.style.color = 'yellow';
        }
        else if (singleTask.importance == 'High') {
            taskImportantLvl.style.color = 'red';
        }
    }
    const makeTaskDate = (singleTask) => {
        dateBox = document.createElement('div');
        dateBox.classList.add('dateBox');
        taskDueTo = document.createElement('input');
        taskDueTo.type = 'date';
        taskDueTo.classList.add('taskDate');
        taskDueTo.disabled = true;
        noDate = document.createElement('p');
        noDate.textContent = 'No date';
        dateBox.appendChild(noDate);
        if (singleTask.date === '') {
            noDate.style.display = 'block';
            taskDueTo.style.display = 'none';
        }
        else {
            noDate.style.display = 'none';
            taskDueTo.style.display = 'block';
            taskDueTo.value = singleTask.date;
        }
    }
    const makeOperationBtns = () => {
        operationBtns = document.createElement('div');
        operationBtns.classList.add('operationBtns');
    }
    const makeDeleteTaskBtn = (taskId) => {
        deleteTaskBtn = document.createElement('i');
        addDeleteButton(taskId, deleteTaskBtn);
    }
    const makeEditTaskBtn = (singleTask) => {
        editTaskBtn = document.createElement('i');
        addEditTaskButton(singleTask, taskName, taskImportantLvl, taskDueTo, noDate, editTaskBtn);
    }
    const applyAllElements = () => {
        graphicTask.appendChild(taskHead);
        taskHead.appendChild(taskImportantLvl);
        taskHead.appendChild(taskName);
        graphicTask.appendChild(dateBox);
        dateBox.appendChild(taskDueTo);
        dateBox.appendChild(noDate);
        graphicTask.appendChild(operationBtns);
        operationBtns.appendChild(editTaskBtn);
        operationBtns.appendChild(deleteTaskBtn);
    }
    return {
        makeGraphicTask,
        makeTaskHead,
        makeTaskImportancy,
        makeTaskDate,
        makeOperationBtns,
        makeEditTaskBtn,
        makeDeleteTaskBtn,
        applyAllElements,
    }
})();

//making single task
const makeTaskList = (array) => {
    const actualTasks = document.querySelector('.actualTasks');
    actualTasks.innerHTML = '';
    array.forEach((singleTask, taskId) => {

        //make graphic task
        makeTaskElement.makeGraphicTask();

        //make task desc
        makeTaskElement.makeTaskHead(singleTask);

        //make task importancy
        makeTaskElement.makeTaskImportancy(singleTask);

        //make task date
        makeTaskElement.makeTaskDate(singleTask);

        //make div for operation buttons - edit and delete
        makeTaskElement.makeOperationBtns();

        // apply edit task button
        makeTaskElement.makeEditTaskBtn(singleTask);

        //apply delete task button
        makeTaskElement.makeDeleteTaskBtn(taskId);

        //apply all informations about task
        makeTaskElement.applyAllElements();

    });
}

//make delete task button
const addDeleteButton = ((taskId, deleteTaskBtn) => {
    deleteTaskBtn.classList.add('far', 'fa-trash-alt', 'deleteTaskBtn');
    deleteTaskBtn.addEventListener('click', () => {
        deleteTask(taskId);
    });
});

//function which let user edit given task
const editTask = (() => {

    const editTaskName = (taskName) => {
        taskName.disabled = false;
        taskName.style = 'background: white; color: black';
    }

    const editTaskImportancy = (singleTask, taskImportantLvl) => {
        taskImportantLvl.addEventListener('click', () => {
            if (singleTask.importance == 'Low') {
                singleTask.importance = 'Medium';
                taskImportantLvl.style.color = "yellow";
            }
            else if (singleTask.importance == 'Medium') {
                singleTask.importance = 'High';
                taskImportantLvl.style.color = "red";
            }
            else if (singleTask.importance == 'High') {
                singleTask.importance = 'Low';
                taskImportantLvl.style.color = "green";
            }
        });
    }

    const editTaskDate = (taskDueTo, noDate) => {
        if (noDate.style.display == 'block') {
            noDate.style.display = 'none';
            taskDueTo.style.display = 'block'
        }
        taskDueTo.disabled = false;
        taskDueTo.style = 'background: white; color: black';

    }
    return {
        editTaskName,
        editTaskImportancy,
        editTaskDate,
    };
})();

//add functions to edit task button
const addEditTaskButton = ((singleTask, taskName, taskImportantLvl, taskDueTo, noDate, editTaskBtn) => {
    editTaskBtn.classList.add('far', 'fa-edit', 'editTaskBtn');
    const actualProjectName = document.querySelector('.actualProjectName');
    const actualProject = projectsArr.find(element => element.name == actualProjectName.textContent);
    editTaskBtn.addEventListener('click', () => {
        if (editTaskBtn.classList.contains('far')) {
            editTask.editTaskName(taskName);
            editTask.editTaskImportancy(singleTask, taskImportantLvl);
            editTask.editTaskDate(taskDueTo, noDate);
            editTaskBtn.classList.remove('far');
            editTaskBtn.classList.add('fas');
        }
        else if (editTaskBtn.classList.contains('fas')) {
            editTaskBtn.classList.remove('fas');
            editTaskBtn.classList.add('far');
            singleTask.name = taskName.value;
            taskName.disabled = true;
            taskName.style = 'background: transparent; color: black';
            singleTask.date = taskDueTo.value;
            taskDueTo.disabled = true;
            taskDueTo.style = 'background: transparent; color: black';
            if (actualProject) {
                makeTaskList(actualProject.projectTasks);
                console.log(projectsArr);
            }
            else {
                makeTaskList(mainTasks);
                console.log(mainTasks);
            }
        }
    });
});

//declare addTaskBox and addTaskBtn and closeAddTaskBtn
const addTaskBox = document.querySelector('.addTaskBox');
const addTaskBtn = document.querySelector('.addTaskBtn');

//declare toggler menu button and left menu
const mobileMenuBtn = document.querySelector('.mobileMenuBtn');
const leftMenu = document.querySelector('.leftMenu');

//declare projects button and project box
const projectsListBtn = document.querySelector('.projectsList');
const actualProjectsList = document.querySelector('.actualProjectsList');

//function which shows and close addTaskBox
const toggleAddTaskBox = () => {
    //get and show shadowbox under addTaskBox
    const shadowBox = document.querySelector('.shadowBox');
    shadowBox.style.display = 'block';
    if (addTaskBox.classList.contains('hide')) {
        addTaskBox.classList.remove('hide');
        addTaskBox.classList.add('show');
        setTimeout(function () {
            addTaskBox.style.display = 'flex';
        }, 0);
    }

    const closeAddTaskBtn = document.querySelector('.closeAddTaskBtn');

    //function which close addTaskBox
    const closeAddTaskBox = () => {
        if (addTaskBox.classList.contains('show')) {
            addTaskBox.classList.remove('show');
            addTaskBox.classList.add('hide');
            setTimeout(function () {
                addTaskBox.style.display = 'none';
            }, 100);
            //close shadowbox under addtasakbox
            shadowBox.style.display = 'none';
            errorMsg.style.display = 'none';
        }
    }
    //function which close addTaskBox if clicked on X in box or outside box
    document.addEventListener('mouseup', function (e) {
        if (e.target == shadowBox || e.target == closeAddTaskBtn) {
            closeAddTaskBox();
        }
    });
}

//function which powers toggle menu button
const toggleMobileMenu = () => {
    if (leftMenu.style.display == 'flex') {
        leftMenu.classList.remove('show');
        leftMenu.classList.add('hide');
        setTimeout(function () {
            leftMenu.style.display = 'none';
        }, 100);
    }
    else if (leftMenu.style.display == 'none' ||
        leftMenu.style.display == '') {
        leftMenu.classList.remove('hide');
        leftMenu.classList.add('show');
        setTimeout(function () {
            leftMenu.style.display = 'flex';
        }, 100);
    }
}

//function with powers toggle projects list button
const toggleProjectsList = () => {
    const projectsListArrow = document.querySelector('.projectsListArrow');
    if (actualProjectsList.style.display == 'flex') {
        actualProjectsList.style.display = 'none';
        projectsListArrow.classList.remove('fa-chevron-down');
        projectsListArrow.classList.add('fa-chevron-up');
    }
    else if (actualProjectsList.style.display == 'none'
        || actualProjectsList.style.display == '') {
        actualProjectsList.style.display = 'flex';
        projectsListArrow.classList.remove('fa-chevron-up');
        projectsListArrow.classList.add('fa-chevron-down');
    }
}

//calling funcionts with mobile menu button and projects list button
mobileMenuBtn.addEventListener('click', toggleMobileMenu);
projectsListBtn.addEventListener('click', toggleProjectsList);

//calling function toggleAddTaskBox to show add task box
addTaskBtn.addEventListener('click', toggleAddTaskBox);

//function which deletes given task
const deleteTask = (taskId) => {
    let actualProjectName = document.querySelector('.actualProjectName');
    const actualProject = projectsArr.find(element => element.name == actualProjectName.textContent);
    let todaysTasks = mainTasks.filter(singleTask => singleTask.date === todaysDateFormated);
    let todaysOtherTasks = mainTasks.filter(singleTask => singleTask.date != todaysDateFormated);
    let nextWeekTasks = mainTasks.filter(singleTask => singleTask.date <= nextWeekDateFormated);
    let nextWeekOtherTasks = mainTasks.filter(singleTask => singleTask.date > nextWeekDateFormated);
    if (actualProject) {
        actualProject.projectTasks.splice(taskId, 1);
        makeTaskList(actualProject.projectTasks);
        console.log(projectsArr);
    }
    else if (actualProjectName.textContent == 'Inbox') {
        mainTasks.splice(taskId, 1);
        makeTaskList(mainTasks);
        console.log(mainTasks);
    }
    else if (actualProjectName.textContent == 'Today') {
        todaysTasks.splice(taskId, 1);
        mainTasks = todaysOtherTasks.concat(todaysTasks);
        makeTaskList(todaysTasks);
        console.log(mainTasks);
        console.log(todaysTasks);
    }
    else if (actualProjectName.textContent == 'Next 7 Days') {
        nextWeekTasks.splice(taskId, 1);
        mainTasks = nextWeekOtherTasks.concat(nextWeekTasks);
        makeTaskList(nextWeekTasks);
        console.log(mainTasks);
        console.log(nextWeekTasks);
    }
    saveInStorage();
}

//call standard project buttons
let standardProjectBtns = document.querySelectorAll('.standardProjectBtn');
standardProjectBtns.forEach(singleButton => {
    singleButton.addEventListener('click', () => {
        let actualProjectName = document.querySelector('.actualProjectName');
        actualProjectName.textContent = singleButton.textContent;
        actualTaskList();
    });
});

//change project on users click
const usersProjectsChoice = () => {
    let usersProjects = document.querySelectorAll('.singleProject');
    usersProjects.forEach(oneProject => {
        oneProject.addEventListener('click', () => {
            let actualProjectName = document.querySelector('.actualProjectName');
            actualProjectName.textContent = oneProject.textContent;
            actualTaskList();
        });
    });
}

// function which displays actual task list depending on users choice
const actualTaskList = () => {
    let taskDesc = document.querySelector('.taskDesc');
    let taskImportance = document.querySelector('.taskImportance');
    let taskDate = document.querySelector('.taskBoxDate');
    let actualProjectName = document.querySelector('.actualProjectName');
    let todaysTasks = mainTasks.filter(singleTask => singleTask.date === todaysDateFormated);
    let nextWeekTasks = mainTasks.filter(singleTask => singleTask.date <= nextWeekDateFormated);
    const actualProject = projectsArr.find(element => element.name == actualProjectName.textContent);
    if (actualProjectName.textContent == 'Inbox') {
        makeTaskList(mainTasks);
        console.log(mainTasks);
    }
    else if (actualProjectName.textContent == 'Today') {
        makeTaskList(todaysTasks);
        console.log(todaysTasks);
    }
    else if (actualProjectName.textContent == 'Next 7 Days') {
        makeTaskList(nextWeekTasks);
        console.log(nextWeekTasks);
    }
    else if (actualProject) {
        makeTaskList(actualProject.projectTasks);
        console.log(projectsArr);
    }
    taskDesc.value = '';
    taskImportance.value = 'Low';
    taskDate.value = '';
}

actualTaskList(mainTasks);

//make single project element 
const makeSingleProject = ((projectElem) => {
    const projectsName = (singleProject) => {
        projectElem = document.createElement('div');
        projectElem.classList.add('singleProject');
        let projectName = document.createElement('span');
        projectName.classList.add('projectName');
        projectName.textContent = singleProject.name;
        projectElem.appendChild(projectName);
        actualProjectsList.appendChild(projectElem);
    }
    const deleteProjectBtn = (projectId) => {
        let projectDeleteBtn = document.createElement('button');
        projectDeleteBtn.classList.add('far', 'fa-trash-alt', 'deleteProjectBtn');
        projectElem.appendChild(projectDeleteBtn);
        projectDeleteBtn.addEventListener('click', (event) => {
            deleteProject(projectId);
            event.stopPropagation();
        });
    }
    return {
        projectsName,
        deleteProjectBtn,
    }
})();

//function which displays actual projects list 
const showActualProjectsList = (array) => {
    actualProjectsList.innerHTML = '';
    array.forEach((singleProject, projectId) => {
        makeSingleProject.projectsName(singleProject);
        makeSingleProject.deleteProjectBtn(projectId);
        usersProjectsChoice();
    })
}

showActualProjectsList(projectsArr);

//function which deletes single project
const deleteProject = (projectId) => {
    let actualProjectName = document.querySelector('.actualProjectName');
    actualProjectName.textContent = 'Inbox';
    projectsArr.splice(projectId, 1);
    saveInStorage();
    showActualProjectsList(projectsArr);
    makeTaskList(mainTasks);
    console.log(projectsArr);
}