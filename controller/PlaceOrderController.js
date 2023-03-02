/**
 * @author : Pasan Pahasara
 * @since : 0.1.0
 **/
let tableRow = [];

// disable cart button and place orderDTO button
$("#btnAddCart").attr('disabled', true);
$("#btnPlaceOrder").attr('disabled', true);


// generate orderID
function generateOrderID() {
    if (orderDB.length > 0) {
        let lastId = orderDB[orderDB.length - 1].oId;
        let digit = lastId.substring(6);
        let number = parseInt(digit) + 1;
        return lastId.replace(digit, number);
    } else {
        return "ORD-001";
    }
}

// get date
function setCurrentDate() {
    let currentDate = $("#orderDate").val();
}

//--------------------------------------------//
<!-- Start Customer Details Combo -->
//--------------------------------------------//
// load ids'
function loadAllCustomersForOption() {
    $("#cusId").empty();
    $("#cusId").append(`<option>-Select Customer-</option>`);
    for (let customer of customers) {
        $("#cusId").append(`<option>${customer.id}</option>`);
    }
}

// set customers Details
$("#cusId").click(function () {
    let find = customers.find(({id}) => id === $("#cusId").val());
    $("#cusName").val(find.name);
    $("#cusAddress").val(find.address);
    $("#cusSalary").val(find.salary);
});
//--------------------------------------------//
<!-- Ended Customer Details Combo -->
//--------------------------------------------//

//--------------------------------------------//
<!-- Start Item Details Combo -->
//--------------------------------------------//
// load ids'
function loadAllItemsForOption() {
    $("#cmbCode").empty();
    $("#cmbCode").append(`<option>-Select Item-</option>`);
    for (let item of items) {
        $("#cmbCode").append(`<option>${item.id}</option>`);
    }
}

// set items Details
$("#cmbCode").click(function () {
    let find = items.find(({id}) => id === $("#cmbCode").val());
    $("#iName").val(find.name);
    $("#iPrice").val(find.price);
    $("#iQtyOnHand").val(find.quantity);
});
//--------------------------------------------//
<!-- Ended Item Details Combo -->
//--------------------------------------------//

// global variables names
let itemCode;
let itemName;
let itemPrice;
let itemQty;
let itemOrderQty;

let total = 0;
let discount = 0;
let subTotal = 0;

//--------------------------------------------//
<!-- Start Cart Details -->
//--------------------------------------------//
// add to cart button
$("#btnAddCart").on('click', function () {
    Swal.fire({
        title: 'Added Cart Successfully..!',
        confirmButtonColor: '#3085d6'
    });

    // duplicate false
    let duplicate = false;
    for (let i = 0; i < $("#tableAddCart tr").length; i++) {
        if ($("#cmbCode option:selected").text() === $("#tableAddCart tr").children(':nth-child(1)')[i].innerText) {
            duplicate = true;
        }
    }

    if (duplicate !== true) {
        loadAddCartTable();
        countingDownQty($("#buyQty").val());
        calcTotal($("#buyQty").val() * $("#iPrice").val());
    } else if (duplicate === true) {

        manageQtyOnHand(tableRow.children(':nth-child(4)').text(), $("#buyQty").val());
        $(tableRow).children(':nth-child(4)').text($("#buyQty").val());

        manageTotal(tableRow.children(':nth-child(5)').text(), $("#buyQty").val() * $("#iPrice").val());
        $(tableRow).children(':nth-child(5)').text($("#buyQty").val() * $("#iPrice").val());
    }

    // click table row and set values to text fields
    $("#tableAddCart>tr").click('click', function () {
        tableRow = $(this);
        let itemCode = $(this).children(":eq(0)").text();
        let itemName = $(this).children(":eq(1)").text();
        let unitPrice = $(this).children(":eq(2)").text();
        let qty = $(this).children(":eq(3)").text();
        let total = $(this).children(":eq(4)").text();

        $("#cmbCode").val(itemCode);
        $("#iName").val(itemName);
        $("#iPrice").val(unitPrice);
        $("#buyQty").val(qty);
        $("#lblTotal").val(total);
    });

    let itemIdQ = $("#cmbCode").val();
    let response = updateItemQty(itemIdQ);
    if (response) {
    }
});

// load cart details to the table
$("#tableAddCart").empty();

function loadAddCartTable() {
    itemCode = $("#cmbCode").val();
    itemName = $("#iName").val();
    itemPrice = $("#iPrice").val();
    itemQty = $("#iQtyOnHand").val();
    itemOrderQty = $("#buyQty").val();

    let total = itemPrice * itemOrderQty;
    let row = `<tr><td>${itemCode}</td><td>${itemName}</td><td>${itemPrice}</td><td>${itemOrderQty}</td><td>${total}</td></tr>`;

    $("#tableAddCart").append(row);
}

// counting orderDTO qty hand after buy
function countingDownQty(orderQty) {
    let minQty = parseInt(orderQty);
    let reduceQty = parseInt($("#iQtyOnHand").val());
    reduceQty = reduceQty - minQty;
    $("#iQtyOnHand").val(reduceQty);
}

