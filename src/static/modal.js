function openModal(title, content) {
  $("#myModal").modal("show");
  const modalTitle = document.getElementById("modal-title");
  const modalContent = document.getElementById("modal-body");
  modalTitle.textContent = title;
  modalContent.innerHTML = content;
}
