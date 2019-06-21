App = {
  init: function() {
    $.getJSON('./data/shelters.json', function (shelters) {
      let columns = '';

      const makeColumn = (shelter) => {
        const column =
          `<div class="column">
            <a href="shelter.html?shelterId=${shelter.shelterId}&shelterName=${shelter.title}">
              <div class="card">
                <div class="card-image">
                  <figure class="image is-4by3">
                    <img src="${shelter.imgUrl}" alt="Placeholder image">
                  </figure>
                </div>
                <div class="card-content">
                  <div class="media">
                    <div class="media-content">
                      <p class="title is-4">${shelter.title}</p>
                      <p class="subtitle is-6">${shelter.subtitle}</p>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>`
        return column;
      }

      $.each(shelters, function(index, shelter) {
        columns += makeColumn(shelter);
      });

      $('.columns').html(columns);
    });
  },
};

$(function() {
  App.init();
});
