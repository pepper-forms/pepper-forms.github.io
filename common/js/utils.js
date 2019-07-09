function form2dict(form) {
    var values = form.querySelectorAll('[name]');
    var data = {};
    for (var i = 0; i < values.length; i++) {
        if (values[i].classList.contains('datepicker')) {
            data[values[i].getAttribute('name')] = values[i].value.toUpperCase() || 'N/A';
        } else {
            data[values[i].getAttribute('name')] = values[i].value || values[i].innerText || 'N/A';
        }
    }
    return data;
}

function applyValues(bbtemplate, dict) {
    for (key in dict) {
        var regexp = new RegExp('%(text|textarea|span):'+key+'%', 'g')
        bbtemplate = bbtemplate.replace(regexp, dict[key]);
    }
    return bbtemplate;
}

function parseDate(now) {
    // DD/MMM/YYYY
    now = now || new Date();
    var months = [
        'JAN', 'FEB', 'MAR', 'APR', 
        'MAY', 'JUN', 'JUL', 'AUG', 
        'SEP', 'OCT', 'NOV', 'DEC'];
    return ('0'+(now.getDate())).slice(-2)+'/'+months[now.getMonth()]+'/'+now.getFullYear();
}

async function parseForm() {
    var dict = form2dict(document);
    var response = await fetch(window.__bbcodeurl);
    var bbcode = await response.text();
    var output = applyValues(bbcode, dict); 
    return output;
}

async function showBB() {
    output = await parseForm();
    h_output = generatePostTitle();
    document.getElementById("output__header").value = h_output;
    document.getElementById("output__body").value = output;
    $('#output_modal').modal('show')
}

function copyCode(btn) {
    var output = document.getElementById(btn.getAttribute('data-field'));
    output.select();
    document.execCommand('copy');
    $(btn).tooltip({
        title: "Copied!",
        placement: "top",
        trigger: "manual"
    })
    $(btn).tooltip('show');
    setTimeout(function() {
        $(btn).tooltip('hide');
        $(btn).tooltip('dispose');
    }, 1000)
}

$(function() {
    $('.datepicker').datepicker({
        'dateFormat': 'dd/M/yy'
    });
});

function uploadImage(input, allowedSize={w: 130, h: 150}) {
    return new Promise(function (resolve, reject) {
        $(input).click()
        $(input).one('change', function() {
            const file = $(input)[0].files[0]
            if (file) {
                const img = new Image()
                img.src = window.URL.createObjectURL(file)
                img.onload = function() {
                    const width = img.naturalWidth,
                          height = img.naturalHeight;
                    window.URL.revokeObjectURL( img.src );
                    if( width === allowedSize.w && height === allowedSize.h ) {
                        const form = new FormData()
                        form.append('image', file)
                        fetch('https://api.imgbb.com/1/upload?key=66a092dd69070ff59ef5dafc4e34f815', { method: 'post', body: form })
                            .then(response => response.json())
                            .then(data => {
                              resolve(data.data.display_url)
                            })
                            .catch(reject)
                    }
                    else {
                        alert(`Изображение должно быть ${allowedSize.w}x${allowedSize.h}`);
                        reject()
                    }
                };
            } else {
                reject()
            }
        })
    })
}
