/* global data */
/* exported data */
/* global updateStoredData */

var $entryForm = document.forms['entry-form'];
var $entryTitle = $entryForm['title-entry'];
var $photoUrl = $entryForm['photo-url'];
var $entryNotes = $entryForm['notes-entry'];
var $entryTags = $entryForm.tags;

var $imagePreview = document.querySelector('.entry-img-preview');

var $deleteTarget = document.querySelector('.delete-target');

function updatePreviewImage() {
  if ($photoUrl.value) {
    $imagePreview.setAttribute('src', $photoUrl.value);
  } else {
    $imagePreview.setAttribute('src', 'images/placeholder-image-square.jpg');
  }

}

function resetPreviewImage() {
  $imagePreview.setAttribute('src', 'images/placeholder-image-square.jpg');
}

$photoUrl.addEventListener('input', updatePreviewImage);

function entryTagHandler(string) {
  var output = [];
  var splitArray = string.split(' ');
  for (var tagIndex = 0; tagIndex < splitArray.length; tagIndex++) {
    if (splitArray[tagIndex] && !output.includes(splitArray[tagIndex])) {
      output.push(splitArray[tagIndex]);
    }
  }
  return output;
}

function submitHandler(event) {
  event.preventDefault();

  var entryObj = {};
  var nextView = '';

  // entryObj ⬇️
  // title: string
  // photoUrl: string
  // notes: string
  // entryId: number
  // dateCreated: new Date()
  // lastModified: new Date()
  // tags: array

  if (data.editing === null) {
    entryObj.title = $entryTitle.value;
    entryObj.photoUrl = $photoUrl.value;
    entryObj.notes = $entryNotes.value;
    entryObj.entryId = data.nextEntryId;
    entryObj.dateCreated = new Date();
    entryObj.lastModified = new Date();
    entryObj.tags = entryTagHandler($entryTags.value);
    data.entries.unshift(entryObj);
    data.nextEntryId++;
    $entryForm.reset();

    var $newEntryDiv = createJournalEntryDOM(entryObj);
    $entryDisplay.prepend($newEntryDiv);

    nextView = 'entries';

  } else {
    data.editing.title = $entryTitle.value;
    data.editing.photoUrl = $photoUrl.value;
    data.editing.notes = $entryNotes.value;
    data.editing.lastModified = new Date();
    data.editing.tags = entryTagHandler($entryTags.value);

    var $oldDiv = data.editing.dom;
    var $newDiv = createJournalEntryDOM(data.editing);
    $entryDisplay.replaceChild($newDiv, $oldDiv);

    nextView = data.editFrom;
    data.editFrom = null;
  }
  updateStoredData();
  resetPreviewImage();
  detailedViewUpdate();
  setView(nextView);
}
$entryForm.addEventListener('submit', submitHandler);
window.addEventListener('keydown', function (event) {
  if (event.key === 'Enter' && event.ctrlKey) {
    $entryForm.requestSubmit();
  }
});

var dateFormat = new Intl.DateTimeFormat([], { dateStyle: 'medium', timeStyle: 'short' });

function splitNotesIntoParagraphs(string, target) {
  var notesSplit = string.split('\n');
  var notesSplitFiltered = notesSplit.filter(function (element) {
    return (element);
  });
  for (var noteP = 0; noteP < notesSplitFiltered.length; noteP++) {
    var paragraph = document.createElement('p');
    paragraph.textContent = notesSplitFiltered[noteP];
    target.append(paragraph);
  }
}

