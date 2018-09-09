function deleteSubmission(id) {
    $.ajax({
        url: `/api/${id}`,
        type: 'DELETE',
        success: (result) => {
            if(result.success){
                $(`#tr${id}`).remove();
            } else {
                console.log("The deletion of the submission was not successful.");
            }
        }
    });
}

function getSubmissions(selector) {
    $.ajax({
        url: `/api/${selector}`,
        type: 'GET',
        success: (result) => {
            if(result.success){
                $.each(result.result.submissions, (key, val) => {
                    $("#tablebody").append(`<tr id="tr${val.id}"><th class="align-middle" scope="row">${val.id}</th><td class="align-middle">${val.time}</td><td class="align-middle">${val.formName}</td><td class="align-middle">${val.replyTo}</td><td class="align-middle">${val.text}</td><td class="align-middle"><button class="btn btn-danger" type="button" onclick="deleteSubmission('${val.id}')">Delete</button></td></tr>`);
                });
            } else {
                console.log("The request of submissions was not successful.");
            }
        }
    });
}
