document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("profile-form");
    const reviewPanel = document.getElementById("review-panel");
    const reviewContent = document.getElementById("review-content");
    const reviewButton = document.getElementById("review-button");
    const editButton = document.getElementById("edit-button");
    const confirmButton = document.getElementById("confirm-button");

    if (!form || !reviewPanel || !reviewContent || !reviewButton ||
        !editButton || !confirmButton) {
        console.error("Review form elements are missing. Check the HTML IDs.");
        return;
    }

    reviewButton.addEventListener("click", () => {
        if (!form.reportValidity()) return;

        reviewContent.replaceChildren();

        const controls = Array.from(form.elements);
        const names = [...new Set(
            controls
                .filter(control => control.name)
                .map(control => control.name)
        )];

        for (const name of names) {
            const matching = controls.filter(control => control.name === name);
            const first = matching[0];

            if (["submit", "reset", "button"].includes(first.type)) continue;

            let values;

            if (first.type === "radio") {
                values = matching.filter(control => control.checked)
                                 .map(control => control.value);
            } else if (first.type === "checkbox") {
                values = matching.filter(control => control.checked)
                                 .map(control => control.value);
            } else if (first.tagName === "SELECT" && first.multiple) {
                values = Array.from(first.selectedOptions, option => option.value);
            } else {
                values = [first.value].filter(Boolean);
            }

            const label = first.labels?.[0]?.textContent.trim().replace(/:$/, "")
                || name.replaceAll("_", " ");

            const term = document.createElement("dt");
            term.textContent = label;

            const detail = document.createElement("dd");
            detail.textContent = values.length ? values.join(", ") : "None selected";

            reviewContent.append(term, detail);
        }

        form.hidden = true;
        reviewPanel.hidden = false;
        reviewPanel.scrollIntoView({ behavior: "smooth" });
    });

    editButton.addEventListener("click", () => {
        reviewPanel.hidden = true;
        form.hidden = false;
        form.scrollIntoView({ behavior: "smooth" });
    });

    confirmButton.addEventListener("click", () => {
        form.submit();
    });
});
