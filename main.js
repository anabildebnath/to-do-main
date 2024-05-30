//live server deployment url on render
const baseUrl = "https://to-do-main.onrender.com";

// creating new checkbox for new to do list
const createCheckbox = (todoDataItem, todoElementRef) => {
  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.name = "isDone";
  checkBox.checked = todoDataItem.is_done;

  checkBox.addEventListener("change", async (e) => {
    const inputValues = {
      isDone: e.target.checked,
      userId: localStorage.getItem("id"),
      value: todoDataItem.value,
      todoItemId: todoDataItem.id,
    };
    todoElementRef.classList.toggle("done-todo-container");
    fetch(`${baseUrl}/todos/update-todo-item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputValues),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      });
  });
  return checkBox;
};

// creating delete button for deleting a particular list
const createDeleteButton = (todoDataItem, todoElementRef) => {
  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = "X";
  deleteButton.className = "delete-button";
  deleteButton.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const inputValues = {
      userId: localStorage.getItem("id"),
      todoItemId: todoDataItem.id,
    };
    fetch(`${baseUrl}/todos/delete-todo-item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputValues),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        todoElementRef.remove();
      });
  });
  return deleteButton;
};

//creating edit button for editing a particular list
const createEditButton = (todoDataItem, todoElementRef) => {
  const editButton = document.createElement("button");
  editButton.innerHTML = "Edit";
  editButton.className = "edit-button";
  editButton.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isSaving = editButton.innerHTML === "Save";
    editButton.innerHTML = isSaving ? "Edit" : "Save";
    const todoTitle = todoElementRef.querySelector(".todo-title");
    todoTitle.contentEditable = isSaving ? false : true;
    todoTitle.classList.toggle("todo-editable");
    todoTitle.focus();

    const inputValues = {
      userId: localStorage.getItem("id"),
      todoItemId: todoDataItem.id,
      value: todoTitle.innerHTML,
      isDone: todoElementRef.querySelector("input").checked,
    };
    if (isSaving) {
      fetch(`${baseUrl}/todos/update-todo-item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputValues),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
        });
    }
  });
  return editButton;
};

const getTodoElement = (todo) => {
  const todoItem = document.createElement("li");
  todoItem.className = "todo-container";
  const checkBox = createCheckbox(todo, todoItem);
  console.log("todo", checkBox);
  if (todo.is_done) {
    todoItem.classList.toggle("done-todo-container");
  }
  todoItem.appendChild(checkBox);
  const todoTitle = document.createElement("span");
  todoTitle.innerHTML = todo.value;
  todoTitle.className = "todo-title";
  todoItem.appendChild(todoTitle);
  const span = document.createElement("span");
  span.className = "todo-checkmark";
  todoItem.appendChild(todoTitle);
  todoItem.appendChild(span);
  const deleteButton = createDeleteButton(todo, todoItem);
  const editButton = createEditButton(todo, todoItem);
  todoItem.appendChild(editButton);
  todoItem.appendChild(deleteButton);
  todoItem.addEventListener("click", (e) => {
    if (e.target.tagName === "INPUT" || e.target.contentEditable === "true")
      return;
    checkBox.click();
  });
  return todoItem;
};

document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  if (isLoggedIn) {
    fetch(`${baseUrl}/todos?userId=${localStorage.getItem("id")}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        const todoList = document.querySelector(".todo-list");
        data.forEach((todo) => {
          const todoItem = getTodoElement(todo);
          todoList.appendChild(todoItem);
        });
      });
    const todoBox = document.querySelector(".todo-box");
    todoBox.style.display = "block";
    const todoList = document.querySelector(".todo-list");

    const addTodoButton = document.querySelector(".add-item-button");
    addTodoButton.addEventListener("click", async () => {
      const inputValues = {
        value: document.querySelector(".add-item-input").value,
        userId: localStorage.getItem("id"),
      };
      console.log('"~~~ hello', inputValues);

      fetch(`${baseUrl}/todos/add-todo-item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputValues),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          const todoDataItem = data[data.length - 1];
          const todoList = document.querySelector(".todo-list");
          const todoItem = getTodoElement(todoDataItem);
          todoList.appendChild(todoItem);
          const inputNode = document.querySelector(".add-item-input");
          inputNode.value = "";
          todoList.scrollTop = todoList.scrollHeight;
          inputBox.focus();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });

    const inputBox = document.querySelector(".add-item-input");
    inputBox.addEventListener("keyup", (e) => {
      if (e.keyCode === 13) {
        addTodoButton.click();
      }
    });
    inputBox.focus();
  } else {
    const loginBox = document.querySelector(".login-box");
    const signUpBox = document.querySelector(".signup-box");

    loginBox.style.display = "block";

    //login page button that takes you to signup page
    const goToSignUpButton = document.querySelector(".goto-sign-up");
    goToSignUpButton.addEventListener("click", () => {
      loginBox.style.display = "none";
      signUpBox.style.display = "block";
    });

    //signup page button that thakes you to login page
    const goToLoginButton = document.querySelector(".goto-login");
    goToLoginButton.addEventListener("click", () => {
      signUpBox.style.display = "none";
      loginBox.style.display = "block";
    });
  }

  // login function
  const submitButton = document.querySelector(".login-submit-button"); //this is the login submitButton
  submitButton.addEventListener("click", async () => {
    //listening to the click on submitButton
    const email = document.querySelector(".login-email-input").value; // taking the email value entered
    if (email === "") {
      // if the email is nothing which is ""
      const errorText = document.querySelector(".incorrect-password-error"); // takes the error message part
      errorText.style.display = "block"; // and and changes the style from none to block so now the error message is visible
      return; //simply returns
    }
    const inputValues = {
      //taking email and password from user input
      email,
      password: document.querySelector(".login-password-input").value,
    };
    console.log('"~~~ hello', inputValues); //prints the input values on the console
    fetch(`${baseUrl}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputValues),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.user.name);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("id", data.user.id);
        window.location.reload();
      })
      .catch((error) => {//if any error caught 
        const errorText = document.querySelector(".incorrect-password-error");//taking the error message part
        errorText.style.display = "block";//changing the display style to block from none
        localStorage.clear();//clearing the local storage where form data was stored
        console.error("Error:", error);//printing the error message on console 
      });
  });

  // signup function
  const signUp = document.querySelector(".signup-submit-button");
  signUp.addEventListener("click", async () => {
    const email = document.querySelector(".signup-email-input").value;
    if (!email.includes("@")) {
      alert("Invalid email");
      return;
    }
    const inputValues = {
      name: document.querySelector(".signup-name-input").value,
      email,
      password: document.querySelector(".signup-password-input").value,
      confirmPassword: document.querySelector(".signup-confirm-password-input")
        .value,
    };

    if (inputValues.password !== inputValues.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    fetch(`${baseUrl}/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputValues),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.token) {
          alert(data.message);
          return;
        }
        console.log("Success:", data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.user.name);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("id", data.user.id);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  // logout function
  const logoutButton = document.querySelector(".todo-logout-button");
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("id");
    window.location.reload();
  });
});

//popup for server delay alert message
document.addEventListener("DOMContentLoaded", function () {
  const popup = document.getElementById("popup");
  popup.style.display = "block";
  setTimeout(function () {
    popup.style.display = "none";
  }, 7000);
});
