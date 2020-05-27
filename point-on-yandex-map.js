ymaps.ready(init);

let myMap;
const str = document.getElementById("map").getAttribute("data-map");
const coordinates = str.split(",");
const coords = [(coordinates[0]), (coordinates[1])];
const zoom = (coordinates[2]);

function init() {
    let myMap = new ymaps.Map("map", {
            center: coords,
            zoom: zoom,
            controls: ['zoomControl']
        }, {
            suppressMapOpenBlock: true
        }),
        objectManager = new ymaps.ObjectManager({
            // Чтобы метки начали кластеризоваться, выставляем опцию.
            // clusterize: true,
            // ObjectManager принимает те же опции, что и кластеризатор.
            gridSize: 32,
            clusterDisableClickZoom: true
        });

    // Чтобы задать опции одиночным объектам и кластерам,
    // обратимся к дочерним коллекциям ObjectManager.
    // objectManager.objects.options.set('preset', 'islands#greenDotIcon');
    // objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');

    myMap.geoObjects.add(objectManager);

    // =============
    function getJson(parentData) {
        // Создаём объект класса XMLHttpRequest
        const request = new XMLHttpRequest();

        /*  Составляем строку запроса. */
        let url = 'data' + parentData + '.json';
        // let url = 'data1.json';

        /* Здесь мы указываем параметры соединения с сервером, метод соединения GET. */
        request.open('GET', url);

        // Указываем заголовки для сервера, говорим что тип данных, - контент который мы хотим получить должен быть не закодирован. 
        request.setRequestHeader('Content-Type', 'application/x-www-form-url');

        // Здесь мы ждем ответ от сервера 
        request.addEventListener("readystatechange", () => {

            /*   request.readyState - возвращает текущее состояние объекта XHR(XMLHttpRequest) объекта, 
            бывает 4 состояния 4-е состояние запроса - операция полностью завершена, пришел ответ от сервера, 
            вот то что нам нужно request.status это статус ответа, 
            нам нужен код 200 это нормальный ответ сервера, 401 файл не найден, 500 сервер дал ошибку и прочее...   */
            if (request.readyState === 4 && request.status === 200) {

                let dataObject = JSON.parse(request.responseText);

                let dataHead = '{"type": "FeatureCollection","features": [';

                let dataBody = [];
                for (let i in dataObject) {
                    dataBody.push('{"type": "Feature", "id": "' + dataObject[i].id + '", "geometry": {"type": "Point", "coordinates":[' + dataObject[i].geocor + ']},"options": {"iconLayout": "default#image", "iconImageHref": "https://adr-group.ru/' + dataObject[i].img41 + '", "iconImageSize": [41, 41], "iconImageOffset": [-15, -27]}, "properties": {"hintContent": "' + dataObject[i].pagetitle + '", "balloonContent": "<h3>' + dataObject[i].pagetitle + '</h3><img align=left src=https://adr-group.ru/' + dataObject[i].img120 + '>' + dataObject[i].description + ' ...<br/><a class=balloon-read-more href=' + dataObject[i].uri + '>Узнать детали <b>></b></a>", "data": {"media_type": "' + dataObject[i].media_type + '"}}}');
                }
                let dataFooter = ']}';

                let data = dataHead + dataBody.toString() + dataFooter;

                // Добавляем метки на карту
                objectManager.add(data);
            }

        });

        // Выполняем запрос 
        request.send();
    }
    // =============

    let parentData = 1;

    getJson(parentData);

    document.addEventListener('click', function(event) {

        objectManager.removeAll();

        let parentData = event.target.dataset.parent;

        getJson(parentData);

    });

}


// =================================
/*
    ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map("map", {
        center: [55.73, 37.75],
        zoom: 8
    }, {
        searchControlProvider: 'yandex#search'
    });
    
    // Создадим объекты на основе JSON-описания геометрий.
    var objects = ymaps.geoQuery([{
            type: 'Point',
            coordinates: [55.73, 37.75]
        }, {
            type: 'Point',
            coordinates: [55.10, 37.45]
        }, {
            type: 'Point',
            coordinates: [55.25, 37.35]
        }, {
            type: 'Point',
            coordinates: [55.25, 67.35]
        }]);
    
        // Найдем объекты, попадающие в видимую область карты.
    objects.searchInside(myMap)
        // И затем добавим найденные объекты на карту.
        .addToMap(myMap);
    
    myMap.events.add('boundschange', function () {
        // После каждого сдвига карты будем смотреть, какие объекты попадают в видимую область.
        var visibleObjects = objects.searchInside(myMap).addToMap(myMap);
        // Оставшиеся объекты будем удалять с карты.
        objects.remove(visibleObjects).removeFromMap(myMap);
    });
    
}
*/
/*
        // test.onclick = () => alert("Привет");
*/