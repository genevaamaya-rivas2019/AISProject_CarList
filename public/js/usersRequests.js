$(document).ready(function () {
    retrieveItems();

    function retrieveItems() {
        $.ajax({
            url: "item/retrieve/all",
            type: "GET",
            crossDomain: true,
            success: (data) => {
                $('tbody').empty();
                for (let i = 0; i < data.results.length; i++) {
                    addRow(data.results[i])

                }
            }
        })
    }

    function addRow(item) {
        var tr = $("<tr>", {
            id: item._id,
            brand: item.brand,
            model: item.model,
            year: item.year,
            price: item.price
        });
        var btns = $("<div>").append($("<button>", {
            class: "btn btn-primary update btn-sm up",
            "data-toggle": "modal",
            "data-target": '#exampleModal',
            id: "update_" + item._id,
        }).text("update"),
            $("<button>", {
                class: "btn btn-warning del btn-sm",
                id: "delete_" + item._id,
            }).text("delete")
        )
        $(tr).append(
            $("<td>", {
                class: "forBrand"
            }).text(item.brand),
            $("<td>", {
                class: "forModel"
            }).text(item.model),
            $("<td>", {
                class: "forYear"
            }).text(item.year),
            $("<td>", {
                class: "forPrice"
            }).text(item.price),
            $("<td>").append(btns)
        ).appendTo($('tbody'))
    }

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    $("#btnAdd").click(function () {
        var validBrand = $('#brand').val();
        // var validModel = $('#model').val()
        var validYear = $('#year').val()
        var validPrice = $('#price').val()

        var valid = true;
        $('.form-control').each(function () {
            let brandmatches = validBrand.match(/\d+/g);
            if (brandmatches != null) {
                valid = false;
                Swal.fire({
                    type: 'error',
                    title: 'Car Brand should be alphabet letters',
                    showConfirmButton: false,
                    timer: 1000
                })
                $('input').val("");
            }
            if (!isNumeric(validYear) || !isNumeric(validPrice)) {
                valid = false;
                Swal.fire({
                    type: 'error',
                    title: 'Year and Price should be numbers',
                    showConfirmButton: false,
                    timer: 1000
                })
                $('input').val("");
            }
            if (!$("#brand").val() || !$("#model").val() || !$("#year").val() || !$("#price").val()) {
                valid = false;
                Swal.fire({
                    type: 'error',
                    title: 'All inputs should be filled!!',
                    showConfirmButton: false,
                    timer: 1000
                })
                $('input').val("");
            }
            // else if (!$("#model").val()) {
            //     valid = false;
            //     Swal.fire({
            //         type: 'error',
            //         title: 'All inputs should be filled!!',
            //         showConfirmButton: false,
            //         timer: 1000
            //     })
            //     $('input').val("");
            // } else if (!$("#year").val()) {
            //     valid = false;
            //     Swal.fire({
            //         type: 'error',
            //         title: 'All inputs should be filled!!',
            //         showConfirmButton: false,
            //         timer: 1000
            //     })
            //     $('input').val("");


            // }
            // else if (!$("#price").val()) {
            //     valid = false;
            //     Swal.fire({
            //         type: 'error',
            //         title: 'All inputs should be filled!!',
            //         showConfirmButton: false,
            //         timer: 1000
            //     })
            //     $('input').val("");
            // }
        })
        if (valid) {
            var formData = {
                brand: $("#brand").val(),
                model: $("#model").val(),
                year: $("#year").val(),
                price: $("#price").val()
            }

            $.ajax({
                url: "/item/create",
                crossDomain: true,
                data: formData,
                success: function (result) {
                    console.log(formData)
                    console.log(result)
                    Swal.fire({
                        type: 'success',
                        title: 'Add Success!',
                        text: 'Item has been added!!!',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    retrieveItems();
                    addRow(result)
                    $("#getResultDiv").html("<strong>Success!</strong>");
                    $('input').val("")
                },
                error: function (e) {
                    $("#getResultDiv").html("<strong>Error</strong>");
                    console.log("ERROR: ", e);
                }
            });

        }
    })


    $("#btnSearch").click(function (e) {
        var id = $('.id_search').val()
        retrieveItems(id)
    })

    //back to table
    $(document).on("click", "#btnRetrieve", function () {
        $('input').val("");
        retrieveItems();
    })
    //retrieve all data
    $(document).on("click", "#retrieve", function () {
        retrieveItems();
    })


    $(document).on("click", ".del", function () {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        })
        swalWithBootstrapButtons.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                var formData = {
                    brand: $("#brand").val(),
                    model: $("#model").val(),
                    year: $("#year").val(),
                    price: $("#price").val()
                }
                var id = $(this).attr('id').split('_')
                $.ajax({
                    url: "/item/delete/" + id[1],
                    crossDomain: true,
                    data: formData,
                    success: function (result) {
                        console.log('Success!!')
                        console.log(data);
                    },
                    error: function (e) {
                        console.log("ERROR: ", e);
                    }
                });
                $(this).parent().parent().parent().fadeOut("slow")
                swalWithBootstrapButtons.fire(
                    'Deleted!',
                    'The item has been deleted.',
                    'success'
                )

            }
        })
    })

    $(document).on("click", ".update", function () {
        var updateId = $(this).parent().parent().parent().attr("id");
        localStorage.setItem("value", updateId)
        retrieveOneItem(updateId)
    })

    $("#btnUpdated").click(function () {
        var validBrand = $('#updateBrand').val();
        // var validModel = $('#updateModel').val()
        var validYear = $('#updateYear').val()
        var validPrice = $('#updatePrice').val()
        var brandmatches = validBrand.match(/\d+/g);
        var key = $(this).attr("key");
        var data1 = {
            "brand": $('#updateBrand').val(),
            "model": $('#updateModel').val(),
            "year": $('#updateYear').val(),
            "price": $('#updatePrice').val()
        }
        $.ajax({
            url: "item/retrieve/" + localStorage.getItem("value"),
            crossDomain: true,
            success: function (data) {
                console.log(data)
                console.log(data.brand)
                if ($('#updateBrand').val() == data.brand && $('#updateModel').val() == data.model &&
                    $('#updateYear').val() == data.year && $('#updatePrice').val() == data.price) {
                    Swal.fire('Nothing has been changed!!!')
                } else if (brandmatches != null) {
                    valid = false;
                    Swal.fire({
                        type: 'error',
                        title: 'Car Brand should be alphabet letters',
                        showConfirmButton: false,
                        timer: 1000
                    })
                    $('input').val("");
                }
                else if (!isNumeric(validYear) || !isNumeric(validPrice)) {
                    valid = false;
                    Swal.fire({
                        type: 'error',
                        title: 'Year and Price should be numbers',
                        showConfirmButton: false,
                        timer: 1000
                    })
                    $('input').val("");
                }
                else if (!$("#updateBrand").val() || !$("#updateModel").val() || !$("#updateYear").val() || !$("#updatePrice").val()) {
                    valid = false;
                    Swal.fire({
                        type: 'error',
                        title: 'All inputs should be filled!!',
                        showConfirmButton: false,
                        timer: 1000
                    })
                    $('input').val("");
                }
                else {
                    updateItem(key, data1)
                    Swal.fire('Saved Changes')
                }
            },
            error: function (e) {
                console.log(e);
            }
        })
    })

    $("#searchBtn").click(function () {
        var updateBrand = $("#searchInput").val();
        searchedItem(updateBrand);
        $("#searchInput").val("");
    })

    //update Item function
    function updateItem(id, newData) {
        $.ajax({
            url: "item/update",
            type: "put",
            data: {
                id: id,
                newData: newData
            },
            success: function (data) {
                $('#' + data._id + " td.forBrand").text(data.brand)
                $('#' + data._id + " td.forModel").text(data.model)
                $('#' + data._id + " td.forYear").text(data.year)
                $('#' + data._id + " td.forPrice").text(data.price)

            },
            error: function (e) {
                console.log(e);
            }
        })
    }

    function retrieveOneItem(id) {
        $.ajax({
            url: "item/retrieve/" + id,
            crossDomain: true,
            success: function (data) {
                console.log(data)
                $('#updateBrand').val(data.brand);
                $('#updateModel').val(data.model);
                $('#updateYear').val(data.year);
                $('#updatePrice').val(data.price);
                $("#btnUpdated").attr("key", data._id)
            },
            error: function (e) {
                console.log(e);
            }
        })
    }

    function searchedItem(brand) {
        $.ajax({
            url: "item/search/" + brand,
            type: "put",
            crossDomain: true,
            success: function (data) {
                if (data.length != 0) {
                    $("tbody").empty();
                    data.forEach(car => {
                        addRow(car)
                    })
                } else {
                    // Swal.fire({
                    //     type: 'error',
                    //     title: 'Item not found!!!',
                    //     showConfirmButton: false,
                    //     timer: 1000
                    // })
                }


            },
            error: function (e) {
                console.log(e);
            }
        })
    }

})
