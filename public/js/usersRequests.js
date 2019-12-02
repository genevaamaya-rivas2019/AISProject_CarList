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



    $("#btnAdd").click(function () {
        // var validBrand = $('#brand').val();
        // var validModel = $('#model').val()
        // var validYear = $('#year').val()
        // var validPrice = $('#price').val()
        var valid = true;
        $('.form-control').each(function () {


            if (!$("#brand").val()) {
                valid = false;
                Swal.fire({
                    type: 'error',
                    title: 'Brand should be filled!!',
                    showConfirmButton: false,
                    timer: 1000
                })
            } else if (!$("#model").val()) {
                valid = false;
                Swal.fire({
                    type: 'error',
                    title: 'Model should be filled!!',
                    showConfirmButton: false,
                    timer: 1000
                })
            } else if (!$("#year").val()) {
                valid = false;
                Swal.fire({
                    type: 'error',
                    title: 'Year should be filled!!',
                    showConfirmButton: false,
                    timer: 1000
                })


            }
            else if (!$("#price").val()) {
                valid = false;
                Swal.fire({
                    type: 'error',
                    title: 'Price should be filled!!',
                    showConfirmButton: false,
                    timer: 1000
                })


            }
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

    $(document).on("click", ".del", function () {
        Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
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
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
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
                if($('#updateBrand').val() == data.brand && $('#updateModel').val() == data.model && 
                $('#updateYear').val() == data.year && $('#updatePrice').val() == data.price){
                    Swal.fire('Nothing has been changed!!!')
                }else{
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
                    Swal.fire({
                        type: 'error',
                        title: 'Item not found!!!',
                        showConfirmButton: false,
                        timer: 1000
                    })
                }


            },
            error: function (e) {
                console.log(e);
            }
        })
    }

})
