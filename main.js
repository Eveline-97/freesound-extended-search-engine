freesound.setToken("u7CIOWYDOCYLH1DlxfIHtCpX70YrfzVew1CkpRrR");

/*DOM elements*/
const $searchButton = document.getElementById('search');
let $queryField = document.getElementById('query');
const $soundDiv = document.getElementById('sound-div');

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
const $filter1 = document.getElementById('filter1');
let currentFilter = null;
$filter1.addEventListener('change', () => {
    if ($filter1.value != currentFilter) {
        if (currentFilter == null) {
            document.getElementById($filter1.value + 'Div').style.display = 'block';
            let obj = filters.find(o => o.name === $filter1.value);
            obj.shown = true;
            currentFilter = $filter1.value;
        } else {
            document.getElementById(currentFilter + 'Div').style.display = 'none';
            let obj = filters.find(o => o.name === currentFilter);
            obj.shown = false;
            document.getElementById($filter1.value + 'Div').style.display = 'block';
            obj = filters.find(o => o.name === $filter1.value);
            obj.shown = true;
            currentFilter = $filter1.value;
        }
    }
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
    console.log('error');
}

