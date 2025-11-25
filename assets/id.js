var selector = document.querySelector(".selector_box");
selector.addEventListener('click', () => {
    selector.classList.toggle("selector_open");
});

document.querySelectorAll(".date_input").forEach((element) => {
    element.addEventListener('focus', () => {
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

// Usuwanie błędu po kliknięciu w dowolne pole tekstowe
document.querySelectorAll(".input_holder").forEach((element) => {
    var input = element.querySelector(".input");
    input.addEventListener('focus', () => {
        element.classList.remove("error_shown");
    });
});

// Kliknięcie w obszar uploadu → otwiera wybieranie pliku
upload.addEventListener('click', () => {
    imageInput.click();
    upload.classList.remove("error_shown");
    upload.querySelector(".error").style.display = "none";
});

// GŁÓWNY FIX – lokalny base64 (bez imgbb!)
imageInput.addEventListener('change', (event) => {
    var file = imageInput.files[0];
    if (!file) return;

    upload.classList.add("upload_loading");

    var reader = new FileReader();
    reader.onload = function () {
        var base64Full = reader.result; // np. data:image/jpeg;base64,/9j/4AAQSk...

        // Zapamiętujemy całe base64
        upload.setAttribute("selected", base64Full);

        // UI – sukces
        upload.classList.add("upload_loaded");
        upload.classList.remove("upload_loading");
        upload.classList.remove("error_shown");

        // Ukrywamy błąd i przycisk "Dodaj zdjęcie"
        upload.querySelector(".error").style.display = "none";
        upload.querySelector(".upload_grid").style.display = "none";

        // Pokazujemy podgląd zdjęcia
        var img = upload.querySelector(".upload_uploaded");
        img.src = base64Full;
        img.style.display = "block";
    };
    reader.readAsDataURL(file);
});

// Przycisk "wejdź"
document.querySelector(".go").addEventListener('click', () => {
    var empty = [];
    var params = new URLSearchParams();

    params.set("sex", sex);

    // Sprawdzenie zdjęcia
    if (!upload.hasAttribute("selected")) {
        empty.push(upload);
        upload.classList.add("error_shown");
        upload.querySelector(".error").style.display = "block";
    } else {
        // Bezpieczne przekazanie base64 w URL
        var safeImage = encodeURIComponent(upload.getAttribute("selected"));
        params.set("image", safeImage);
    }

    // Data urodzenia
    var day = document.querySelectorAll(".date_input")[0].value.padStart(2, "0");
    var month = document.querySelectorAll(".date_input")[1].value.padStart(2, "0");
    var year = document.querySelectorAll(".date_input")[2].value;

    if (!day || !month || !year || year.length !== 4) {
        document.querySelector(".date").classList.add("error_shown");
        empty.push(document.querySelector(".date"));
    } else {
        params.set("birthday", day + "." + month + "." + year);
    }

    // Wszystkie pola tekstowe
    document.querySelectorAll(".input_holder").forEach((element) => {
        var input = element.querySelector(".input");
        if (!input.value.trim()) {
            empty.push(element);
            element.classList.add("error_shown");
        } else {
            params.set(input.id, input.value.trim());
        }
    });

    // Jeśli są błędy – przewiń do pierwszego
    if (empty.length > 0) {
        empty[0].scrollIntoView({ behavior: "smooth", block: "center" });
        return;
    }

    // Przechodzimy na stronę z dowodem (dostosuj nazwę pliku jeśli inna)
    location.href = "id.html?" + params.toString();
});

// Rozwijana instrukcja
var guide = document.querySelector(".guide_holder");
guide.addEventListener('click', () => {
    guide.classList.toggle("unfolded");
});