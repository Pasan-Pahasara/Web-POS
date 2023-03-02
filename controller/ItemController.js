/**
 * @author : Pasan Pahasara
 * @since : 0.1.0
 **/

// stating focus customerID
$("#item-id").focus();

// generate ItemID
function generateItemID() {
    if (items.length > 0) {
        let lastId = items[items.length - 1].id;
        let digit = lastId.substring(6);
        let number = parseInt(digit) + 1;
        return lastId.replace(digit, number);
    } else {
        return "I00-001";
    }
}
//add new item
$("#newItem").click(function () {
    let itemID = $("#item-id").val();
    let itemName = $("#item-name").val();
    let itemPrice = $("#item-price").val();
    let itemQuantity = $("#item-quantity").val();

    let itemObject = new ItemDTO(itemID, itemName, itemPrice, itemQuantity);

    items.push(itemObject);
    //item saved alert
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Your Item has been saved',
        showConfirmButton: false,
        timer: 1500
    })
    loadAllItems();
    dblItemRowClickEvents();
    bindItemRowClickEvents();
    clearItemAllTexts();
    loadAllItemsForOption();
    $("#item-id").val(generateItemID());
});

// load all items function
function loadAllItems() {
    $("#tblItem").empty();

    // get all item records from the array
    for (let item of items) {
        let row = `<tr><td>${item.id}</td><td>${item.name}</td><td>${item.price}</td><td>${item.quantity}</td></tr>`;
        $("#tblItem").append(row);
    }
}

// double clicked delete function
function dblItemRowClickEvents() {
    $("#tblItem>tr").on('dblclick', function () {
        let deleteItemID = $(this).children(":eq(0)").text();

        Swal.fire({
            title: 'Do you want to Delete the \n' + deleteItemID + ' ?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Delete',
            confirmButtonColor: '#3085d6',
            denyButtonText: `Don't Delete`,
        }).then((result) => {
            if (result.isConfirmed) {
                $(this).remove(); //select the row which runs the event at the moment and then delete it
                if (deleteItem(deleteItemID)) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Delete Successfully',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setItemTextFieldValues("", "", "", "");
                } else {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: 'Delete Unsuccessfully',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            } else if (result.isDenied) {
                Swal.fire(deleteItemID + ' Delete Canceled!', '', 'info')
            }
        })
    });
}

// setting all table records details values to text fields
function bindItemRowClickEvents() {
    $("#tblItem>tr").click(function () {
        let iteId = $(this).children(":eq(0)").text();
        let iteName = $(this).children(":eq(1)").text();
        let itePrice = $(this).children(":eq(2)").text();
        let iteQtyOnHand = $(this).children(":eq(3)").text();

        $('#itemID').val(iteId);
        $('#itemName').val(iteName);
        $('#itemPrice').val(itePrice);
        $('#itemQuantity').val(iteQtyOnHand);
    });
}

// regex patterns
let regItemCode = /^(I00-)[0-9]{3,4}$/;
let regItemName = /^[A-z ]{3,20}$/;
let regItemPrice = /^[0-9]{1,10}$/;
let regItemQtyOnHand = /^[0-9]{1,3}$/;

// item validation array
let itemValidations = [];
let updateItemValidations = [];

itemValidations.push({
    itemReg: regItemCode,
    itemField: $('#item-id'),
    itemError: 'Item ID Pattern is Wrong : I00-001'
});
itemValidations.push({
    itemReg: regItemName,
    itemField: $('#item-name'),
    itemError: 'Item Name Pattern is Wrong : A-z 5-20'
});
itemValidations.push({
    itemReg: regItemPrice,
    itemField: $('#item-price'),
    itemError: 'Item Price Pattern is Wrong : 100 or 100.00,/'
});
itemValidations.push({
    itemReg: regItemQtyOnHand,
    itemField: $('#item-quantity'),
    itemError: 'Item Quantity Pattern is Wrong : 100'
});

// disable tab key of all four text fields using grouping selector in CSS
$("#item-id,#item-name,#item-price,#item-quantity").on('keydown', function (event) {
    if (event.key == "Tab") {
        event.preventDefault();
    }
});

// grouping all fields keyup event using and call check validity function
$("#item-id,#item-name,#item-price,#item-quantity").on('keyup', function (event) {
    checkItemValidity();
});

// grouping all fields blur event using and call check validity function
$("#item-id,#item-name,#item-price,#item-quantity").on('blur', function (event) {
    checkItemValidity();
});

// item-id focus event
$("#item-id").on('keydown', function (event) {
    if (event.key == "Enter" && itemCheck(regItemCode, $("#item-id"))) {
        $("#item-name").focus();
    } else {
        focusItemText($("#item-id"));
    }
});

