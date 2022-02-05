import { format, addDays } from 'date-fns';

//get todays date
const date = new Date();
const todaysDateFormated = format(date, "yyyy-MM-dd");

//making array for our main tasks - inbox, today and 7 days
let mainTasks = [];

//get error msg under information in taskbox if taskdesc = ''
let errorMsg = document.querySelector('.errorMsg');

class baseTasks {
    constructor(name, importance, date) {
        this.name = name;
        this.importance = importance;
        this.date = date;
    }
    addToArray(newTask) {
        mainTasks.push(newTask);
    }
}

//declare button which finally adds task to array
const addTaskBoxBtn = document.querySelector('.addTaskBoxBtn');

//function which takes data from addTaskBox and put it into mainTask array
addTaskBoxBtn.addEventListener('click', () => {
    let taskDesc = document.querySelector('.taskDesc').value;
    let taskImportance = document.querySelector('.taskImportance').value;
    let taskDate = document.querySelector('.taskBoxDate').value;
    let newTask = new baseTasks(taskDesc, taskImportance, taskDate);
    if (taskDesc != '') {
        errorMsg.style.display = 'none';
        newTask.addToArray(newTask);
        actualTaskList();
    }
    else {
        errorMsg.style.display = 'block';
    }
});
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

const addEditTaskButton = ((singleTask, taskName, taskImportantLvl, taskDueTo, noDate, editTaskBtn) => {
    editTaskBtn.classList.add('far', 'fa-edit', 'editTaskBtn');
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
            makeTaskList(mainTasks);
            console.log(mainTasks);
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
const allProjects = document.querySelectorAll('.project');

//function which shows and close addTaskBox
const toggleAddTaskBox = () => {
    //get and show shadowbox under addTaskBox
    const shadowBox = document.querySelector('.shadowBox');
    shadowBox.style.display = 'block';
    if (addTaskBox.style.display == 'none' ||
        addTaskBox.style.display == '') {
        addTaskBox.style.display = 'flex';
    }

    const closeAddTaskBtn = document.querySelector('.closeAddTaskBtn');

    //function which close addTaskBox
    const closeAddTaskBox = () => {
        if (addTaskBox.style.display == 'flex') {
            addTaskBox.style.display = 'none';
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
        leftMenu.style.display = 'none';
    }
    else if (leftMenu.style.display == 'none' ||
        leftMenu.style.display == '') {
        leftMenu.style.display = 'flex';
    }
}

//function with powers toggle projects list button
const toggleProjectsList = () => {
    allProjects.forEach(singleProject => {
        if (singleProject.style.display == 'flex') {
            singleProject.style.display = 'none';
            projectsListBtn.classList.remove('fa-chevron-up');
            projectsListBtn.classList.add('fa-chevron-down');
        }
        else if (singleProject.style.display == 'none' ||
            singleProject.style.display == '') {
            singleProject.style.display = 'flex';
            projectsListBtn.classList.remove('fa-chevron-down');
            projectsListBtn.classList.add('fa-chevron-up');
        }
    });
}

//calling funcionts with mobile menu button and projects list button
mobileMenuBtn.addEventListener('click', toggleMobileMenu);
projectsListBtn.addEventListener('click', toggleProjectsList);

//calling function toggleAddTaskBox to show add task box
addTaskBtn.addEventListener('click', toggleAddTaskBox);

//function which deletes given task
const deleteTask = (taskId) => {
    mainTasks.splice(taskId, 1);
    makeTaskList(mainTasks);
    console.log(mainTasks);
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

// //function which makes new array of tasks with date as today
// const todaysTasks = () => {


// }

const actualTaskList = () => {
    let taskDesc = document.querySelector('.taskDesc');
    let taskImportance = document.querySelector('.taskImportance');
    let taskDate = document.querySelector('.taskBoxDate');
    const nextWeekDate = addDays(date, 7);
    const nextWeekDateFormated = format(nextWeekDate, "yyyy-MM-dd");
    let actualProjectName = document.querySelector('.actualProjectName');
    let todaysTasks = mainTasks.filter(singleTask => singleTask.date === todaysDateFormated);
    let nextWeekTasks = mainTasks.filter(singleTask => singleTask.date <= nextWeekDateFormated);
    if (actualProjectName.textContent == 'Inbox') {
        makeTaskList(mainTasks);
        console.log(mainTasks);
    }
    else if (actualProjectName.textContent == 'Today') {
        makeTaskList(todaysTasks)
        console.log(todaysTasks);
    }
    else if (actualProjectName.textContent == 'Next 7 Days') {
        makeTaskList(nextWeekTasks);
        console.log(nextWeekTasks);
    }
    taskDesc.value = '';
    taskImportance.value = 'Low';
    taskDate.value = '';
}