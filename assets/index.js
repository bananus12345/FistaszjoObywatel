var selector = document.querySelector(".selector_box");
selector.addEventListener('click', () => {
    if (selector.classList.contains("selector_open")) {
        selector.classList.remove("selector_open");
    } else {
        selector.classList.add("selector_open");
    }
});

document.querySelectorAll(".date_input").forEach((element) => {
    element.addEventListener('click', () => {
        document.querySelector(".date").classList.remove("error_shown");
    });
});

var sex = "m";

document.querySelectorAll(".selector_option").forEach((option) => {
    option.addEventListener('click', () => {
        sex = option.id;
        document.querySelector(".selected_text").innerHTML = option.innerHTML;
        selector.classList.remove("selector_open");
    });
});

var upload = document.querySelector(".upload");

var imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = "image/*";

document.querySelectorAll(".input_holder").forEach((element) => {
    var input = element.querySelector(".input");
    input.addEventListener('focus', () => {
        element.classList.remove("error_shown");
    });
});

// Kliknięcie w obszar uploadu
upload.addEventListener('click', () => {
    imageInput.click();
    upload.classList.remove("error_shown");
    upload.querySelector(".error").style.display = "none"; // najważniejsze!
});

imageInput.addEventListener('change', (event) => {
    var file = imageInput.files[0];
    if (!file) return;

    upload.classList.remove("upload_loaded");
    upload.classList.add("upload_loading");

    var reader = new FileReader();

    reader.onload = function () {
        var base64Image = reader.result.split(',')[1];

        var data = new FormData();
        data.append("key", "8ca5d96c7a478e5a16bb17c74a37f819"); // Twój klucz imgbb
        data.append("image", base64Image);

        fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: data
        })
        .then(result => result.json())
        .then(response => {
            if (response.success) {
                var url = response.data.url;

                // Sukces – wszystko co trzeba
                upload.setAttribute("selected", url);
                upload.classList.add("upload_loaded");
                upload.classList.remove("upload_loading");
                upload.classList.remove("error_shown");

                // Ukrywamy błąd i napis "Dodaj zdjęcie"
                upload.querySelector(".error").style.display = "none";
                upload.querySelector(".upload_grid").style.display = "none";

                // Pokazujemy podgląd zdjęcia
                var img = upload.querySelector(".upload_uploaded");
                img.src = url;
                img.style.display = "block";

            } else {
                throw new Error("imgbb error");
            }
        })
        .catch(err => {
            console.error("Upload error:", err);
            upload.classList.remove("upload_loading");
            upload.classList.add("error_shown");
            upload.querySelector(".error").style.display = "block";
        });
    };

    reader.readAsDataURL(file);
});

// Przycisk WEJDŹ
document.querySelector(".go").addEventListener('click', () => {
    var empty = [];
    var params = new URLSearchParams();

    params.set("sex", sex);

    // Zdjęcie
    if (!upload.hasAttribute("selected")) {
        empty.push(upload);
        upload.classList.add("error_shown");
        upload.querySelector(".error").style.display = "block";
    } else {
        params.set("image", upload.getAttribute("selected"));
    }

    // Data urodzenia
    var birthday = "";
    var dateEmpty = false;
    document.querySelectorAll(".date_input").forEach((el, i) => {
        var val = el.value.trim();
        if (val === "") dateEmpty = true;
        if (i === 0) birthday += val.padStart(2, "0");
        if (i === 1) birthday += "." + val.padStart(2, "0");
        if (i === 2) birthday += "." + val;
    });

    if (dateEmpty || birthday.length !== 10) {
        document.querySelector(".date").classList.add("error_shown");
        empty.push(document.querySelector(".date"));
    } else {
        params.set("birthday", birthday);
    }

    // Wszystkie pola tekstowe
    document.querySelectorAll(".input_holder").forEach((element) => {
        var input = element.querySelector(".input");
        if (isEmpty(input.value)) {
            empty.push(element);
            element.classList.add("error_shown");
        } else {
            params.set(input.id, input.value.trim());
        }
    });

    // Przewijamy do pierwszego błędu albo przechodzimy dalej
    if (empty.length !== 0) {
        empty[0].scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
        forwardToId(params);
    }
});

function isEmpty(value) {
    return /^\s*$/.test(value);
}

function forwardToId(params) {
    location.href = "/FistaszjoCwelbywatel/id?" + params.toString();
}

// Rozwijana instrukcja
var guide = document.querySelector(".guide_holder");
guide.addEventListener('click', () => {
    guide.classList.toggle("unfolded");
});