

const API = "http://localhost:8000/list";

let list = document.querySelector('#list');
let inpComment = document.querySelector('#comment')
let inpImage = document.querySelector('#image');
let btn = document.querySelector('#btn');
let btnEd = document.querySelector('#btn-edited');
let inpSearch = document.querySelector('#inpSearch');
let searchVal = '';
let currentPage = 1; // текущая страница
let pageTotalCount = 1; // общее количество страниц
let paginationList = document.querySelector(".pagination-list"); // блок, куда добавляются кнопки с цифрами, для переключения между страницами
let prev = document.querySelector(".prev"); // кнопка предыдущая страница
let next = document.querySelector(".next"); //нопка след страница



// Запросы в БД
async function getPosts(url) {
  const response = await fetching(url, "GET");
     const data = await response.json();
  return data;
}

const addPost = async (url, body) => {
 const response = await fetching(url, "POST", body);
 const data = await response.json();
 return data;
}
const updatePost = async (url, body) => {
 const response = await fetching(url, "PUT", body);
 const data = await response.json();
 return data;

}
const deletePost = async (url) => {
const response = await fetching(url, "DELETE");
 const data = await response.json();
 return data;
}

async function  getOnePost(url) {
 const response = await fetching(url, "GET");
 const data = await response.json();
 return data;
}


//? Поисковик, поле поиска при нажатии на enter
document.addEventListener('keydown',async (e) =>{
    if(e.code === 'Enter'){
        render();
        searchVal='';
    }
})

inpSearch.addEventListener("input", () => {
  searchVal = inpSearch.value;
  
  render();
});


document.addEventListener('click', (e) =>{
    if (e.target.classList.contains("btn-delete")) {
        let id = e.target.id;
        deletePost(`${API}/${id}`);
        render();
      }
})
let id;
document.addEventListener('click', async (e) =>{
    if (e.target.classList.contains("btn-edit")) {
         id = e.target.id;
       let post = await getOnePost(`${API}/${id}`);
    //    console.log(post);
       inpComment.value = post.comment;
       inpImage.value = post.image;
       openModal('.modal');

      }
})
btnEd.addEventListener('click', ()=>{
    saveEdit({comment:inpComment.value, image:inpImage.value},id);
    closeModal();
})
async function saveEdit(editedProduct, id) {
    await updatePost(`${API}/${id}`, editedProduct);
    //? вызов функции render для отображения обнавленных данных
    render();
    //? закрываем модалку
    let modal = bootstrap.Modal.getInstance(exampleModal);
    modal.hide();
  }




btn.addEventListener('click', (e) =>{
    e.preventDefault();
    let obj ={
        comment: inpComment.value,
        image: inpImage.value
    }
    if(!obj.comment.trim() ||
    !obj.image.trim()){
        alert("заполните поля");
    return;
    }
    addPost(API, obj);
         inpComment.value ='';
         inpImage.value = '';
         render();
})
        



render();

function fetching (url, method, body) {
    return fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
}



async function render() {
   
  let data = await getPosts(`${API}?comment_like=${searchVal}&_page=${currentPage}&_limit=3`);
//   console.log(data);
  
  

drawPaginationButtons()
    //? очищаем содержимое блока list
    list.innerHTML = "";

    //? перебор массива с продуктами и отрисовка
    data.forEach((element) => {
        
      let newElem = document.createElement("div");
      newElem.id = element.id;
  
      newElem.innerHTML = `
      <div class="card m-5" style="width: 35rem;">
    <img src=${element.image} class="card-img-top" alt="...">
     <div class="card-body">
      <h5 class="card-title">${element.comment}</h5>
      
      <button class="btn btn-info btn-delete" id=${element.id}>DELETE</button>
      <button class="btn btn-primary btn-edit" id=${element.id} data-bs-toggle="modal" 
      data-bs-target="#exampleModal" id=${element.id}>EDIT</button>
      <button class="btn btn-danger photos__like-icon">like</button>
      <span class="photos__like-count active"></span>
      <span><svg viewBox="0 0 24 24" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1hdv0qi"><g><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></g></svg></span>
    </div>
  </div> `;
  
      list.append(newElem); //? отрисовываем карточку в list
    });
  }





