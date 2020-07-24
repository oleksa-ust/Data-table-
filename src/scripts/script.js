/* 
    ajax -> promise -> then
*/

let tableBody = $('.table__body');
let tableCellHeader = $('.table__cell_header');
let arrow = $('.table__cell_arrow'); // DOM-element for sort
let select = $('.select');
let preloader = $('.image__preloader_visibility');
let valueForSlice = 10; // value of the select option

// first request with standart params

let request = $.ajax({
    url: 'http://api.odesseo.com.ua/warehouses',
    method: 'GET',
    dataType: 'json',
    data: {limit: '100', order_by:'number', order: 'asc'},
    cache: false,

    beforeSend: function(){
        tableBody.css({'visibility':'hidden'});
        preloader.css({'visibility':'visible'});
    },

    success: function(){
        preloader.css({'visibility':'hidden'});
        tableBody.css({'visibility':'visible'});
    },

    complete: function(result){
        pagination(result);
    }

});

request.then(function(result){
    let originalArray = result.data; // requested original array from server
    let sliceOriginalArray = result.data.slice(0, 10); // firstly displayed in the page
    renderElement(sliceOriginalArray);  // result - array 'data' inside the main obj, which came from server

    // second request with DESC params
    // down - desc, up - asc

    let sortRequest = $.ajax({
        url: 'http://api.odesseo.com.ua/warehouses',
        method: 'GET',
        dataType: 'json',
        data: {limit: '100', order_by: 'number', order: 'desc'},
        cache: false,

        complete: function(result){
            tableCellHeader.on('click', function(event){
                event.preventDefault();     
                sort(result.responseJSON, originalArray);
            })
        }
    });

    // Select quantity

    select.on('change', function(event){
        event.preventDefault();
        selectQuantity(originalArray);
        valueForSlice = +event.target.value;
    });
})

// Quantity/Sort/pagintaion and other functions

function renderElement(array){
    let data = array;
    let tr;
    tableBody.empty();
    for(let i = 0; i < data.length;){
        tr = $('<tr class="table__row table__row_body">' + '<td class="table__cell table__cell_body" data="id">' + (i + 1) + '</td>' + '<td class="table__cell table__cell_body">' + data[i].name + '</td>' + '<td class="table__cell table__cell_body">' + data[i].city + '</td>' + '<td class="table__cell table__cell_body">' + data[i].ref + '</td>' + '</tr>');
        tableBody.append(tr);
        i++;
    }
}

function selectQuantity(array){
    let value = event.target.value;
    let slicedArray = array.slice(0, value);
    renderElement(slicedArray);

    if (arrow.hasClass('table__cell_arrow down')){
        arrow.toggleClass('down', 'up');
        arrow.toggleClass('up', 'down');
        renderElement(slicedArray);
    }
}

function sort(array, originalArray){
    let slicedArray = array.data.slice(0, valueForSlice); // sorted array
    let mainArray = originalArray.slice(0, valueForSlice); // original array 
    if(arrow.hasClass('table__cell_arrow up')){
        arrow.toggleClass('up', 'down');
        arrow.toggleClass('down', 'up');
        renderElement(slicedArray);
    } else if (arrow.hasClass('table__cell_arrow down')){
        arrow.toggleClass('down', 'up');
        arrow.toggleClass('up', 'down');
        renderElement(mainArray);
    }
}

function pagination(result){
    let paginationList = $('.list');
    let data = result.responseJSON.data;
    let createListItem;
    let itemQuantity = Math.ceil(data.length / 10);

    /* 
       1 - 0 - 10
       2 - 10 - 20
       3 - 20 - 30
       4 - 30 - 40
       5 - 40 - 50
    */

    for (let i=1; i < itemQuantity;){
        createListItem = $('<li class="list__item">' + i + '</li>');
        createListItem.attr('data', i);
        paginationList.append(createListItem);
        ++i;
    }

    let children = paginationList.children();
    children.first().addClass('active');

    paginationList.on('click', function(event){
        event.preventDefault();
        let target = event.target;
        let start = +target.innerHTML * 10;
        let end = start + 10;
        let item = data.slice(start, end);
        let currentElement = children[+target.innerHTML-1]; // current clicked element

        
        tableBody.empty();
        renderElement(item);
        
        children.each((i, elem) => {
            (elem.classList !== 'list__item active') ? ((elem.classList.value = 'list__item') && (currentElement.classList.value = 'list__item active')) : null;
        })
    })
}