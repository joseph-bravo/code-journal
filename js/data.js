/* exported data */
/* exported updateStoredData */

// entryObj =
// title: string
// photoUrl: string
// notes: string
// entryId: number
// tags: array of strings

var data = {
  view: 'entry-form',
  entries: [],
  editing: null,
  nextEntryId: 1,
  getEntryObject: function (id) {
    return this.entries[id];
  },
  getEntryDom: function (id) {
    return this.entries[id].dom;
  }
};

function updateStoredData() {
  localStorage.setItem('data', JSON.stringify(data));
}

function readStoredData() {
  var storedData = JSON.parse(localStorage.getItem('data'));
  if (storedData) {
    for (var prop in storedData) {
      data[prop] = storedData[prop];
    }
    for (var i = 0; i < data.entries.length; i++) {
      data.entries[i].dateCreated = new Date(data.entries[i].dateCreated);
      data.entries[i].lastModified = new Date(data.entries[i].lastModified);
    }
  }
}

readStoredData();
