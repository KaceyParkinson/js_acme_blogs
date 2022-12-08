// 1 createElemWithText
function createElemWithText(element = "p", text = "", name){
    const newElement = document.createElement(element);
    newElement.textContent = text;
    if(name !== undefined){
        newElement.className = name;
    }
    return newElement;
}

// 2 createSelectOptions
function createSelectOptions(data){
    if(!data){
        return;
    }
    const newUserArray = [];
    data.forEach(user => {
        const newUser = document.createElement("option");
        newUser.value = user.id;
        newUser.textContent = user.name;
        newUserArray.push(newUser);
    });
    return newUserArray;
}

// 3 toggleCommentSection
function toggleCommentSection(postID){
    if(!postID){
        return;
    }
    const sections = document.getElementsByTagName("section");
    let sectionToReturn = null;
    for (let i = 0; i < sections.length; i++){
        if(sections[i].getAttribute("data-post-id") != null){
            if(sections[i].getAttribute("data-post-id") == postID){
                sections[i].classList.toggle("hide");
                sectionToReturn = sections[i];
            }
        }
    }
    return sectionToReturn;
}

// 4 toggleCommentButton
function toggleCommentButton(postID){
    if(!postID){
        return;
    }
    const buttons = document.getElementsByTagName("button");
    let buttonToReturn = null;
    for (let i = 0; i < buttons.length; i++){
        if(buttons[i].getAttribute("data-post-id") !== null){
            if(buttons[i].getAttribute("data-post-id") == postID){
                buttons[i].textContent === "Show Comments" 
                ? buttons[i].textContent = "Hide Comments" 
                : buttons[i].textContent = "Show Comments";
                buttonToReturn = buttons[i];
            }
        }
    }
    return buttonToReturn;
}

// 5 (Incomplete) deleteChildElements
function deleteChildElements(parent){
    if(!parent?.tagName){
        return;
    }
    let child;
    child = parent.lastElementChild;
    while(child){
        parent.removeChild(child);
        child = parent.lastElementChild;
    }
    return parent;
}

// The Functions below have mild dependencies on other functions
// 6 (incomplete) addButtonListeners
function addButtonListeners(){
    const buttons = document.querySelectorAll("main button");
    if(buttons){
        for(let i = 0; i < buttons.length; i++){
            let postID = buttons[i].dataset.postId;
            buttons[i].addEventListener("click", (event) => {
                toggleComments(event, postID)
            }, false);
        }
    }
    return buttons;
}

// 7 (incomplete?) removeButtonListeners
function removeButtonListeners(){
    const docButtons = document.querySelectorAll("main button");
    for(let i = 0; i < docButtons.length; i++){
        let theID = docButtons[i].dataset.postId;
        docButtons[i].removeEventListener("click", (e) =>{
            toggleComments(e, theID);
        });
    }
    return docButtons;
}

// 8 createComments
function createComments(jsonComments){
    if(!jsonComments){
        return;
    }
    const fragment = document.createDocumentFragment();
    jsonComments.forEach(comment =>{
        const article = document.createElement("article");
        const h3Element = createElemWithText("h3", comment.name);
        const paragraph1 = createElemWithText("p", comment.body);
        const paragraph2 = createElemWithText("p", `From: ${comment.email}`);
        article.append(h3Element);
        article.append(paragraph1);
        article.append(paragraph2);
        fragment.append(article);
    });
    return fragment;
}

// 9 populateSelectMenu
function populateSelectMenu(jsonUsers){
    if(!jsonUsers){
        return;
    }
    const menu = document.getElementById("selectMenu");
    const optionArray = createSelectOptions(jsonUsers);
    for(let i = 0; i < optionArray.length; i++){
        menu.append(optionArray[i]);
    }
    return menu;
}

// 10 getUsers
async function getUsers(){
    try{
        const response = await fetch("https://jsonplaceholder.typicode.com/users", {
            method: "GET",
            headers: {
                Accept: "application/json"
            }
        });
        const userData = await response.json();
        return userData;
    }catch(err){
        console.error(`Error: getUsers failed to get user data: ${err}`);
        return;
    }
}

