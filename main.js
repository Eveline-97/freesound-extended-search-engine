/*TOKEN*/
const $applyKeyButton = document.getElementById('apply-key');
const $newKeyButton = document.getElementById('new-key');
const $keyField = document.getElementById('key');

$applyKeyButton.addEventListener('click', () => {
    let token = $keyField.value;
    freesound.setToken(token);
    $applyKeyButton.innerHTML = '&#10004;';
    $applyKeyButton.classList.add('applied');
    $newKeyButton.classList.add('show');
    $newKeyButton.classList.remove('hidden');
    $keyField.classList.add('hidden');
    $keyField.value = '';
})

$newKeyButton.addEventListener('click', () => {
    $applyKeyButton.innerHTML = 'apply key';
    $applyKeyButton.classList.remove('applied');
    $newKeyButton.classList.remove('show');
    $newKeyButton.classList.add('hidden');
    $keyField.classList.remove('hidden');
})

/*DOM elements*/
const $searchButton = document.getElementById('search');
const $queryField = document.getElementById('query');
const $soundDiv = document.getElementById('sound-div');
const $extraFilter = document.getElementById('extra-filter');
const $deleteFilter = document.getElementById('delete-filter');
const $amountOfResults = document.getElementById('amount-of-results');

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
        name: 'loopable',
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
const $tonalityEnable = document.getElementById('tonality-enable');
const $tonalityExtras = document.getElementById('tonality-extras');

$('#tonality-enable').change(() => {
    if ($tonalityEnable.checked) {
        $tonalityExtras.classList.remove('hidden');
        filters[0].shown = true;
    } else {
        $tonalityExtras.classList.add('hidden');
        filters[0].shown = false;
    }
})

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

/*LOOPABLE*/
const $loopable = document.getElementById('loopable');
$('#loopable').change(() => {
    filters[3].shown = $loopable.checked;
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
    if (currentAmountOfFilters != 0) {
        console.log(currentAmountOfFilters);
        $(`#filter${currentAmountOfFilters}`).remove();
        $(`#filter${currentAmountOfFilters}-label`).remove();

        //make selected filter invisible
        let currentFilter = displayedFilters[currentAmountOfFilters - 1];
        let filterElement = document.getElementById(currentFilter + 'Div');
        if (filterElement) {
            document.getElementById(currentFilter + 'Div').style.display = 'none';
            let obj = filters.find(o => o.name === currentFilter);
            obj.shown = false;
        }

        currentAmountOfFilters--;
    }
})

const midiNotes = {
    'C': 12,
    'C#': 13,
    'D': 14,
    'D#': 15,
    'E': 16,
    'F': 17,
    'F#': 18,
    'G': 19,
    'G#': 20,
    'A': 21,
    'A#': 22,
    'B': 23
}

function calculateMidi(noteName, octave) {
    return midiNotes[noteName] + 12*octave;
}

/*SEARCH*/
let foundSounds = [];
let soundList = [];

let filterString = `ac_tonality:[B major] ac_tonality_confidence:[0.8 TO 1]`;
let filterQuery;

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
                filterString += `ac_${filter.name}:"${filter.rootNote} ${filter.scale}" `;
                filterString += `ac_tonality_confidence:[${filter.min / 100} TO ${filter.max / 100}] `;
            } else if (filter.name == 'pitch') {
                //special case for pitch
                if (filter.rootNote == 'none' || filter.octave == 'none') {
                    alert('Please provide all necessary information for the pitch');
                }
                filterString += `ac_note_midi:${calculateMidi(filter.rootNote, filter.octave)} `;
            } else if (filter.name == 'single-event') {
                filterString += `ac_single_event:true `;
            } else if (filter.name == 'loopable') {
                filterString += `ac_loop:true `;
            } else {
                filterString += ` ac_${filter.name}:[${filter.min} TO ${filter.max}] `;
            }
        }
    });
    if (filterString == '') {
        filterQuery = { page_size: $amountOfResults.value }
    } else {
        filterQuery = { filter: filterString, page_size: $amountOfResults.value };
    }
    console.log(filterString);

    foundSounds = [];

    freesound.textSearch(
        $queryField.value,
        filterQuery,
        sounds => {
            sounds.results.forEach(sound => {
                foundSounds.push(sound);
            });
            deleteAllSounds();
            displaySounds(foundSounds);
        },
        errorMsg
    );
    //all sounds are not on loop 
    $loopAll.innerHTML = 'Loop all';
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
    //because sound-div weirdly moves out of result-div
    $('#sound-div').appendTo('#result-div');
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
    'http://creativecommons.org/licenses/by/3.0/': 'Attribution 3.0',
    'https://creativecommons.org/licenses/by/4.0/': 'Attribution 4.0',
    'https://creativecommons.org/licenses/by-nc/3.0/': 'CC BY-NC 3.0',
    'https://creativecommons.org/licenses/by-nc/4.0/': 'CC BY-NC 4.0',
    'https://creativecommons.org/licenses/sampling+/1.0/': 'CC SAMPLING+ 1.0'
}


/*Play all sounds*/
const $loopAll = document.getElementById('loop-all');

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

$loopAll.addEventListener('click', () => {
    if ($loopAll.innerHTML == 'Loop all') {
        soundList.forEach(sound => {
            sound.loop = true;
        })
        $loopAll.innerHTML = 'Unloop all';
    } else {
        soundList.forEach(sound => {
            sound.loop = false;
        })
        $loopAll.innerHTML = 'Loop all';
    }
})

function deleteAllSounds() {
    $('#sound-div').remove();
    let newDiv = `<div id="sound-div"></div>`
    $('footer').before(newDiv);
}

function errorMsg() {
    alert('Your search was invalid. Make sure you applied a correct API key.');
    //401: inauthenticated, your API key is invalid
    //429: too many requests
}