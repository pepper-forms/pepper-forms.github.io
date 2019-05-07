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

function generatePostTitle() {
    var incident_date = document.getElementsByName("incident_date")[0].value.toUpperCase();
    var h_output = "INCIDENT REPORT #" + document.getElementsByName("case_number")[0].innerText;
    h_output = incident_date ? (h_output + " from " + incident_date) : h_output;
    return h_output;
}

async function showBB() {
    output = await parseForm();
    h_output = generatePostTitle();
    document.getElementById("output").value = output;
    document.getElementById("header_output").value = h_output;
    MicroModal.show('modal-1');
}

function copyCode() {
    document.getElementById("output").select();
    document.execCommand('copy');
    MicroModal.close('modal-1');
}

$(function() {
    $('.datepicker').datepicker({
        'dateFormat': 'dd/M/yy'
    });
});
