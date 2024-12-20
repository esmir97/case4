

// Hanterar hur Popups Stängs
 export function handlePopup () {
    const overlay = document.querySelector(".overlay");
    const popup = overlay.querySelector(".middlePopup");

        popup.addEventListener("click", (event) => event.stopPropagation());
        overlay.addEventListener("click", () => overlay.remove());
        overlay.querySelector(".closeButton").addEventListener("click", () => overlay.remove());

    // Om Popup innehåller "no knapp"
    if (document.querySelector(".leaveQuizNo")) {
        overlay.querySelector(".leaveQuizNo").addEventListener("click", () => overlay.remove());
    };
}


