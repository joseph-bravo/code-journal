/* exported data */
/* exported updateStoredData */

var data = {
  view: 'entry-form',
  entries: [],
  editing: null,
  nextEntryId: 1
};

function updateStoredData() {
  localStorage.setItem('data', JSON.stringify(data));
}

var storedData = localStorage.getItem('data');
function readStoredData() {
  if (storedData) {
    data = JSON.parse(storedData);
  }
}

readStoredData();
