(function () {

    const results = $(".results");
    const go = $(".go");
    const reset = $(".reset");
    const input = $("input");
    const picResults = $(".picResults");
    let artist;
    let selectType;
    let image;
    const searchHtml = "";
    const url = "https://elegant-croissant.glitch.me/spotify";
    let nextSearch;

    // focus on input
    input.focus();

    go.on("click", function () {
        artist = $("input").val();
        selectType = $("select").val();
        var data = {
            q: artist,
            type: selectType
        };
        getSearch(url, data);
    });

    reset.on("click", function () {
        window.location.reload();
    });

    $(document).on("click", ".more", function () {
        url = nextSearch.replace("https://api.spotify.com/v1/search", "https://elegant-croissant.glitch.me/spotify");
        getSearch(url);
    });

    function getSearch(url, data) {
        console.log(url, data);
        $.ajax({
            url: url,
            data: data,
            success: successCall
        }); // end of ajax call
    } // getSearch function end

    function successCall(data) {
        searchHtml = "";
        searchResults = data.artists || data.albums;

        if (searchResults.items.length > 0) {
            var searchHtml = '<p>You searched on ' + artist + ' ( ' + selectType + ' ) ' + '</p>';
            results.html(searchHtml);
            searchHtml = "";
            nextSearch = searchResults.next;
            getItems(searchResults);
        } else {
            searchHtml = '<p>No results found for ' + artist + ' ( ' + selectType + ' ) ' + '</p>';
            results.html(searchHtml);
            searchHtml = "";
        }
    } // success end

    function getItems(searchResults) {
        for (var i = 0; i < searchResults.items.length; i++) {

            if (searchResults.items[i].images.length > 0) {
                image = searchResults.items[i].images[1].url;
            } else {
                image = "noImage.png";
            }

            var name = searchResults.items[i].name;
            var externalUrl = searchResults.items[i].external_urls.spotify;
            searchHtml += '<div class="imgDiv"><a href="' + externalUrl + '"><img src="' + image + '" height="220" width="220" alt="' + name + '"></a><div class="nameDiv"><a href="' + externalUrl + '">' + name + '</a></div></div>';
        }
        picResults.html(searchHtml);

        if (nextSearch) {
            if (location.search.search(/scroll=infinite\b/) > -1) {
                setTimeout(infiniteSCrollCheck, 500);
            } else {
                picResults.append('<div class="moreButton"><button class="more" type="button" name="more">More</button></div>');
            }
        }
    }

    function infiniteSCrollCheck() {
        var documentHeight = $(document).height();
        var windowHeight = $(window).height();
        var documentScrollTop = $(document).scrollTop();

        if (documentScrollTop + windowHeight == documentHeight) {
            url = nextSearch.replace("https://api.spotify.com/v1/search", "https://elegant-croissant.glitch.me/spotify");
            getSearch(url);
        } else {
            setTimeout(infiniteSCrollCheck, 500);
        }
    }

})();