// Модальное окно
const sub = document.querySelectorAll(".sub");


sub.forEach((item)=>{
  item.addEventListener('click', () => openModal('.modal'))
})

function openModal(modalSelector, modalTimer) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add("show");
    modal.classList.remove("hide");
    document.body.style.overflow = "hidden";
    if (modalTimer) {
        clearTimeout(modalTimer);

    }
}
// функция закрытия модального окна
function closeModal(modalSelector) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add("hide");
    modal.classList.remove("show");
    document.body.style.overflow = "scroll";
}

function modal(triggerSelector, modalSelector, modalTimer) {

    const btnModal = document.querySelectorAll(triggerSelector);
    const modal = document.querySelector(modalSelector);

    btnModal.forEach((item) => {
        item.addEventListener("click", () => {
            openModal(modalSelector, modalTimer)
        });
    });


    modal.addEventListener("click", (e) => {
        if (e.target === modal || e.target.getAttribute("data-close") === "") {
            closeModal(modalSelector);
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("show")) {
            closeModal(modalSelector);
        }
    });

}
modal("[data-modal]", ".modal");




// Лайк
  document.addEventListener('click', ({ target: t }) => {
    if (t.classList.contains('photos__like-icon')) {
      const index = [...document.querySelectorAll('.photos__like-icon')].indexOf(t);
      const count = document.querySelectorAll('.photos__like-count')[index];
      count.classList.toggle('active');
      count.innerText -= [ 1, -1 ][+count.classList.contains('active')];
    }
  });



//? Пагинация
function drawPaginationButtons() {
    fetch(`${API}?q=${searchVal}`) //запрос на сервер, чтоб узнать общее количество продуктов
      .then((res) => res.json())
      .then((data) => {
        pageTotalCount = Math.ceil(data.length / 3); // общее количество продуктов делим на количество продуктов, к-е отображаются на одной странице
        // pageTotalCount = количество страниц
        paginationList.innerHTML = "";
  
        for (let i = 1; i <= pageTotalCount; i++) {
          if (currentPage == i) {
            let page1 = document.createElement("li");
            page1.innerHTML = `<li class="page-item active"><a class="page-link" href="#">${i}</a></li>`;
            paginationList.append(page1);
          } else {
            let page1 = document.createElement("li");
            page1.innerHTML = `<li class="page-item"><a class="page-link page_number" href="#">${i}</a></li>`;
  
            paginationList.append(page1);
          }
        }
      });
  
    //?  красим кнопки prev/next в серый
    if (currentPage == 1) {
      prev.classList.add("disabled");
    } else {
      prev.classList.remove("disabled");
    }
  
    if (currentPage == pageTotalCount) {
      next.classList.add("disabled");
    } else {
      next.classList.remove("disabled");
    }
  }
  
  //? кнопка переключения на пред. страницу
  
  prev.addEventListener("click", () => {
    if (currentPage <= 1) {
      return;
    }
    currentPage--;
    render();
  });
  
  //? кнопка переключения на след. страницу
  
  next.addEventListener("click", () => {
    if (currentPage >= pageTotalCount) {
      return;
    }
    currentPage++;
    render();
  });
  
  
  //? кнопки переключения на определенную страницу
  
  document.addEventListener('click', function(e){
    if(e.target.classList.contains('page_number')){
      currentPage = e.target.innerText;
      render();
    }
  })



  //? Like
  document.addEventListener('click', ({ target: t }) => {
    if (t.classList.contains('photos__like-icon')) {
      const index = [...document.querySelectorAll('.photos__like-icon')].indexOf(t);
      const count = document.querySelectorAll('.photos__like-count')[index];
      count.classList.toggle('active');
      count.innerText -= [ 1, -1 ][+count.classList.contains('active')];
    }
  });