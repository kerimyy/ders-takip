const btn = document.getElementById("dersEkle");
const dersAdi = document.getElementById("dersAdi");
const liste = document.querySelector(".liste");
const con = document.querySelector(".defter-con");
liste.addEventListener("click", addBall);
btn.addEventListener("click", addLesson);
const formNote=`<div class="defter">
<form id="note-form" onsubmit="return false;">
    <input type="text" placeholder="Konu Başlıkları" id="title">
    <textarea placeholder="not..."name="notes" id="note" ></textarea>
    <div class="save"><i class="far fa-save"></i></div>
</form></div>`;
var lookingBall;
getLessons();

function addLesson() {
    var text = dersAdi.value;
    if(!text){return;}
    dersAdi.value = "";
    saveLessons(text);
    createLesson(text);


}

function createAddDel(ders) {
    const satir = ders.parentElement;
    const ekleSil = document.createElement("div");
    ekleSil.classList.add("ekle_sil");
    satir.appendChild(ekleSil);

    const arti = document.createElement("div");
    arti.classList.add("arti");
    arti.innerHTML = '<i class="fas fa-plus">'
    ekleSil.appendChild(arti);

    const eksi = document.createElement("div");
    eksi.classList.add("eksi");
    eksi.innerHTML = '<i class="fas fa-minus">'
    ekleSil.appendChild(eksi);

    var mouseControle = false;

    ekleSil.addEventListener("mouseover", function () {
        mouseControle = true;
    });

    ekleSil.addEventListener("mouseout", function () {
        mouseControle = false;
        setTimeout(function () {
            if (!mouseControle) {
                ekleSil.style.visibility = "hidden";
                ders.style.visibility = "visible";
            }
        }, 50);
    });

    ders.addEventListener("mouseover", function () {
        ders.style.visibility = "hidden";
        ekleSil.style.visibility = "visible";
    });

}
function createLesson(text) {
    const satirDiv = document.createElement("div");
    satirDiv.classList.add("satir");
    const dersDiv = document.createElement("div");
    dersDiv.classList.add("ders");
    dersDiv.classList.add("unselectable");
    dersDiv.textContent = text;
    satirDiv.appendChild(dersDiv);
    liste.appendChild(satirDiv);
    createAddDel(dersDiv);


    return satirDiv;
}

function addBall(e) {
    const item = e.target;
    const satir = item.parentElement.parentElement;
    const ders = satir.children[0];
    console.log(item);
    if (item.classList[0] === "arti") {
        var count = saveCount(ders);
        createBall(satir, count);
    }
    else if (item.classList[0] === "eksi") {
        if (satir.childElementCount == 2) {
            removeLesson(ders);
            return;
        }
        removeCount(ders);
        removeBall(satir);
    }


}

function saveCount(item) {
    let lesson = item.textContent;
    let count;
    lessons = JSON.parse(localStorage.getItem("lessons"));
    lessons.forEach(function (item) {
        if (item.name == lesson) {
            count = ++item.count;
            let lastId = item.items[item.items.length - 1].id;
            let newItem = {
                id: (lastId + 1),
                selected: false,
                head: "",
                content: ""
            };
            item.items.push(newItem);
            return;
        }
    });
    localStorage.setItem("lessons", JSON.stringify(lessons));
    return count;
}


function removeCount(item) {
    let lesson = item.textContent;
    let count;
    lessons = JSON.parse(localStorage.getItem("lessons"));
    lessons.forEach(function (item) {
        if (item.name == lesson) {
            count = --item.count;
            return;
        }
    });

    localStorage.setItem("lessons", JSON.stringify(lessons));
}


function saveLessons(text) {
    let lessons;
    if (localStorage.getItem("lessons") === null) {
        lessons = [];
    } else {
        lessons = JSON.parse(localStorage.getItem("lessons"));
    }
    var lesson = {
        name: text,
        count: 0,
        items: [
            {
                id: 0,
                selected: false,
                head: "konu başlıkları",
                content: "notlar"

            }
        ]
    };
    lessons.push(lesson);
    localStorage.setItem("lessons", JSON.stringify(lessons));

}

function getLessons() {
    let lessons;
    if (localStorage.getItem("lessons") === null) {
        lessons = [];
    } else {
        lessons = JSON.parse(localStorage.getItem("lessons"));
    }
    lessons.forEach(function (item) {
        const satirDiv = createLesson(item.name);
        var count = item.count;
        for (var i = 1; count >= i; i++) {
            var isSelected = item.items[i].selected;
            var head = item.items[i].head;
            var content = item.items[i].content;
            createBall(satirDiv, i, isSelected,head,content)
        }


    });

}

function createBall(satir, num, isSelected, head, content) {
    const topDiv = document.createElement("div");
    topDiv.classList.add("top");
    topDiv.classList.add("unselectable");
    if(isSelected){topDiv.classList.add("selected");}
    satir.appendChild(topDiv);
    topDiv.textContent = num;
    var lessons = JSON.parse(localStorage.getItem("lessons"));

    const lesson = satir.children[0].textContent;

    topDiv.addEventListener("click", function () {
        if(topDiv.classList.contains("looking")){
            con.innerHTML="";
            lookingBall.classList.remove("looking");
            return;
        }
        if(lookingBall){
            lookingBall.classList.remove("looking");
        }

        topDiv.classList.add("looking");
        lookingBall = topDiv;
        con.innerHTML = formNote;
        var noteTitle = document.getElementById("title");
        var note = document.getElementById("note");
        var save = document.querySelector(".save");
        lessons = JSON.parse(localStorage.getItem("lessons"));
        lessons.forEach(function (item) {
            if (item.name == lesson) {
                noteTitle.value = item.items[num].head;
                note.value = item.items[num].content;

                save.addEventListener("click",function(){
                    item.items[num].head = noteTitle.value;
                    item.items[num].content = note.value;
                    localStorage.setItem("lessons", JSON.stringify(lessons));
                    window.alert(item.name+" dersinin "+num+". ders notu başarılı bir şekilde kaydedildi");
                })
            }

        });
        localStorage.setItem("lessons", JSON.stringify(lessons));
    }) 


    topDiv.addEventListener("dblclick", function () {
        lessons = JSON.parse(localStorage.getItem("lessons"));
        lessons.forEach(function (item) {
            if (item.name == lesson) {
                if (item.items[num].selected) {
                    item.items[num].selected = false;
                    topDiv.classList.remove("selected");
                } else {
                    item.items[num].selected = true;
                    topDiv.classList.add("selected");
                }

                return;
            }

        });
        localStorage.setItem("lessons", JSON.stringify(lessons));
    });
}

function removeBall(satir) {
    satir.lastElementChild.remove();
}

function removeLesson(ders) {
    let name = ders.textContent;
    let index = 0;
    let count = 0;
    lessons = JSON.parse(localStorage.getItem("lessons"));
    lessons.forEach(function (item) {

        if (item.name == name) {

            index = count;
        }
        count++;
    });
    lessons.splice(index, 1);
    localStorage.setItem("lessons", JSON.stringify(lessons));
    ders.parentElement.remove();
}