/* exported data */
/* exported updateStoredData */

// entryObj =
// title: string
// photoUrl: string
// notes: string
// entryId: number
// tags: array of strings
// viewing: entryobject

var data = {
  view: 'entry-form',
  entries: [],
  editing: null,
  viewing: null,
  nextEntryId: 1,
  editFrom: null,
  sortBy: {
    type: 'dateAdded',
    isReverse: false
  },
  getEntryObject: function (id) {
    return data.entries.find(function (element) {
      return element.entryId === id;
    });
  },
  sortByDateAdded: function (reverse) {
    var sortingArray = this.entries.slice();
    sortingArray.sort(function (a, b) {
      return a.dateCreated.getTime() - b.dateCreated.getTime();
    });
    if (reverse) {
      sortingArray.reverse();
    }
    return sortingArray;
  },
  sortByLastModified: function (reverse) {
    var sortingArray = this.entries.slice();
    sortingArray.sort(function (a, b) {
      return a.lastModified.getTime() - b.lastModified.getTime();
    });
    if (reverse) {
      sortingArray.reverse();
    }
    return sortingArray;
  },
  sortByAlphabet: function (reverse) {
    var sortingArray = this.entries.slice();
    sortingArray.sort(function (a, b) {
      var nameA = a.title.toUpperCase();
      var nameB = b.title.toUpperCase();
      if (nameA > nameB) {
        return 1;
      } else if (nameA < nameB) {
        return -1;
      } else {
        return 0;
      }
    });
    if (reverse) {
      sortingArray.reverse();
    }
    return sortingArray;
  },
  reset: function () {
    localStorage.removeItem('data');
    location.reload();
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
  if (data.viewing) {
    data.viewing = data.getEntryObject(data.viewing.entryId);
  }
  if (data.editing) {
    data.editing = data.getEntryObject(data.editing.entryId);
  }
}
readStoredData();