// item-name focus event
$("#item-name").on('keydown', function (event) {
    if (event.key == "Enter" && itemCheck(regItemName, $("#item-name"))) {
        focusItemText($("#item-price"));
    }
});

// item-price focus event
$("#item-price").on('keydown', function (event) {
    if (event.key == "Enter" && itemCheck(regItemPrice, $("#item-price"))) {
        focusItemText($("#item-quantity"));
    }
});

// item-quantity focus event
$("#item-quantity").on('keydown', function (event) {
    if (event.key == "Enter" && itemCheck(regItemQtyOnHand, $("#item-quantity"))) {
        $("#newItem").focus();
    }
});

// load all items button
$("#btnViewAllItem").on('click', function () {
    loadAllItems();
})

// add item modal clear button
$("#clearItem").on('click', function () {
    clearItemAllTexts();
});

// search id and load table
$("#btnItemSearch").click(function () {
    var searchItemID = items.find(({id}) => id === $("#itemSearchBar").val());

    // delete item button
    $("#btnItemDelete").click(function () {
        let deleteItemID = $("#itemSearchBar").val();
        Swal.fire({
            title: 'Do you want to Delete the \n' + deleteItemID + ' ?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Delete',
            confirmButtonColor: '#3085d6',
            denyButtonText: `Don't Delete`,
        }).then((result) => {
            if (result.isConfirmed) {
                if (deleteItem(deleteItemID)) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Delete Successfully',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setItemTextFieldValues("", "", "", "");
                } else {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: 'Delete Unsuccessfully',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            } else if (result.isDenied) {
                Swal.fire(deleteItemID + ' Delete Canceled!', '', 'info')
            }
        })
    });

    // set update text fields values
    if (searchItemID != null) {
        $("#itemID").val(searchItemID.id);
        $("#itemName").val(searchItemID.name);
        $("#itemPrice").val(searchItemID.price);
        $("#itemQuantity").val(searchItemID.quantity);
        loadAllItems();
        return true;
    } else {
        return false;
        loadAllItems();
        setItemTextFieldValues("", "", "", "");
    }

    $("#tblItem").empty();

    // get all item records from the array
    var row = `<tr><td>${searchItemID.id}</td><td>${searchItemID.name}</td><td>${searchItemID.price}</td><td>${searchItemID.quantity}</td></tr>`;
    $("#tblItem").append(row);
});

// update customer button
$("#updateItemBtn").click(function () {
    let itemID = $("#itemID").val();
    let response = updateItem(itemID);
    if (response) {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Update Successfully',
            showConfirmButton: false,
            timer: 1500
        })
        setItemTextFieldValues("", "", "", "");
    } else {
        Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Update Unsuccessfully',
            showConfirmButton: false,
            timer: 1500
        })
    }
});

// clear Search Bar Button
$("#btnItemSearchClear").click(function () {
    $("#itemSearchBar").val("");
    clearItemAllTexts();
    loadAllItems();
});

// search item ID
$("#itemID").on('keyup', function (event) {
    if (event.code == "Enter") {
        let typedItemId = $("#itemID").val();
        let Item = searchItem(typedItemId);
        if (Item != null) {
            setItemTextFieldValues(Item.id, Item.name, Item.price, Item.quantity);
        } else {
            alert("There is no item available for that " + typedItemId);
            setItemTextFieldValues("", "", "", "");
        }
    }
});

// check validity function
function checkItemValidity() {
    let itemErrorCount = 0;
    for (let itemValidation of itemValidations) {
        if (itemCheck(itemValidation.itemReg, itemValidation.itemField)) {
            textItemSuccess(itemValidation.itemField, "");
        } else {
            itemErrorCount = itemErrorCount + 1;
            setItemTextError(itemValidation.itemField, itemValidation.itemError);
        }
    }
    setItemButtonState(itemErrorCount);
}

// check regex pattern function
function itemCheck(regex, txtField) {
    let itemInputValue = txtField.val();
    return regex.test(itemInputValue) ? true : false;
}

// error text fields function
function setItemTextError(txtField, error) {
    if (txtField.val().length <= 0) {
        defaultItemText(txtField, "");
    } else {
        txtField.css('border', '2px solid red');
        txtField.parent().children('small').text(error);
    }
}

// success text fields function
function textItemSuccess(txtField, error) {
    if (txtField.val().length <= 0) {
        defaultItemText(txtField, "");
    } else {
        txtField.css('border', '2px solid green');
        txtField.parent().children('small').text(error);
    }
}

// default text fields function
function defaultItemText(txtField, error) {
    txtField.css("border", "1px solid #ced4da");
    txtField.parent().children('small').text(error);
}

// focus texts function
function focusItemText(txtField) {
    txtField.focus();
}

