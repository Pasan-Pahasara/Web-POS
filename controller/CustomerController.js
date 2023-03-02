/**
 * @author : Pasan Pahasara
 * @since : 0.1.0
 **/

// stating focus customerID
$("#customer-id").focus();
$("#customerID").focus();

// generate CustomerID
function generateCustomerID() {
    if (customers.length > 0) {
        let lastId = customers[customers.length - 1].id;
        let digit = lastId.substring(6);
        let number = parseInt(digit) + 1;
        return lastId.replace(digit, number);
    } else {
        return "C00-001";
    }
}
// add new customer
$("#newCustomer").click(function () {
    let customerID = $("#customer-id").val();
    let customerName = $("#customer-name").val();
    let customerAddress = $("#customer-address").val();
    let customerSalary = $("#customer-salary").val();

    let customerObject = new CustomerDTO(customerID, customerName, customerAddress, customerSalary);

    customers.push(customerObject);
    //customer saved alert
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Your Customer has been saved',
        showConfirmButton: false,
        timer: 1500
    })
    loadAllCustomers();
    dblCustomerRowClickEvents();
    bindCustomerRowClickEvents();
    clearAllTexts();
    loadAllCustomersForOption();
    $("#customer-id").val(generateCustomerID());
});

// load all customers function
function loadAllCustomers() {
    $("#tblCustomer").empty();

    // get all customer records from the array
    for (var customer of customers) {
        var row = `<tr><td>${customer.id}</td><td>${customer.name}</td><td>${customer.address}</td><td>${customer.salary}</td></tr>`;
        $("#tblCustomer").append(row);
    }
}

// setting all table records details values to text fields
function bindCustomerRowClickEvents() {
    $("#tblCustomer>tr").click(function () {
        let cusId = $(this).children(":eq(0)").text();
        let cusName = $(this).children(":eq(1)").text();
        let cusAddress = $(this).children(":eq(2)").text();
        let cusSalary = $(this).children(":eq(3)").text();

        $('#customerID').val(cusId);
        $('#customerName').val(cusName);
        $('#customerAddress').val(cusAddress);
        $('#customerSalary').val(cusSalary);
    });
}

// double clicked delete function
function dblCustomerRowClickEvents() {
    $("#tblCustomer>tr").on('dblclick', function () {
        let deleteCusID = $(this).children(":eq(0)").text();

        Swal.fire({
            title: 'Do you want to Delete the \n' + deleteCusID + ' ?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Delete',
            confirmButtonColor: '#3085d6',
            denyButtonText: `Don't Delete`,
        }).then((result) => {
            if (result.isConfirmed) {
                $(this).remove(); //select the row which runs the event at the moment and then delete it
                if (deleteCustomer(deleteCusID)) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Delete Successfully',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setCusTextFieldValues("", "", "", "");
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
                Swal.fire(deleteCusID + ' Delete Canceled!', '', 'info')
            }
        })
    });
}

// regex patterns
let regCusID = /^(C00-)[0-9]{3,4}$/;
let regCusName = /^[A-z ]{3,20}$/;
let regCusAddress = /^[A-z0-9/ ]{6,30}$/;
let regCusSalary = /^[0-9]{1,}[.]?[0-9]{1,2}$/;

// customer validation array
let customerValidations = [];
let updateCustomerValidations = [];

customerValidations.push({
    reg: regCusID,
    field: $('#customer-id'),
    error: 'Customer ID Pattern is Wrong : C00-001'
});
customerValidations.push({
    reg: regCusName,
    field: $('#customer-name'),
    error: 'Customer Name Pattern is Wrong : A-z 5-20'
});
customerValidations.push({
    reg: regCusAddress,
    field: $('#customer-address'),
    error: 'Customer Address Pattern is Wrong : A-z 0-9 ,/'
});
customerValidations.push({
    reg: regCusSalary,
    field: $('#customer-salary'),
    error: 'Customer Salary Pattern is Wrong : 100 or 100.00'
});

// disable tab key of all four text fields using grouping selector in CSS
$("#customer-id,#customer-name,#customer-address,#customer-salary").on('keydown', function (event) {
    if (event.key == "Tab") {
        event.preventDefault();
    }
});

// grouping all fields keyup event using and call check validity function
$("#customer-id,#customer-name,#customer-address,#customer-salary").on('keyup', function (event) {
    checkValidity();
});

// grouping all fields blur event using and call check validity function
$("#customer-id,#customer-name,#customer-address,#customer-salary").on('blur', function (event) {
    checkValidity();
});

