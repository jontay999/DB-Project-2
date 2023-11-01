function openModal(title, content) {
  const modal = document.getElementById("myModal");
  const closeModalButton = document.getElementById("close-modal");
  modal.style.display = "flex";
  closeModalButton.addEventListener("click", () => {
    modal.style.display = "none";
  });
  const modalTitle = document.getElementById("modal-title");
  const modalContent = document.getElementById("modal-body");
  modalTitle.textContent = title;
  modalContent.textContent = content;
}
