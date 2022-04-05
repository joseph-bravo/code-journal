/* exported data */
/* exported updateStoredData */

var data = {
  view: "entry-form",
  entries: [],
  editing: null,
  nextEntryId: 1,
};

function updateStoredData() {
  localStorage.setItem("data", JSON.stringify(data));
}

function readStoredData() {
  var storedData = localStorage.getItem("data");
  if (storedData) {
    data = JSON.parse(storedData);
  }
}

readStoredData();