// customer-id focus event
$("#customer-id").on('keydown', function (event) {
    if (event.key == "Enter" && check(regCusID, $("#customer-id"))) {
        $("#customer-name").focus();
    } else {
        focusText($("#customer-id"));
    }
});

// customer-name focus event
$("#customer-name").on('keydown', function (event) {
    if (event.key == "Enter" && check(regCusName, $("#customer-name"))) {
        focusText($("#customer-address"));
    }
});

// customer-address focus event
$("#customer-address").on('keydown', function (event) {
    if (event.key == "Enter" && check(regCusAddress, $("#customer-address"))) {
        focusText($("#customer-salary"));
    }
});

// customer-salary focus event
$("#customer-salary").on('keydown', function (event) {
    if (event.key == "Enter" && check(regCusSalary, $("#customer-salary"))) {
        $("#newCustomer").focus();
    }
});

// add customer modal clear button
$("#clearCustomer").on('click', function () {
    clearAllTexts();
});

// load all customers button
$("#btnViewAllCustomer").click(function () {
    loadAllCustomers();
})

// search id and load table
$("#btnCustomerSearch").click(function () {
    var searchCusID = customers.find(({id}) => id === $("#customerSearchBar").val());

    // delete customer button
    $("#btnCusDelete").click(function () {
        let deleteCusID = $("#customerSearchBar").val();
        Swal.fire({
            title: 'Do you want to Delete the \n' + deleteCusID + ' ?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Delete',
            confirmButtonColor: '#3085d6',
            denyButtonText: `Don't Delete`,
        }).then((result) => {
            if (result.isConfirmed) {
                if (deleteCustomer(deleteCusID)) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Delete Successfully',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setCusTextFieldValues("", "", "", "");
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
                Swal.fire(deleteCusID + ' Delete Canceled!', '', 'info')
            }
        })
    });

    // set update text fields values
    if (searchCusID != null) {
        $("#customerID").val(searchCusID.id);
        $("#customerName").val(searchCusID.name);
        $("#customerAddress").val(searchCusID.address);
        $("#customerSalary").val(searchCusID.salary);
        loadAllCustomers();
        return true;
    } else {
        return false;
        loadAllCustomers();
        setCusTextFieldValues("", "", "", "");
    }

    $("#tblCustomer").empty();

    // get all customer records from the array
    var row = `<tr><td>${searchCusID.id}</td><td>${searchCusID.name}</td><td>${searchCusID.address}</td><td>${searchCusID.salary}</td></tr>`;
    $("#tblCustomer").append(row);
});

