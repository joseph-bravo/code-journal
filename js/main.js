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

  // entryObj ⬇️
  // title: string
  // photoUrl: string
  // notes: string
  // entryId: number

  entryObj.title = $entryTitle.value;
  entryObj.photoUrl = $photoUrl.value;
  entryObj.notes = $entryNotes.value;
  entryObj.entryId = data.nextEntryId;
  data.nextEntryId++;
  data.entries.unshift(entryObj);
  $newEntryForm.reset();

  $entryDisplay.prepend(createJournalEntryDOM(entryObj));

  updateStoredData();
  resetPreviewImage();
  setView('entries');
}

$newEntryForm.addEventListener('submit', submitHandler);

window.addEventListener('keydown', function (event) {
  if (event.key === 'Enter' && event.ctrlKey) {
    $newEntryForm.requestSubmit();
  }
});

function createJournalEntryDOM(entry) {

  // <li class="row journal-entry">
  //   <div class="column-half">
  //     <img class="entry-img" src="https://c.tenor.com/a1iw8cAQKisAAAAM/dance-dance-moves.gif">
  //   </div>
  //   <div class="column-half">
  //     <h3>Bababooey</h3>
  //     <p>Lorem</p>
  //     <p>Lorem</p>
  //   </div>
  // </li>

  var $imgDiv = document.createElement('div');
  $imgDiv.classList.add('column-half');
  var $img = document.createElement('img');
  $img.classList.add('entry-img');
  $img.src = (entry.photoUrl);
  $imgDiv.append($img);
  // imgDiv > img.entry-img

  var $textDiv = document.createElement('div');
  $textDiv.classList.add('column-half');
  var $h3 = document.createElement('h3');
  $h3.textContent = entry.title;
  $textDiv.append($h3);
  // textDiv > h3

  var notesSplit = entry.notes.split('\n');
  var notesSplitFiltered = notesSplit.filter(function (element) {
    return (element);
  });
  for (var noteP = 0; noteP < notesSplitFiltered.length; noteP++) {
    var paragraph = document.createElement('p');
    paragraph.textContent = notesSplitFiltered[noteP];
    $textDiv.append(paragraph);
  }
  // textDiv > h3 / p / p ...

  var $listItem = document.createElement('li');
  $listItem.classList.add('row', 'journal-entry');
  $listItem.append($imgDiv, $textDiv);
  // listItem > imgDiv / textDiv ...

  return $listItem;
}

var $views = document.querySelectorAll('[data-view]');

function setView(viewString) {
  checkForPosts();
  for (var viewIndex = 0; viewIndex < $views.length; viewIndex++) {
    if ($views[viewIndex].dataset.view === viewString) {
      $views[viewIndex].classList.remove('hidden');
    } else {
      $views[viewIndex].classList.add('hidden');
    }
  }
  data.view = viewString;
  updateStoredData();
}

var $viewNav = document.querySelectorAll('[data-nav]');

for (var navIndex = 0; navIndex < $viewNav.length; navIndex++) {
  $viewNav[navIndex].addEventListener('click', function (event) {
    setView(event.target.dataset.nav);
  });
}

function checkForPosts() {
  if (journalEntries.length > 0) {
    $noEntryMessage.classList.add('hidden');
  } else {
    $noEntryMessage.classList.remove('hidden');
  }
}

//! INITIALIZE PAGE
var $entryDisplay = document.querySelector('#entry-display');
var journalEntries = data.entries;
var $noEntryMessage = document.querySelector('.no-entry-message');

function pageLoad(event) {
  setView(data.view);
  checkForPosts();
  for (var entryIndex = 0; entryIndex < data.entries.length; entryIndex++) {
    $entryDisplay.append(createJournalEntryDOM(journalEntries[entryIndex]));
  }
}

window.addEventListener('DOMContentLoaded', pageLoad);
