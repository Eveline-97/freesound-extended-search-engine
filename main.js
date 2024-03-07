/*TOKEN*/
document.getElementById('apply-key').addEventListener('click', () => {
    let token = document.getElementById('key').value;
    freesound.setToken(token);
})

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
        name: 'tonality',
        rootNote: 'none',
        scale: 'none',
        min: 0,
        max: 100,
        shown: false //only true if single event is not ticked
    },
    {
        name: 'pitch',
        rootNote: 'none',
        octave: 'none',
        shown: false //only true if single event is ticked
    },
    {
        name: 'single-event',
        shown: false
    },
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

/*SINGLE EVENT*/
const $singleEvent = document.getElementById('single-event');
const $tonalityDiv = document.getElementById('tonality-div');
const $pitchDiv = document.getElementById('note-name-div');
let singleEvent = false;

$('#single-event').change(() => {
    singleEvent = $singleEvent.checked;
    checkSingleEvent();
})

function checkSingleEvent() {
    filters[2].shown = singleEvent;
    if (singleEvent) {
        //hide tonality div, because it has no use with a single event
        $tonalityDiv.style.display = 'none';
        filters[0].shown = false;
        //show pitch div
        $pitchDiv.style.display = 'block';
    } else {
        //hide pitch div, because it only has a use with a single event
        $pitchDiv.style.display = 'none';
        filters[1].shown = false;
        //show tonality div
        $tonalityDiv.style.display = 'block';
    }
}
checkSingleEvent();

/*TONALITY and PITCH*/
const $rootNote = document.getElementById('root-note');
const $scale = document.getElementById('scale');
const $pitch = document.getElementById('pitch');
const $octave = document.getElementById('octave');

/*tonality*/
$('#root-note').change(() => {
    filters[0].rootNote = $rootNote.value;
    //include Tonality confidence range
    if ($rootNote.value == 'none') {
        filters[0].shown = false;
    } else {
        filters[0].shown = true;
    }
})

$('#scale').change(() => {
    filters[0].scale = $scale.value;
})

/*pitch*/
$('#pitch').change(() => {
    filters[1].rootNote = $pitch.value;
    if ($pitch.value == 'none') {
        filters[1].shown = false;
    } else {
        filters[1].shown = true;
    }
})
$('#octave').change(() => {
    filters[1].octave = $octave.value;
})

/*RANGE FILTERS*/

//sliders
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

//display the range sliders when chosen
let displayedFilters = [];

function filterChange(filter) {
    let number = filter.id.replace('filter', '') - 1;

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
    })
};

//for first filter
filterChange(document.getElementById('filter1'));

//add or remove filter
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
})

$deleteFilter.addEventListener('click', () => {
    $(`#filter${currentAmountOfFilters}`).remove();
    $(`#filter${currentAmountOfFilters}-label`).remove();

    //make selected filter invisible
    let currentFilter = displayedFilters[currentAmountOfFilters - 1];
    document.getElementById(currentFilter + 'Div').style.display = 'none';
    let obj = filters.find(o => o.name === currentFilter);
    obj.shown = false;

    currentAmountOfFilters--;
})

/*SEARCH*/
let foundSounds = [];
let soundList = [];

let filterString = `ac_tonality:[B major] ac_tonality_confidence:[0.8 TO 1]`;

/*license: 
"http://creativecommons.org/publicdomain/zero/1.0/"*/

$searchButton.addEventListener('click', function () {
    filterString = '';
    filters.forEach(filter => {
        //only add those filters that are shown
        if (filter.shown) {
            if (filter.name == 'tonality') {
                //special case for tonality, because 0 to 1 not 0 to 100
                if (filter.rootNote == 'none' || filter.scale == 'none') {
                    alert('Please provide all necessary information for the tonality');
                }
                filterString += `ac_${filter.name}:[${filter.rootNote} ${filter.scale}] `;
                filterString += `ac_tonality_confidence:[${filter.min / 100} TO ${filter.max / 100}] `;
            } else if (filter.name == 'pitch') {
                //special case for pitch
                if (filter.rootNote == 'none' || filter.octave == 'none') {
                    alert('Please provide all necessary information for the pitch');
                }
                filterString += `ac_note_name:${filter.rootNote}${filter.octave} `;
            } else if (filter.name == 'single-event') {
                filterString += `ac_single_event:true `;
            } else {
                filterString += ` ac_${filter.name}:[${filter.min} TO ${filter.max}] `;
            }
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
            deleteAllSounds();
            displaySounds(foundSounds);
        },
        errorMsg
    );
    console.log(foundSounds);
})

function displaySounds(arr) {
    soundList = [];

    //now get sounds
    arr.forEach((sound, index) => {
        freesound.getSound(
            sound.id,
            result => {
                foundSounds[index].src = result.url;
                //create audio element
                snd = new Audio(result.previews['preview-hq-mp3']);
                snd.setAttribute('title', result.name);
                snd.controls = true;
                //create div
                let div = document.createElement('div');
                div.setAttribute('class', 'audio-element');
                //add div and elements to sound-div
                document.getElementById('sound-div').appendChild(div);
                div.appendChild(snd);
                div.appendChild(createLink(result.url, 'source'));
                div.appendChild(createLink(result.license, 'license'));
                soundList.push(snd);
            },
            errorMsg
        )
    })
    console.log(soundList);
}

function createLink(url, name) {
    let link = document.createElement("a");
    link.setAttribute('href', url);
    link.setAttribute('target', 'blank');
    link.setAttribute('rel', 'noopener noreferrer');
    if (name == 'license') {
        link.innerHTML = licenses[url];
    } else {
        link.innerHTML = name;
    }
    return link;
}


const licenses = {
    'http://creativecommons.org/publicdomain/zero/1.0/': 'Creative Commons 0',
    'https://creativecommons.org/licenses/by/4.0/': 'Attribution 4.0'
}


/*Play all sounds*/
document.getElementById('play-all').addEventListener('click', () => {
    soundList.forEach(sound => {
        sound.play();
    })
});
document.getElementById('stop-all').addEventListener('click', () => {
    soundList.forEach(sound => {
        sound.pause();
    })
});

function deleteAllSounds() {
    $('#sound-div').remove();
    let newDiv = `<div id="sound-div"></div>`
    $('footer').before(newDiv);
}

function errorMsg() {
    alert('Your search was invalid or the audio files could not be found. Please try again later.');
    //401: inauthenticated, your API key is invalid
}