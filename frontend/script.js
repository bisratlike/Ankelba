// script.ts
// TypeScript code for handling the hamburger button click
var hamburgerButton = document.getElementById('hamburger');
var mobileLinks = document.getElementById('mobile-links');
if (hamburgerButton && mobileLinks) {
    hamburgerButton.addEventListener('click', function () {
        mobileLinks.classList.toggle('hidden');
    });
}
var currentSlideID = 1;
var sliderElement = document.getElementById('slider');
var totalSlides = sliderElement ? sliderElement.childElementCount : 0;
function next() {
    if (currentSlideID < totalSlides) {
        currentSlideID++;
        showSlide();
    }
}
function prev() {
    if (currentSlideID > 1) {
        currentSlideID--;
        showSlide();
    }
}
function showSlide() {
    var slides = sliderElement === null || sliderElement === void 0 ? void 0 : sliderElement.getElementsByTagName('li');
    if (slides) {
        for (var index = 0; index < totalSlides; index++) {
            var element = slides[index];
            if (element) {
                if (currentSlideID === index + 1) {
                    element.classList.remove('hidden');
                }
                else {
                    element.classList.add('hidden');
                }
            }
        }
    }
}
