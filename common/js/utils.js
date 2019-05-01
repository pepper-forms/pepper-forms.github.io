function form2dict(form) {
    var values = form.querySelectorAll('[name]');
    var data = {};
    for (var i = 0; i < values.length; i++) {
        data[values[i].getAttribute('name')] = values[i].value || values[i].innerText || 'N/A';
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
    document.getElementById("output").value = output;
    MicroModal.show('modal-1');
    console.log(output)
}

function copyCode() {
    document.getElementById("output").select();
    document.execCommand('copy');
    MicroModal.close('modal-1');
}

