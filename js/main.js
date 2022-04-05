/* global data */
/* exported data */
/* global updateStoredData */

var $newEntryForm = document.forms['new-entry'];
var $entryTitle = $newEntryForm['title-entry'];
var $photoUrl = $newEntryForm['photo-url'];
var $entryNotes = $newEntryForm['notes-entry'];

var $imagePreview = document.querySelector('.entry-img-preview');

function updatePreviewImage(event) {
  $imagePreview.setAttribute('src', $photoUrl.value);
}

function resetPreviewImage() {
  $imagePreview.setAttribute('src', 'images/placeholder-image-square.jpg');
}

$photoUrl.addEventListener('input', updatePreviewImage);

function submitHandler(event) {
  event.preventDefault();
  var entryObj = {};
  entryObj.title = $entryTitle.value;
  entryObj.photoUrl = $photoUrl.value;
  entryObj.notes = $entryNotes.value;
  entryObj.entryId = data.nextEntryId;
  data.nextEntryId++;
  data.entries.unshift(entryObj);
  $newEntryForm.reset();

  updateStoredData();
  resetPreviewImage();
}

$newEntryForm.addEventListener('submit', submitHandler);

window.addEventListener('keydown', function (event) {
  if (event.key === 'Enter' && event.ctrlKey) {
    $newEntryForm.requestSubmit();
  }
});
