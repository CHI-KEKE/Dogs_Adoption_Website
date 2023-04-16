'use script';

const Popup = document.querySelector('.Popup');
const overlay = document.querySelector('.overlay');
const btnClosePopup = document.querySelector('.btn--close-Popup');
const btnsOpenPopup = document.querySelectorAll('.btn--show-Popup');

const nav = document.querySelector('.nav');
const header = document.querySelector('.header')


const sections = document.querySelectorAll('.section');
const targetimgs = document.querySelectorAll('img[data-src]');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

//////////////////////////////////////////////////////////////////////////////////////////////////


//Popup window!!/////////////////////////////////////////////

const openPopup = function (e) {
  e.preventDefault();
  Popup.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closePopup = function () {
  Popup.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenPopup.forEach(btn => btn.addEventListener('click', openPopup));

btnClosePopup.addEventListener('click', closePopup);
overlay.addEventListener('click', closePopup);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !Popup.classList.contains('hidden')) {
    closePopup();
  }
});


//////////////////////Nav-links Fading////////////////
const navFading = function(e){
  if (e.target.classList.contains('nav__link')) {
    const chosen = e.target;
    const sibling = chosen.closest('.nav').querySelectorAll('.nav__link');
    sibling.forEach(el =>{
      if(el !== chosen) el.style.opacity = this;
    });
  };
};

nav.addEventListener("mouseover",navFading.bind(0.5));
nav.addEventListener("mouseout",navFading.bind(1));



///////////////////Sticky Nav//////////////////////////
const navHeight = nav.getBoundingClientRect().height;

const stickynav = function(entries){
  const [entry] = entries;
  if(!entry.isIntersecting) nav.classList.add('sticky')
  else nav.classList.remove('sticky')
}

const headerObserver = new IntersectionObserver(stickynav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);


///////////Reveal Sections//////////////////////////////

const revealsection = function(entries,observer){
  const [entry] = entries;
  if(!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const SectionObserver = new IntersectionObserver(revealsection,{
  roll:null,
  threshold:0.15,
})

sections.forEach(sec => {
  SectionObserver.observe(sec);
  sec.classList.add('section--hidden')
})


////////Lazy Loading Images////////////////////////////

const imgload = function(entries,observer){
  const [entry] = entries;

  if(!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load',function(){
      entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(imgload,{
  root:null,
  threshold:0,
  rootMargin:'200px',
});

targetimgs.forEach(i => imgObserver.observe(i));



////////Tabbed!///////////////////////////////////////////////////

tabsContainer.addEventListener('click', function(e){
  const clicked = e.target.closest('.operations__tab');
  if(!clicked) return;

  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
})



///////////////Header Pics!///////////////////////////////
const HeaderImg = document.querySelector('.header__img');
function loading() {
  loader.hidden = false;
  // HeaderImg.hidden = true;
}

function complete() {
  loader.hidden = true;
  HeaderImg.hidden = false;
}


const getHeaderPic = function(){
  loading()
  fetch('https://dog.ceo/api/breeds/image/random')
  .then(res=>res.json()).then(json =>{
    if (json.status === 'success') HeaderImg.src = json.message;
    else(HeaderImg.src = 'img/moji.jpg');
    complete()
  });
}

getHeaderPic();


//////////Nav-Links-intoView!!//////////////////////////////

document.querySelector('.nav__links').addEventListener('click',function(e){
  e.preventDefault;
  if(e.target.classList.contains('nav__link')){
  const id = e.target.getAttribute('href');
  document.querySelector(id).scrollIntoView({ behavior: 'smooth'});
}});



/////Slider~~~////////////////////////////////////////////

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');



let Curslide = 0;
let maxSlide = slides.length;

const createDots = function(){
  slides.forEach(function(_,i){
    dotContainer.insertAdjacentHTML('beforeend',
     `<button class = "dots__dot" data-slide = "${i}"></button>`);
  });
};

const activateDots = function(slide){
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide = "${slide}"]`)
    .classList.add('dots__dot--active');
}




const NextSlide = function(){
  if(Curslide === maxSlide-1){
      Curslide = 0;
  }
  else{
    Curslide ++;
  }
  GoToSlide(Curslide);
  activateDots(Curslide);
}

const PrevSlide = function(){
  if(Curslide === 0){
    Curslide = maxSlide -1;
  }
  else{
    Curslide --;
  }
  GoToSlide(Curslide);
  activateDots(Curslide);
}


const GoToSlide = function(curslide){
  slides.forEach((s,i) =>(s.style.transform = `translateX(${100*(i-curslide)}%)`))
}


btnRight.addEventListener('click', NextSlide);
btnLeft.addEventListener('click',PrevSlide);

dotContainer.addEventListener('click',function(e){
  if(e.target.classList.contains('dots__dot')){
    const {slide} = e.target.dataset;
    GoToSlide(slide);
    activateDots(slide);
  };
});

document.addEventListener('keydown', function(e){
  if(e.key === 'ArrowLeft') PrevSlide();
  e.key === 'ArrowRight' && NextSlide();
});

//Init
GoToSlide(0);
createDots();
activateDots(0);