// calculate total
function calcTotal(number) {
    total += number;
    $("#lblTotal").val("RS: " + total + "/=");
}

// manage qtyOnHand function
function manageQtyOnHand(preQty, nowQty) {
    var preQty = parseInt(preQty);
    var nowQty = parseInt(nowQty);
    let avaQty = parseInt($("#iQtyOnHand").val());

    avaQty = avaQty + preQty;
    avaQty = avaQty - nowQty;

    $("#iQtyOnHand").val(avaQty);
}

// manage total function
function manageTotal(preTotal, nowTotal) {
    total -= preTotal;
    total += nowTotal;

    $("#lblTotal").val(total);
}
//--------------------------------------------//
<!-- Ended Cart Details -->
//--------------------------------------------//

// discount added and calculate total
$(document).on("change keyup blur", "#discount", function () {
    discount = $("#discount").val();
    discount = (total / 100) * discount;
    subTotal = total - discount;

    $("#subTotal").val(subTotal);
});

// added cash and check balance
$(document).on("change keyup blur", "#cash", function () {
    let cash = $("#cash").val();
    let balance = cash - subTotal;
    $("#balance").val(balance);
    if (balance < 0) {
        $("#lblCheckSubtotal").parent().children('strong').text(balance+" : plz enter valid Balance");
        $("#btnPlaceOrder").attr('disabled', true);
    } else {
        $("#lblCheckSubtotal").parent().children('strong').text("");
        $("#btnPlaceOrder").attr('disabled', false);
    }
});

// dblclick delete function
$("#tableAddCart").on('dblclick',function () {
    Swal.fire({
        title: 'Do you want to Delete the Select row ?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Delete',
        confirmButtonColor: '#3085d6',
        denyButtonText: `Don't Delete`,
        customClass: {
            actions: 'my-actions',
            cancelButton: 'order-1 right-gap',
            confirmButton: 'order-2',
            denyButton: 'order-3',
        }
    }).then((result) => {
        if (result.isConfirmed) {
            $(this).children('tr').eq(0).remove();
            Swal.fire('Delete!', '', 'success')
        } else if (result.isDenied) {
            Swal.fire('Select row are not Delete', '', 'info')
        }
    })

});

// place orderDTO button
$("#btnPlaceOrder").click(function () {
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Your Order has been placed',
        showConfirmButton: false,
        timer: 1500
    })
    placeOrder();
    pushOrderDetails();
    clearAllOrderTextFieldsDetails();
    loadAllOrders();
    loadAllOrderDetails();
    $("#tableAddCart").empty();
    $("#orderId").val(generateOrderID());
});

// place orderDTO details function
function pushOrderDetails() {
    for (let i = 0; i < $("#tableAddCart tr").length; i++) {
        let orderId = $("#orderId").val();
        let cusId = $("#cusId").val();
        let itemId = $("#tableAddCart tr").children(':nth-child(1)')[i].innerText;
        let qty = $("#tableAddCart tr").children(':nth-child(4)')[i].innerText;
        let total = $("#tableAddCart tr").children(':nth-child(5)')[i].innerText;

        let orderDetailArrayList = new orderDetailDTO(orderId, cusId, itemId, qty, total);

        orderDetails.push(orderDetailArrayList);
        console.log(orderDetailArrayList);
    }
}

// place orderDTO function
function placeOrder() {
    //create object
    let orderArrayList = new orderDTO(
        $("#orderId").val(),
        $("#cusId").val(),
        $("#orderDate").val(),
        $("#subTotal").val(),
        $("#discount").val()
    );

    orderDB.push(orderArrayList);
    console.log(orderArrayList);

    // saveUpdateAlert("Place Ordering", "Successfully.");
}

// check buy quantity and enable btnAddCart button
$(document).on("change keyup blur", "#buyQty", function () {
    let qtyOnHand = $("#iQtyOnHand").val();
    let buyQty = $("#buyQty").val();
    let buyOnHand = qtyOnHand - buyQty;
    if (buyOnHand < 0) {
        $("#lblCheckQty").parent().children('strong').text(qtyOnHand + " : Empty On Stock..!!");
        $("#btnAddCart").attr('disabled', true);
    } else {
        $("#lblCheckQty").parent().children('strong').text("");
        $("#btnAddCart").attr('disabled', false);
    }
});

// update Item Qty function
function updateItemQty(itemIdQ) {
    let itemQ = searchItemQty(itemIdQ);
    if (itemQ != null) {
        itemQ.quantity = $("#iQtyOnHand").val();
        loadAllItems();
        return true;
    } else {
        return false;
    }
}

// search item Qty function
function searchItemQty(itemIdQ) {
    for (let itemQ of items) {
        if (itemQ.id === itemIdQ) {
            return itemQ;
        }
    }
    return null;
}

// clear add order details in textFields function
function clearAllOrderTextFieldsDetails() {
    $('#cusId,#cusName,#cusAddress,#cusSalary,#orderDate,#cmbCode,#iName,#iPrice,#iQtyOnHand,#buyQty,#discount,#lblTotal,#subTotal,#cash,#balance').val("");
    $("#btnAddCart").attr('disabled', true);
    $("#btnPlaceOrder").attr('disabled', true);
}


