freesound.setToken("u7CIOWYDOCYLH1DlxfIHtCpX70YrfzVew1CkpRrR");

/*DOM elements*/
const $searchButton = document.getElementById('search');
const $queryField = document.getElementById('query');
const $soundDiv = document.getElementById('sound-div');
const $extraFilter = document.getElementById('extra-filter');
const $deleteFilter = document.getElementById('delete-filter');

/*FILTERS*/
let filters = [
    {
        name: 'brightness',
        min: 0,
        max: 100,
        shown: false
    },
    {
        name: 'sharpness',
        min: 0,
        max: 100,
        shown: false
    },
    {
        name: 'depth',
        min: 0,
        max: 100,
        shown: false
    },
    {
        name: 'warmth',
        min: 0,
        max: 100,
        shown: false
    },
    {
        name: 'boominess',
        min: 0,
        max: 100,
        shown: false
    },
    {
        name: 'hardness',
        min: 0,
        max: 100,
        shown: false
    },
    {
        name: 'roughness',
        min: 0,
        max: 100,
        shown: false
    }
]

filters.forEach(filter => {
    $('#' + filter.name + '-range').slider({
        range: true,
        min: filter.min,
        max: filter.max,
        values: [filter.min, filter.max],
        slide: function (event, ui) {
            $('#' + filter.name).val(ui.values[0] + " - " + ui.values[1]);
            filter.min = ui.values[0];
            filter.max = ui.values[1];
        }
    })
})

/*display filters*/
let displayedFilters = [];

function filterChange(filter) {
    let number = filter.id.replace('filter', '')-1;

    let currentFilter = null;
    filter.addEventListener('change', () => {
        if (filter.value != currentFilter) {
            if (currentFilter == null) {
                document.getElementById(filter.value + 'Div').style.display = 'block';
                let obj = filters.find(o => o.name === filter.value);
                obj.shown = true;
                currentFilter = filter.value;
            } else {
                document.getElementById(currentFilter + 'Div').style.display = 'none';
                let obj = filters.find(o => o.name === currentFilter);
                obj.shown = false;
                document.getElementById(filter.value + 'Div').style.display = 'block';
                obj = filters.find(o => o.name === filter.value);
                obj.shown = true;
                currentFilter = filter.value;
            }
        }

        displayedFilters[number] = filter.value;
        console.log(displayedFilters);
    })
};

filterChange(document.getElementById('filter1'));

/*extra filter*/
let currentAmountOfFilters = 1;
$extraFilter.addEventListener('click', () => {
    let newFilter =
        `
        <label class="filterSelector" for="filter${currentAmountOfFilters + 1}" id="filter${currentAmountOfFilters + 1}-label">Choose filter ${currentAmountOfFilters + 1}:</label>

        <select name="filters" id="filter${currentAmountOfFilters + 1}">
            <option value="none"></option>
            <option value="brightness">brightness</option>
            <option value="sharpness">sharpness</option>
            <option value="depth">depth</option>
            <option value="warmth">warmth</option>
            <option value="boominess">boominess</option>
            <option value="hardness">hardness</option>
            <option value="roughness">roughness</option>
        </select>
    `;
    $('#extra-filter').before(newFilter);
    filterChange(document.getElementById(`filter${currentAmountOfFilters + 1}`));
    currentAmountOfFilters++;
    console.log(currentAmountOfFilters);
})

$deleteFilter.addEventListener('click', () => {
    $(`#filter${currentAmountOfFilters}`).remove();
    $(`#filter${currentAmountOfFilters}-label`).remove();
    
    //make selected filter invisible
    let currentFilter = displayedFilters[currentAmountOfFilters-1];
    document.getElementById(currentFilter + 'Div').style.display = 'none';
    let obj = filters.find(o => o.name === currentFilter);
    obj.shown = false;

    currentAmountOfFilters--;
})

/*search*/
let foundSounds = [];
let soundList = [];
let filterString = `ac_tonality:[B major] ac_tonality_confidence:[0.8 TO 1]`;

/*license: 
"http://creativecommons.org/publicdomain/zero/1.0/"*/

$searchButton.addEventListener('click', function () {
    filterString = `ac_tonality:[B major] ac_tonality_confidence:[0.8 TO 1]`;
    filters.forEach(filter => {
        //only add those filters that are shown
        if (filter.shown) {
            filterString += ` ac_${filter.name}:[${filter.min} TO ${filter.max}]`;
        }
    });
    console.log(filterString);

    foundSounds = [];

    freesound.textSearch(
        $queryField.value,
        { filter: filterString },
        sounds => {
            sounds.results.forEach(sound => {
                foundSounds.push(sound);
            });
            displaySounds(foundSounds);
        },
        errorMsg
    );
})

function displaySounds(arr) {
    arr.forEach(sound => {
        console.log(sound);
        freesound.getSound(
            sound.id,
            result => {
                snd = new Audio(result.previews['preview-hq-mp3']);
                snd.controls = true;
                document.getElementById('sound-div').appendChild(snd);
                snd.play();
                soundList.push(snd);
            },
            errorMsg
        )
    })
}

function errorMsg() {
    alert('Your search was invalid. Please try again.');
}