// 11 getUserPosts
async function getUserPosts(userID){
    if(!userID){
        return;
    }
    try{
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userID}/posts`, {
            method: "GET",
            headers: {
                Accept: "application/json"
            }
        });
        const userData = await response.json();
        return userData;
    }catch(err){
        console.error(`Error: getUserPosts failed to get user data: ${err}`);
        return;
    }
}

// 12 getUser
async function getUser(userID){
    if(!userID){
        return;
    }
    try{
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userID}`, {
            method: "GET",
            headers: {
                Accept: "application/json"
            }
        });
        const userData = await response.json();
        return userData;
    }catch(err){
        console.error(`Error: getUser failed to get user data: ${err}`);
        return;
    }
}

// 13 getPostComments
async function getPostComments(postID){
    if(!postID){
        return;
    }
    try{
        const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postID}`, {
            method: "GET",
            headers: {
                Accept: "application/json"
            }
        });
        const commentData = await response.json();
        return commentData;
    }catch(err){
        console.error(`Error: getPostComments failed to get comment data: ${err}`);
        return;
    }
}

// 14 displayComments
async function displayComments(postID){
    if(!postID){
        return;
    }
    const sect = document.createElement("section");
    sect.dataset.postId = postID;
    sect.classList.add("comments");
    sect.classList.add("hide");
    const comments = await getPostComments(postID);
    const fragment = createComments(comments);
    sect.append(fragment);
    return sect;
}

// 15 createPosts
async function createPosts(jsonPosts){
    if(!jsonPosts){
        return;
    }
    const fragment = document.createDocumentFragment();
    for(let i = 0; i < jsonPosts.length; i++){
        const article = document.createElement("article");
        const h2Element = createElemWithText("h2", jsonPosts[i].title);
        const para1 = createElemWithText("p", jsonPosts[i].body);
        const para2 = createElemWithText("p", `Post ID: ${jsonPosts[i].id}`);
        const author = await getUser(jsonPosts[i].userId);
        const para3 = createElemWithText("p", `Author: ${author.name} with ${author.company.name}`);
        const para4 = createElemWithText("p", author.company.catchPhrase);
        const button = document.createElement("button");
        button.textContent = "Show Comments";
        button.dataset.postId = jsonPosts[i].postId;
        const section = await displayComments(jsonPosts[i].id);
        article.append(h2Element, para1, para2, para3, para4, button, section);
        fragment.append(article);
    }
    return fragment;
}

// 16 diplayPosts
async function displayPosts(postsData){
    const element = postsData
        ? await createPosts(postsData)
        : document.querySelector("p");
    document.querySelector("main").append(element);
    return element;
}

// 17 toggleComments
function toggleComments(event, postID){
    if(!event || !postID){
        return;
    }
    event.target.listener = true;
    const sectionElement = toggleCommentSection(postID);
    const buttonElement = toggleCommentButton(postID);
    const elementArray = [sectionElement, buttonElement];
    return elementArray;
}

// 18 refreshPosts
async function refreshPosts(postsJSON){
    if(!postsJSON){
        return;
    }
    const removedButtons = removeButtonListeners();
    let mainElement = document.querySelector("main");
    mainElement = deleteChildElements(mainElement);
    const fragment = await displayPosts(postsJSON);
    const addedButtons = addButtonListeners();
    const array = [removedButtons, mainElement, fragment, addedButtons];
    return array;
}

// 19 selectMenuChangeEventHandler
async function selectMenuChangeEventHandler(){
    if(!event){
        return;
    }
    const selectMenu = document.getElementById("selectMenu");
    selectMenu.disabled = true;
    const userID = event.target.value || 1;
    const postsJSONdata = await getUserPosts(userID);
    const refreshPostsArray = await refreshPosts(postsJSONdata);
    selectMenu.disabled = false;
    return [userID, postsJSONdata, refreshPostsArray];
}

// 20 initPage
async function initPage(){
    const usersJSONdata = await getUsers();
    const selectElement = populateSelectMenu(usersJSONdata);
    const returnArray = [usersJSONdata, selectElement];
    return returnArray;
}

// 21 initApp
function initApp(){
    initPage();
    const selectMenu = document.getElementById("selectMenu");
    selectMenu.addEventListener("change", selectMenuChangeEventHandler, false);
}

document.addEventListener("DOMContentLoaded", (e) =>{
    initApp();
});