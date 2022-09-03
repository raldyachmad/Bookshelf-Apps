let backToTop = document.querySelector(".back_to_top");

window.addEventListener("scroll", () => {
  if (this.scrollY >= 400) {
    backToTop.classList.remove("hidden");

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0 });
    });
  } else {
    backToTop.classList.add("hidden");
  }
});

const localStorageKey = "BOOKSHELF_APPS";

const bookTitle = document.querySelector("#inputBookTitle");
const errorTitle = document.querySelector("#errorTitle");
const sectionTitle = document.querySelector("#sectionTitle");

const author = document.querySelector("#inputBookAuthor");
const errorAuthor = document.querySelector("#errorAuthor");
const sectionAuthor = document.querySelector("#sectionAuthor");

const bookYear = document.querySelector("#inputBookYear");
const errorYear = document.querySelector("#errorYear");
const sectionYear = document.querySelector("#sectionYear");

const read = document.querySelector("#inputBookIsComplete");

const btnSubmit = document.querySelector("#bookSubmit");

const searchBook = document.querySelector("#searchBookTitle");
const btnSearch = document.querySelector("#searchSubmit");

let checkInput = [];
let checkTitle = null;
let checkAuthor = null;
let checkYear = null;

window.addEventListener("load", function () {
  if (localStorage.getItem(localStorageKey) !== null) {
    const booksData = getData();
    showData(booksData);
  }
});

btnSearch.addEventListener("click", function (e) {
  e.preventDefault();
  if (localStorage.getItem(localStorageKey) == null) {
    return alert("Buku Masih Kosong");
  } else {
    const getByTitle = getData().filter((a) => a.bookTitle == searchBook.value.trim());
    if (getByTitle.length == 0) {
      const getByAuthor = getData().filter((a) => a.author == searchBook.value.trim());
      if (getByAuthor.length == 0) {
        const getByYear = getData().filter((a) => a.bookYear == searchBook.value.trim());
        if (getByYear.length == 0) {
          alert(`Gagal Menemukan Buku dengan Kata Kunci ${searchBook.value}`);
        } else {
          showSearchResult(getByYear);
        }
      } else {
        showSearchResult(getByAuthor);
      }
    } else {
      showSearchResult(getByTitle);
    }
  }

  searchBook.value = "";
});

btnSubmit.addEventListener("click", function () {
  if (btnSubmit.value == "") {
    checkInput = [];

    bookTitle.classList.remove("error");
    author.classList.remove("error");
    bookYear.classList.remove("error");

    errorTitle.classList.add("error_display");
    errorAuthor.classList.add("error_display");
    errorYear.classList.add("error_display");

    if (bookTitle.value == "") {
      checkTitle = false;
    } else {
      checkTitle = true;
    }

    if (author.value == "") {
      checkAuthor = false;
    } else {
      checkAuthor = true;
    }

    if (bookYear.value == "") {
      checkYear = false;
    } else {
      checkYear = true;
    }

    checkInput.push(checkTitle, checkAuthor, checkYear);
    let resultCheck = validation(checkInput);

    if (resultCheck.includes(false)) {
      return false;
    } else {
      const newBook = {
        id: +new Date(),
        bookTitle: bookTitle.value.trim(),
        author: author.value.trim(),
        bookYear: bookYear.value,
        isCompleted: read.checked,
      };
      insertData(newBook);

      bookTitle.value = "";
      author.value = "";
      bookYear.value = "";
      read.checked = false;
    }
  } else {
    const bookData = getData().filter((a) => a.id != btnSubmit.value);
    localStorage.setItem(localStorageKey, JSON.stringify(bookData));

    const newBook = {
      id: btnSubmit.value,
      bookTitle: bookTitle.value.trim(),
      author: author.value.trim(),
      bookYear: bookYear.value,
      isCompleted: read.checked,
    };
    insertData(newBook);
    btnSubmit.innerHTML = "Masukkan Buku";
    btnSubmit.value = "";
    bookTitle.value = "";
    author.value = "";
    bookYear.value = "";
    read.checked = false;
    alert("Buku Berhasil Diedit");
  }
});

function validation(check) {
  let resultCheck = [];

  check.forEach((a, i) => {
    if (a == false) {
      if (i == 0) {
        bookTitle.classList.add("error");
        errorTitle.classList.remove("error_display");
        resultCheck.push(false);
      } else if (i == 1) {
        author.classList.add("error");
        errorAuthor.classList.remove("error_display");
        resultCheck.push(false);
      } else {
        bookYear.classList.add("error");
        errorYear.classList.remove("error_display");
        resultCheck.push(false);
      }
    }
  });

  return resultCheck;
}

