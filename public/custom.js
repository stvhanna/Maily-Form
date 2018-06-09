function deleteSubmission(id) {
    $.ajax({
        url: 'admin/' + id,
        type: 'DELETE'
    }).done(function () {
        location.reload();
    });
}