function createJournalEntryDOM(entry) {

  /*
  <li class="row journal-entry" data-entry-id="1">
    <div class="column-half">
      <img class="entry-img" src="https://c.tenor.com/itjaaJTQUEYAAAAd/cat-vibing.gif">
    </div>
    <div class="column-half">
      <div class="row space-between">
        <div class="column-content">
          <h3>title
          <h4>April 6th, 2022 / 12:30pm
        </div>
        <a class="edit-button fa fa-edit"></a>
      </div>
      <p>Lorem</p>
      <p>Lorem</p>
      <p>Lorem</p>
    </div>
  </li>
  */

  var $imgDiv = document.createElement('div');
  $imgDiv.classList.add('column-half');
  var $img = document.createElement('img');
  $img.classList.add('entry-img');
  $img.src = (entry.photoUrl);
  $imgDiv.append($img);
  // imgDiv > img.entry-img

  var $textDiv = document.createElement('div');
  $textDiv.classList.add('column-half');

  var $headerDiv = document.createElement('div');
  $headerDiv.classList.add('row', 'space-between');

  var $h3 = document.createElement('h3');
  $h3.textContent = entry.title;
  var $date = document.createElement('h4');
  $date.textContent = dateFormat.format(entry.dateCreated);

  var $h3AndDate = document.createElement('div');
  $h3AndDate.classList.add('header-and-date');
  $h3AndDate.append($h3, $date);

  var $anchor = document.createElement('a');
  $anchor.classList.add('edit-button', 'fa', 'fa-edit');

  $headerDiv.append($h3AndDate, $anchor);
  // headerDiv > h3 & date / icon

  $textDiv.append($headerDiv);
  // textDiv > headerDiv

  splitNotesIntoParagraphs(entry.notes, $textDiv);
  // textDiv > headerDiv / p / p ...

  var $listItem = document.createElement('li');
  $listItem.classList.add('row', 'journal-entry');
  $listItem.setAttribute('data-entry-id', entry.entryId);
  $listItem.append($imgDiv, $textDiv);
  // listItem > imgDiv / textDiv ...
  entry.dom = $listItem;
  return $listItem;
}
var $formHeaderNew = document.querySelector('.new-entry-head');
var $formHeaderEdit = document.querySelector('.edit-entry-head');

function newEntryHandler(event) {
  $deleteTarget.classList.add('hidden');
  data.editing = null;

  $formHeaderEdit.classList.add('hidden');
  $formHeaderNew.classList.remove('hidden');

  $entryForm.reset();
  updatePreviewImage();
  setView('entry-form');
}
var $buttonNewEntry = document.querySelector('.button-new');
$buttonNewEntry.addEventListener('click', newEntryHandler);

