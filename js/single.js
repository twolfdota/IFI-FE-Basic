$(document).ready(function () {
    
    var currVote = 3;
    var vote = function (voteVal) {
        $(".star-rating").find("span").each(function (index) {
            if (index < voteVal) {
                $(this).addClass("checked");
            }
            else {
                $(this).removeClass("checked");
            }
        })
    }


    $('.star-rating').find('span').hover(
        function () {
            let voteVal = parseInt($(this).attr("voteVal"));
            vote(voteVal);
        },
        function () {
            vote(currVote);
        }
    );

    $('.star-rating').find('span').on("click", function(e){
        currVote = $(e.target).attr("voteVal");
        vote(currVote);
    })

    vote(currVote);

    $(document).mousemove(function (e) {
        let offset = $(".prod-img").offset();
        let corX = e.pageX - offset.left;
        let corY = e.pageY - offset.top;
        let imgW = $(".prod-img").width();
        let imgH = $(".prod-img").height();
        var isInside = 0 <= corX && corX <= imgW && 0 <= corY && corY <= imgH;
        if (isInside) {
            $('.magGlass').css({
                left: corX - 60,
                top: corY - 60,
                backgroundPositionX: -500 / imgW * corX + 60,
                backgroundPositionY: -500 / imgH * corY + 60
            })
        }
        else {
            $('.magGlass').css({
                left: -1000,
                top: -1000
            })
        }

    })

   /* $(".view-tenth").hover(
        function(){
            console.log($(this));
            let heightX = $(this).height();
            console.log(heightX);
            $(this).css("height", heightX);
            $(this).find('.img-responsive').css('transform', 'scale(' + 10 + ')');

        },
        function(){

        }
    );*/
    let url = new URL(location.href);
    let searchParams = new URLSearchParams(url.search);
    const id = searchParams.get('id');
    if (id) getProducts(`?id=${id}`, ".single-content", true);
    getProducts("?cat=Food",".food-list", false);
    getProducts("?cat=Veg", ".veg-list", false);
    getProducts("?cat=Bevs", ".bevs-list",false);
})
