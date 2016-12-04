var lang = window.navigator.useLanguage || window.navigator.language;
if (lang == 'zh-cn') {

    var resElms = document.querySelectorAll('[data-res]');
    // console.log(resElms);
    for (var n = 0; n < resElms.length; n++) {
        var resEl = resElms[n];
        // Get the resource key from the element.
        var resKey = resEl.getAttribute('data-res');
        // console.log(resKey);
        if (resKey) {
            // Get all the resources that start with the key.
            for (var key in resources) {
                if (key.indexOf(resKey) == 0) {
                    var resValue = resources[key];
                    // console.log(resValue);

                        resEl.innerHTML = resValue;

                }
            }
        }
    }

}
