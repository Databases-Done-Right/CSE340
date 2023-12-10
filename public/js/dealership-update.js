const form = document.querySelector("#updateForm")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector(".buttonContainer input")
      updateBtn.removeAttribute("disabled")
    })