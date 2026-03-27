document.querySelector('#search').addEventListener('click',(event) => {

    event.preventDefault();
    
    if (document.querySelector('#search-results') !== undefined && document.querySelector('#search-results') !== null) {
        document.querySelector('#search-results').remove();
    }

    const keyword = document.querySelector('.search-input input').value.trim();
    console.log(keyword);
    if (!keyword) {
        console.log("I am out")
        return;
    }

    fetch('resources/recommendations.json')
    .then(res => res.json())
    .then(data => {  
        const cities = data.countries.flatMap(c =>
            c.cities.map(city => ({
                ...city,
                type: ["cities","country","countries","city"]
            }))        
        );
        const temples = data.temples.map(c => ({
            ...c,
            type: ['temples','temple']
        }));
        const beaches = data.beaches.map(c => ({
            ...c,
            type: ['beaches','beach']
        }));

        const all = [...cities, ...temples, ...beaches];

        const all_to_compare = all.map(place => ({
            index: all.indexOf(place),
            ...place,
            name: place.name.toLowerCase(),
            description: place.description.toLowerCase()
        }));

        console.log(all);

        const results = all_to_compare.filter(place => {
            return (place.name.includes(keyword) || place.description.includes(keyword) || place.type.includes(keyword));
        });

        if (results.length > 0) {

            const body = document.getElementsByTagName('body')[0];
            
            const final = results.map(place => all[place.index]);

            let search_results_div = document.createElement('div');
            search_results_div.id = 'search-results';
            body.appendChild(search_results_div);

            document.querySelector('#search-results').innerHTML = '<h1>Search Results</h1>';
            
            let search_cards = document.createElement('div');
            search_cards.id = 'search-cards';
            document.querySelector('#search-results').appendChild(search_cards);

            final.forEach(element => {
                console.log(all[element.index]);
                document.querySelector('#search-cards').innerHTML += `
                    <div class="card">
                        <div class="card-img">
                            <img src="media/${element.imageUrl}" alt="${element.name}">
                        </div>
                        <h4>${element.name}</h4>
                        <p>${element.description}</p>
                    </div>
                `
            });
        }

    });

});

document.querySelector('button[type=reset]').addEventListener('click',(event) => {
    event.preventDefault();
    if (document.querySelector('#search-results') !== undefined && document.querySelector('#search-results') !== null) {
        document.querySelector('#search-results').remove();
    }
})