function insertData(book) {
  let bookData = [];

  if (localStorage.getItem(localStorageKey) === null) {
    localStorage.setItem(localStorageKey, 0);
  } else {
    bookData = JSON.parse(localStorage.getItem(localStorageKey));
  }

  bookData.unshift(book);
  localStorage.setItem(localStorageKey, JSON.stringify(bookData));

  showData(getData());
}

function getData() {
  return JSON.parse(localStorage.getItem(localStorageKey)) || [];
}

function showData(books = []) {
  const inCompleted = document.querySelector("#incompleteBookshelfList");
  const completed = document.querySelector("#completeBookshelfList");

  inCompleted.innerHTML = "";
  completed.innerHTML = "";

  books.forEach((book) => {
    if (book.isCompleted == false) {
      let el = `
            <article class="book_item">
                <h3>${book.bookTitle}</h3>
                <p>Penulis: ${book.author}</p>
                <p>Tahun: ${book.bookYear}</p>

                <div class="action">
                    <button class="green" onclick="readedBook('${book.id}')">Selesai dibaca</button>
                    <button class="yellow" onclick="editBook('${book.id}')">Edit Buku</button>
                    <button class="red" onclick="deleteBook('${book.id}')">Hapus buku</button>
                </div>
            </article>
            `;

      inCompleted.innerHTML += el;
    } else {
      let el = `
            <article class="book_item">
                <h3>${book.bookTitle}</h3>
                <p>Penulis: ${book.author}</p>
                <p>Tahun: ${book.bookYear}</p>

                <div class="action">
                    <button class="green" onclick="unreadedBook('${book.id}')">Belum selesai di Baca</button>
                    <button class="yellow" onclick="editBook('${book.id}')">Edit Buku</button>
                    <button class="red" onclick="deleteBook('${book.id}')">Hapus buku</button>
                </div>
            </article>
            `;
      completed.innerHTML += el;
    }
  });
}

function showSearchResult(books) {
  const searchResult = document.querySelector("#searchResult");

  searchResult.innerHTML = "";

  books.forEach((book) => {
    var el = `
        <article class="book_item">
            <h3>${book.bookTitle}</h3>
            <p>Penulis: ${book.author}</p>
            <p>Tahun: ${book.bookYear}</p>
            <p>${book.isCompleted ? "Sudah Dibaca" : "Belum Dibaca"}</p>
        </article>
        <span id="clear">Clear</span>
        `;

    searchResult.innerHTML += el;
    const clear = document.getElementById("clear");

    clear.addEventListener("click", function () {
      searchResult.innerHTML = "";
    });
  });
}

function readedBook(id) {
  let confirmation = confirm("Pindahkan ke Selesai Dibaca?");

  if (confirmation == true) {
    const bookDataDetail = getData().filter((a) => a.id == id);
    const newBook = {
      id: bookDataDetail[0].id,
      bookTitle: bookDataDetail[0].bookTitle,
      author: bookDataDetail[0].author,
      bookYear: bookDataDetail[0].bookYear,
      isCompleted: true,
    };

    const bookData = getData().filter((a) => a.id != id);
    localStorage.setItem(localStorageKey, JSON.stringify(bookData));

    insertData(newBook);
  } else {
    return 0;
  }
}

function unreadedBook(id) {
  let confirmation = confirm("Pindahkan ke Belum Selesai Dibaca?");

  if (confirmation == true) {
    const bookDataDetail = getData().filter((a) => a.id == id);
    const newBook = {
      id: bookDataDetail[0].id,
      bookTitle: bookDataDetail[0].bookTitle,
      author: bookDataDetail[0].author,
      bookYear: bookDataDetail[0].bookYear,
      isCompleted: false,
    };

    const bookData = getData().filter((a) => a.id != id);
    localStorage.setItem(localStorageKey, JSON.stringify(bookData));

    insertData(newBook);
  } else {
    return 0;
  }
}

function editBook(id) {
  const bookDataDetail = getData().filter((a) => a.id == id);
  bookTitle.value = bookDataDetail[0].bookTitle;
  author.value = bookDataDetail[0].author;
  bookYear.value = bookDataDetail[0].bookYear;
  bookDataDetail[0].isCompleted ? (read.checked = true) : (read.checked = false);

  btnSubmit.innerHTML = "Edit buku";
  btnSubmit.value = bookDataDetail[0].id;
  window.scrollTo({ top: 0 });
}

function deleteBook(id) {
  let confirmation = confirm("Yakin akan menghapusnya?");

  if (confirmation == true) {
    const bookDataDetail = getData().filter((a) => a.id == id);
    const bookData = getData().filter((a) => a.id != id);
    localStorage.setItem(localStorageKey, JSON.stringify(bookData));
    showData(getData());
    alert(`Buku ${bookDataDetail[0].bookTitle} telah terhapus`);
  } else {
    return 0;
  }
}