// data-nav handling
var $views = document.querySelectorAll('[data-view]');
var $viewNav = document.querySelectorAll('[data-nav]');
for (var navIndex = 0; navIndex < $viewNav.length; navIndex++) {
  $viewNav[navIndex].addEventListener('click', function (event) {
    setView(event.target.dataset.nav);
  });
}
function setView(viewString) {
  checkForPosts();
  reorderList(data.sortBy.type, data.sortBy.isReverse);
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

function checkForPosts() {
  if (journalEntries.length > 0) {
    $noEntryMessage.classList.add('hidden');
  } else {
    $noEntryMessage.classList.remove('hidden');
  }
}

var $entryDisplay = document.querySelector('#entry-display');

function editFormFiller(obj) {

  $formHeaderEdit.classList.remove('hidden');
  $formHeaderNew.classList.add('hidden');
  $entryTitle.value = obj.title;
  $photoUrl.value = obj.photoUrl;
  $entryNotes.value = obj.notes;
  $entryTags.value = obj.tags.join(' ');
  updatePreviewImage();
}

var $detailedView = document.querySelector('[data-view="detailed"]');
var $detailedImage = $detailedView.querySelector('.entry-img');
var $detailedTitle = $detailedView.querySelector('.single-entry-title');
var $detailedDate = $detailedView.querySelector('.single-date');
var $detailedNotes = $detailedView.querySelector('.single-notes');
var $detailedModified = $detailedView.querySelector('.single-modified');
var $detailedTagList = $detailedView.querySelector('.tag-list');

function detailedViewUpdate() {
  $detailedView.setAttribute('data-entry-id', data.viewing.entryId);
  $detailedImage.setAttribute('src', data.viewing.photoUrl);
  $detailedTitle.textContent = data.viewing.title;
  $detailedDate.textContent = dateFormat.format(data.viewing.dateCreated);
  $detailedModified.textContent = 'last modified ' + dateFormat.format(data.viewing.lastModified);

  while ($detailedNotes.children.length > 0) {
    $detailedNotes.children[0].remove();
  }
  splitNotesIntoParagraphs(data.viewing.notes, $detailedNotes);

  while ($detailedTagList.children.length > 0) {
    $detailedTagList.children[0].remove();
  }
  for (var tagIndex = 0; tagIndex < data.viewing.tags.length; tagIndex++) {
    var $newTag = document.createElement('li');
    var $newTagAnchor = document.createElement('a');
    $newTagAnchor.textContent = data.viewing.tags[tagIndex];
    $newTag.classList.add('tag-item');
    $newTag.append($newTagAnchor);
    $detailedTagList.append($newTag);
  }
}

function entryDisplayLinks(event) {
  if (event.target.matches('.edit-button')) {
    data.editFrom = data.view;
    var $correspondingDiv = event.target.closest('[data-entry-id]');
    var correspondingEntryId = $correspondingDiv.dataset.entryId;
    data.editing = data.getEntryObject(JSON.parse(correspondingEntryId));
    editFormFiller(data.editing);
    $deleteTarget.classList.remove('hidden');
    setView('entry-form');
  }
  if (event.target.matches('.journal-entry h3')) {
    var correspondingDetailedId = event.target.closest('[data-entry-id]').dataset.entryId;
    data.viewing = data.getEntryObject(JSON.parse(correspondingDetailedId));
    detailedViewUpdate();
    setView('detailed');
  }
  if (event.target.matches('.back')) {
    if (data.view === 'entry-form' && data.editFrom) {
      setView(data.editFrom);
      data.editFrom = null;
    } else {
      setView('entries');
    }
  }
}

// $entryDisplay.addEventListener('click', entryDisplayLinks);
// $detailedView.addEventListener('click', entryDisplayLinks);
var $container = document.querySelector('main.container');
$container.addEventListener('click', entryDisplayLinks);

var $deletePopup = document.querySelector('.modal');
function deleteButtonHandler(event) {
  $deletePopup.classList.remove('hidden');
}
$deleteTarget.addEventListener('click', deleteButtonHandler);
var $deleteConfirm = document.querySelector('button.confirm');
var $deleteCancel = document.querySelector('button.cancel');

function popupHandler(event) {
  if (event.target === $deleteCancel) {
    $deletePopup.classList.add('hidden');
  }
  if (event.target === $deleteConfirm) {
    var $divToDelete = data.editing.dom;
    data.entries.splice((data.entries.indexOf(data.editing)), 1);
    $divToDelete.remove();
    $deletePopup.classList.add('hidden');
    setView('entries');
  }
}

$deletePopup.addEventListener('click', popupHandler);

function reorderList(sortOrder, isReverse) {
  if (!sortOrder) {
    return;
  }
  var sortedArray = [];
  switch (sortOrder) {
    case 'added':
      sortedArray = data.sortByDateAdded(isReverse);
      for (var i = 0; i < sortedArray.length; i++) {
        $entryDisplay.append(sortedArray[i].dom);
      }
      break;
    case 'modified':
      sortedArray = data.sortByLastModified(isReverse);
      // eslint-disable-next-line no-redeclare
      for (var i = 0; i < sortedArray.length; i++) {
        $entryDisplay.append(sortedArray[i].dom);
      }
      break;
    case 'alphabetical':
      sortedArray = data.sortByAlphabet(isReverse);
      // eslint-disable-next-line no-redeclare
      for (var i = 0; i < sortedArray.length; i++) {
        $entryDisplay.append(sortedArray[i].dom);
      }
      break;
  }
}

var $sortOptionsContainer = document.querySelector('.sort-select');
var $sortOption = document.querySelector('#sort-option');
var $reverseOption = document.querySelector('#reverse-sort');
function sortOptionHandler(event) {
  data.sortBy.type = $sortOption.value;
  data.sortBy.isReverse = $reverseOption.checked;
  reorderList(data.sortBy.type, data.sortBy.isReverse);
  updateStoredData();
}
$sortOptionsContainer.addEventListener('input', sortOptionHandler);

function initializeSortOptions() {
  $sortOption.value = data.sortBy.type;
  $reverseOption.checked = data.sortBy.isReverse;
}

//! INITIALIZE PAGE
var journalEntries = data.entries;
var $noEntryMessage = document.querySelector('.no-entry-message');

function pageLoad(event) {
  if (data.viewing) {
    detailedViewUpdate();
  }
  for (var entryIndex = 0; entryIndex < data.entries.length; entryIndex++) {
    $entryDisplay.append(createJournalEntryDOM(journalEntries[entryIndex]));
  }
  initializeSortOptions();
  setView(data.view);
}

window.addEventListener('DOMContentLoaded', pageLoad);
