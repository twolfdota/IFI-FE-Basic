$(document).ready(function () {
    initCart();
    $(".table-cart").on("click", ".minus", function (e) {
        const currId = $(e.target).closest(".cart-item").attr("proId");
        console.log(currId);
        let rawCart = JSON.parse(localStorage.getItem("myCart"));
        let currQty = parseInt($(e.target).parent().find(".cart-qty").val()) - 1;
        console.log(currQty);
        $(e.target).parent().find(".cart-qty").val(currQty);
        if (currQty <= 0) {
            removeById(rawCart, currId, e);
        }
        else {
            rawCart[currId].qty = currQty;
            localStorage.setItem('myCart', JSON.stringify(rawCart));
        }
        recalculate();
    })

    $(".table-cart").on("click", ".plus", function (e) {
        const currId = $(e.target).closest(".cart-item").attr("proId");
        console.log(currId);
        let rawCart = JSON.parse(localStorage.getItem("myCart"));
        let currQty = parseInt($(e.target).parent().find(".cart-qty").val()) + 1;

        $(e.target).parent().find(".cart-qty").val(currQty);

        rawCart[currId].qty = currQty;
        localStorage.setItem('myCart', JSON.stringify(rawCart));

        recalculate();
    })

    $(".btn-post").on("click", function (e) {
        e.preventDefault();
        let validated = true;
        const rawCart = JSON.parse(localStorage.getItem("myCart"));
        const cName = $("#cName").val();
        const cPhone = $("#cPhone").val();
        const cLandmark = $("#cLandmark").val();
        const cCity = $("#cCity").val();
        const addressType = $("#addressType").val();
        const phoneRegex = /^0.{9}$/;
        if (!Object.keys(rawCart).length) {
            validated = false;
            alert("Your shopping cart is empty");
            return;
        }

        if (!cName) {
            validated = false;
            alert("Please enter your name");
            $("#cName").focus();
            return;
        }

        if (!cPhone || !phoneRegex.test(cPhone)) {
            validated = false;
            alert("Invalid phone number");
            $("#cPhone").focus();
            return;
        }

        if (validated) {

            let myOrder =
            {
                details: [],
                cName: cName,
                cPhone: cPhone,
                cLandmark: cLandmark,
                cCity: cCity,
                addressType: addressType
            }

            for (let key in rawCart) {
                myOrder.details.push(rawCart[key]);
            }
            const postData = JSON.stringify(myOrder);
            $.ajax({
                type: "POST",
                contentType:"application/json",
                data: postData,
                url: `http://localhost:3000/orders`
            }).done(function (data) {
                alert(JSON.stringify(data));
                localStorage.removeItem('myCart');
            }).fail(function (jqXHR, textStatus, errorThrown) {
                alert(textStatus + ': ' + errorThrown);
            });

        }
    });
})