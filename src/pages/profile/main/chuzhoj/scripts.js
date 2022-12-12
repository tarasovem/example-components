"use strict";

(function () {
  const genresMoreBtn = document.getElementById('profile-favorite-genres-more');
  const genresList = document.querySelectorAll('.pf-favorite-genres__item');
  const tagsMoreBtn = document.getElementById('profile-tags-more');
  const tagsList = document.querySelectorAll('.pf-tags__item');
  


  function showItems(list, value, btnEl) {
    let startValue = value;
  
    function show() {
      let counter = startValue;

      for (let i = 0; i < list.length; i++) {
        if (counter > 0) {
          list[i].classList.add('show');
        }
        counter -= 1;
      }

      startValue += 10;
    }

    show();

    btnEl.addEventListener('click', show);
  }

  showItems(genresList, 3, genresMoreBtn);
  showItems(tagsList, 3, tagsMoreBtn);
})();
