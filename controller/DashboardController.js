/**
 * @author : Pasan Pahasara
 * @since : 0.1.0
 **/

// generate OrderID
$("#btnPlaceOrder").click(function () {
    setCurrentDate();
});

var swiper = new Swiper(".mySwiper", {
    direction: "vertical",
    autoplay: {
        delay: 2600,
        disableOnInteraction: false,
    },
    mousewheel: true,
    keyboard: {
        enabled: true,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
});

$(document).ready(function () {
    $('#homeSection').attr('style', 'display : flex !important')
    $('#customerSection').attr('style', 'display : none !important')
    $('#itemSection').attr('style', 'display : none !important')
    $('#placeOrderSection').attr('style', 'display : none !important')
    $('#orderDetailsSection').attr('style', 'display : none !important')
});

$('#homeBtn').click(function () {
    $('#homeSection').attr('style', 'display : flex !important')
    $('#customerSection').attr('style', 'display : none !important')
    $('#itemSection').attr('style', 'display : none !important')
    $('#placeOrderSection').attr('style', 'display : none !important')
    $('#orderDetailsSection').attr('style', 'display : none !important')
})

$('#customersBtn').click(function () {
    $('#homeSection').attr('style', 'display : none !important')
    $('#customerSection').attr('style', 'display : flex !important')
    $('#itemSection').attr('style', 'display : none !important')
    $('#placeOrderSection').attr('style', 'display : none !important')
    $('#orderDetailsSection').attr('style', 'display : none !important')
    $("#customer-id").val(generateCustomerID());
})

$('#itemsBtn').click(function () {
    $('#homeSection').attr('style', 'display : none !important')
    $('#customerSection').attr('style', 'display : none !important')
    $('#itemSection').attr('style', 'display : flex !important')
    $('#placeOrderSection').attr('style', 'display : none !important')
    $('#orderDetailsSection').attr('style', 'display : none !important')
    $("#item-id").val(generateItemID());
})

$('#placeOrderBtn').click(function () {
    $('#homeSection').attr('style', 'display : none !important')
    $('#customerSection').attr('style', 'display : none !important')
    $('#itemSection').attr('style', 'display : none !important')
    $('#placeOrderSection').attr('style', 'display : flex !important')
    $('#orderDetailsSection').attr('style', 'display : none !important')
    $("#orderId").val(generateOrderID());
})

$('#OrderDetailsBtn').click(function () {
    $('#homeSection').attr('style', 'display : none !important')
    $('#customerSection').attr('style', 'display : none !important')
    $('#itemSection').attr('style', 'display : none !important')
    $('#placeOrderSection').attr('style', 'display : none !important')
    $('#orderDetailsSection').attr('style', 'display : flex !important')
})