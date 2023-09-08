freesound.setToken("u7CIOWYDOCYLH1DlxfIHtCpX70YrfzVew1CkpRrR");

/*DOM elements*/
const $searchButton = document.getElementById('search');
let $queryField = document.getElementById('query');
const $soundDiv = document.getElementById('sound-div');
console.log($soundDiv);

/*FILTERS*/
let filters = [
    {
        name: 'brightness',
        min: 0,
        max: 100
    },
    {
        name: 'depth',
        min: 0,
        max: 100
    },
    {
        name: 'hardness',
        min: 0,
        max: 100
    },
    {
        name: 'roughness',
        min: 0,
        max: 100
    },
    {
        name: 'boominess',
        min: 0,
        max: 100
    },
    {
        name: 'warmth',
        min: 0,
        max: 100
    },
    {
        name: 'sharpness',
        min: 0,
        max: 100
    }
]

let filterString = `ac_tonality:[A major] ac_tonality_confidence:[0.8 TO 1]`;

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

/*search*/
let foundSounds = [];
let soundList = [];

/*license: 
"http://creativecommons.org/publicdomain/zero/1.0/"*/

$searchButton.addEventListener('click', function () {
    filterString = `ac_tonality:[A major] ac_tonality_confidence:[0.8 TO 1]`;
    filters.forEach(filter => {
        filterString += ` ac_${filter.name}:[${filter.min} TO ${filter.max}]`;
    });
    console.log(filterString);

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