// button state function
function setItemButtonState(value) {
    if (value > 0) {
        $("#newItem").attr('disabled', true);
    } else {
        $("#newItem").attr('disabled', false);
    }
}

// clear text fields function
function clearItemAllTexts() {
    $("#item-name").focus();
    $("#item-name,#item-price,#item-quantity").val("");
    checkItemValidity();
}

// search item function
function searchItem(itemID) {
    for (let item of items) {
        if (item.id == itemID) {
            return item;
        }
    }
    return null;
}

// set item values function
function setItemTextFieldValues(code, iName, price, qty) {
    $("#itemID").val(code);
    $("#itemName").val(iName);
    $("#itemPrice").val(price);
    $("#itemQuantity").val(qty);
}

// delete item function
function deleteItem(itemID) {
    let item = searchItem(itemID);
    if (item != null) {
        let indexNumber = items.indexOf(item);
        items.splice(indexNumber, 1);
        loadAllItems();
        return true;
    } else {
        return false;
    }
}

// update item function
function updateItem(itemID) {
    let items = searchItem(itemID);
    if (items != null) {
        items.id = $("#itemID").val();
        items.name = $("#itemName").val();
        items.price = $("#itemPrice").val();
        items.quantity = $("#itemQuantity").val();
        loadAllItems();
        return true;
    } else {
        return false;
        loadAllItems();
        setItemTextFieldValues("", "", "", "");
    }
}

//--------------------------------------------//
<!-- Start Item Update Regex -->
//--------------------------------------------//

updateItemValidations.push({
    itemReg: regItemCode,
    itemField: $('#itemID'),
    itemError: 'Item ID Pattern is Wrong : I00-001'
});
updateItemValidations.push({
    itemReg: regItemName,
    itemField: $('#itemName'),
    itemError: 'Item Name Pattern is Wrong : A-z 5-20'
});
updateItemValidations.push({
    itemReg: regItemPrice,
    itemField: $('#itemPrice'),
    itemError: 'Item Price Pattern is Wrong : 100 or 100.00,/'
});
updateItemValidations.push({
    itemReg: regItemQtyOnHand,
    itemField: $('#itemQuantity'),
    itemError: 'Item Quantity Pattern is Wrong : 100'
});

// disable tab key of all four text fields using grouping selector in CSS
$("#itemID,#itemName,#itemPrice,#itemQuantity").on('keydown', function (event) {
    if (event.key == "Tab") {
        event.preventDefault();
    }
});

// grouping all fields keyup event using and call check validity function
$("#itemID,#itemName,#itemPrice,#itemQuantity").on('keyup', function (event) {
    checkUpdateItemValidity();
});

// grouping all fields blur event using and call check validity function
$("#itemID,#itemName,#itemPrice,#itemQuantity").on('blur', function (event) {
    checkUpdateItemValidity();
});

// update itemID focus event
$("#itemID").on('keydown', function (event) {
    if (event.key == "Enter" && itemCheck(regItemCode, $("#itemID"))) {
    }
});

// update itemName focus event
$("#itemName").on('keydown', function (event) {
    if (event.key == "Enter" && itemCheck(regItemName, $("#itemName"))) {
        focusItemText($("#itemPrice"));
    }
});

// update itemPrice focus event
$("#itemPrice").on('keydown', function (event) {
    if (event.key == "Enter" && itemCheck(regItemPrice, $("#itemPrice"))) {
        focusItemText($("#itemQuantity"));
    }
});

// update itemQuantity focus event
$("#itemQuantity").on('keydown', function (event) {
    if (event.key == "Enter" && itemCheck(regItemQtyOnHand, $("#itemQuantity"))) {
        $("#updateItemBtn").focus();
    }
});

// add update item modal clear button
$("#clearUpdateItem").on('click', function () {
    clearUpdateItemAllTexts();
});

// check update validity function
function checkUpdateItemValidity() {
    let itemErrorCount = 0;
    for (let itemValidation of updateItemValidations) {
        if (itemCheck(itemValidation.itemReg, itemValidation.itemField)) {
            textItemSuccess(itemValidation.itemField, "");
        } else {
            itemErrorCount = itemErrorCount + 1;
            setItemTextError(itemValidation.itemField, itemValidation.itemError);
        }
    }
    setUpdateItemButtonState(itemErrorCount);
}

// update button state function
function setUpdateItemButtonState(value) {
    if (value > 0) {
        $("#updateItemBtn").attr('disabled', true);
    } else {
        $("#updateItemBtn").attr('disabled', false);
    }
}

// clear update text fields function
function clearUpdateItemAllTexts() {
    $("#itemID").focus();
    $("#itemID,#itemName,#itemPrice,#itemQuantity").val("");
    checkUpdateItemValidity();
}

//--------------------------------------------//
<!-- Ended Item Update Regex -->
//--------------------------------------------//