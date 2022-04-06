/* exported data */
/* exported updateStoredData */

// entryObj =
// title: string
// photoUrl: string
// notes: string
// entryId: number

var data = {
  view: 'entry-form',
  entries: [],
  editing: null,
  nextEntryId: 1
};

function updateStoredData() {
  localStorage.setItem('data', JSON.stringify(data));
}

function readStoredData() {
  var storedData = localStorage.getItem('data');
  if (storedData) {
    data = JSON.parse(storedData);
  }
}

readStoredData();
