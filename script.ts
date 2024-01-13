// script.ts
// TypeScript code for handling the hamburger button click
var hamburgerButton = document.getElementById('hamburger');
var mobileLinks = document.getElementById('mobile-links') as HTMLDivElement;

if (hamburgerButton && mobileLinks) {
    hamburgerButton.addEventListener('click', () => {
        mobileLinks.classList.toggle('hidden');
    });
}

var currentSlideID: number = 1;
var sliderElement: HTMLElement | null = document.getElementById('slider');
var totalSlides: number = sliderElement ? sliderElement.childElementCount : 0;

function next(): void {
    if (currentSlideID < totalSlides) {
        currentSlideID++;
        showSlide();
    }
}

function prev(): void {
    if (currentSlideID > 1) {
        currentSlideID--;
        showSlide();
    }
}

function showSlide(): void {
    const slides: HTMLCollectionOf<HTMLLIElement> | undefined = sliderElement?.getElementsByTagName('li');
    if (slides) {
        for (let index = 0; index < totalSlides; index++) {
            const element: HTMLLIElement | undefined = slides[index];
            if (element) {
                if (currentSlideID === index + 1) {
                    element.classList.remove('hidden');
                } else {
                    element.classList.add('hidden');
                }
            }
        }
    }
}
