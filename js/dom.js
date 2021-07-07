const UNCOMPLETED_LIST_TODO_ID = "todos";
const TODO_ITEMID = "itemId";
const COMPLETED_LIST_TODO_ID = "completed-todos";


function addTodo() {
  const uncompletedTODOList = document.getElementById(UNCOMPLETED_LIST_TODO_ID);

  const textTodo = document.getElementById("title").value;
  const timestamp = document.getElementById("date").value;
  //   console.log("todo" + textTodo);
  //   console.log("timestamp" + timestamp);

  const todo = makeTodo(textTodo, timestamp, false);
  const todoObject = composeTodoObject(textTodo, timestamp, false);

  todo[TODO_ITEMID] = todoObject.id;
  todos.push(todoObject);

  uncompletedTODOList.append(todo);
  updateDataToStorage();
}
function makeTodo(data, timestamp, isCompleted) {
  // membuat sebuah elemen <h2>
  const textTitle = document.createElement("h2");
  textTitle.innerText = data;

  const textTimestamp = document.createElement("p");
  textTimestamp.innerText = timestamp;

  const textContainer = document.createElement("div");
  // class “inner” pada tag div menggunakan fungsi classList.add()
  textContainer.classList.add("inner");
  // append() untuk memasukkan textTitle dan textTimestamp ke dalam textContainer
  textContainer.append(textTitle, textTimestamp);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  //   Hasil
  {
    /* <div class="item shadow">
    <div class="inner">
        <h2>Tugas Android</h2>
        <p>2021-05-01</p>
    </div>
    </div>; */
  }
  if (isCompleted) {
    container.append(createUndoButton());
    container.append(createTrashButton());
  } else {
    container.append(createCheckButton());
  }
  return container;
}
// membuat sebuah elemen button dengan class yang didapat dari parameter buttonTypeClass. Lalu button tersebut diberi listener ketika diklik. Ketika button tersebut diklik maka fungsi pada parameter eventListener akan dijalankan.
function createButton(buttonTypeClass, eventListener) {
  const button = document.createElement("button");
  button.classList.add(buttonTypeClass);
  button.addEventListener("click", function (event) {
    eventListener(event);
  });
  return button;
}

function createCheckButton() {
  return createButton("check-button", function () {
    addTaskCompleted(event.target.parentElement);
  });
}
function createUndoButton() {
  return createButton("undo-button", function (event) {
    undoTaskFromCompleted(event.target.parentElement);
  });
}
function createTrashButton() {
  return createButton("trash-button", function (event) {
    removeTaskFromCompleted(event.target.parentElement);
  });
}

function addTaskCompleted(taskElement) {
  const taskTitle = taskElement.querySelector(".inner>h2").innerText;
  const taskTimeStamp = taskElement.querySelector(".inner>p").innerText;

  const newTodo = makeTodo(taskTitle, taskTimeStamp, true);
  const todo = findTodo(taskElement[TODO_ITEMID]);
  todo.isCompleted = true;
  newTodo[TODO_ITEMID] = todo.id;

  const listCompleted = document.getElementById(COMPLETED_LIST_TODO_ID);
  listCompleted.append(newTodo);
  taskElement.remove();
  updateDataToStorage();
}
function removeTaskFromCompleted(taskElement) {
  const todoPosition = findTodoIndex(taskElement[TODO_ITEMID]);
  todos.splice(todoPosition, 1);

  taskElement.remove();
  updateDataToStorage();
}

function undoTaskFromCompleted(taskElement) {
  const listUncompleted = document.getElementById(UNCOMPLETED_LIST_TODO_ID);
  const taskTitle = taskElement.querySelector(".inner>h2").innerText;
  const taskTimeStamp = taskElement.querySelector(".inner>p").innerText;

  const newTodo = makeTodo(taskTitle, taskTimeStamp, false);

  const todo = findTodo(taskElement[TODO_ITEMID]);
  todo.isCompleted = false;
  newTodo[TODO_ITEMID] = todo.id;

  listUncompleted.append(newTodo);
  taskElement.remove();
  updateDataToStorage();
  //   jika dilihat kode tersebut hampir sama dengan kode pada fungsi addTaskToCompleted(), hanya saja logikanya yang dibalik.
}
