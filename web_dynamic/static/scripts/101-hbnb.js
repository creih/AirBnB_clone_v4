$(document).ready(function() {
    let selectedAmenities = {};
    let selectedLocations = { states: {}, cities: {} };

    // Handle checkbox changes for amenities
    $('.amenities input[type="checkbox"]').change(function() {
        if ($(this).is(':checked')) {
            selectedAmenities[$(this).data('id')] = $(this).data('name');
        } else {
            delete selectedAmenities[$(this).data('id')];
        }
        let amenitiesList = Object.values(selectedAmenities).join(', ');
        $('.amenities h4').text(amenitiesList);
    });

    // Handle checkbox changes for locations (states and cities)
    $('.locations input[type="checkbox"]').change(function() {
        let id = $(this).data('id');
        let name = $(this).data('name');
        let isState = $(this).closest('ul').parent().find('h2').length > 0;

        if ($(this).is(':checked')) {
            if (isState) {
                selectedLocations.states[id] = name;
            } else {
                selectedLocations.cities[id] = name;
            }
        } else {
            if (isState) {
                delete selectedLocations.states[id];
            } else {
                delete selectedLocations.cities[id];
            }
        }

        let locationsList = [...Object.values(selectedLocations.states), ...Object.values(selectedLocations.cities)].join(', ');
        $('.locations h4').text(locationsList);
    });

    $.get('http://0.0.0.0:5001/api/v1/status/', function(data) {
        if (data.status === 'OK') {
            $('#api_status').addClass('available');
        } else {
            $('#api_status').removeClass('available');
        }
    });

    function searchPlaces() {
        const amenities = Object.keys(selectedAmenities);
        const states = Object.keys(selectedLocations.states);
        const cities = Object.keys(selectedLocations.cities);

        $.ajax({
            url: 'http://0.0.0.0:5001/api/v1/places_search/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ amenities: amenities, states: states, cities: cities }),
            success: function(data) {
                $('section.places').empty();
                data.forEach(place => {
                    const article = `
                    <article>
                        <div class="title_box">
                            <h2>${place.name}</h2>
                            <div class="price_by_night">$${place.price_by_night}</div>
                        </div>
                        <div class="information">
                            <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
                            <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
                            <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
                        </div>
                        <div class="description">
                            ${place.description}
                        </div>
                        <div class="reviews">
                            <h2>Reviews <span class="toggle-reviews" data-place-id="${place.id}">show</span></h2>
                            <div class="review-list" id="reviews-${place.id}" style="display: none;"></div>
                        </div>
                    </article>
                    `;
                    $('section.places').append(article);
                });
            }
        });
    }

    searchPlaces(); // Initial search to load all places

    $('button').click(function() {
        searchPlaces();
    });

    // Handle review toggling
    $(document).on('click', '.toggle-reviews', function() {
        const placeId = $(this).data('place-id');
        const reviewsDiv = $(`#reviews-${placeId}`);
        if ($(this).text() === 'show') {
            $.get(`http://0.0.0.0:5001/api/v1/places/${placeId}/reviews/`, function(data) {
                data.forEach(review => {
                    const reviewElement = `
                    <div class="review">
                        <h3>From ${review.user.first_name} ${review.user.last_name} the ${new Date(review.created_at).toLocaleString()}</h3>
                        <p>${review.text}</p>
                    </div>
                    `;
                    reviewsDiv.append(reviewElement);
                });
                reviewsDiv.show();
                $(this).text('hide');
            }.bind(this));
        } else {
            reviewsDiv.empty().hide();
            $(this).text('show');
        }
    });
});