// update customer button
$("#updateCustomerBtn").click(function () {
    let customerID = $("#customerID").val();
    let response = updateCustomer(customerID);
    if (response) {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Update Successfully',
            showConfirmButton: false,
            timer: 1500
        })
        setCusTextFieldValues("", "", "", "");
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
$("#btnCustomerSearchClear").click(function () {
    $("#customerSearchBar").val("");
    clearAllTexts();
    loadAllCustomers();
})

// search customer ID
$("#customerID").on('keyup', function (event) {
    if (event.code == "Enter") {
        let typedId = $("#customerID").val();
        let customer = searchCustomer(typedId);
        if (customer != null) {
            setCusTextFieldValues(customer.id, customer.name, customer.address, customer.salary);
        } else {
            alert("There is no customer available for that " + typedId);
            setCusTextFieldValues("", "", "", "");
        }
    }
});

// check validity function
function checkValidity() {
    let errorCount = 0;
    for (let validation of customerValidations) {
        if (check(validation.reg, validation.field)) {
            textSuccess(validation.field, "");
        } else {
            errorCount = errorCount + 1;
            setTextError(validation.field, validation.error);
        }
    }
    setButtonState(errorCount);
}

// check regex pattern function
function check(regex, txtField) {
    let inputValue = txtField.val();
    return regex.test(inputValue) ? true : false;
}

// error text fields function
function setTextError(txtField, error) {
    if (txtField.val().length <= 0) {
        defaultText(txtField, "");
    } else {
        txtField.css('border', '2px solid red');
        txtField.parent().children('small').text(error);
    }
}

// success text fields function
function textSuccess(txtField, error) {
    if (txtField.val().length <= 0) {
        defaultText(txtField, "");
    } else {
        txtField.css('border', '2px solid green');
        txtField.parent().children('small').text(error);
    }
}

// default text fields function
function defaultText(txtField, error) {
    txtField.css("border", "1px solid #ced4da");
    txtField.parent().children('small').text(error);
}

// focus texts function
function focusText(txtField) {
    txtField.focus();
}

// button state function
function setButtonState(value) {
    if (value > 0) {
        $("#newCustomer").attr('disabled', true);
    } else {
        $("#newCustomer").attr('disabled', false);
    }
}

// clear added text fields function
function clearAllTexts() {
    $("#customer-name").focus();
    $("#customer-name,#customer-address,#customer-salary").val("");
    checkValidity();
}

// search customer function
function searchCustomer(cusID) {
    for (let customer of customers) {
        if (customer.id == cusID) {
            return customer;
        }
    }
    return null;
}

// set customer values function
function setCusTextFieldValues(id, name, address, salary) {
    $("#customerID").val(id);
    $("#customerName").val(name);
    $("#customerAddress").val(address);
    $("#customerSalary").val(salary);
}

// delete customer function
function deleteCustomer(customerID) {
    let customer = searchCustomer(customerID);
    if (customer != null) {
        let indexNumber = customers.indexOf(customer);
        customers.splice(indexNumber, 1);
        loadAllCustomers();
        return true;
    } else {
        return false;
    }
}

// update customer function
function updateCustomer(customerID) {
    let customer = searchCustomer(customerID);
    if (customer != null) {
        customer.id = $("#customerID").val();
        customer.name = $("#customerName").val();
        customer.address = $("#customerAddress").val();
        customer.salary = $("#customerSalary").val();
        loadAllCustomers();
        return true;
    } else {
        return false;
        loadAllCustomers();
        setCusTextFieldValues("", "", "", "");
    }
}

//--------------------------------------------//
<!-- Start Customer Update Regex -->
//--------------------------------------------//

updateCustomerValidations.push({
    reg: regCusID,
    field: $('#customerID'),
    error: 'Customer ID Pattern is Wrong : C00-001'
});
updateCustomerValidations.push({
    reg: regCusName,
    field: $('#customerName'),
    error: 'Customer Name Pattern is Wrong : A-z 5-20'
});
updateCustomerValidations.push({
    reg: regCusAddress,
    field: $('#customerAddress'),
    error: 'Customer Address Pattern is Wrong : A-z 0-9 ,/'
});
updateCustomerValidations.push({
    reg: regCusSalary,
    field: $('#customerSalary'),
    error: 'Customer Salary Pattern is Wrong : 100 or 100.00'
});

// disable tab key of all four text fields using grouping selector in CSS
$("#customerID,#customerName,#customerAddress,#customerSalary").on('keydown', function (event) {
    if (event.key == "Tab") {
        event.preventDefault();
    }
});

// grouping all fields keyup event using and call check validity function
$("#customerID,#customerName,#customerAddress,#customerSalary").on('keyup', function (event) {
    checkUpdateCustomerValidity();
});

// grouping all fields blur event using and call check validity function
$("#customerID,#customerName,#customerAddress,#customerSalary").on('blur', function (event) {
    checkUpdateCustomerValidity();
});

// update customerID focus event
$("#customerID").on('keydown', function (event) {
    if (event.key == "Enter" && check(regCusID, $("#customerID"))) {
    }
});

// update customerName focus event
$("#customerName").on('keydown', function (event) {
    if (event.key == "Enter" && check(regCusName, $("#customerName"))) {
        focusText($("#customerAddress"));
    }
});

// update customerAddress focus event
$("#customerAddress").on('keydown', function (event) {
    if (event.key == "Enter" && check(regCusAddress, $("#customerAddress"))) {
        focusText($("#customerSalary"));
    }
});

// update customerSalary focus event
$("#customerSalary").on('keydown', function (event) {
    if (event.key == "Enter" && check(regCusSalary, $("#customerSalary"))) {
        $("#updateCustomerBtn").focus();
    }
});

// add update customer modal clear button
$("#clearUpdateCustomer").on('click', function () {
    clearUpdateCustomerAllTexts();
});

// check update validity function
function checkUpdateCustomerValidity() {
    let errorCount = 0;
    for (let validation of updateCustomerValidations) {
        if (check(validation.reg, validation.field)) {
            textSuccess(validation.field, "");
        } else {
            errorCount = errorCount + 1;
            setTextError(validation.field, validation.error);
        }
    }
    setUpdateCustomerButtonState(errorCount);
}

// update button state function
function setUpdateCustomerButtonState(value) {
    if (value > 0) {
        $("#updateCustomerBtn").attr('disabled', true);
    } else {
        $("#updateCustomerBtn").attr('disabled', false);
    }
}

// clear update text fields function
function clearUpdateCustomerAllTexts() {
    $("#customerID").focus();
    $("#customerID,#customerName,#customerAddress,#customerSalary").val("");
    checkUpdateCustomerValidity();
}

