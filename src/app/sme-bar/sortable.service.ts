const Sortable = require("sortablejs");
export class SortableService {
  init() {
    var sharedList = document.getElementsByClassName("cs-list");
    Array.from(sharedList).forEach(ul => {
      new Sortable(ul, {
        multiDrag: true,
        group: "shared", // set both lists to same group
        animation: 150
      });
    });
  }
}
