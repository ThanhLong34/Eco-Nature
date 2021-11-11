const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const myWeb = $('#website');
const pathSource = './resources/data/source.txt';
const myRequest = new Request(pathSource);
fetch(myRequest)
   .then(response => response.text())
   .then(source => { website.innerHTML = source })
   .then(function () {
      initWebsite();
   });

function CircleProgress(idPercentNode, ms, maxPercent) {
   this.itemNode = document.querySelector(idPercentNode);
   this.percentNode = this.itemNode.querySelector('#statistical__itemPercent');
   this.progressNode = this.itemNode.querySelector('#statistical__itemCircle');
   this.ms = ms;
   this.maxPercent = maxPercent;
}
function circleProgressLoader(obj) {
   const ms = Math.floor(obj.ms / obj.maxPercent);
   let percent = 0;
   const objPropertyCSS = window.getComputedStyle(obj.progressNode);
   const valueStrokeDashoffset = objPropertyCSS.getPropertyValue('stroke-dashoffset');
   const persentOffSet = Math.floor(parseInt(valueStrokeDashoffset) * (100 - obj.maxPercent) / 100);
   obj.progressNode.animate({
      strokeDashoffset: `${persentOffSet}`
   }, {
      duration: obj.ms, fill: 'forwards', easing: 'linear'
   });
   setInterval(() => {
      if (percent === obj.maxPercent) {
         clearInterval();
      } else {
         percent++;
         obj.percentNode.innerText = percent + '%';
      }
   }, ms);
}
function initWebsite() {
   const myWebsite = (function () {
      const headerStart = $('#headerStart');
      const headerInnerView = $('#headerInnerView');
      const backToTopButton = $('#website__outerView-backToTop');
      const sliderItemList = $$('.slider__item');
      const counterSliderItemList = sliderItemList.length;
      const sliderNextButton = $('#slider__buttonNext');
      const sliderPrevButton = $('#slider__buttonPrev');
      let sliderCurrentItem = $('.slider__item.active');
      let isClickButtonSlider = false;
      let sliderInterval, postsInterval;
      const postsListWrap = $('#posts__listOuter');
      const postsList = $('#posts__list');
      const postsItem = $('.posts__item');
      let startX_Posts, x_Post;
      let pressed_Post = false;
      let limitLeft = false;
      let limitRight = false;
      let outerWidth_Posts, innerWidth_Posts;
      const prevButton_Posts = $('#posts__prevButton');
      const nextButton_Posts = $('#posts__nextButton');
      const propertyOfPostsList = window.getComputedStyle(postsList);
      const gapValueStringPropertyOfPostsList = propertyOfPostsList.getPropertyValue('grid-column-gap');
      const gapValueNumberPropertyOfPostsList = parseInt(gapValueStringPropertyOfPostsList);

      const listHeartButton = $$('.posts__itemHeartIcon');
      const closeButton_ImageViewport = $('#imageViewport__closeButton');
      const fullscreenButton_ImageViewport = $('#imageViewport__fullscreenButton');
      const imageViewport = $('#imageViewport');
      const imageViewportOverlay = $('#imageViewport__overlay');
      const imageViewportInner = $('#imageViewport__inner');
      const imageViewportImageNode = $('#imageViewport__imageNode');
      const listItemSearch_Projects = $$('.projects__itemSearch');
      const imageNode_Viewport = $('#imageViewport__imageNode');
      const listItemSearch_Posts = $$('.posts__itemSearch');

      // list circle progress
      const msCircleProgress = 1600;
      const circleProgress1 = new CircleProgress(
         '#statistical__item-0', msCircleProgress, 86
      );
      const circleProgress2 = new CircleProgress(
         '#statistical__item-1', msCircleProgress, 71
      );
      const circleProgress3 = new CircleProgress(
         '#statistical__item-2', msCircleProgress, 78
      );
      const circleProgress4 = new CircleProgress(
         '#statistical__item-3', msCircleProgress, 82
      );
      const statisticalSectionNode = $('#statistical');
      let isLoadStistical = false;

      // list elements button instead of elements a in main nav (header)
      const scrollToAboutNode = $('#scrollToAbout');
      const scrollToProjectsNode = $('#scrollToProjects');
      const scrollToMissionNode = $('#scrollToMission');
      const scrollToPostsNode = $('#scrollToPosts');
      const scrollToShopNode = $('#scrollToShop');
      const scrollToContactsNode = $('#scrollToContacts');

      // list elements section in website
      const aboutSection = $('#about');
      const projectsSection = $('#projects');
      const missionSection = $('#mission');
      const postsSection = $('#posts');
      const shopSection = $('#shop');
      const contactsSection = $('#contacts');

      //todo: margin when scroll exactly section
      const marginScrollTopForSection = 52;

      //? intended for responsive
      const expandButton = $('#headerResponsive__expandButton');
      const headerResponsive_Above = $('#headerResponsive__above');
      const headerResponsiveExpandButtonIcon = $('#headerResponsive__expandButtonIcon');
      let isExpand = false;

      const headerResponsiveNavigationButton = $('#headerResponsive__navigationButton');
      const headerResponsiveNavigationList = $('#headerResponsive__navigationList');
      let isExpandNav = false;

      const headerResponsiveNavigationItems = $$('.headerResponsive__navigationItem');
      let headerResponsiveNavigationItemActive = $('.headerResponsive__navigationItem.active');

      const postsPrevButtonResponsive = $('#posts__prevButtonResponsive');
      const postsNextButtonResponsive = $('#posts__nextButtonResponsive');
      const offSetScroll_Posts = $('.posts__item').clientWidth;

      //! RETURN
      return {
         handleBackToTopButton() {
            const thumb = window.scrollY || document.documentElement.scrollTop;
            if (thumb > 300) {
               backToTopButton.classList.remove('hidden');
            } else {
               backToTopButton.classList.add('hidden');
            }
         },
         handleHeaderWhenScroll() {
            const thumb = window.scrollY || document.documentElement.scrollTop;
            if (thumb > headerInnerView.clientHeight * 2) {
               headerStart.style.padding = '13px 0';
            } else if (thumb === 0) {
               headerStart.style.padding = null;
            }
         },
         handleChangeSlider() {
            sliderCurrentItem.style.animation = 'hiddenAnimate ease 1s forwards';
            setTimeout(() => {
               sliderCurrentItem.classList.remove('active');
               sliderCurrentItem.style.animation = null;
            }, 1000);
         },
         // next - slider
         handleSliderNext(slideIndex) {
            this.handleChangeSlider();
            const nextItem = $(`.slider__item-${slideIndex}`);
            if (nextItem) {
               nextItem.classList.add('active');
               setTimeout(() => {
                  sliderCurrentItem = nextItem;
               }, 1000);
            }
         },
         // prev - slider
         handleSliderPrev(slideIndex) {
            this.handleChangeSlider();
            const prevItem = $(`.slider__item-${slideIndex}`);
            if (prevItem) {
               prevItem.classList.add('active');
               setTimeout(() => {
                  sliderCurrentItem = prevItem;
               }, 1000);
            }
         },
         // click prev button - slider
         handleClickPrevButton_Slider() {
            if (!isClickButtonSlider) {
               isClickButtonSlider = true;
               let index = +sliderCurrentItem.dataset.sliderindex - 1;
               if (index < 0) {
                  index = counterSliderItemList - 1;
               }
               this.handleSliderPrev(index);
               setTimeout(() => {
                  isClickButtonSlider = false;
               }, 1000);
            }
         },
         // click next button - slider
         handleClickNextButton_Slider() {
            if (!isClickButtonSlider) {
               isClickButtonSlider = true;
               let index = +sliderCurrentItem.dataset.sliderindex + 1;
               if (index >= counterSliderItemList) {
                  index = 0;
               }
               this.handleSliderNext(index);
               setTimeout(() => {
                  isClickButtonSlider = false;
               }, 1000);
            }
         },
         // auto click next button - slider
         autoClickNextButton_Slider() {
            sliderInterval = setInterval(() => {
               this.handleClickNextButton_Slider();
            }, 5000);
         },
         // refresh auto change - slider
         refreshAutoChange_Slider() {
            clearInterval(sliderInterval);
            this.autoClickNextButton_Slider();
         },
         handleOnMouseUpWindow_Posts() {
            pressed_Post = false;
            allowDrag_Posts = false;
            if (limitLeft) {
               limitLeft = false;
               postsList.style.left = '0px';

            } else if (limitRight) {
               limitRight = false;
               postsList.style.left = `-${innerWidth_Posts - outerWidth_Posts}px`;
            }
         },
         checkBoundary_Posts() {
            const outer = postsListWrap.getBoundingClientRect();
            const inner = postsList.getBoundingClientRect();
            if (parseInt(postsList.style.left) > 0) {
               limitLeft = true;
            } else if (inner.right < outer.right) {
               limitRight = true;
            }
            outerWidth_Posts = outer.width;
            innerWidth_Posts = inner.width;
         },
         autoClickNextButton_Posts() {
            postsInterval = setInterval(() => {
               this.handleNextButton_Posts();
            }, 5000);
         },
         refreshAutoChange_Posts() {
            clearInterval(postsInterval);
            this.autoClickNextButton_Posts();
         },
         handlePrevButton_Posts() {
            if (!postsList.style.left) {
               postsList.style.left = 0;
            }
            const x = parseInt(postsList.style.left) +
               (postsItem.offsetWidth + gapValueNumberPropertyOfPostsList);
            this.checkBoundary_Posts(); //todo: get innerWidth_Posts and outerWidth_Posts
            const y = -(innerWidth_Posts - outerWidth_Posts);
            if (x > 0) {
               // nếu x < -y thì quay lại item cuối
               if (x === -y) {
                  postsList.style.left = `${y}px`;
               } else {
                  postsList.style.left = `0px`;
               }
            } else {
               postsList.style.left = `${x}px`;
            }
         },
         handleNextButton_Posts() {
            if (!postsList.style.left) {
               postsList.style.left = 0;
            }
            const x = parseInt(postsList.style.left) -
               (postsItem.offsetWidth + gapValueNumberPropertyOfPostsList);
            this.checkBoundary_Posts(); //todo: get innerWidth_Posts and outerWidth_Posts
            const y = -(innerWidth_Posts - outerWidth_Posts);

            if (x < y) {
               // nếu x < y * 2 thì quay lại item 1
               if (x === y * 2) {
                  postsList.style.left = `0px`;
               } else {
                  postsList.style.left = `${y}px`;
               }
            } else {
               postsList.style.left = `${x}px`;
            }
         },
         handleEventAuto() {
            this.autoClickNextButton_Slider();
            this.autoClickNextButton_Posts();
         },
         createIndexItem_Projects() {
            listItemSearch_Projects.forEach((item, index) => {
               item.onclick = () => {
                  imageViewport.classList.remove('hidden');
                  imageNode_Viewport.src = `./resources/images/view-image/projects/projects-${index}.jpg`;
               }
            });
         },
         createIndexItem_Posts() {
            listItemSearch_Posts.forEach((item, index) => {
               item.onclick = () => {
                  imageViewport.classList.remove('hidden');
                  imageNode_Viewport.src = `./resources/images/view-image/posts/posts-${index}.jpg`;
               }
            });
         },
         closeImageViewport() {
            imageViewport.animate({ opacity: '0' }, { duration: 300, easing: 'ease' });
            setTimeout(() => {
               imageViewport.classList.add('hidden');
            }, 300);
         },
         playCircleProgress() {
            setTimeout(() => {
               circleProgressLoader(circleProgress1);
               setTimeout(() => {
                  circleProgressLoader(circleProgress2);
                  setTimeout(() => {
                     circleProgressLoader(circleProgress3);
                     setTimeout(() => {
                        circleProgressLoader(circleProgress4);
                     }, msCircleProgress - 200);
                  }, msCircleProgress - 200);
               }, msCircleProgress - 200);
            });
         },
         handleLoadStatisticalProgress() {
            // nếu scroll y hoặc scroll top chạm tới offsetTop của statistical section
            if (!isLoadStistical) {
               if (window.scrollY > statisticalSectionNode.offsetTop ||
                  document.documentElement.scrollTop > statisticalSectionNode.offsetTop) {
                  this.playCircleProgress();
                  isLoadStistical = true;
               }
            }
         },
         handleActiveNavigator(buttonActive, sectionNode, nextSectionNode) {
            const scroll = window.scrollY || document.documentElement.scrollTop;
            if ((scroll >= sectionNode.offsetTop + marginScrollTopForSection || scroll >= sectionNode.offsetTop + marginScrollTopForSection) &&
               (scroll < nextSectionNode.offsetTop + marginScrollTopForSection || scroll < nextSectionNode.offsetTop + marginScrollTopForSection)) {
               buttonActive.style.backgroundColor = 'var(--primary-color)';
               buttonActive.style.color = 'white';
            } else {
               buttonActive.style.backgroundColor = null;
               buttonActive.style.color = null;
            }
         },
         handleEvent() {
            // event scroll page
            window.onscroll = () => {
               // header start decrease padding
               this.handleHeaderWhenScroll();
               // button back to top
               this.handleBackToTopButton();
               // statistical progress 
               this.handleLoadStatisticalProgress();
               // active button in header navigation
               this.handleActiveNavigator(
                  scrollToAboutNode, aboutSection, projectsSection
               );
               this.handleActiveNavigator(
                  scrollToProjectsNode, projectsSection, missionSection
               );
               this.handleActiveNavigator(
                  scrollToMissionNode, missionSection, postsSection
               );
               this.handleActiveNavigator(
                  scrollToPostsNode, postsSection, shopSection
               );
               this.handleActiveNavigator(
                  scrollToShopNode, shopSection, contactsSection
               );
               const restSection = { offsetTop: document.body.offsetHeight };
               this.handleActiveNavigator(
                  scrollToContactsNode, contactsSection, restSection
               );
            }
            // event onmouseup in window
            window.onmouseup = () => {
               // handle for posts section
               this.handleOnMouseUpWindow_Posts();
            }
            // event click previous button of slider
            sliderPrevButton.onclick = () => {
               this.refreshAutoChange_Slider();
               this.handleClickPrevButton_Slider();
            }
            // event click next button of slider
            sliderNextButton.onclick = () => {
               this.refreshAutoChange_Slider();
               this.handleClickNextButton_Slider();
            }
            // event onmousedown in postsListWrap 
            postsListWrap.onmousedown = (e) => {
               e.preventDefault();
               pressed_Post = true;
               startX_Posts = e.offsetX - postsList.offsetLeft;
               postsListWrap.style.cursor = 'grabbing';
            }
            // event onmouseenter in postsListWrap
            postsListWrap.onmouseenter = () => {
               postsListWrap.style.cursor = 'grab';
            }
            // event onmouseup in postsListWrap
            postsListWrap.onmouseup = () => {
               postsListWrap.style.cursor = 'grab';
            }
            // event onmousemove in postsListWrap
            postsListWrap.onmousemove = (e) => {
               e.preventDefault();
               if (pressed_Post) {
                  x_Post = e.offsetX;
                  postsList.style.left = `${x_Post - startX_Posts}px`;
                  this.checkBoundary_Posts();
               }
            }
            // event click prev button of posts section
            prevButton_Posts.onclick = () => {
               this.refreshAutoChange_Posts();
               this.handlePrevButton_Posts();
            }
            // event click next button of posts section
            nextButton_Posts.onclick = () => {
               this.refreshAutoChange_Posts();
               this.handleNextButton_Posts();
            }
            // event click heart button in posts section
            listHeartButton.forEach(item => {
               item.onclick = function () {
                  this.style.color = 'var(--primary-color)';
               }
            });
            // event click close button in image viewport 
            closeButton_ImageViewport.onclick = () => {
               this.closeImageViewport();
            }
            // event click overlay image viewport
            imageViewportOverlay.onclick = () => {
               this.closeImageViewport();
            }
            // stop propagation event click on overlay image
            imageViewportInner.onclick = (e) => {
               e.stopPropagation();
            }
            // event click fullscreen button in image viewport
            fullscreenButton_ImageViewport.onclick = function () {
               if (imageViewportImageNode.requestFullscreen) {
                  imageViewportImageNode.requestFullscreen();
               } else if (imageViewportImageNode.webkitRequestFullscreen) { // safari
                  imageViewportImageNode.webkitRequestFullscreen();
               } else if (imageViewportImageNode.msRequestFullscreen) { // IE11
                  imageViewportImageNode.msRequestFullscreen();
               }
            }
            // scroll to about section
            scrollToAboutNode.onclick = function () {
               window.scrollTo({
                  top: aboutSection.offsetTop + marginScrollTopForSection,
                  left: 0,
                  behavior: 'smooth'
               });
            }
            // scroll to projects section
            scrollToProjectsNode.onclick = function () {
               window.scrollTo({
                  top: projectsSection.offsetTop + marginScrollTopForSection,
                  left: 0,
                  behavior: 'smooth'
               });
            }
            // scroll to mission section
            scrollToMissionNode.onclick = function () {
               window.scrollTo({
                  top: missionSection.offsetTop + marginScrollTopForSection,
                  left: 0,
                  behavior: 'smooth'
               });
            }
            // scroll to posts section
            scrollToPostsNode.onclick = function () {
               window.scrollTo({
                  top: postsSection.offsetTop + marginScrollTopForSection,
                  left: 0,
                  behavior: 'smooth'
               });
            }
            // scroll to shop section
            scrollToShopNode.onclick = function () {
               window.scrollTo({
                  top: shopSection.offsetTop + marginScrollTopForSection,
                  left: 0,
                  behavior: 'smooth'
               });
            }
            // scroll to contacts section
            scrollToContactsNode.onclick = function () {
               window.scrollTo({
                  top: contactsSection.offsetTop + marginScrollTopForSection,
                  left: 0,
                  behavior: 'smooth'
               });
            }
            // event click expand button for responsive 
            expandButton.onclick = function () {
               if (!isExpand) {
                  isExpand = true;
                  headerResponsive_Above.style.marginTop = 'unset';
                  headerResponsiveExpandButtonIcon.style.transform = 'rotateZ(0deg)';
               } else {
                  isExpand = false;
                  headerResponsive_Above.style.marginTop = null;
                  headerResponsiveExpandButtonIcon.style.transform = null;
               }
            }
            // event click expand navigation list for responsive
            headerResponsiveNavigationButton.onclick = function () {
               headerResponsiveNavigationList.classList.toggle('hidden', isExpandNav);
               isExpandNav = !isExpandNav;
            }
            // event click nav item for responsive
            headerResponsiveNavigationItems.forEach((item) => {
               item.onclick = function () {
                  headerResponsiveNavigationItemActive.classList.remove('active');
                  item.classList.add('active');
                  headerResponsiveNavigationItemActive = item;
               }
            });
            // event click previous button Posts section (responsive)
            postsPrevButtonResponsive.onclick = function () {
               postsList.scrollBy({
                  left: -offSetScroll_Posts,
                  behavior: 'smooth'
               });
            }
            // event click next button Posts section (responsive)
            postsNextButtonResponsive.onclick = function () {
               postsList.scrollBy({
                  left: offSetScroll_Posts,
                  behavior: 'smooth'
               });
            }
         },
         init() {
            this.createIndexItem_Projects();
            this.createIndexItem_Posts();
         },
         start() {
            this.handleEvent();
            this.handleEventAuto();
            this.init();
         }
      }
   }());

   myWebsite.start();
}
